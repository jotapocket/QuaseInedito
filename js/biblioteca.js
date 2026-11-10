
const livrosDigitais = [
    {
        id: 1,
        titulo: "A Divina Comédia",
        autor: "Dante Alighieri",
        descricao: "Uma jornada épica pelo Inferno, Purgatório e Paraíso.",
        imagem: "assets/livros/divina-comedia.jpg",
        arquivo: "assets/pdfs/a-divina-comedia.pdf",
        categoria: "Literatura clássica"
    },
    {
        id: 2,
        titulo: "A Guerra dos Mundos",
        autor: "H. G. Wells",
        descricao: "Uma invasão extraterrestre ameaça a humanidade.",
        imagem: "assets/livros/guerra-dos-mundos.jpg",
        arquivo: "assets/pdfs/a-guerra-dos-mundos.pdf",
        categoria: "Ficção científica"
    },
    {
        id: 3,
        titulo: "A Revolução dos Bichos",
        autor: "George Orwell",
        descricao: "Uma fábula sobre poder, política e desigualdade.",
        imagem: "assets/livros/revolucao-dos-bichos.jpg",
        arquivo: "assets/pdfs/a-revolucao-dos-bichos.pdf",
        categoria: "Ficção e crítica social"
    },
    {
        id: 4,
        titulo: "Alice no País das Maravilhas",
        autor: "Lewis Carroll",
        descricao: "Uma aventura fantástica por um mundo extraordinário.",
        imagem: "assets/livros/alice.jpg",
        arquivo: "assets/pdfs/alice-no-pais-das-maravilhas.pdf",
        categoria: "Fantasia"
    },
    {
        id: 5,
        titulo: "As Aventuras de Sherlock Holmes",
        autor: "Arthur Conan Doyle",
        descricao: "Uma coletânea de mistérios protagonizados pelo famoso detetive.",
        imagem: "assets/livros/sherlock-holmes.jpg",
        arquivo: "assets/pdfs/as-aventuras-de-sherlock-holmes.pdf",
        categoria: "Mistério"
    },
    {
        id: 6,
        titulo: "Frankenstein",
        autor: "Mary Shelley",
        descricao: "Uma história sobre ciência, criação e responsabilidade.",
        imagem: "assets/livros/frankenstein.jpg",
        arquivo: "assets/pdfs/frankenstein.pdf",
        categoria: "Terror e ficção científica"
    },
    {
        id: 7,
        titulo: "Moby Dick",
        autor: "Herman Melville",
        descricao: "Uma expedição marítima marcada pela obsessão de um capitão.",
        imagem: "assets/livros/moby-dick.jpg",
        arquivo: "assets/pdfs/moby-dick.pdf",
        categoria: "Aventura"
    }
];

const areaBiblioteca = document.getElementById("biblioteca-lista");
const leitor = document.getElementById("leitor-pdf");
const visualizador = document.getElementById("visualizador-pdf");
const tituloLeitor = document.getElementById("titulo-leitor");
const botaoFecharLeitor = document.getElementById("fechar-leitor");

// ===== EXIBIR LIVROS =====

function exibirBiblioteca() {
    if (!areaBiblioteca) return;

    areaBiblioteca.innerHTML = "";

    livrosDigitais.forEach(livro => {
        const card = document.createElement("article");
        card.classList.add("livro-card");

        const capa = document.createElement("img");
        capa.src = livro.imagem;
        capa.alt = `Capa de ${livro.titulo}`;
        capa.loading = "lazy";

        const titulo = document.createElement("h3");
        titulo.textContent = livro.titulo;

        const autor = document.createElement("p");
        autor.textContent = livro.autor;

        const categoria = document.createElement("span");
        categoria.classList.add("categoria-livro-digital");
        categoria.textContent = livro.categoria;

        const descricao = document.createElement("p");
        descricao.textContent = livro.descricao;

        const botaoLer = document.createElement("button");
        botaoLer.type = "button";
        botaoLer.classList.add("botao-principal");
        botaoLer.textContent = "Ler online";

        botaoLer.addEventListener("click", () => {
            lerLivro(livro);
        });

        const botaoBaixar = document.createElement("a");
        botaoBaixar.href = livro.arquivo;
        botaoBaixar.download = "";
        botaoBaixar.classList.add("link-download-biblioteca");
        botaoBaixar.textContent = "Baixar PDF";

        card.append(
            capa,
            titulo,
            autor,
            categoria,
            descricao,
            botaoLer,
            botaoBaixar
        );

        areaBiblioteca.appendChild(card);
    });
}

// ===== LEITURA ONLINE =====

function lerLivro(livro) {
    if (!leitor || !visualizador) return;

    visualizador.src = livro.arquivo;
    tituloLeitor.textContent = livro.titulo;

    leitor.hidden = false;

    leitor.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// ===== FECHAR LEITOR =====

if (botaoFecharLeitor) {
    botaoFecharLeitor.addEventListener("click", () => {
        leitor.hidden = true;
        visualizador.src = "";
    });
}

// ===== INICIALIZAÇÃO =====

exibirBiblioteca();
