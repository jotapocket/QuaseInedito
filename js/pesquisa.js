
// ===== ELEMENTOS DA PÁGINA =====

const campoPesquisa = document.getElementById("resultados-pesquisa");
const textoPesquisa = document.getElementById("texto-pesquisa");
const quantidadeResultados = document.getElementById("quantidade-resultados");
const filtroPesquisa = document.getElementById("filtro-pesquisa");

// ===== PARÂMETROS DA URL =====

const parametros = new URLSearchParams(window.location.search);

const termoPesquisa = parametros.get("q") || "";
const categoriaInicial = parametros.get("categoria") || "";

const termoNormalizado = termoPesquisa.trim().toLocaleLowerCase("pt-BR");

// ===== PROTEÇÃO DOS TEXTOS =====

function escaparHTMLPesquisa(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, caractere => {
        const caracteres = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return caracteres[caractere];
    });
}

// ===== OBTÉM TODOS OS LIVROS À VENDA =====

function obterLivrosPesquisa() {
    const livrosOriginais = livros.filter(livro => {
        return livro.modalidade === "venda" &&
               livro.disponivel !== false;
    });

    let anunciosUsuarios = [];

    if (typeof obterAnunciosUsuarios === "function") {
        anunciosUsuarios = obterAnunciosUsuarios().filter(anuncio => {
            return anuncio.modalidade === "venda" &&
                   anuncio.disponivel !== false;
        });
    }

    return [...livrosOriginais, ...anunciosUsuarios];
}

// ===== LISTA DE LIVROS =====

const livrosDisponiveis = obterLivrosPesquisa();

// ===== FORMATAÇÃO DE PREÇO =====

function formatarPrecoPesquisa(preco) {
    return Number(preco).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// ===== CARREGA AS CATEGORIAS =====

function carregarCategoriasPesquisa() {
    const categorias = [...new Set(
        livrosDisponiveis.map(livro => livro.categoria)
    )].sort((a, b) => a.localeCompare(b, "pt-BR"));

    categorias.forEach(categoria => {
        const opcao = document.createElement("option");

        opcao.value = categoria;
        opcao.textContent = categoria;

        filtroPesquisa.appendChild(opcao);
    });
}

// ===== CRIA OS CARTÕES =====

function exibirResultados(lista) {
    campoPesquisa.innerHTML = "";

    quantidadeResultados.textContent =
        `${lista.length} ${lista.length === 1 ? "livro encontrado" : "livros encontrados"}`;

    if (lista.length === 0) {
        campoPesquisa.innerHTML = `
            <div class="mensagem-sem-resultados">
                <h2>Nenhum livro encontrado.</h2>
                <p>Tente pesquisar por outro título, autor ou categoria.</p>
            </div>
        `;

        return;
    }

    lista.forEach(livro => {
        const cartao = document.createElement("article");
        cartao.classList.add("livro-card");

        const id = encodeURIComponent(String(livro.id));

        cartao.innerHTML = `
            <a href="livro.html?id=${id}" class="livro-card-conteudo">

                <img
                    src="${escaparHTMLPesquisa(livro.imagem)}"
                    alt="Capa de ${escaparHTMLPesquisa(livro.titulo)}"
                >

                <h3>${escaparHTMLPesquisa(livro.titulo)}</h3>

                <p>${escaparHTMLPesquisa(livro.autor)}</p>

                <strong>${formatarPrecoPesquisa(livro.preco)}</strong>

            </a>

            <a href="livro.html?id=${id}" class="botao-comprar">
                Ver detalhes
            </a>
        `;

        campoPesquisa.appendChild(cartao);
    });
}

// ===== APLICA A PESQUISA E O FILTRO =====

function filtrarResultados() {
    const categoriaSelecionada = filtroPesquisa.value;

    const resultados = livrosDisponiveis.filter(livro => {
        const titulo = String(livro.titulo || "").toLocaleLowerCase("pt-BR");
        const autor = String(livro.autor || "").toLocaleLowerCase("pt-BR");
        const categoria = String(livro.categoria || "").toLocaleLowerCase("pt-BR");

        const correspondePesquisa =
            !termoNormalizado ||
            titulo.includes(termoNormalizado) ||
            autor.includes(termoNormalizado) ||
            categoria.includes(termoNormalizado);

        const correspondeCategoria =
            !categoriaSelecionada ||
            livro.categoria === categoriaSelecionada;

        return correspondePesquisa && correspondeCategoria;
    });

    exibirResultados(resultados);
}

// ===== TEXTO DE APRESENTAÇÃO =====

function atualizarTextoPesquisa() {
    if (termoPesquisa.trim() && categoriaInicial) {
        textoPesquisa.textContent =
            `Resultados para "${termoPesquisa.trim()}" na categoria ${categoriaInicial}.`;
    } else if (termoPesquisa.trim()) {
        textoPesquisa.textContent =
            `Você pesquisou por: "${termoPesquisa.trim()}"`;
    } else if (categoriaInicial) {
        textoPesquisa.textContent =
            `Categoria: ${categoriaInicial}`;
    } else {
        textoPesquisa.textContent =
            "Explore todos os livros disponíveis.";
    }
}

// ===== INICIALIZAÇÃO =====

carregarCategoriasPesquisa();

// Seleciona automaticamente a categoria recebida pela URL.

if (categoriaInicial) {
    const opcaoExiste = [...filtroPesquisa.options].some(
        opcao => opcao.value === categoriaInicial
    );

    if (opcaoExiste) {
        filtroPesquisa.value = categoriaInicial;
    }
}

atualizarTextoPesquisa();
filtrarResultados();

filtroPesquisa.addEventListener("change", filtrarResultados);
