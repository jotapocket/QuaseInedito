const livros = [

    // ===== LITERATURA E FICÇÃO =====

    {
        id: 1,
        titulo: "O Pequeno Príncipe",
        autor: "Antoine de Saint-Exupéry",
        categoria: "Literatura estrangeira",
        descricao: "Uma história sobre amizade, afeto e a maneira como enxergamos o mundo.",
        imagem: "assets/livros/pequeno-principe.jpg",
        tipo: "fisico",
        preco: 18.90,
        condicao: null,
        vendedor: null,
        modalidade: "venda",
        disponivel: true
    },

    {
        id: 2,
        titulo: "Dom Casmurro",
        autor: "Machado de Assis",
        categoria: "Literatura brasileira",
        descricao: "Romance narrado por Bento Santiago, que revisita sua história e seu relacionamento com Capitu.",
        imagem: "assets/livros/dom-casmurro.jpg",
        tipo: "fisico",
        preco: 16.90,
        condicao: null,
        vendedor: null,
        modalidade: "venda",
        disponivel: true
    },

    {
        id: 3,
        titulo: "O Hobbit",
        autor: "J. R. R. Tolkien",
        categoria: "Fantasia e aventura",
        descricao: "Bilbo Bolseiro parte em uma aventura inesperada ao lado de um grupo de anões.",
        imagem: "assets/livros/o-hobbit.jpg",
        tipo: "fisico",
        preco: 29.90,
        condicao: null,
        vendedor: null,
        modalidade: "venda",
        disponivel: true
    },

    {
        id: 4,
        titulo: "Capitães da Areia",
        autor: "Jorge Amado",
        categoria: "Literatura brasileira",
        descricao: "A história de um grupo de jovens que vive nas ruas de Salvador.",
        imagem: "assets/livros/capitaes-da-areia.jpg",
        tipo: "fisico",
        preco: 19.90,
        condicao: null,
        vendedor: null,
        modalidade: "venda",
        disponivel: true
    },

    {
        id: 5,
        titulo: "Extraordinário",
        autor: "R. J. Palacio",
        categoria: "Drama",
        descricao: "A trajetória de Auggie, um garoto que enfrenta os desafios de começar a estudar em uma nova escola.",
        imagem: "assets/livros/extraordinario.jpg",
        tipo: "fisico",
        preco: 24.90,
        condicao: null,
        vendedor: null,
        modalidade: "venda",
        disponivel: true
    },

    {
        id: 6,
        titulo: "Percy Jackson e o Ladrão de Raios",
        autor: "Rick Riordan",
        categoria: "Fantasia e aventura",
        descricao: "Percy descobre sua ligação com a mitologia grega e embarca em uma missão perigosa.",
        imagem: "assets/livros/percy-jackson.jpg",
        tipo: "fisico",
        preco: 27.90,
        condicao: null,
        vendedor: null,
        modalidade: "venda",
        disponivel: true
    },

    {
        id: 7,
        titulo: "Coraline",
        autor: "Neil Gaiman",
        categoria: "Fantasia e suspense",
        descricao: "Uma garota encontra uma passagem para uma versão misteriosa e inquietante de sua própria casa.",
        imagem: "assets/livros/coraline.jpg",
        tipo: "fisico",
        preco: 22.90,
        condicao: null,
        vendedor: null,
        modalidade: "venda",
        disponivel: true
    },

    {
        id: 8,
        titulo: "A Revolução dos Bichos",
        autor: "George Orwell",
        categoria: "Ficção e crítica social",
        descricao: "Uma fábula sobre poder, manipulação e desigualdade em uma sociedade governada por animais.",
        imagem: "assets/livros/revolucao-dos-bichos.jpg",
        tipo: "fisico",
        preco: 18.90,
        condicao: null,
        vendedor: null,
        modalidade: "venda",
        disponivel: true
    },

    {
        id: 9,
        titulo: "Harry Potter e a Pedra Filosofal",
        autor: "J. K. Rowling",
        categoria: "Fantasia e aventura",
        descricao: "Harry descobre que é um bruxo e começa sua jornada no mundo da magia.",
        imagem: "assets/livros/harry-potter-1.jpg",
        tipo: "fisico",
        preco: 26.90,
        condicao: null,
        vendedor: null,
        modalidade: "venda",
        disponivel: true
    },

    {
        id: 10,
        titulo: "O Cortiço",
        autor: "Aluísio Azevedo",
        categoria: "Literatura brasileira",
        descricao: "Romance naturalista que retrata as relações sociais e as condições de vida em um cortiço no Rio de Janeiro.",
        imagem: "assets/livros/o-cortico.jpg",
        tipo: "fisico",
        preco: 16.90,
        condicao: null,
        vendedor: null,
        modalidade: "venda",
        disponivel: true
    },

    // ===== MANGÁS =====

    {
        id: 11,
        titulo: "Saint Seiya (Kanzenban)",
        autor: "Masami Kurumada",
        categoria: "Mangá",
        descricao: "Edição especial do mangá clássico dos Cavaleiros do Zodíaco.",
        imagem: "assets/livros/saint-seiya-kanzenban.jpg",
        tipo: "fisico",
        preco: 49.90,
        condicao: null,
        vendedor: null,
        modalidade: "venda",
        disponivel: true
    },

    {
        id: 12,
        titulo: "Dragon Ball: Edição Definitiva",
        autor: "Akira Toriyama",
        categoria: "Mangá",
        descricao: "Edição especial em capa dura da clássica aventura de Goku e seus amigos.",
        imagem: "assets/livros/dragon-ball-definitiva.jpg",
        tipo: "fisico",
        preco: 39.90,
        condicao: null,
        vendedor: null,
        modalidade: "venda",
        disponivel: true
    },

    // ===== HQs E SUPER-HERÓIS =====

    {
        id: 13,
        titulo: "Batman: Ano Um",
        autor: "Frank Miller e David Mazzucchelli",
        categoria: "HQs e super-heróis",
        descricao: "A origem de Batman e os primeiros passos de Bruce Wayne como vigilante de Gotham.",
        imagem: "assets/livros/batman-ano-um.jpg",
        tipo: "fisico",
        preco: 39.90,
        condicao: null,
        vendedor: null,
        modalidade: "venda",
        disponivel: true
    },

    {
        id: 14,
        titulo: "Batman: O Longo Dia das Bruxas",
        autor: "Jeph Loeb e Tim Sale",
        categoria: "HQs e super-heróis",
        descricao: "Uma investigação de Batman sobre uma série de crimes que acontecem em Gotham.",
        imagem: "assets/livros/batman-longo-dia.jpg",
        tipo: "fisico",
        preco: 59.90,
        condicao: null,
        vendedor: null,
        modalidade: "venda",
        disponivel: true
    },

    {
        id: 15,
        titulo: "All-Star Superman",
        autor: "Grant Morrison e Frank Quitely",
        categoria: "HQs e super-heróis",
        descricao: "Uma história especial que apresenta uma interpretação marcante do Superman.",
        imagem: "assets/livros/all-star-superman.jpg",
        tipo: "fisico",
        preco: 44.90,
        condicao: null,
        vendedor: null,
        modalidade: "venda",
        disponivel: true
    },

    {
        id: 16,
        titulo: "Lanterna Verde: Origem Secreta",
        autor: "Geoff Johns e Ivan Reis",
        categoria: "HQs e super-heróis",
        descricao: "A origem de Hal Jordan e sua descoberta do universo dos Lanternas Verdes.",
        imagem: "assets/livros/lanterna-verde-origem.jpg",
        tipo: "fisico",
        preco: 44.90,
        condicao: null,
        vendedor: null,
        modalidade: "venda",
        disponivel: true
    },

    {
        id: 17,
        titulo: "Lanterna Verde: A Noite Mais Densa",
        autor: "Geoff Johns e diversos artistas",
        categoria: "HQs e super-heróis",
        descricao: "Uma grande saga envolvendo os diferentes grupos de Lanternas do universo DC.",
        imagem: "assets/livros/lanterna-verde-noite-densa.jpg",
        tipo: "fisico",
        preco: 54.90,
        condicao: null,
        vendedor: null,
        modalidade: "venda",
        disponivel: true
    },

    {
        id: 18,
        titulo: "Batman: O Cavaleiro das Trevas",
        autor: "Frank Miller",
        categoria: "HQs e super-heróis",
        descricao: "Uma história que apresenta um Batman mais velho retornando à ação em Gotham.",
        imagem: "assets/livros/batman-cavaleiro-das-trevas.jpg",
        tipo: "fisico",
        preco: 49.90,
        condicao: null,
        vendedor: null,
        modalidade: "venda",
        disponivel: true
    },

    {
        id: 19,
        titulo: "Superman: O Homem de Aço",
        autor: "John Byrne",
        categoria: "HQs e super-heróis",
        descricao: "Uma releitura da origem do Superman e de sua chegada ao mundo dos humanos.",
        imagem: "assets/livros/superman-homem-de-aco.jpg",
        tipo: "fisico",
        preco: 39.90,
        condicao: null,
        vendedor: null,
        modalidade: "venda",
        disponivel: true
    },

    {
        id: 20,
        titulo: "Reino do Amanhã",
        autor: "Mark Waid e Alex Ross",
        categoria: "HQs e super-heróis",
        descricao: "Uma história sobre o futuro do universo DC e o papel dos grandes heróis.",
        imagem: "assets/livros/reino-do-amanha.jpg",
        tipo: "fisico",
        preco: 59.90,
        condicao: null,
        vendedor: null,
        modalidade: "venda",
        disponivel: true
    },

    // ===== TEOLOGIA =====

    {
        id: 21,
        titulo: "Cristianismo Puro e Simples",
        autor: "C. S. Lewis",
        categoria: "Teologia e espiritualidade",
        descricao: "Uma apresentação de ideias centrais da fé cristã e de seus fundamentos.",
        imagem: "assets/livros/cristianismo-puro-e-simples.jpg",
        tipo: "fisico",
        preco: 27.90,
        condicao: null,
        vendedor: null,
        modalidade: "venda",
        disponivel: true
    },

    {
        id: 22,
        titulo: "Cartas de um Diabo a Seu Aprendiz",
        autor: "C. S. Lewis",
        categoria: "Teologia e espiritualidade",
        descricao: "Uma obra de ficção que aborda questões morais e espirituais por meio de cartas fictícias.",
        imagem: "assets/livros/cartas-diabo-aprendiz.jpg",
        tipo: "fisico",
        preco: 34.90,
        condicao: null,
        vendedor: null,
        modalidade: "venda",
        disponivel: true
    },

    {
        id: 23,
        titulo: "O Peregrino",
        autor: "John Bunyan",
        categoria: "Teologia e espiritualidade",
        descricao: "Uma alegoria cristã que acompanha a jornada de um peregrino em busca da Cidade Celestial.",
        imagem: "assets/livros/o-peregrino.jpg",
        tipo: "fisico",
        preco: 22.90,
        condicao: null,
        vendedor: null,
        modalidade: "venda",
        disponivel: true
    },

    // ===== COLEÇÕES DE FANTASIA =====

    {
        id: 24,
        titulo: "As Crônicas de Nárnia: Volume Único",
        autor: "C. S. Lewis",
        categoria: "Fantasia e aventura",
        descricao: "Coleção de histórias fantásticas ambientadas no mundo de Nárnia.",
        imagem: "assets/livros/cronicas-de-narnia.jpg",
        tipo: "fisico",
        preco: 74.90,
        condicao: null,
        vendedor: null,
        modalidade: "venda",
        disponivel: true
    }

];