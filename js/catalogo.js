const listaCatalogo = document.getElementById("lista-catalogo");
const pesquisaLivro = document.getElementById("pesquisa-livro");
const filtroCategoria = document.getElementById("filtro-categoria");
const filtroDisponibilidade = document.getElementById("filtro-disponibilidade");
const contadorLivros = document.getElementById("contador-livros");

// Cria automaticamente as opções de categoria.
function carregarCategorias() {
    const categorias = [...new Set(livros.map(livro => livro.categoria))];

    categorias.sort();

    categorias.forEach(categoria => {
        const opcao = document.createElement("option");
        opcao.value = categoria;
        opcao.textContent = categoria;

        filtroCategoria.appendChild(opcao);
    });
}

// Exibe os livros de acordo com os filtros.
function exibirCatalogo() {
    const termo = pesquisaLivro.value.toLowerCase().trim();
    const categoriaSelecionada = filtroCategoria.value;
    const disponibilidadeSelecionada = filtroDisponibilidade.value;

    const livrosFiltrados = livros.filter(livro => {

        const correspondePesquisa =
            livro.titulo.toLowerCase().includes(termo) ||
            livro.autor.toLowerCase().includes(termo);

        const correspondeCategoria =
            categoriaSelecionada === "todas" ||
            livro.categoria === categoriaSelecionada;

        const correspondeDisponibilidade =
            disponibilidadeSelecionada === "todos" ||
            (disponibilidadeSelecionada === "disponiveis" && livro.disponivel) ||
            (disponibilidadeSelecionada === "indisponiveis" && !livro.disponivel);

        return correspondePesquisa &&
               correspondeCategoria &&
               correspondeDisponibilidade;
    });

    listaCatalogo.innerHTML = "";

    contadorLivros.textContent =
        `${livrosFiltrados.length} livro(s) encontrado(s)`;

    if (livrosFiltrados.length === 0) {
        listaCatalogo.innerHTML =
            "<p class='catalogo-vazio'>Nenhum livro encontrado.</p>";
        return;
    }

    livrosFiltrados.forEach(livro => {

        const card = document.createElement("article");
        card.classList.add("livro-card");

        const imagem = livro.imagem
            ? livro.imagem
            : "assets/livros/capa-padrao.png";

        const disponibilidade = livro.disponivel
            ? "Disponível"
            : "Em breve";

        card.innerHTML = `
            <img
                src="${imagem}"
                alt="Capa de ${livro.titulo}"
                onerror="this.style.display='none'"
            >

            <span class="livro-categoria">${livro.categoria}</span>

            <h3>${livro.titulo}</h3>

            <p>${livro.autor}</p>

            <span class="livro-status ${livro.disponivel ? "disponivel" : "indisponivel"}">
                ${disponibilidade}
            </span>

            <a href="livro.html?id=${livro.id}">
                Ver detalhes
            </a>
        `;

        listaCatalogo.appendChild(card);
    });
}

// Eventos dos filtros.
pesquisaLivro.addEventListener("input", exibirCatalogo);
filtroCategoria.addEventListener("change", exibirCatalogo);
filtroDisponibilidade.addEventListener("change", exibirCatalogo);

// Inicialização.
carregarCategorias();
exibirCatalogo();