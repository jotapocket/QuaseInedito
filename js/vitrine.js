
const areaCarrosseis = document.getElementById("carrosseis-categorias");

// Livros escolhidos manualmente para os destaques.
const idsDestaques = [3, 6, 9, 11, 13, 21];

// Livros demonstrativos + anúncios de usuários disponíveis.
const livrosDisponiveisVitrine = obterLivrosPorModalidade("venda");


function formatarPrecoVitrine(preco) {
    return Number(preco || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


// Cria o cartão de cada livro.
function criarCartaoLivro(livro) {
    return `
        <article class="cartao-vitrine">

            <a href="livro.html?id=${encodeURIComponent(livro.id)}"
               class="cartao-vitrine-link">

                <div class="cartao-vitrine-imagem">
                    <img
                        src="${escaparHTML(livro.imagem)}"
                        alt="Capa de ${escaparHTML(livro.titulo)}"
                        onerror="this.style.display='none'"
                    >
                </div>

                <h3>${escaparHTML(livro.titulo)}</h3>
                <p>${escaparHTML(livro.autor)}</p>
                <strong>${formatarPrecoVitrine(livro.preco)}</strong>
            </a>

            <button
                type="button"
                class="botao-comprar"
                data-comprar="${escaparHTML(livro.id)}">
                Comprar
            </button>

        </article>
    `;
}


// Cria uma fileira horizontal de livros.
function criarCarrossel(titulo, listaLivros, categoria = null) {
    if (listaLivros.length === 0) return "";

    const identificador = `carrossel-${Math.random().toString(36).slice(2, 9)}`;

    const linkCategoria = categoria
        ? `pesquisa.html?categoria=${encodeURIComponent(categoria)}`
        : "pesquisa.html";

    return `
        <section class="secao-carrossel">

            <div class="carrossel-cabecalho">
                <h2>${escaparHTML(titulo)}</h2>

                <div class="carrossel-controles">
                    <a href="${linkCategoria}" class="carrossel-ver-todos">
                        Ver todos
                    </a>

                    <button type="button"
                        class="carrossel-seta"
                        data-direcao="-1"
                        data-alvo="${identificador}"
                        aria-label="Livros anteriores">
                        &#10094;
                    </button>

                    <button type="button"
                        class="carrossel-seta"
                        data-direcao="1"
                        data-alvo="${identificador}"
                        aria-label="Próximos livros">
                        &#10095;
                    </button>
                </div>
            </div>

            <div class="carrossel-trilho" id="${identificador}">
                ${listaLivros.map(criarCartaoLivro).join("")}
            </div>

        </section>
    `;
}


// Organiza os livros automaticamente por categoria.
function organizarVitrine() {
    if (!areaCarrosseis) return;

    const destaques = livrosDisponiveisVitrine.filter(
        livro => idsDestaques.includes(livro.id)
    );

    const categorias = {};

    livrosDisponiveisVitrine.forEach(livro => {
        const categoria = livro.categoria || "Outros";

        if (!categorias[categoria]) {
            categorias[categoria] = [];
        }

        categorias[categoria].push(livro);
    });

    let html = "";

    // Primeiro, a seleção especial.
    html += criarCarrossel("Seleção do sebo", destaques);

    const outrasLeituras = [];

    // Depois, as categorias com pelo menos dois livros.
    Object.keys(categorias)
        .sort((a, b) => a.localeCompare(b, "pt-BR"))
        .forEach(categoria => {
            const lista = categorias[categoria];

            if (lista.length >= 2) {
                html += criarCarrossel(categoria, lista, categoria);
            } else {
                outrasLeituras.push(...lista);
            }
        });

    // Categorias menores são reunidas em uma única seção.
    if (outrasLeituras.length > 0) {
        html += criarCarrossel("Outras leituras", outrasLeituras);
    }

    areaCarrosseis.innerHTML = html;
}


// Faz as setas movimentarem o carrossel.
if (areaCarrosseis) {
    areaCarrosseis.addEventListener("click", function(event) {
        const botao = event.target.closest(".carrossel-seta");

        if (!botao) return;

        const identificador = botao.dataset.alvo;
        const direcao = Number(botao.dataset.direcao);

        const trilho = document.getElementById(identificador);

        if (trilho) {
            trilho.scrollBy({
                left: direcao * 300,
                behavior: "smooth"
            });
        }
    });


    // Adiciona o livro ao carrinho.
    areaCarrosseis.addEventListener("click", function(event) {
        const botao = event.target.closest("[data-comprar]");

        if (!botao) return;

        adicionarAoCarrinho(botao.dataset.comprar);
    });
}


// Inicializa a vitrine.
organizarVitrine();
