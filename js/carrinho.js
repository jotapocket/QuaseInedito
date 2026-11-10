
// ==========================================
// SISTEMA DA PÁGINA COMPLETA DO CARRINHO
// ==========================================

const listaCarrinho = document.getElementById("lista-carrinho");
const resumoQuantidade = document.getElementById("resumo-quantidade");
const resumoTotal = document.getElementById("resumo-total");
const botaoFinalizar = document.getElementById("finalizar-compra");
const mensagemFinalizacao = document.getElementById("mensagem-finalizacao");


// ==========================================
// ARMAZENAMENTO DO CARRINHO
// ==========================================

function obterCarrinho() {
    try {
        const dados = JSON.parse(localStorage.getItem("carrinho")) || [];
        return Array.isArray(dados) ? dados : [];
    } catch (erro) {
        return [];
    }
}

function salvarCarrinho(carrinho) {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    exibirCarrinho();
}


// ==========================================
// BUSCA DE PRODUTOS
// ==========================================

function obterProdutoCarrinho(id) {
    const idTexto = String(id);

    // Primeiro, procura nos livros originais.
    const livroOriginal = livros.find(produto =>
        String(produto.id) === idTexto &&
        produto.modalidade === "venda" &&
        produto.disponivel !== false
    );

    if (livroOriginal) {
        return livroOriginal;
    }

    // Depois, procura nos anúncios dos usuários.
    if (typeof obterAnunciosUsuarios !== "function") {
        return null;
    }

    const anuncioUsuario = obterAnunciosUsuarios().find(anuncio =>
        String(anuncio.id) === idTexto &&
        anuncio.modalidade === "venda" &&
        anuncio.disponivel === true
    );

    return anuncioUsuario || null;
}


// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

function formatarPreco(preco) {
    return Number(preco).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function escaparHTML(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[caractere]);
}

function atualizarResumo(quantidade, total) {
    if (resumoQuantidade) {
        resumoQuantidade.textContent = quantidade;
    }

    if (resumoTotal) {
        resumoTotal.textContent = formatarPreco(total);
    }

    if (botaoFinalizar) {
        botaoFinalizar.disabled = quantidade === 0;
    }
}


// ==========================================
// EXIBIÇÃO DOS PRODUTOS
// ==========================================

function exibirCarrinho() {
    if (!listaCarrinho) return;

    let carrinho = obterCarrinho();

    // Remove itens que não existem mais ou estão indisponíveis.
    const carrinhoValido = carrinho.filter(item =>
        obterProdutoCarrinho(item.id) !== null
    );

    if (carrinhoValido.length !== carrinho.length) {
        carrinho = carrinhoValido;
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
    }

    listaCarrinho.innerHTML = "";

    let total = 0;
    let quantidadeTotal = 0;

    if (carrinho.length === 0) {
        listaCarrinho.innerHTML = `
            <div class="carrinho-vazio">
                <h2>Seu carrinho está vazio.</h2>
                <p>Que tal encontrar uma nova história?</p>
                <a href="index.html#catalogo" class="botao-principal">
                    Explorar livros
                </a>
            </div>
        `;

        atualizarResumo(0, 0);
        return;
    }

    carrinho.forEach(item => {
        const livro = obterProdutoCarrinho(item.id);

        if (!livro) return;

        const quantidade = Math.max(
            1,
            Math.floor(Number(item.quantidade) || 1)
        );

        const preco = Number(livro.preco) || 0;
        const subtotal = preco * quantidade;
        const id = String(livro.id);

        total += subtotal;
        quantidadeTotal += quantidade;

        const titulo = escaparHTML(livro.titulo);
        const autor = escaparHTML(livro.autor);
        const imagem = escaparHTML(livro.imagem);

        const elemento = document.createElement("article");
        elemento.classList.add("carrinho-livro");

        elemento.innerHTML = `
            <img
                src="${imagem}"
                alt="Capa de ${titulo}"
                class="carrinho-livro-imagem"
            >

            <div class="carrinho-livro-info">
                <a href="livro.html?id=${encodeURIComponent(id)}">
                    <h3>${titulo}</h3>
                </a>

                <p>${autor}</p>

                <strong>${formatarPreco(preco)}</strong>

                <div class="carrinho-livro-acoes">
                    <div class="controle-quantidade">
                        <button
                            type="button"
                            data-diminuir="${escaparHTML(id)}"
                            aria-label="Diminuir quantidade"
                        >−</button>

                        <span>${quantidade}</span>

                        <button
                            type="button"
                            data-aumentar="${escaparHTML(id)}"
                            aria-label="Aumentar quantidade"
                        >+</button>
                    </div>

                    <button
                        type="button"
                        class="remover-livro"
                        data-remover="${escaparHTML(id)}"
                    >
                        Remover
                    </button>
                </div>
            </div>

            <div class="carrinho-livro-subtotal">
                ${formatarPreco(subtotal)}
            </div>
        `;

        listaCarrinho.appendChild(elemento);
    });

    atualizarResumo(quantidadeTotal, total);
}


// ==========================================
// CONTROLES DE QUANTIDADE E REMOÇÃO
// ==========================================

if (listaCarrinho) {
    listaCarrinho.addEventListener("click", function (event) {
        const botao = event.target.closest("button");

        if (!botao) return;

        const id =
            botao.dataset.aumentar ??
            botao.dataset.diminuir ??
            botao.dataset.remover;

        if (id === undefined) return;

        const carrinho = obterCarrinho();

        const item = carrinho.find(produto =>
            String(produto.id) === String(id)
        );

        if (!item) return;

        if (botao.dataset.aumentar !== undefined) {
            item.quantidade = Math.max(
                1,
                Math.floor(Number(item.quantidade) || 1)
            ) + 1;
        }

        if (botao.dataset.diminuir !== undefined) {
            item.quantidade = Math.max(
                1,
                Math.floor(Number(item.quantidade) || 1)
            ) - 1;

            if (item.quantidade <= 0) {
                carrinho.splice(carrinho.indexOf(item), 1);
            }
        }

        if (botao.dataset.remover !== undefined) {
            carrinho.splice(carrinho.indexOf(item), 1);
        }

        salvarCarrinho(carrinho);
    });
}

// ==========================================
// FINALIZAÇÃO E REGISTRO DA COMPRA
// ==========================================

if (botaoFinalizar) {
    botaoFinalizar.addEventListener("click", function () {
        const carrinho = obterCarrinho();

        if (carrinho.length === 0) return;

        // Verifica se o usuário está conectado.
        const sessao = localStorage.getItem("usuarioLogado");

        if (!sessao) {
            alert("Você precisa entrar na sua conta para finalizar a compra.");
            window.location.href = "login.html";
            return;
        }

        // Confere se a função de registro está disponível.
        if (typeof registrarCompra !== "function") {
            alert("Não foi possível acessar o sistema de compras. Tente novamente.");
            return;
        }

        // Recupera os dados atualizados dos livros.
        const itensCompra = carrinho.map(item => {
            const livro = obterProdutoCarrinho(item.id);

            if (!livro) return null;

            return {
                id: livro.id,
                titulo: livro.titulo,
                autor: livro.autor,
                imagem: livro.imagem,
                preco: Number(livro.preco),
                quantidade: Math.max(
                    1,
                    Math.floor(Number(item.quantidade) || 1)
                )
            };
        });

        // Impede a compra caso algum livro não esteja mais disponível.
        if (itensCompra.some(item => item === null)) {
            alert("Um ou mais livros não estão mais disponíveis. Atualize seu carrinho.");
            exibirCarrinho();
            return;
        }

        // Calcula o valor total.
        const total = itensCompra.reduce((soma, item) => {
            return soma + item.preco * item.quantidade;
        }, 0);

        // Registra a compra no armazenamento.
        const resultado = registrarCompra(itensCompra, total);

        if (!resultado.sucesso) {
            alert(resultado.mensagem);
            return;
        }

        // Limpa o carrinho somente após o registro bem-sucedido.
        localStorage.removeItem("carrinho");

        // Limpa os itens e atualiza os valores do resumo.
        listaCarrinho.innerHTML = "";
        atualizarResumo(0, 0);

        const layoutCarrinho = document.querySelector(".carrinho-layout");

        if (layoutCarrinho) {
            layoutCarrinho.hidden = true;
        }

        if (mensagemFinalizacao) {
            mensagemFinalizacao.hidden = false;
        }

        alert("Compra registrada com sucesso!");
    });
}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

exibirCarrinho();
