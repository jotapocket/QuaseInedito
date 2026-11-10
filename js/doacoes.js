
// ==========================================
// ELEMENTOS DA PÁGINA
// ==========================================

const areaDoacoes = document.getElementById("livros-doacao");


// ==========================================
// PROTEÇÃO DOS TEXTOS
// ==========================================

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


// ==========================================
// USUÁRIO CONECTADO
// ==========================================

function obterUsuarioDoacao() {

    try {
        return JSON.parse(localStorage.getItem("usuarioLogado"));
    } catch (erro) {
        return null;
    }

}


// ==========================================
// OBTÉM AS DOAÇÕES DOS USUÁRIOS
// ==========================================

function obterDoacoesUsuarios() {

    if (typeof obterAnunciosUsuarios !== "function") {
        return [];
    }

    return obterAnunciosUsuarios().filter(anuncio => {

        return anuncio.modalidade === "doacao" &&
            anuncio.disponivel !== false;

    });

}


// ==========================================
// CRIA OS CARTÕES
// ==========================================

function criarCartaoDoacao(anuncio) {

    const sessao = obterUsuarioDoacao();

    const ehDono = sessao && anuncio.usuarioId === sessao.id;

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
                    Doação gratuita
                </span>

                <h3>${escaparHTML(anuncio.titulo)}</h3>

                <p class="troca-autor">
                    ${escaparHTML(anuncio.autor)}
                </p>

                <div class="troca-informacoes">

                    <span>${escaparHTML(anuncio.categoria)}</span>

                    <span>
                        Conservação:
                        ${escaparHTML(anuncio.condicao || "Não informada")}
                    </span>

                </div>

                <p>${escaparHTML(anuncio.descricao)}</p>

                ${ehDono ? `

                    <p class="aviso-indisponivel">
                        Este é o seu anúncio.
                    </p>

                ` : `

                    <button
                        type="button"
                        class="botao-solicitar-doacao"
                        data-solicitar-doacao="${escaparHTML(anuncio.id)}"
                    >
                        Solicitar doação
                    </button>

                `}

            </div>

        </article>

    `;

}


// ==========================================
// EXIBE AS DOAÇÕES
// ==========================================

function exibirDoacoes() {

    if (!areaDoacoes) return;

    const doacoes = obterDoacoesUsuarios();

    if (doacoes.length === 0) {

        areaDoacoes.innerHTML = `

            <p class="mensagem-vazia">
                Ainda não há livros disponíveis para doação.
            </p>

        `;

        return;
    }

    areaDoacoes.innerHTML = doacoes
        .map(criarCartaoDoacao)
        .join("");

}


// ==========================================
// SOLICITAR UMA DOAÇÃO
// ==========================================

function solicitarDoacao(id) {

    const sessao = obterUsuarioDoacao();

    // Verifica se o usuário está conectado
    if (!sessao) {

        alert("Entre na sua conta para solicitar uma doação.");

        window.location.href = "login.html";

        return;
    }

    // Localiza o anúncio
    const anuncio = obterDoacoesUsuarios().find(
        item => item.id === id
    );

    if (!anuncio) {

        alert("Este livro não está mais disponível.");

        exibirDoacoes();

        return;
    }

    // Impede solicitação do próprio anúncio
    if (anuncio.usuarioId === sessao.id) {

        alert("Você não pode solicitar seu próprio anúncio.");

        return;
    }

    // Solicita uma mensagem opcional
    const mensagem = prompt(
        `Você deseja solicitar "${anuncio.titulo}"?\n\nEscreva uma mensagem para o doador (opcional):`
    );

    // Se cancelar, interrompe a operação
    if (mensagem === null) return;

    // Registra a solicitação
    const resultado = registrarSolicitacaoDoacao({

        anuncioId: id,
        mensagem: mensagem

    });

    alert(resultado.mensagem);

    if (resultado.sucesso) {
        exibirDoacoes();
    }

}


// ==========================================
// EVENTOS DOS BOTÕES
// ==========================================

if (areaDoacoes) {

    areaDoacoes.addEventListener("click", function(event) {

        const botao = event.target.closest(
            "[data-solicitar-doacao]"
        );

        if (!botao) return;

        const id = botao.dataset.solicitarDoacao;

        solicitarDoacao(id);

    });

}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

exibirDoacoes();
