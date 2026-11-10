
const areaDetalhes = document.getElementById("detalhes-livro");

// ==========================================
// IDENTIFICAÇÃO DO LIVRO
// ==========================================

// Mantém o ID como texto para aceitar números e UUIDs.
const parametros = new URLSearchParams(window.location.search);
const idLivro = parametros.get("id");

// Primeiro procura nos livros demonstrativos.
const livroOriginal = livros.find(
    livro => String(livro.id) === String(idLivro)
);

// Depois procura nos anúncios cadastrados pelos usuários.
function obterAnuncioPorId(id) {
    if (typeof obterAnunciosUsuarios !== "function") {
        return null;
    }

    return obterAnunciosUsuarios().find(
        anuncio => String(anuncio.id) === String(id)
    ) || null;
}

const anuncioUsuario = livroOriginal ? null : obterAnuncioPorId(idLivro);

const livroSelecionado = livroOriginal || anuncioUsuario;

const ehAnuncioUsuario = Boolean(anuncioUsuario);


// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

function escaparHTMLDetalhe(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[caractere]);
}


function formatarPrecoDetalhe(preco) {
    return Number(preco || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


// Procura o nome do usuário que publicou o anúncio.
function obterNomeVendedor(anuncio) {
    if (anuncio.vendedor) {
        return anuncio.vendedor;
    }

    try {
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        const usuario = usuarios.find(
            item => String(item.id) === String(anuncio.usuarioId)
        );

        return usuario ? usuario.nome : "Usuário do Quase Inédito";

    } catch (erro) {
        return "Usuário do Quase Inédito";
    }
}


// ==========================================
// EXIBIÇÃO DOS DETALHES
// ==========================================

function exibirDetalhes() {
    if (!areaDetalhes) return;

    if (!livroSelecionado) {
        areaDetalhes.innerHTML = `
            <div class="livro-nao-encontrado">
                <h1>Livro não encontrado</h1>
                <p>Não conseguimos localizar esse livro na vitrine.</p>

                <a href="index.html#catalogo" class="botao-principal">
                    Voltar à vitrine
                </a>
            </div>
        `;

        return;
    }

    document.title = `${livroSelecionado.titulo} | Quase Inédito`;

    const titulo = escaparHTMLDetalhe(livroSelecionado.titulo);
    const autor = escaparHTMLDetalhe(livroSelecionado.autor);
    const categoria = escaparHTMLDetalhe(livroSelecionado.categoria);
    const descricao = escaparHTMLDetalhe(livroSelecionado.descricao);
    const imagem = escaparHTMLDetalhe(livroSelecionado.imagem);

    // Verifica se o anúncio está disponível.
    const disponivel = ehAnuncioUsuario
        ? livroSelecionado.disponivel === true
        : livroSelecionado.disponivel !== false;

    const modalidade = livroSelecionado.modalidade || "venda";


    // ==========================================
    // IDENTIFICAÇÃO VISUAL
    // ==========================================

    const modalidades = {
        venda: {
            texto: "À venda",
            classe: "venda"
        },

        troca: {
            texto: "Disponível para troca",
            classe: "troca"
        },

        doacao: {
            texto: "Doação",
            classe: "doacao"
        }
    };

    const identificacaoModalidade =
        modalidades[modalidade] || modalidades.venda;


    // Identificação do catálogo próprio ou da comunidade.
    const identificacaoOrigem = ehAnuncioUsuario
        ? `
            <span class="identificacao-anuncio-usuario">
                Anúncio da comunidade
            </span>
        `
        : `
            <span class="selo-oficial-titulo">
                <img
                    src="assets/Selo.png"
                    alt=""
                    aria-hidden="true"
                >
                Produto oficial
            </span>
        `;


    // ==========================================
    // INFORMAÇÕES ADICIONAIS
    // ==========================================

    const condicao = livroSelecionado.condicao
        ? `
            <p>
                <strong>Conservação:</strong>
                ${escaparHTMLDetalhe(livroSelecionado.condicao)}
            </p>
        `
        : "";

    let nomeVendedor = "";

    if (ehAnuncioUsuario) {
        nomeVendedor = obterNomeVendedor(livroSelecionado);
    } else if (livroSelecionado.vendedor) {
        nomeVendedor = livroSelecionado.vendedor;
    }

    const vendedor = nomeVendedor
        ? `
            <p>
                <strong>Vendedor:</strong>
                ${escaparHTMLDetalhe(nomeVendedor)}
            </p>
        `
        : "";

    const textoDisponibilidade = disponivel
        ? "Disponível"
        : "Indisponível";


    // ==========================================
    // PREÇO E BOTÃO
    // ==========================================

    let textoPreco = "";

    if (modalidade === "doacao") {
        textoPreco = "Gratuito";
    } else if (modalidade === "troca") {
        textoPreco = "Disponível para troca";
    } else {
        textoPreco = formatarPrecoDetalhe(livroSelecionado.preco);
    }

    // Só permite adicionar ao carrinho livros disponíveis para venda.
    const podeComprar = modalidade === "venda" && disponivel;

    let textoBotao = "Adicionar ao carrinho";

    if (!disponivel) {
        textoBotao = "Indisponível";
    } else if (modalidade === "troca") {
        textoBotao = "Anúncio para troca";
    } else if (modalidade === "doacao") {
        textoBotao = "Anúncio para doação";
    }


    // ==========================================
    // MONTAGEM DA PÁGINA
    // ==========================================

    areaDetalhes.innerHTML = `
        <div class="detalhe-livro-container">

            <!-- CAPA -->

            <div class="detalhe-livro-imagem">

                <img
                    src="${imagem}"
                    alt="Capa de ${titulo}"
                    onerror="this.style.display='none'"
                >

            </div>


            <!-- INFORMAÇÕES -->

            <div class="detalhe-livro-informacoes">

                <div class="detalhe-livro-identificadores">

                    <span class="etiqueta-modalidade ${identificacaoModalidade.classe}">
                        ${identificacaoModalidade.texto}
                    </span>

                </div>


                <span class="detalhe-livro-categoria">
                    ${categoria}
                </span>


                <!-- TÍTULO E IDENTIFICAÇÃO -->

                <div class="detalhe-livro-titulo">

                    <h1>${titulo}</h1>

                    ${identificacaoOrigem}

                </div>


                <p class="detalhe-livro-autor">
                    Por ${autor}
                </p>


                <!-- DESCRIÇÃO -->

                <div class="detalhe-livro-descricao">

                    <h2>Sobre o livro</h2>

                    <p>${descricao}</p>

                </div>


                <!-- INFORMAÇÕES ADICIONAIS -->

                <div class="detalhe-livro-extra">

                    ${condicao}

                    ${vendedor}

                    <p>
                        <strong>Disponibilidade:</strong>
                        ${textoDisponibilidade}
                    </p>

                </div>


                <!-- ÁREA DE COMPRA -->

                <div class="detalhe-livro-compra">

                    <strong class="detalhe-livro-preco">
                        ${textoPreco}
                    </strong>

                    <button
                        type="button"
                        id="adicionar-detalhe-carrinho"
                        class="botao-comprar"
                        ${podeComprar ? "" : "disabled"}
                    >
                        ${textoBotao}
                    </button>

                    <p
                        id="mensagem-carrinho-detalhe"
                        class="mensagem-carrinho-detalhe"
                    ></p>

                </div>

            </div>

        </div>
    `;


    // ==========================================
    // EVENTO DO CARRINHO
    // ==========================================

    const botaoAdicionar = document.getElementById(
        "adicionar-detalhe-carrinho"
    );

    if (botaoAdicionar && podeComprar) {
        botaoAdicionar.addEventListener("click", adicionarAoCarrinho);
    }
}


// ==========================================
// ADICIONAR AO CARRINHO
// ==========================================

function adicionarAoCarrinho() {
    if (!livroSelecionado) return;

    const modalidade = livroSelecionado.modalidade || "venda";

    const disponivel = ehAnuncioUsuario
        ? livroSelecionado.disponivel === true
        : livroSelecionado.disponivel !== false;

    if (!disponivel || modalidade !== "venda") {
        return;
    }

    let carrinho = [];

    try {
        carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

        if (!Array.isArray(carrinho)) {
            carrinho = [];
        }

    } catch (erro) {
        carrinho = [];
    }

    const itemExistente = carrinho.find(
        item => String(item.id) === String(livroSelecionado.id)
    );

    if (itemExistente) {
        itemExistente.quantidade =
            (Number(itemExistente.quantidade) || 0) + 1;

    } else {
        carrinho.push({
            id: livroSelecionado.id,
            quantidade: 1
        });
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));

    const mensagem = document.getElementById(
        "mensagem-carrinho-detalhe"
    );

    if (mensagem) {
        mensagem.innerHTML = `
            Livro adicionado ao carrinho!
            <a href="carrinho.html">Ver carrinho</a>
        `;
    }
}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

exibirDetalhes();
