
// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

// Evita que textos cadastrados pelos usuários sejam interpretados como HTML.
function escaparHTML(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[caractere]);
}


// Retorna os anúncios cadastrados pelos usuários.
function obterAnunciosPublicos() {
    if (typeof obterAnunciosUsuarios !== "function") {
        return [];
    }

    return obterAnunciosUsuarios();
}


// Retorna todos os livros de uma modalidade.
function obterLivrosPorModalidade(modalidade) {
    const livrosOriginais = livros.filter(
        livro => livro.modalidade === modalidade &&
                 livro.disponivel !== false
    );

    const anunciosUsuarios = obterAnunciosPublicos().filter(
        anuncio => anuncio.modalidade === modalidade &&
                   anuncio.disponivel === true
    );

    return [...livrosOriginais, ...anunciosUsuarios];
}


// Localiza um produto pelo ID, seja ele numérico ou textual.
function obterProdutoPorId(id) {
    const idTexto = String(id);

    const livroOriginal = livros.find(
        livro => String(livro.id) === idTexto &&
                 livro.modalidade === "venda" &&
                 livro.disponivel !== false
    );

    if (livroOriginal) return livroOriginal;

    const anuncioUsuario = obterAnunciosPublicos().find(
        anuncio => String(anuncio.id) === idTexto &&
                   anuncio.modalidade === "venda" &&
                   anuncio.disponivel === true
    );

    return anuncioUsuario || null;
}


// ==========================================
// EXIBIÇÃO DE LIVROS EM OUTRAS PÁGINAS
// ==========================================

function exibirLivros(modalidade, elementoId) {
    const area = document.getElementById(elementoId);

    if (!area) return;

    const livrosFiltrados = obterLivrosPorModalidade(modalidade);

    if (livrosFiltrados.length === 0) {
        area.innerHTML = "<p>Nenhum livro disponível no momento.</p>";
        return;
    }

    area.innerHTML = "";

    livrosFiltrados.forEach(livro => {
        const card = document.createElement("article");
        card.classList.add("livro-card");

        const preco = modalidade === "doacao"
            ? "Gratuito"
            : formatarPreco(livro.preco);

        card.innerHTML = `
            <a href="livro.html?id=${encodeURIComponent(livro.id)}">
                <img src="${escaparHTML(livro.imagem)}"
                     alt="Capa de ${escaparHTML(livro.titulo)}"
                     onerror="this.style.display='none'">

                <h3>${escaparHTML(livro.titulo)}</h3>
                <p>${escaparHTML(livro.autor)}</p>
            </a>

            <strong>${preco}</strong>
        `;

        area.appendChild(card);
    });
}


// ==========================================
// CATÁLOGO DA PÁGINA INICIAL
// ==========================================

const areaCatalogo = document.getElementById("catalogo-livros");
const campoBusca = document.getElementById("busca-livros");
const filtroCategoria = document.getElementById("filtro-categoria");
const quantidadeLivros = document.getElementById("quantidade-livros");

// Inclui livros originais e anúncios de usuários disponíveis.
const livrosVenda = obterLivrosPorModalidade("venda");


// Preenche o filtro com as categorias existentes.
function carregarCategorias() {
    if (!filtroCategoria) return;

    const categorias = [...new Set(
        livrosVenda.map(livro => livro.categoria)
    )].filter(Boolean).sort((a, b) => a.localeCompare(b, "pt-BR"));

    categorias.forEach(categoria => {
        const opcao = document.createElement("option");
        opcao.value = categoria;
        opcao.textContent = categoria;

        filtroCategoria.appendChild(opcao);
    });
}


// Formata os preços.
function formatarPreco(preco) {
    return Number(preco || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


// Exibe os livros na página.
function exibirCatalogo(listaLivros) {
    if (!areaCatalogo) return;

    areaCatalogo.innerHTML = "";

    if (quantidadeLivros) {
        quantidadeLivros.textContent =
            `${listaLivros.length} livro(s) encontrado(s)`;
    }

    if (listaLivros.length === 0) {
        areaCatalogo.innerHTML =
            "<p>Nenhum livro encontrado. Tente outra busca ou categoria.</p>";
        return;
    }

    listaLivros.forEach(livro => {
        const card = document.createElement("article");
        card.classList.add("livro-card");

        card.innerHTML = `
            <a href="livro.html?id=${encodeURIComponent(livro.id)}"
               class="livro-card-conteudo">

                <img
                    src="${escaparHTML(livro.imagem)}"
                    alt="Capa de ${escaparHTML(livro.titulo)}"
                    onerror="this.style.display='none'"
                >

                <h3>${escaparHTML(livro.titulo)}</h3>
                <p>${escaparHTML(livro.autor)}</p>
                <strong>${formatarPreco(livro.preco)}</strong>
            </a>

            <button
                type="button"
                class="botao-comprar"
                data-comprar="${escaparHTML(livro.id)}"
            >
                Comprar
            </button>
        `;

        areaCatalogo.appendChild(card);
    });
}


// Pesquisa e filtros.
function filtrarLivros() {
    const termo = campoBusca
        ? campoBusca.value.trim().toLocaleLowerCase("pt-BR")
        : "";

    const categoriaSelecionada = filtroCategoria
        ? filtroCategoria.value
        : "";

    const resultado = livrosVenda.filter(livro => {
        const titulo = String(livro.titulo || "").toLocaleLowerCase("pt-BR");
        const autor = String(livro.autor || "").toLocaleLowerCase("pt-BR");

        const correspondeBusca =
            titulo.includes(termo) || autor.includes(termo);

        const correspondeCategoria =
            !categoriaSelecionada ||
            livro.categoria === categoriaSelecionada;

        return correspondeBusca && correspondeCategoria;
    });

    exibirCatalogo(resultado);
}


// ==========================================
// ADICIONAR LIVRO AO CARRINHO
// ==========================================

function adicionarAoCarrinho(idLivro) {
    const livro = obterProdutoPorId(idLivro);

    if (!livro) {
        alert("Este livro não está mais disponível para venda.");
        return;
    }

    let carrinho = [];

    try {
        carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    } catch (erro) {
        carrinho = [];
    }

    if (!Array.isArray(carrinho)) {
        carrinho = [];
    }

    const itemExistente = carrinho.find(
        item => String(item.id) === String(livro.id)
    );

    if (itemExistente) {
        itemExistente.quantidade =
            (Number(itemExistente.quantidade) || 0) + 1;
    } else {
        carrinho.push({
            id: livro.id,
            quantidade: 1
        });
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));

    atualizarCarrinhoLateral();
    abrirCarrinhoLateral();
}


// Detecta o clique no botão Comprar.
if (areaCatalogo) {
    areaCatalogo.addEventListener("click", function(event) {
        const botao = event.target.closest("[data-comprar]");

        if (!botao) return;

        adicionarAoCarrinho(botao.dataset.comprar);
    });
}


// ==========================================
// PAINEL LATERAL DO CARRINHO
// ==========================================

const painelCarrinho = document.getElementById("carrinho-lateral");
const overlayCarrinho = document.getElementById("carrinho-overlay");
const listaCarrinho = document.getElementById("carrinho-lateral-lista");
const subtotalCarrinho = document.getElementById("carrinho-subtotal");
const contadorCarrinho = document.getElementById("contador-carrinho");


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
    atualizarCarrinhoLateral();
}


function abrirCarrinhoLateral() {
    if (!painelCarrinho || !overlayCarrinho) return;

    painelCarrinho.classList.add("ativo");
    overlayCarrinho.classList.add("ativo");
    painelCarrinho.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}


function fecharCarrinhoLateral() {
    if (!painelCarrinho || !overlayCarrinho) return;

    painelCarrinho.classList.remove("ativo");
    overlayCarrinho.classList.remove("ativo");
    painelCarrinho.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}


function atualizarCarrinhoLateral() {
    if (!listaCarrinho) return;

    const carrinho = obterCarrinho();

    let subtotal = 0;
    let quantidadeTotal = 0;

    listaCarrinho.innerHTML = "";

    if (carrinho.length === 0) {
        listaCarrinho.innerHTML = "<p>Seu carrinho está vazio.</p>";
    }

    carrinho.forEach(item => {
        const livro = obterProdutoPorId(item.id);

        if (!livro) return;

        const quantidade = Math.max(1, Number(item.quantidade) || 1);
        const preco = Number(livro.preco) || 0;

        subtotal += preco * quantidade;
        quantidadeTotal += quantidade;

        const elemento = document.createElement("article");
        elemento.classList.add("carrinho-item");

        elemento.innerHTML = `
            <img
                src="${escaparHTML(livro.imagem)}"
                alt="Capa de ${escaparHTML(livro.titulo)}"
                onerror="this.style.display='none'"
            >

            <div class="carrinho-item-info">
                <h3>${escaparHTML(livro.titulo)}</h3>
                <p>${formatarPreco(preco)}</p>

                <div class="carrinho-item-acoes">
                    <button type="button"
                            data-diminuir="${escaparHTML(livro.id)}">−</button>

                    <span>${quantidade}</span>

                    <button type="button"
                            data-aumentar="${escaparHTML(livro.id)}">+</button>

                    <button type="button"
                            class="carrinho-remover"
                            data-remover="${escaparHTML(livro.id)}">
                        Remover
                    </button>
                </div>
            </div>
        `;

        listaCarrinho.appendChild(elemento);
    });

    if (contadorCarrinho) {
        contadorCarrinho.textContent = quantidadeTotal;
    }

    if (subtotalCarrinho) {
        subtotalCarrinho.textContent = formatarPreco(subtotal);
    }
}


// Eventos dos botões do painel.
if (listaCarrinho) {
    listaCarrinho.addEventListener("click", function(event) {
        const botao = event.target.closest("button");
        if (!botao) return;

        const id =
            botao.dataset.aumentar ||
            botao.dataset.diminuir ||
            botao.dataset.remover;

        if (!id) return;

        const carrinho = obterCarrinho();

        const item = carrinho.find(
            produto => String(produto.id) === String(id)
        );

        if (!item) return;

        if (botao.dataset.aumentar) {
            item.quantidade = (Number(item.quantidade) || 0) + 1;
        }

        if (botao.dataset.diminuir) {
            item.quantidade = (Number(item.quantidade) || 0) - 1;

            if (item.quantidade <= 0) {
                const indice = carrinho.indexOf(item);
                carrinho.splice(indice, 1);
            }
        }

        if (botao.dataset.remover) {
            const indice = carrinho.indexOf(item);
            carrinho.splice(indice, 1);
        }

        salvarCarrinho(carrinho);
    });
}


// Botões para abrir e fechar.
const botaoAbrirCarrinho = document.getElementById("abrir-carrinho");
const botaoFecharCarrinho = document.getElementById("fechar-carrinho");
const botaoContinuarComprando = document.getElementById("continuar-comprando");

if (botaoAbrirCarrinho) {
    botaoAbrirCarrinho.addEventListener("click", abrirCarrinhoLateral);
}

if (botaoFecharCarrinho) {
    botaoFecharCarrinho.addEventListener("click", fecharCarrinhoLateral);
}

if (botaoContinuarComprando) {
    botaoContinuarComprando.addEventListener("click", fecharCarrinhoLateral);
}

if (overlayCarrinho) {
    overlayCarrinho.addEventListener("click", fecharCarrinhoLateral);
}


// Fecha o painel com a tecla Esc.
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        fecharCarrinhoLateral();
    }
});


// Atualiza o contador e o subtotal ao carregar a página.
atualizarCarrinhoLateral();


// ==========================================
// INICIALIZAÇÃO
// ==========================================

// Mantém o funcionamento das páginas antigas.
exibirLivros("venda", "livros-destaque");
exibirLivros("troca", "livros-troca");
exibirLivros("doacao", "livros-doacao");

// Inicializa o catálogo da página inicial.
if (areaCatalogo) {
    carregarCategorias();
    filtrarLivros();

    if (campoBusca) {
        campoBusca.addEventListener("input", filtrarLivros);
    }

    if (filtroCategoria) {
        filtroCategoria.addEventListener("change", filtrarLivros);
    }
}
