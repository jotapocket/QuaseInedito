
// ==========================================
// SISTEMA DE TROCAS
// ==========================================

// ===== ANÚNCIOS DEMONSTRATIVOS =====

const anunciosTroca = [
    {
        id: 1,
        titulo: "O Hobbit",
        autor: "J. R. R. Tolkien",
        categoria: "Fantasia e aventura",
        imagem: "assets/livros/o-hobbit.jpg",
        anunciante: "Lucas",
        conservacao: "Muito bom",
        descricao: "Livro bem conservado, com poucas marcas de uso. Uma ótima leitura para quem gosta de fantasia.",
        procura: "Livros de fantasia, aventura ou ficção."
    },
    {
        id: 2,
        titulo: "Extraordinário",
        autor: "R. J. Palacio",
        categoria: "Drama",
        imagem: "assets/livros/extraordinario.jpg",
        anunciante: "Mariana",
        conservacao: "Bom",
        descricao: "Exemplar usado, mas em bom estado. Páginas preservadas e leitura completa.",
        procura: "Romances, dramas ou histórias inspiradoras."
    },
    {
        id: 3,
        titulo: "Coraline",
        autor: "Neil Gaiman",
        categoria: "Fantasia e suspense",
        imagem: "assets/livros/coraline.jpg",
        anunciante: "Pedro",
        conservacao: "Muito bom",
        descricao: "Livro conservado, sem páginas rasgadas. Ideal para quem gosta de histórias misteriosas.",
        procura: "Fantasia, suspense ou ficção."
    },
    {
        id: 4,
        titulo: "Dom Casmurro",
        autor: "Machado de Assis",
        categoria: "Literatura brasileira",
        imagem: "assets/livros/dom-casmurro.jpg",
        anunciante: "Ana",
        conservacao: "Bom",
        descricao: "Edição de leitura, com algumas marcas de uso na capa. Interior preservado.",
        procura: "Clássicos da literatura ou romances."
    },
    {
        id: 5,
        titulo: "Harry Potter e a Pedra Filosofal",
        autor: "J. K. Rowling",
        categoria: "Fantasia e aventura",
        imagem: "assets/livros/harry-potter-1.jpg",
        anunciante: "Gabriel",
        conservacao: "Regular",
        descricao: "Exemplar com sinais de uso, mas com todas as páginas em boas condições de leitura.",
        procura: "Outros livros de fantasia e aventura."
    },
    {
        id: 6,
        titulo: "O Pequeno Príncipe",
        autor: "Antoine de Saint-Exupéry",
        categoria: "Literatura estrangeira",
        imagem: "assets/livros/pequeno-principe.jpg",
        anunciante: "Beatriz",
        conservacao: "Muito bom",
        descricao: "Livro bem cuidado, com capa e páginas preservadas.",
        procura: "Clássicos, ficção ou literatura infantojuvenil."
    }
];

// ===== ELEMENTOS DA PÁGINA =====

const areaTrocas = document.getElementById("livros-troca");
const quantidadeTrocas = document.getElementById("quantidade-trocas");

const overlayTroca = document.getElementById("modal-troca-overlay");
const conteudoModalTroca = document.getElementById("conteudo-modal-troca");
const fecharModalTroca = document.getElementById("fechar-modal-troca");

// ===== USUÁRIO CONECTADO =====

function obterUsuarioTroca() {
    try {
        return JSON.parse(localStorage.getItem("usuarioLogado"));
    } catch (erro) {
        return null;
    }
}

// ===== ANÚNCIOS DOS USUÁRIOS =====

function obterAnunciosTrocaUsuarios() {

    if (typeof obterAnunciosUsuarios !== "function") {
        return [];
    }

    return obterAnunciosUsuarios()
        .filter(anuncio => {
            return anuncio.modalidade === "troca" &&
                anuncio.disponivel !== false;
        })
        .map(anuncio => ({
            ...anuncio,
            anunciante: "Usuário cadastrado",
            conservacao: anuncio.condicao || "Não informada",
            anuncioUsuario: true
        }));
}

// ===== REÚNE TODOS OS ANÚNCIOS =====

function obterTodosAnunciosTroca() {

    return [
        ...anunciosTroca.map(anuncio => ({
            ...anuncio,
            anuncioUsuario: false
        })),
        ...obterAnunciosTrocaUsuarios()
    ];
}

// ===== PROTEÇÃO DOS TEXTOS =====

function escaparHTML(texto) {

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

// ===== CRIA OS CARTÕES =====

function criarCartaoTroca(anuncio) {

    return `
        <article class="cartao-troca">

            <div class="cartao-troca-imagem">
                <img
                    src="${escaparHTML(anuncio.imagem)}"
                    alt="Capa de ${escaparHTML(anuncio.titulo)}"
                >
            </div>

            <div class="cartao-troca-conteudo">

                <span class="etiqueta-troca">
                    Disponível para troca
                </span>

                <h3>${escaparHTML(anuncio.titulo)}</h3>

                <p class="troca-autor">
                    ${escaparHTML(anuncio.autor)}
                </p>

                <div class="troca-informacoes">
                    <span>Por: ${escaparHTML(anuncio.anunciante)}</span>
                    <span>Conservação: ${escaparHTML(anuncio.conservacao)}</span>
                </div>

                <button
                    type="button"
                    class="botao-detalhes-troca"
                    data-anuncio="${escaparHTML(anuncio.id)}"
                >
                    Ver detalhes
                </button>

            </div>

        </article>
    `;
}

// ===== EXIBE OS ANÚNCIOS =====

function exibirAnunciosTroca() {

    if (!areaTrocas || !quantidadeTrocas) return;

    const todosAnuncios = obterTodosAnunciosTroca();

    quantidadeTrocas.textContent =
        `${todosAnuncios.length} anúncios disponíveis`;

    areaTrocas.innerHTML = todosAnuncios
        .map(criarCartaoTroca)
        .join("");
}

// ===== ABRE OS DETALHES =====

function abrirDetalhesTroca(id) {

    const todosAnuncios = obterTodosAnunciosTroca();

    const anuncio = todosAnuncios.find(
        item => String(item.id) === String(id)
    );

    if (!anuncio || !overlayTroca || !conteudoModalTroca) return;

    const sessao = obterUsuarioTroca();

    const ehDono = anuncio.anuncioUsuario &&
        sessao &&
        anuncio.usuarioId === sessao.id;

    let areaProposta = "";

    if (!anuncio.anuncioUsuario) {

        areaProposta = `
            <div class="aviso-indisponivel">
                Este é um anúncio demonstrativo.
                Propostas não estão disponíveis para ele.
            </div>
        `;

    } else if (ehDono) {

        areaProposta = `
            <div class="aviso-indisponivel">
                Este é o seu anúncio. Você não pode propor
                uma troca para o próprio livro.
            </div>
        `;

    } else {

        areaProposta = `
            <form id="form-proposta-troca" class="form-proposta-troca">

                <h3>Gostou deste livro?</h3>

                <p>
                    Informe qual livro você gostaria de oferecer
                    em troca.
                </p>

                <label for="livro-oferecido">
                    Livro que você oferece
                </label>

                <input
                    type="text"
                    id="livro-oferecido"
                    name="livroOferecido"
                    placeholder="Título do seu livro"
                    maxlength="100"
                    required
                >

                <label for="mensagem-proposta">
                    Mensagem ao anunciante (opcional)
                </label>

                <textarea
                    id="mensagem-proposta"
                    name="mensagem"
                    placeholder="Conte um pouco sobre o livro que está oferecendo..."
                    maxlength="500"
                    rows="3"
                ></textarea>

                <button
                    type="submit"
                    class="botao-principal"
                >
                    Enviar proposta
                </button>

                <p id="mensagem-proposta-troca" role="status"></p>

            </form>
        `;
    }

    conteudoModalTroca.innerHTML = `
        <div class="modal-troca-conteudo">

            <div class="modal-troca-imagem">
                <img
                    src="${escaparHTML(anuncio.imagem)}"
                    alt="Capa de ${escaparHTML(anuncio.titulo)}"
                >
            </div>

            <div class="modal-troca-informacoes">

                <span class="etiqueta-troca">
                    Disponível para troca
                </span>

                <h2 id="modal-troca-titulo">
                    ${escaparHTML(anuncio.titulo)}
                </h2>

                <p class="troca-autor">
                    ${escaparHTML(anuncio.autor)}
                </p>

                <p>
                    <strong>Categoria:</strong>
                    ${escaparHTML(anuncio.categoria)}
                </p>

                <p>
                    <strong>Anunciante:</strong>
                    ${escaparHTML(anuncio.anunciante)}
                </p>

                <p>
                    <strong>Conservação:</strong>
                    ${escaparHTML(anuncio.conservacao)}
                </p>

                <div class="troca-descricao">
                    <h3>Sobre o livro</h3>
                    <p>${escaparHTML(anuncio.descricao)}</p>
                </div>

                <div class="troca-procura">
                    <h3>O que o anunciante procura?</h3>
                    <p>${escaparHTML(anuncio.procura || "Não informado.")}</p>
                </div>

                ${areaProposta}

            </div>

        </div>
    `;

    overlayTroca.classList.add("ativo");
    document.body.classList.add("modal-aberto");

    configurarFormularioProposta(anuncio);
}

// ===== ENVIO DA PROPOSTA =====

function configurarFormularioProposta(anuncio) {

    const formulario = document.getElementById("form-proposta-troca");

    if (!formulario) return;

    formulario.addEventListener("submit", function(event) {

        event.preventDefault();

        const sessao = obterUsuarioTroca();

        if (!sessao) {
            alert("Entre na sua conta para enviar uma proposta.");
            window.location.href = "login.html";
            return;
        }

        const livroOferecido = document
            .getElementById("livro-oferecido")
            .value.trim();

        const mensagem = document
            .getElementById("mensagem-proposta")
            .value.trim();

        const resultado = registrarPropostaTroca({
            anuncioId: anuncio.id,
            livroOferecido: livroOferecido,
            mensagem: mensagem
        });

        const areaMensagem = document.getElementById(
            "mensagem-proposta-troca"
        );

        areaMensagem.textContent = resultado.mensagem;

        if (resultado.sucesso) {

            areaMensagem.classList.add("sucesso-proposta");

            formulario.reset();

            // Evita o envio de outra proposta na mesma janela.
            const botaoEnviar = formulario.querySelector(
                'button[type="submit"]'
            );

            botaoEnviar.disabled = true;
            botaoEnviar.textContent = "Proposta enviada";

        } else {

            areaMensagem.classList.add("erro-proposta");
        }
    });
}

// ===== EVENTOS DOS ANÚNCIOS =====

if (areaTrocas) {

    areaTrocas.addEventListener("click", function(event) {

        const botao = event.target.closest("[data-anuncio]");

        if (!botao) return;

        abrirDetalhesTroca(botao.dataset.anuncio);
    });
}

// ===== FECHAR MODAL =====

function fecharDetalhesTroca() {

    if (!overlayTroca) return;

    overlayTroca.classList.remove("ativo");
    document.body.classList.remove("modal-aberto");
}

if (fecharModalTroca) {
    fecharModalTroca.addEventListener("click", fecharDetalhesTroca);
}

if (overlayTroca) {

    overlayTroca.addEventListener("click", function(event) {

        if (event.target === overlayTroca) {
            fecharDetalhesTroca();
        }
    });
}

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {
        fecharDetalhesTroca();
    }
});

// ===== INICIALIZAÇÃO =====

exibirAnunciosTroca();
