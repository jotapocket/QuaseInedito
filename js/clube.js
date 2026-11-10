
/* =========================================
   CLUBE DO LIVRO — QUASE INÉDITO
========================================= */


/* ===== ELEMENTOS PRINCIPAIS ===== */

const botaoAdicionarLivro = document.getElementById("botao-adicionar-livro");
const listaEstante = document.getElementById("lista-estante");
const listaPublicacoes = document.getElementById("lista-publicacoes");
const formularioPublicacao = document.getElementById("form-publicacao");
const textoPublicacao = document.getElementById("texto-publicacao");


/* ===== USUÁRIO CONECTADO ===== */

function obterUsuarioClube() {

    try {
        return JSON.parse(localStorage.getItem("usuarioLogado"));
    } catch (erro) {
        return null;
    }

}

function exigirLoginClube() {

    const usuario = obterUsuarioClube();

    if (!usuario) {
        alert("Faça login para utilizar o Clube do Livro.");
        window.location.href = "login.html";
        return false;
    }

    return true;

}


/* ===== ARMAZENAMENTO ===== */

const CHAVE_CLUBE = "clubeDados";

function obterDadosClube() {

    try {

        const dados = JSON.parse(localStorage.getItem(CHAVE_CLUBE));

        if (dados && typeof dados === "object") {

            return {
                estantes: dados.estantes || {},
                publicacoes: Array.isArray(dados.publicacoes)
                    ? dados.publicacoes
                    : []
            };

        }

    } catch (erro) {

        console.error("Erro ao recuperar dados do clube:", erro);

    }

    return {
        estantes: {},
        publicacoes: []
    };

}


function salvarDadosClube(dados) {

    localStorage.setItem(CHAVE_CLUBE, JSON.stringify(dados));

}


function obterMinhaEstante() {

    const usuario = obterUsuarioClube();

    if (!usuario) {
        return [];
    }

    const dados = obterDadosClube();

    return dados.estantes[usuario.id] || [];

}


function salvarMinhaEstante(estante) {

    const usuario = obterUsuarioClube();

    if (!usuario) {
        return;
    }

    const dados = obterDadosClube();

    dados.estantes[usuario.id] = estante;

    salvarDadosClube(dados);

}


/* =========================================
   MINHA ESTANTE
========================================= */


/* ===== MODAL DE ADIÇÃO ===== */

function abrirModalAdicionarLivro() {

    if (!exigirLoginClube()) {
        return;
    }

    if (!Array.isArray(livros)) {
        alert("Não foi possível carregar o catálogo de livros.");
        return;
    }

    const modalExistente = document.getElementById("modal-adicionar-livro");

    if (modalExistente) {
        modalExistente.remove();
    }

    const modal = document.createElement("dialog");
    modal.id = "modal-adicionar-livro";
    modal.className = "modal-clube";

    modal.innerHTML = `
        <div class="conteudo-modal-clube">

            <button
                type="button"
                class="fechar-modal-clube"
                aria-label="Fechar"
            >
                &times;
            </button>

            <h2>Adicionar livro à estante</h2>

            <p>Pesquise um livro disponível no catálogo.</p>

            <label for="pesquisa-livro-clube">
                Nome do livro ou autor
            </label>

            <input
                type="search"
                id="pesquisa-livro-clube"
                placeholder="Digite o título ou autor..."
            >

            <div id="resultados-livros-clube"></div>

            <label for="status-livro-clube">
                Situação da leitura
            </label>

            <select id="status-livro-clube">
                <option value="quero-ler">Quero ler</option>
                <option value="lendo">Estou lendo</option>
                <option value="lidos">Já li</option>
            </select>

            <button
                type="button"
                id="confirmar-livro-clube"
                disabled
            >
                Adicionar à estante
            </button>

        </div>
    `;

    document.body.appendChild(modal);

    const campoPesquisa = modal.querySelector("#pesquisa-livro-clube");
    const resultados = modal.querySelector("#resultados-livros-clube");
    const campoStatus = modal.querySelector("#status-livro-clube");
    const botaoConfirmar = modal.querySelector("#confirmar-livro-clube");
    const botaoFechar = modal.querySelector(".fechar-modal-clube");

    let livroSelecionado = null;


    function exibirResultados(termo = "") {

        resultados.replaceChildren();

        livroSelecionado = null;
        botaoConfirmar.disabled = true;

        const pesquisa = termo.trim().toLowerCase();

        const encontrados = livros.filter(function (livro) {

            const titulo = String(livro.titulo || "").toLowerCase();
            const autor = String(livro.autor || "").toLowerCase();

            return titulo.includes(pesquisa) || autor.includes(pesquisa);

        }).slice(0, 10);


        if (encontrados.length === 0) {

            const mensagem = document.createElement("p");
            mensagem.textContent = "Nenhum livro encontrado.";
            resultados.appendChild(mensagem);

            return;

        }


        encontrados.forEach(function (livro) {

            const item = document.createElement("button");

            item.type = "button";
            item.className = "resultado-livro-clube";
            item.textContent = `${livro.titulo} — ${livro.autor}`;

            item.addEventListener("click", function () {

                livroSelecionado = livro;

                resultados.querySelectorAll("button").forEach(function (botao) {
                    botao.classList.remove("selecionado");
                });

                item.classList.add("selecionado");

                botaoConfirmar.disabled = false;

            });

            resultados.appendChild(item);

        });

    }


    campoPesquisa.addEventListener("input", function () {
        exibirResultados(campoPesquisa.value);
    });


    botaoConfirmar.addEventListener("click", function () {

        if (!livroSelecionado) {
            return;
        }

        const estante = obterMinhaEstante();

        const jaAdicionado = estante.some(function (item) {
            return item.idLivro === livroSelecionado.id;
        });

        if (jaAdicionado) {

            alert("Este livro já está na sua estante.");
            return;

        }


        estante.push({

            idLivro: livroSelecionado.id,
            status: campoStatus.value,
            dataAdicao: new Date().toISOString()

        });


        salvarMinhaEstante(estante);

        atualizarEstante();

        modal.close();
        modal.remove();

    });


    botaoFechar.addEventListener("click", function () {

        modal.close();
        modal.remove();

    });


    modal.addEventListener("click", function (event) {

        if (event.target === modal) {
            modal.close();
            modal.remove();
        }

    });


    exibirResultados();

    modal.showModal();

    campoPesquisa.focus();

}


/* ===== EXIBIR LIVROS ===== */

function atualizarEstante() {

    if (!listaEstante) {
        return;
    }

    const estante = obterMinhaEstante();

    const filtroAtivo = document.querySelector(
        ".filtro-estante.ativo"
    );

    const filtro = filtroAtivo
        ? filtroAtivo.dataset.filtro
        : "todos";


    atualizarContadoresEstante(estante);

    listaEstante.replaceChildren();


    const livrosFiltrados = estante.filter(function (item) {

        return filtro === "todos" || item.status === filtro;

    });


    if (livrosFiltrados.length === 0) {

        const mensagem = document.createElement("p");

        mensagem.className = "mensagem-vazia";

        mensagem.textContent = estante.length === 0
            ? "Sua estante está vazia. Adicione seu primeiro livro!"
            : "Nenhum livro encontrado nesta categoria.";

        listaEstante.appendChild(mensagem);

        return;

    }


    livrosFiltrados.forEach(function (item) {

        const livro = livros.find(function (produto) {
            return produto.id === item.idLivro;
        });

        if (!livro) {
            return;
        }


        const card = document.createElement("article");
        card.className = "card-livro-estante";


        const imagem = document.createElement("img");

        imagem.src = livro.imagem;
        imagem.alt = `Capa de ${livro.titulo}`;
        imagem.loading = "lazy";


        const titulo = document.createElement("h3");
        titulo.textContent = livro.titulo;


        const autor = document.createElement("p");
        autor.textContent = livro.autor;


        const seletorStatus = document.createElement("select");

        seletorStatus.className = "status-livro-estante";

        const opcoes = [
            { valor: "quero-ler", texto: "Quero ler" },
            { valor: "lendo", texto: "Estou lendo" },
            { valor: "lidos", texto: "Já li" }
        ];

        opcoes.forEach(function (opcao) {

            const elemento = document.createElement("option");

            elemento.value = opcao.valor;
            elemento.textContent = opcao.texto;

            seletorStatus.appendChild(elemento);

        });

        seletorStatus.value = item.status;


        seletorStatus.addEventListener("change", function () {

            const estanteAtualizada = obterMinhaEstante();

            const livroAtualizado = estanteAtualizada.find(function (registro) {
                return registro.idLivro === item.idLivro;
            });

            if (livroAtualizado) {

                livroAtualizado.status = seletorStatus.value;

                salvarMinhaEstante(estanteAtualizada);

                atualizarEstante();

            }

        });


        const botaoRemover = document.createElement("button");

        botaoRemover.type = "button";
        botaoRemover.textContent = "Remover livro";


        botaoRemover.addEventListener("click", function () {

            const confirmar = confirm(
                `Deseja remover "${livro.titulo}" da sua estante?`
            );

            if (!confirmar) {
                return;
            }

            const novaEstante = obterMinhaEstante().filter(function (registro) {
                return registro.idLivro !== item.idLivro;
            });

            salvarMinhaEstante(novaEstante);

            atualizarEstante();

        });


        card.appendChild(imagem);
        card.appendChild(titulo);
        card.appendChild(autor);
        card.appendChild(seletorStatus);
        card.appendChild(botaoRemover);

        listaEstante.appendChild(card);

    });

}


/* ===== CONTADORES ===== */

function atualizarContadoresEstante(estante) {

    const totalLendo = document.getElementById("total-lendo");
    const totalQueroLer = document.getElementById("total-quero-ler");
    const totalLidos = document.getElementById("total-lidos");

    if (totalLendo) {
        totalLendo.textContent = estante.filter(item => item.status === "lendo").length;
    }

    if (totalQueroLer) {
        totalQueroLer.textContent = estante.filter(item => item.status === "quero-ler").length;
    }

    if (totalLidos) {
        totalLidos.textContent = estante.filter(item => item.status === "lidos").length;
    }

}


/* ===== FILTROS ===== */

document.querySelectorAll(".filtro-estante").forEach(function (botao) {

    botao.addEventListener("click", function () {

        document.querySelectorAll(".filtro-estante").forEach(function (item) {
            item.classList.remove("ativo");
        });

        botao.classList.add("ativo");

        atualizarEstante();

    });

});


if (botaoAdicionarLivro) {

    botaoAdicionarLivro.addEventListener("click", abrirModalAdicionarLivro);

}


/* =========================================
   FÓRUM DE LEITORES
========================================= */


/* ===== PUBLICAÇÃO OFICIAL ===== */

const PUBLICACAO_OFICIAL = {

    id: "oficial",
    autorId: "quase-inedito",
    autorNome: "Quase Inédito",
    oficial: true,

    texto: `Bem-vindo ao fórum do Quase Inédito!

Este é um espaço para compartilhar suas experiências literárias, conversar sobre suas leituras, recomendar livros e conhecer novas histórias.

Aqui você pode publicar suas opiniões, comentar as publicações de outros leitores e descobrir diferentes perspectivas sobre o universo literário.

Pegue seu livro favorito e participe da conversa!`,

    data: "2026-01-01T12:00:00.000Z",
    comentarios: []

};


function garantirPublicacaoOficial() {

    const dados = obterDadosClube();

    const oficial = dados.publicacoes.find(function (publicacao) {
        return publicacao.id === "oficial";
    });

    if (!oficial) {

        dados.publicacoes.unshift(PUBLICACAO_OFICIAL);

        salvarDadosClube(dados);

    }

}


/* ===== CRIAR PUBLICAÇÃO ===== */

if (formularioPublicacao) {

    formularioPublicacao.addEventListener("submit", function (event) {

        event.preventDefault();

        if (!exigirLoginClube()) {
            return;
        }

        const texto = textoPublicacao.value.trim();

        if (!texto) {
            return;
        }

        const usuario = obterUsuarioClube();

        const dados = obterDadosClube();


        const novaPublicacao = {

            id: crypto.randomUUID(),
            autorId: usuario.id,
            autorNome: usuario.nome,
            oficial: false,
            texto: texto,
            data: new Date().toISOString(),
            comentarios: []

        };


        dados.publicacoes.push(novaPublicacao);

        salvarDadosClube(dados);

        formularioPublicacao.reset();

        atualizarPublicacoes();

    });

}


/* ===== EXIBIR PUBLICAÇÕES ===== */

function atualizarPublicacoes() {

    if (!listaPublicacoes) {
        return;
    }

    const dados = obterDadosClube();

    const publicacoes = dados.publicacoes;

    listaPublicacoes.replaceChildren();


    publicacoes.slice().reverse().forEach(function (publicacao) {

        const artigo = document.createElement("article");

        artigo.className = publicacao.oficial
            ? "publicacao-oficial"
            : "publicacao-usuario";

        artigo.dataset.idPublicacao = publicacao.id;


        const cabecalho = document.createElement("div");
        cabecalho.className = "cabecalho-publicacao";


        const avatar = document.createElement("div");

        avatar.className = publicacao.oficial
            ? "avatar-oficial"
            : "avatar-publicacao";

        if (publicacao.oficial) {
            const logo = document.createElement("img");

            logo.src = "assets/logo.png";
            logo.alt = "Logo do Quase Inédito";
            logo.className = "avatar-logo-oficial";

            avatar.appendChild(logo);
        } else {
            avatar.textContent = String(publicacao.autorNome || "U")
                .trim()
                .charAt(0)
                .toUpperCase();
        }


        const informacoes = document.createElement("div");

        const nome = document.createElement("h3");
        nome.textContent = publicacao.autorNome || "Leitor";

        const tipo = document.createElement("span");

        tipo.textContent = publicacao.oficial
            ? "Conta oficial"
            : new Date(publicacao.data).toLocaleDateString("pt-BR");


        informacoes.appendChild(nome);
        informacoes.appendChild(tipo);

        cabecalho.appendChild(avatar);
        cabecalho.appendChild(informacoes);


        const texto = document.createElement("p");
        texto.textContent = publicacao.texto;


        /* Área de comentários */

        const areaComentarios = document.createElement("div");
        areaComentarios.className = "comentarios-publicacao";


        const listaComentarios = document.createElement("div");
        listaComentarios.className = "lista-comentarios";


        (publicacao.comentarios || []).forEach(function (comentario) {

            const item = document.createElement("div");
            item.className = "comentario";

            const nomeComentario = document.createElement("strong");
            nomeComentario.textContent = comentario.autorNome + ": ";

            const textoComentario = document.createElement("p");
            textoComentario.textContent = comentario.texto;

            textoComentario.prepend(nomeComentario);

            item.appendChild(textoComentario);

            listaComentarios.appendChild(item);

        });


        const formularioComentario = document.createElement("form");
        formularioComentario.className = "form-comentario";


        const rotulo = document.createElement("label");
        rotulo.textContent = "Deixe seu comentário";


        const campo = document.createElement("div");
        campo.className = "campo-comentario";


        const input = document.createElement("input");

        input.type = "text";
        input.placeholder = "Escreva um comentário...";
        input.required = true;


        const botaoEnviar = document.createElement("button");

        botaoEnviar.type = "submit";
        botaoEnviar.textContent = "Enviar";


        campo.appendChild(input);
        campo.appendChild(botaoEnviar);

        formularioComentario.appendChild(rotulo);
        formularioComentario.appendChild(campo);


        formularioComentario.addEventListener("submit", function (event) {

            event.preventDefault();

            if (!exigirLoginClube()) {
                return;
            }

            const textoComentario = input.value.trim();

            if (!textoComentario) {
                return;
            }

            const usuario = obterUsuarioClube();

            const dadosAtualizados = obterDadosClube();

            const publicacaoAtual = dadosAtualizados.publicacoes.find(function (item) {
                return item.id === publicacao.id;
            });

            if (!publicacaoAtual) {
                return;
            }

            if (!Array.isArray(publicacaoAtual.comentarios)) {
                publicacaoAtual.comentarios = [];
            }

            publicacaoAtual.comentarios.push({

                id: crypto.randomUUID(),
                autorId: usuario.id,
                autorNome: usuario.nome,
                texto: textoComentario,
                data: new Date().toISOString()

            });

            salvarDadosClube(dadosAtualizados);

            atualizarPublicacoes();

        });


        areaComentarios.appendChild(listaComentarios);
        areaComentarios.appendChild(formularioComentario);


        artigo.appendChild(cabecalho);
        artigo.appendChild(texto);
        artigo.appendChild(areaComentarios);


        listaPublicacoes.appendChild(artigo);

    });

}


/* =========================================
   INICIALIZAÇÃO
========================================= */

garantirPublicacaoOficial();

atualizarEstante();

atualizarPublicacoes();
