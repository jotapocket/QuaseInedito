
 // ==========================================
 // MINHA CONTA — QUASE INÉDITO
 // ==========================================


// ===== IDENTIFICAÇÃO DO USUÁRIO =====

let sessao;
let usuario;

try {
    sessao = JSON.parse(localStorage.getItem("usuarioLogado"));
} catch (erro) {
    sessao = null;
}

if (!sessao) {
    window.location.replace("login.html");
} else {

    const usuarios = obterDadosUsuarios();

    usuario = usuarios.find(u => u.id === sessao.id);

    if (!usuario) {
        localStorage.removeItem("usuarioLogado");
        window.location.replace("login.html");
    } else {

        iniciarMinhaConta();

    }
}


// Recupera usuários cadastrados
function obterDadosUsuarios() {
    try {
        const dados = JSON.parse(localStorage.getItem("usuarios"));
        return Array.isArray(dados) ? dados : [];
    } catch (erro) {
        return [];
    }
}


// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

// Formata preços
function formatarPrecoConta(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


// Formata datas
function formatarDataConta(data) {
    if (!data) return "Não informada";

    const dataFormatada = new Date(data);

    if (Number.isNaN(dataFormatada.getTime())) {
        return "Data inválida";
    }

    return dataFormatada.toLocaleDateString("pt-BR");
}


// Evita interpretar informações digitadas
// pelo usuário como código HTML
function escaparHTML(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, caractere => {
        const entidades = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entidades[caractere];
    });
}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

function iniciarMinhaConta() {

    exibirPerfil();
    configurarFormulario();
    configurarBotoes();

    configurarModais();
    configurarFormularioConfiguracoes();

    atualizarMinhaConta();

}


// ==========================================
// PERFIL
// ==========================================

function exibirPerfil() {

    document.getElementById("nome-perfil").textContent =
        usuario.nome;

    document.getElementById("email-perfil").textContent =
        usuario.email;

    document.getElementById("detalhe-nome").textContent =
        usuario.nome;

    document.getElementById("detalhe-email").textContent =
        usuario.email;

    document.getElementById("data-cadastro").textContent =
        formatarDataConta(usuario.dataCadastro);

    const iniciais = usuario.nome
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(parte => parte[0])
        .join("")
        .toUpperCase();

    document.getElementById("avatar-perfil").textContent =
        iniciais;

    // Preenche os campos de edição
    document.getElementById("config-nome").value =
        usuario.nome;

    document.getElementById("config-email").value =
        usuario.email;

}

// ==========================================
// MODAIS DA MINHA CONTA
// ==========================================

function configurarModais() {

    // Abrir modal
    document.querySelectorAll("[data-abrir-modal]").forEach(botao => {

        botao.addEventListener("click", function() {

            const idModal = this.dataset.abrirModal;
            const modal = document.getElementById(idModal);

            if (modal) {
                modal.showModal();
            }

        });

    });


    // Fechar pelos botões
    document.querySelectorAll("[data-fechar-modal]").forEach(botao => {

        botao.addEventListener("click", function() {

            const modal = this.closest("dialog");

            if (modal) {
                modal.close();
            }

        });

    });


    // Fechar ao clicar fora do conteúdo
    document.querySelectorAll(".modal-conta").forEach(modal => {

        modal.addEventListener("click", function(event) {

            if (event.target === modal) {
                modal.close();
            }

        });

    });

}


// ==========================================
// SEGURANÇA E CONFIGURAÇÕES
// ==========================================

// Converte um buffer em hexadecimal
function converterHexConta(buffer) {

    return Array.from(new Uint8Array(buffer))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");

}


// Gera hash usando o mesmo padrão do cadastro
async function gerarHashConta(senha, sal) {

    const codificador = new TextEncoder();

    const chave = await crypto.subtle.importKey(
        "raw",
        codificador.encode(senha),
        "PBKDF2",
        false,
        ["deriveBits"]
    );

    const resultado = await crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            salt: codificador.encode(sal),
            iterations: 100000,
            hash: "SHA-256"
        },
        chave,
        256
    );

    return converterHexConta(resultado);

}


// Exibe mensagens das configurações
function mostrarMensagemConta(elemento, texto, tipo) {

    elemento.textContent = texto;

    elemento.className = tipo === "sucesso"
        ? "mensagem-sucesso"
        : "mensagem-erro";

}


// ==========================================
// FORMULÁRIOS DE CONFIGURAÇÕES
// ==========================================

function configurarFormularioConfiguracoes() {

    const formularioPerfil =
        document.getElementById("form-editar-perfil");

    const formularioSenha =
        document.getElementById("form-alterar-senha");


    // ======================================
    // EDITAR NOME E E-MAIL
    // ======================================

    formularioPerfil.addEventListener("submit", function(event) {

        event.preventDefault();

        const mensagem = document.getElementById("mensagem-perfil");

        const novoNome = document
            .getElementById("config-nome")
            .value.trim();

        const novoEmail = document
            .getElementById("config-email")
            .value.trim()
            .toLowerCase();

        if (novoNome.length < 3) {

            mostrarMensagemConta(
                mensagem,
                "O nome precisa ter pelo menos 3 caracteres.",
                "erro"
            );

            return;

        }

        if (!novoEmail) {

            mostrarMensagemConta(
                mensagem,
                "Informe um endereço de e-mail válido.",
                "erro"
            );

            return;

        }


        const usuarios = obterDadosUsuarios();

        // Verifica se outro usuário já utiliza esse e-mail
        const emailExiste = usuarios.some(item =>
            item.email === novoEmail && item.id !== usuario.id
        );

        if (emailExiste) {

            mostrarMensagemConta(
                mensagem,
                "Este e-mail já está sendo utilizado por outra conta.",
                "erro"
            );

            return;

        }


        // Atualiza os dados oficiais
        const indice = usuarios.findIndex(item =>
            item.id === usuario.id
        );

        if (indice === -1) {

            mostrarMensagemConta(
                mensagem,
                "Não foi possível localizar sua conta.",
                "erro"
            );

            return;

        }


        usuarios[indice].nome = novoNome;
        usuarios[indice].email = novoEmail;

        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        // Atualiza o usuário em memória
        usuario = usuarios[indice];

        // Atualiza a sessão
        const novaSessao = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        };

        localStorage.setItem(
            "usuarioLogado",
            JSON.stringify(novaSessao)
        );

        // Atualiza o perfil e a navbar
        exibirPerfil();

        if (typeof atualizarNavbarUsuario === "function") {
            atualizarNavbarUsuario();
        }

        mostrarMensagemConta(
            mensagem,
            "Seus dados foram atualizados com sucesso!",
            "sucesso"
        );

    });


    // ======================================
    // ALTERAR SENHA
    // ======================================

    formularioSenha.addEventListener("submit", async function(event) {

        event.preventDefault();

        const mensagem = document.getElementById("mensagem-senha");

        const senhaAtual = document.getElementById("senha-atual").value;
        const novaSenha = document.getElementById("nova-senha").value;
        const confirmarSenha = document.getElementById("confirmar-nova-senha").value;


        if (novaSenha.length < 6) {

            mostrarMensagemConta(
                mensagem,
                "A nova senha precisa ter pelo menos 6 caracteres.",
                "erro"
            );

            return;

        }


        if (novaSenha !== confirmarSenha) {

            mostrarMensagemConta(
                mensagem,
                "As novas senhas não são iguais.",
                "erro"
            );

            return;

        }


        if (senhaAtual === novaSenha) {

            mostrarMensagemConta(
                mensagem,
                "A nova senha precisa ser diferente da atual.",
                "erro"
            );

            return;

        }


        try {

            // Confere a senha atual
            const hashAtual = await gerarHashConta(
                senhaAtual,
                usuario.sal
            );

            if (hashAtual !== usuario.senhaHash) {

                mostrarMensagemConta(
                    mensagem,
                    "A senha atual está incorreta.",
                    "erro"
                );

                return;

            }


            // Gera um novo salt
            const novoSal = converterHexConta(
                crypto.getRandomValues(new Uint8Array(16))
            );

            // Gera o novo hash
            const novoHash = await gerarHashConta(
                novaSenha,
                novoSal
            );


            // Atualiza os dados do usuário
            const usuarios = obterDadosUsuarios();

            const indice = usuarios.findIndex(item =>
                item.id === usuario.id
            );

            if (indice === -1) {

                mostrarMensagemConta(
                    mensagem,
                    "Não foi possível localizar sua conta.",
                    "erro"
                );

                return;

            }


            usuarios[indice].sal = novoSal;
            usuarios[indice].senhaHash = novoHash;

            localStorage.setItem(
                "usuarios",
                JSON.stringify(usuarios)
            );

            // Atualiza o usuário em memória
            usuario = usuarios[indice];

            formularioSenha.reset();

            mostrarMensagemConta(
                mensagem,
                "Senha alterada com sucesso!",
                "sucesso"
            );

        } catch (erro) {

            mostrarMensagemConta(
                mensagem,
                "Não foi possível alterar a senha. Tente novamente.",
                "erro"
            );

            console.error("Erro ao alterar senha:", erro);

        }

    });

}

// ==========================================
// MODAIS DA MINHA CONTA
// ==========================================

function configurarModais() {

    // Abrir modal
    document.querySelectorAll("[data-abrir-modal]").forEach(botao => {

        botao.addEventListener("click", function() {

            const idModal = this.dataset.abrirModal;
            const modal = document.getElementById(idModal);

            if (modal) {
                modal.showModal();
            }

        });

    });


    // Fechar pelos botões
    document.querySelectorAll("[data-fechar-modal]").forEach(botao => {

        botao.addEventListener("click", function() {

            const modal = this.closest("dialog");

            if (modal) {
                modal.close();
            }

        });

    });


    // Fechar ao clicar fora do conteúdo
    document.querySelectorAll(".modal-conta").forEach(modal => {

        modal.addEventListener("click", function(event) {

            if (event.target === modal) {
                modal.close();
            }

        });

    });

}


// ==========================================
// SEGURANÇA E CONFIGURAÇÕES
// ==========================================

// Converte um buffer em hexadecimal
function converterHexConta(buffer) {

    return Array.from(new Uint8Array(buffer))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");

}


// Gera hash usando o mesmo padrão do cadastro
async function gerarHashConta(senha, sal) {

    const codificador = new TextEncoder();

    const chave = await crypto.subtle.importKey(
        "raw",
        codificador.encode(senha),
        "PBKDF2",
        false,
        ["deriveBits"]
    );

    const resultado = await crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            salt: codificador.encode(sal),
            iterations: 100000,
            hash: "SHA-256"
        },
        chave,
        256
    );

    return converterHexConta(resultado);

}


// Exibe mensagens das configurações
function mostrarMensagemConta(elemento, texto, tipo) {

    elemento.textContent = texto;

    elemento.className = tipo === "sucesso"
        ? "mensagem-sucesso"
        : "mensagem-erro";

}


// ==========================================
// FORMULÁRIOS DE CONFIGURAÇÕES
// ==========================================

function configurarFormularioConfiguracoes() {

    const formularioPerfil =
        document.getElementById("form-editar-perfil");

    const formularioSenha =
        document.getElementById("form-alterar-senha");


    // ======================================
    // EDITAR NOME E E-MAIL
    // ======================================

    formularioPerfil.addEventListener("submit", function(event) {

        event.preventDefault();

        const mensagem = document.getElementById("mensagem-perfil");

        const novoNome = document
            .getElementById("config-nome")
            .value.trim();

        const novoEmail = document
            .getElementById("config-email")
            .value.trim()
            .toLowerCase();

        if (novoNome.length < 3) {

            mostrarMensagemConta(
                mensagem,
                "O nome precisa ter pelo menos 3 caracteres.",
                "erro"
            );

            return;

        }

        if (!novoEmail) {

            mostrarMensagemConta(
                mensagem,
                "Informe um endereço de e-mail válido.",
                "erro"
            );

            return;

        }


        const usuarios = obterDadosUsuarios();

        // Verifica se outro usuário já utiliza esse e-mail
        const emailExiste = usuarios.some(item =>
            item.email === novoEmail && item.id !== usuario.id
        );

        if (emailExiste) {

            mostrarMensagemConta(
                mensagem,
                "Este e-mail já está sendo utilizado por outra conta.",
                "erro"
            );

            return;

        }


        // Atualiza os dados oficiais
        const indice = usuarios.findIndex(item =>
            item.id === usuario.id
        );

        if (indice === -1) {

            mostrarMensagemConta(
                mensagem,
                "Não foi possível localizar sua conta.",
                "erro"
            );

            return;

        }


        usuarios[indice].nome = novoNome;
        usuarios[indice].email = novoEmail;

        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        // Atualiza o usuário em memória
        usuario = usuarios[indice];

        // Atualiza a sessão
        const novaSessao = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        };

        localStorage.setItem(
            "usuarioLogado",
            JSON.stringify(novaSessao)
        );

        // Atualiza o perfil e a navbar
        exibirPerfil();

        if (typeof atualizarNavbarUsuario === "function") {
            atualizarNavbarUsuario();
        }

        mostrarMensagemConta(
            mensagem,
            "Seus dados foram atualizados com sucesso!",
            "sucesso"
        );

    });


    // ======================================
    // ALTERAR SENHA
    // ======================================

    formularioSenha.addEventListener("submit", async function(event) {

        event.preventDefault();

        const mensagem = document.getElementById("mensagem-senha");

        const senhaAtual = document.getElementById("senha-atual").value;
        const novaSenha = document.getElementById("nova-senha").value;
        const confirmarSenha = document.getElementById("confirmar-nova-senha").value;


        if (novaSenha.length < 6) {

            mostrarMensagemConta(
                mensagem,
                "A nova senha precisa ter pelo menos 6 caracteres.",
                "erro"
            );

            return;

        }


        if (novaSenha !== confirmarSenha) {

            mostrarMensagemConta(
                mensagem,
                "As novas senhas não são iguais.",
                "erro"
            );

            return;

        }


        if (senhaAtual === novaSenha) {

            mostrarMensagemConta(
                mensagem,
                "A nova senha precisa ser diferente da atual.",
                "erro"
            );

            return;

        }


        try {

            // Confere a senha atual
            const hashAtual = await gerarHashConta(
                senhaAtual,
                usuario.sal
            );

            if (hashAtual !== usuario.senhaHash) {

                mostrarMensagemConta(
                    mensagem,
                    "A senha atual está incorreta.",
                    "erro"
                );

                return;

            }


            // Gera um novo salt
            const novoSal = converterHexConta(
                crypto.getRandomValues(new Uint8Array(16))
            );

            // Gera o novo hash
            const novoHash = await gerarHashConta(
                novaSenha,
                novoSal
            );


            // Atualiza os dados do usuário
            const usuarios = obterDadosUsuarios();

            const indice = usuarios.findIndex(item =>
                item.id === usuario.id
            );

            if (indice === -1) {

                mostrarMensagemConta(
                    mensagem,
                    "Não foi possível localizar sua conta.",
                    "erro"
                );

                return;

            }


            usuarios[indice].sal = novoSal;
            usuarios[indice].senhaHash = novoHash;

            localStorage.setItem(
                "usuarios",
                JSON.stringify(usuarios)
            );

            // Atualiza o usuário em memória
            usuario = usuarios[indice];

            formularioSenha.reset();

            mostrarMensagemConta(
                mensagem,
                "Senha alterada com sucesso!",
                "sucesso"
            );

        } catch (erro) {

            mostrarMensagemConta(
                mensagem,
                "Não foi possível alterar a senha. Tente novamente.",
                "erro"
            );

            console.error("Erro ao alterar senha:", erro);

        }

    });

}


// ==========================================
// FORMULÁRIO DE ANÚNCIOS
// ==========================================

function configurarFormulario() {

    const formulario = document.getElementById("form-anuncio");
    const modalidade = document.getElementById("modalidade-anuncio");

    const blocoPreco = document.getElementById("bloco-preco");
    const blocoProcura = document.getElementById("bloco-procura");

    const campoPreco = document.getElementById("preco-anuncio");

    function atualizarCamposModalidade() {

        blocoPreco.hidden = modalidade.value !== "venda";
        blocoProcura.hidden = modalidade.value !== "troca";

        campoPreco.required = modalidade.value === "venda";

    }

    modalidade.addEventListener("change", atualizarCamposModalidade);

    atualizarCamposModalidade();


    // Envio do formulário
    formulario.addEventListener("submit", function(event) {

        event.preventDefault();

        const dados = {

            titulo: document.getElementById("titulo-anuncio").value,
            autor: document.getElementById("autor-anuncio").value,
            categoria: document.getElementById("categoria-anuncio").value,
            descricao: document.getElementById("descricao-anuncio").value,
            imagem: document.getElementById("imagem-anuncio").value,
            modalidade: modalidade.value,
            preco: campoPreco.value,
            condicao: document.getElementById("condicao-anuncio").value,
            procura: document.getElementById("procura-anuncio").value

        };

        const resultado = criarAnuncio(dados);

        const mensagem = document.getElementById("mensagem-anuncio");

        mensagem.textContent = resultado.mensagem;

        mensagem.className = resultado.sucesso
            ? "mensagem-sucesso"
            : "mensagem-erro";

        if (resultado.sucesso) {

            formulario.reset();

            atualizarCamposModalidade();

            document.getElementById("area-formulario-anuncio").hidden = true;

            atualizarMinhaConta();

        }

    });

}


// ==========================================
// BOTÕES DA PÁGINA
// ==========================================

function configurarBotoes() {

    const botaoNovo = document.getElementById("botao-novo-anuncio");
    const botaoCancelar = document.getElementById("botao-cancelar-anuncio");
    const areaFormulario = document.getElementById("area-formulario-anuncio");

    botaoNovo.addEventListener("click", function() {

        areaFormulario.hidden = !areaFormulario.hidden;

    });


    botaoCancelar.addEventListener("click", function() {

        document.getElementById("form-anuncio").reset();

        areaFormulario.hidden = true;

        document.getElementById("mensagem-anuncio").textContent = "";

        document.getElementById("bloco-preco").hidden = true;
        document.getElementById("bloco-procura").hidden = true;

    });


    // Sair da conta
    document.getElementById("botao-sair").addEventListener("click", function() {

        localStorage.removeItem("usuarioLogado");

        window.location.replace("index.html");

    });

}


// ==========================================
// ATUALIZAÇÃO GERAL
// ==========================================

function atualizarMinhaConta() {

    exibirMeusAnuncios();
    exibirMinhasCompras();
    exibirMinhasTrocas();

}


// ==========================================
// MEUS ANÚNCIOS
// ==========================================

function exibirMeusAnuncios() {

    const anuncios = obterMeusAnuncios();

    const modalidades = [
        {
            nome: "venda",
            elemento: "lista-anuncios-venda"
        },
        {
            nome: "troca",
            elemento: "lista-anuncios-troca"
        },
        {
            nome: "doacao",
            elemento: "lista-anuncios-doacao"
        }
    ];

    modalidades.forEach(modalidade => {

        const area = document.getElementById(modalidade.elemento);

        const lista = anuncios.filter(
            anuncio => anuncio.modalidade === modalidade.nome
        );

        if (lista.length === 0) {

            area.innerHTML = "<p>Nenhum anúncio nesta modalidade.</p>";

            return;

        }

        area.innerHTML = "";

        lista.forEach(anuncio => {

            const card = document.createElement("article");

            card.classList.add("meu-anuncio-card");

            card.innerHTML = `

                <img
                    src="${escaparHTML(anuncio.imagem)}"
                    alt="Capa de ${escaparHTML(anuncio.titulo)}"
                    onerror="this.style.display='none'"
                >

                <div class="meu-anuncio-informacoes">

                    <h4>${escaparHTML(anuncio.titulo)}</h4>

                    <p>${escaparHTML(anuncio.autor)}</p>

                    <p>
                        ${anuncio.modalidade === "venda"
                            ? formatarPrecoConta(anuncio.preco)
                            : anuncio.modalidade === "troca"
                                ? "Disponível para troca"
                                : "Doação gratuita"}
                    </p>

                    <p>
                        Status:
                        ${anuncio.disponivel ? "Disponível" : "Indisponível"}
                    </p>

                    <div class="acoes-anuncio">

                        <button
                            type="button"
                            data-alterar="${escaparHTML(anuncio.id)}"
                            data-disponivel="${!anuncio.disponivel}"
                        >
                            ${anuncio.disponivel
                                ? "Desativar anúncio"
                                : "Reativar anúncio"}
                        </button>

                        <button
                            type="button"
                            data-excluir="${escaparHTML(anuncio.id)}"
                        >
                            Excluir
                        </button>

                    </div>

                </div>

            `;

            area.appendChild(card);

        });

    });


    // Eventos das ações dos anúncios
    document.querySelectorAll("[data-alterar]").forEach(botao => {

        botao.addEventListener("click", function() {

            const id = this.dataset.alterar;
            const disponivel = this.dataset.disponivel === "true";

            if (alterarDisponibilidadeAnuncio(id, disponivel)) {
                exibirMeusAnuncios();
            }

        });

    });


    document.querySelectorAll("[data-excluir]").forEach(botao => {

        botao.addEventListener("click", function() {

            const confirmar = confirm(
                "Tem certeza de que deseja excluir este anúncio?"
            );

            if (!confirmar) return;

            if (excluirAnuncio(this.dataset.excluir)) {
                exibirMeusAnuncios();
            }

        });

    });

}


// ==========================================
// MINHAS COMPRAS
// ==========================================

function exibirMinhasCompras() {

    const area = document.getElementById("lista-compras");

    const compras = obterMinhasCompras();

    if (compras.length === 0) {

        area.innerHTML = "<p>Você ainda não realizou nenhuma compra.</p>";

        return;

    }

    area.innerHTML = "";

    compras.slice().reverse().forEach(compra => {

        const card = document.createElement("article");

        card.classList.add("compra-card");

        const itens = compra.itens.map(item => `

            <div class="item-compra">

                <span>${escaparHTML(item.titulo)}</span>

                <span>
                    ${item.quantidade} × ${formatarPrecoConta(item.preco)}
                </span>

            </div>

        `).join("");

        card.innerHTML = `

            <h3>Pedido ${escaparHTML(compra.id.slice(0, 8))}</h3>

            <p>Data: ${formatarDataConta(compra.dataCompra)}</p>

            <p>Status: ${escaparHTML(compra.status)}</p>

            <div class="itens-compra">
                ${itens}
            </div>

            <strong>
                Total: ${formatarPrecoConta(compra.total)}
            </strong>

        `;

        area.appendChild(card);

    });

}


// ==========================================
// MINHAS TROCAS
// ==========================================



function exibirMinhasTrocas() {

    const areaEnviadas = document.getElementById("propostas-enviadas");
    const areaRecebidas = document.getElementById("propostas-recebidas");

    if (!areaEnviadas || !areaRecebidas) return;

    // Recupera os dois tipos de negociação
    const enviadas = [
        ...obterPropostasEnviadas().map(item => ({
            ...item,
            tipo: "troca"
        })),

        ...obterSolicitacoesEnviadas().map(item => ({
            ...item,
            tipo: "doacao"
        }))
    ];

    const recebidas = [
        ...obterPropostasRecebidas().map(item => ({
            ...item,
            tipo: "troca"
        })),

        ...obterSolicitacoesRecebidas().map(item => ({
            ...item,
            tipo: "doacao"
        }))
    ];


    // ======================================
    // CRIAÇÃO DOS CARTÕES
    // ======================================

    function criarCartaoNegociacao(item, recebida) {

        const ehTroca = item.tipo === "troca";

        const etiqueta = ehTroca ? "Troca" : "Doação";

        const mensagem = item.mensagem ||
            "Sem mensagem adicional.";

        const informacaoLivro = ehTroca
            ? `<p>Livro oferecido: ${escaparHTML(item.livroOferecido)}</p>`
            : "";

        let acoes = "";

        // Propostas recebidas e ainda pendentes
        if (recebida && item.status === "Pendente") {

            acoes = `

                <div class="acoes-proposta">

                    <button
                        type="button"
                        data-acao-negociacao="responder"
                        data-tipo-negociacao="${item.tipo}"
                        data-id-negociacao="${escaparHTML(item.id)}"
                        data-decisao="Aceita"
                    >
                        Aceitar
                    </button>

                    <button
                        type="button"
                        data-acao-negociacao="responder"
                        data-tipo-negociacao="${item.tipo}"
                        data-id-negociacao="${escaparHTML(item.id)}"
                        data-decisao="Recusada"
                    >
                        Recusar
                    </button>

                </div>

            `;

        }

        // Negociações aceitas podem ser concluídas
        if (item.status === "Aceita") {

            acoes = `

                <p>
                    ${ehTroca
                        ? "Combine a entrega dos livros com o outro participante."
                        : "Combine a entrega do livro com o doador."}
                </p>

                <button
                    type="button"
                    data-acao-negociacao="concluir"
                    data-tipo-negociacao="${item.tipo}"
                    data-id-negociacao="${escaparHTML(item.id)}"
                >
                    Confirmar conclusão
                </button>

            `;

        }

        return `

            <article class="proposta-card">

                <span class="etiqueta-negociacao">
                    ${etiqueta}
                </span>

                <h3>${escaparHTML(item.tituloAnuncio)}</h3>

                ${informacaoLivro}

                <p>
                    ${escaparHTML(mensagem)}
                </p>

                <p>
                    ${recebida ? "Recebida" : "Enviada"} em:
                    ${formatarDataConta(item.dataEnvio)}
                </p>

                <strong class="status-proposta">
                    Status: ${escaparHTML(item.status)}
                </strong>

                ${acoes}

            </article>

        `;

    }


    // ======================================
    // PROPOSTAS E SOLICITAÇÕES ENVIADAS
    // ======================================

    if (enviadas.length === 0) {

        areaEnviadas.innerHTML =
            "<p>Você ainda não enviou propostas ou solicitações.</p>";

    } else {

        areaEnviadas.innerHTML = enviadas
            .slice()
            .reverse()
            .map(item => criarCartaoNegociacao(item, false))
            .join("");

    }


    // ======================================
    // PROPOSTAS E SOLICITAÇÕES RECEBIDAS
    // ======================================

    if (recebidas.length === 0) {

        areaRecebidas.innerHTML =
            "<p>Você ainda não recebeu propostas ou solicitações.</p>";

    } else {

        areaRecebidas.innerHTML = recebidas
            .slice()
            .reverse()
            .map(item => criarCartaoNegociacao(item, true))
            .join("");

    }


    // ======================================
    // EVENTOS DOS BOTÕES
    // ======================================

    document.querySelectorAll("[data-acao-negociacao]").forEach(botao => {

        botao.addEventListener("click", function() {

            const acao = this.dataset.acaoNegociacao;
            const tipo = this.dataset.tipoNegociacao;
            const id = this.dataset.idNegociacao;

            const decisao = this.dataset.decisao;

            let resultado;

            if (acao === "responder") {

                const confirmacao = confirm(
                    decisao === "Aceita"
                        ? "Deseja aceitar esta solicitação?"
                        : "Deseja recusar esta solicitação?"
                );

                if (!confirmacao) return;

                if (tipo === "troca") {

                    resultado = responderPropostaTroca(id, decisao);

                } else {

                    resultado = responderSolicitacaoDoacao(id, decisao);

                }

            }


            if (acao === "concluir") {

                const confirmacao = confirm(
                    tipo === "troca"
                        ? "Você confirma que a troca foi realizada?"
                        : "Você confirma que o livro foi entregue?"
                );

                if (!confirmacao) return;

                if (tipo === "troca") {

                    resultado = concluirPropostaTroca(id);

                } else {

                    resultado = concluirSolicitacaoDoacao(id);

                }

            }


            if (resultado) {

                alert(resultado.mensagem);

                if (resultado.sucesso) {
                    atualizarMinhaConta();
                }

            }

        });

    });

}
