
// ==========================================
// ARMAZENAMENTO DE DADOS DOS USUÁRIOS
// ==========================================


// ===== FUNÇÕES GERAIS =====

// Recupera uma lista do localStorage
function obterDados(chave) {
    try {
        const dados = JSON.parse(localStorage.getItem(chave));

        return Array.isArray(dados) ? dados : [];

    } catch (erro) {
        return [];
    }
}


// Salva uma lista no localStorage
function salvarDados(chave, dados) {
    if (!Array.isArray(dados)) {
        console.error("Os dados precisam estar em formato de lista.");
        return;
    }

    localStorage.setItem(chave, JSON.stringify(dados));
}


// ==========================================
// ANÚNCIOS DOS USUÁRIOS
// ==========================================

function obterAnunciosUsuarios() {
    return obterDados("anunciosUsuarios");
}

function salvarAnunciosUsuarios(anuncios) {
    salvarDados("anunciosUsuarios", anuncios);
}


// ==========================================
// HISTÓRICO DE COMPRAS
// ==========================================

function obterCompras() {
    return obterDados("compras");
}

function salvarCompras(compras) {
    salvarDados("compras", compras);
}


// ==========================================
// PROPOSTAS DE TROCA
// ==========================================

function obterPropostasTroca() {
    return obterDados("propostasTroca");
}

function salvarPropostasTroca(propostas) {
    salvarDados("propostasTroca", propostas);
}


// ==========================================
// CRIAÇÃO DE ANÚNCIOS
// ==========================================

function criarAnuncio(dados) {

    // Recupera o usuário conectado
    const sessao = JSON.parse(
        localStorage.getItem("usuarioLogado")
    );

    if (!sessao) {
        return {
            sucesso: false,
            mensagem: "Você precisa entrar na sua conta para publicar."
        };
    }

    // Verifica os campos obrigatórios
    const camposObrigatorios = [
        "titulo",
        "autor",
        "categoria",
        "descricao",
        "imagem",
        "modalidade",
        "condicao"
    ];

    const campoVazio = camposObrigatorios.some(campo => {
        return !dados[campo] ||
            String(dados[campo]).trim() === "";
    });

    if (campoVazio) {
        return {
            sucesso: false,
            mensagem: "Preencha todos os campos obrigatórios."
        };
    }

    // Verifica a modalidade
    const modalidadesValidas = ["venda", "troca", "doacao"];

    if (!modalidadesValidas.includes(dados.modalidade)) {
        return {
            sucesso: false,
            mensagem: "Modalidade de anúncio inválida."
        };
    }

    // Verifica o preço das vendas
    if (dados.modalidade === "venda") {
        if (!Number.isFinite(Number(dados.preco)) ||
            Number(dados.preco) <= 0) {
            return {
                sucesso: false,
                mensagem: "Informe um preço válido para a venda."
            };
        }
    }

    // Recupera os anúncios existentes
    const anuncios = obterAnunciosUsuarios();

    // Cria o novo anúncio
    const novoAnuncio = {
        id: crypto.randomUUID(),
        usuarioId: sessao.id,
        titulo: dados.titulo.trim(),
        autor: dados.autor.trim(),
        categoria: dados.categoria.trim(),
        descricao: dados.descricao.trim(),
        imagem: dados.imagem.trim(),
        modalidade: dados.modalidade,
        preco: dados.modalidade === "venda"
            ? Number(dados.preco)
            : null,
        condicao: dados.condicao,
        procura: dados.modalidade === "troca"
            ? (dados.procura || "").trim()
            : "",
        disponivel: true,
        dataCriacao: new Date().toISOString()
    };

    // Salva o anúncio
    anuncios.push(novoAnuncio);
    salvarAnunciosUsuarios(anuncios);

    return {
        sucesso: true,
        mensagem: "Anúncio publicado com sucesso!",
        anuncio: novoAnuncio
    };
}


// ==========================================
// GERENCIAMENTO DE ANÚNCIOS
// ==========================================

// Recupera os anúncios do usuário conectado
function obterMeusAnuncios() {

    const sessao = JSON.parse(
        localStorage.getItem("usuarioLogado")
    );

    if (!sessao) return [];

    return obterAnunciosUsuarios().filter(
        anuncio => anuncio.usuarioId === sessao.id
    );
}


// Altera a disponibilidade de um anúncio
function alterarDisponibilidadeAnuncio(id, disponivel) {

    const sessao = JSON.parse(
        localStorage.getItem("usuarioLogado")
    );

    if (!sessao) return false;

    const anuncios = obterAnunciosUsuarios();

    const anuncio = anuncios.find(
        item => item.id === id && item.usuarioId === sessao.id
    );

    if (!anuncio) return false;

    anuncio.disponivel = Boolean(disponivel);

    salvarAnunciosUsuarios(anuncios);

    return true;
}


// Exclui um anúncio do usuário conectado
function excluirAnuncio(id) {

    const sessao = JSON.parse(
        localStorage.getItem("usuarioLogado")
    );

    if (!sessao) return false;

    const anuncios = obterAnunciosUsuarios();

    const indice = anuncios.findIndex(
        item => item.id === id && item.usuarioId === sessao.id
    );

    if (indice === -1) return false;

    anuncios.splice(indice, 1);

    salvarAnunciosUsuarios(anuncios);

    return true;
}


// ==========================================
// REGISTRO DE COMPRAS
// ==========================================

// Registra uma nova compra
function registrarCompra(itens, total) {

    const sessao = JSON.parse(
        localStorage.getItem("usuarioLogado")
    );

    if (!sessao) {
        return {
            sucesso: false,
            mensagem: "Entre na sua conta para finalizar a compra."
        };
    }

    if (!Array.isArray(itens) || itens.length === 0) {
        return {
            sucesso: false,
            mensagem: "O carrinho está vazio."
        };
    }

    const valorTotal = Number(total);

    if (!Number.isFinite(valorTotal) || valorTotal <= 0) {
        return {
            sucesso: false,
            mensagem: "Valor da compra inválido."
        };
    }

    // Cria um registro independente dos dados do carrinho
    const novaCompra = {
        id: crypto.randomUUID(),
        usuarioId: sessao.id,
        itens: itens.map(item => ({
            id: item.id,
            titulo: item.titulo,
            autor: item.autor,
            imagem: item.imagem,
            preco: Number(item.preco),
            quantidade: Number(item.quantidade)
        })),
        total: valorTotal,
        dataCompra: new Date().toISOString(),
        status: "Concluída"
    };

    const compras = obterCompras();

    compras.push(novaCompra);

    salvarCompras(compras);

    return {
        sucesso: true,
        mensagem: "Compra registrada com sucesso!",
        compra: novaCompra
    };
}


// Recupera as compras do usuário conectado
function obterMinhasCompras() {

    const sessao = JSON.parse(
        localStorage.getItem("usuarioLogado")
    );

    if (!sessao) return [];

    return obterCompras().filter(
        compra => compra.usuarioId === sessao.id
    );
}


// ==========================================
// REGISTRO DE PROPOSTAS DE TROCA
// ==========================================

// Registra uma proposta de troca
function registrarPropostaTroca(dados) {

    const sessao = JSON.parse(
        localStorage.getItem("usuarioLogado")
    );

    if (!sessao) {
        return {
            sucesso: false,
            mensagem: "Entre na sua conta para enviar uma proposta."
        };
    }

    if (!dados.anuncioId || !dados.livroOferecido ||
        !dados.livroOferecido.trim()) {
        return {
            sucesso: false,
            mensagem: "Informe o livro que deseja oferecer."
        };
    }

    // Localiza o anúncio de troca
    const anuncio = obterAnunciosUsuarios().find(
        item => item.id === dados.anuncioId &&
            item.modalidade === "troca" &&
            item.disponivel
    );

    if (!anuncio) {
        return {
            sucesso: false,
            mensagem: "Esse anúncio não está disponível para troca."
        };
    }

    // Impede propostas para o próprio anúncio
    if (anuncio.usuarioId === sessao.id) {
        return {
            sucesso: false,
            mensagem: "Você não pode propor troca no seu próprio anúncio."
        };
    }

    const proposta = {
        id: crypto.randomUUID(),
        usuarioId: sessao.id,
        destinatarioId: anuncio.usuarioId,
        anuncioId: anuncio.id,
        tituloAnuncio: anuncio.titulo,
        livroOferecido: dados.livroOferecido.trim(),
        mensagem: (dados.mensagem || "").trim(),
        dataEnvio: new Date().toISOString(),
        status: "Pendente"
    };

    const propostas = obterPropostasTroca();

    propostas.push(proposta);

    salvarPropostasTroca(propostas);

    return {
        sucesso: true,
        mensagem: "Proposta enviada com sucesso!",
        proposta: proposta
    };
}


// Recupera propostas enviadas pelo usuário
function obterPropostasEnviadas() {

    const sessao = JSON.parse(
        localStorage.getItem("usuarioLogado")
    );

    if (!sessao) return [];

    return obterPropostasTroca().filter(
        proposta => proposta.usuarioId === sessao.id
    );
}


// Recupera propostas recebidas pelo usuário
function obterPropostasRecebidas() {

    const sessao = JSON.parse(
        localStorage.getItem("usuarioLogado")
    );

    if (!sessao) return [];

    return obterPropostasTroca().filter(
        proposta => proposta.destinatarioId === sessao.id
    );
}


// ==========================================
// RESPOSTA ÀS PROPOSTAS DE TROCA
// ==========================================

function responderPropostaTroca(id, decisao) {

    const sessao = JSON.parse(
        localStorage.getItem("usuarioLogado")
    );

    if (!sessao) {
        return {
            sucesso: false,
            mensagem: "Entre na sua conta para responder."
        };
    }

    if (!["Aceita", "Recusada"].includes(decisao)) {
        return {
            sucesso: false,
            mensagem: "Resposta inválida."
        };
    }

    const propostas = obterPropostasTroca();

    const proposta = propostas.find(
        item => item.id === id
    );

    if (!proposta) {
        return {
            sucesso: false,
            mensagem: "Proposta não encontrada."
        };
    }

    if (proposta.destinatarioId !== sessao.id) {
        return {
            sucesso: false,
            mensagem: "Você não pode responder a esta proposta."
        };
    }

    if (proposta.status !== "Pendente") {
        return {
            sucesso: false,
            mensagem: "Esta proposta já recebeu uma resposta."
        };
    }

    // Verifica se o anúncio ainda está disponível.
    const anuncios = obterAnunciosUsuarios();

    const anuncio = anuncios.find(
        item => item.id === proposta.anuncioId
    );

    if (!anuncio || !anuncio.disponivel) {
        return {
            sucesso: false,
            mensagem: "Este livro não está mais disponível."
        };
    }

    proposta.status = decisao;
    proposta.dataResposta = new Date().toISOString();

    // Se aceitar, o anúncio deixa de receber propostas.
    if (decisao === "Aceita") {

        anuncio.disponivel = false;

        // As outras propostas pendentes são recusadas.
        propostas.forEach(item => {

            if (
                item.id !== proposta.id &&
                item.anuncioId === proposta.anuncioId &&
                item.status === "Pendente"
            ) {
                item.status = "Recusada";
                item.dataResposta = new Date().toISOString();
                item.motivoResposta = "Outra proposta foi aceita.";
            }

        });

        salvarAnunciosUsuarios(anuncios);
    }

    salvarPropostasTroca(propostas);

    return {
        sucesso: true,
        mensagem: decisao === "Aceita"
            ? "Proposta aceita! Agora combinem a entrega."
            : "Proposta recusada.",
        proposta: proposta
    };
}

// ==========================================
// CONCLUSÃO DAS TROCAS
// ==========================================

function concluirPropostaTroca(id) {

    const sessao = JSON.parse(
        localStorage.getItem("usuarioLogado")
    );

    if (!sessao) {
        return {
            sucesso: false,
            mensagem: "Entre na sua conta para continuar."
        };
    }

    const propostas = obterPropostasTroca();

    const proposta = propostas.find(
        item => item.id === id
    );

    if (!proposta) {
        return {
            sucesso: false,
            mensagem: "Proposta não encontrada."
        };
    }

    // Somente os participantes podem concluir.
    if (
        proposta.usuarioId !== sessao.id &&
        proposta.destinatarioId !== sessao.id
    ) {
        return {
            sucesso: false,
            mensagem: "Você não participa desta troca."
        };
    }

    if (proposta.status !== "Aceita") {
        return {
            sucesso: false,
            mensagem: "Somente propostas aceitas podem ser concluídas."
        };
    }

    proposta.status = "Concluída";
    proposta.dataConclusao = new Date().toISOString();

    salvarPropostasTroca(propostas);

    return {
        sucesso: true,
        mensagem: "Troca registrada como concluída!",
        proposta: proposta
    };
}


// ==========================================
// SOLICITAÇÕES DE DOAÇÃO
// ==========================================

// Recupera as solicitações de doação
function obterSolicitacoesDoacao() {
    return obterDados("solicitacoesDoacao");
}


// Salva as solicitações de doação
function salvarSolicitacoesDoacao(solicitacoes) {
    salvarDados("solicitacoesDoacao", solicitacoes);
}


// ==========================================
// REGISTRO DE SOLICITAÇÕES
// ==========================================

function registrarSolicitacaoDoacao(dados) {

    const sessao = JSON.parse(
        localStorage.getItem("usuarioLogado")
    );

    if (!sessao) {
        return {
            sucesso: false,
            mensagem: "Entre na sua conta para solicitar uma doação."
        };
    }

    if (!dados.anuncioId) {
        return {
            sucesso: false,
            mensagem: "Anúncio não identificado."
        };
    }

    // Localiza o anúncio de doação
    const anuncio = obterAnunciosUsuarios().find(
        item =>
            item.id === dados.anuncioId &&
            item.modalidade === "doacao" &&
            item.disponivel
    );

    if (!anuncio) {
        return {
            sucesso: false,
            mensagem: "Este livro não está mais disponível para doação."
        };
    }

    // Impede solicitações para o próprio anúncio
    if (anuncio.usuarioId === sessao.id) {
        return {
            sucesso: false,
            mensagem: "Você não pode solicitar seu próprio anúncio."
        };
    }

    const solicitacoes = obterSolicitacoesDoacao();

    // Impede solicitações duplicadas enquanto a anterior estiver pendente
    const solicitacaoExistente = solicitacoes.find(
        item =>
            item.anuncioId === anuncio.id &&
            item.solicitanteId === sessao.id &&
            item.status === "Pendente"
    );

    if (solicitacaoExistente) {
        return {
            sucesso: false,
            mensagem: "Você já possui uma solicitação pendente para este livro."
        };
    }

    const solicitacao = {
        id: crypto.randomUUID(),
        solicitanteId: sessao.id,
        destinatarioId: anuncio.usuarioId,
        anuncioId: anuncio.id,
        tituloAnuncio: anuncio.titulo,
        mensagem: (dados.mensagem || "").trim(),
        dataEnvio: new Date().toISOString(),
        status: "Pendente"
    };

    solicitacoes.push(solicitacao);

    salvarSolicitacoesDoacao(solicitacoes);

    return {
        sucesso: true,
        mensagem: "Solicitação enviada com sucesso!",
        solicitacao: solicitacao
    };
}


// ==========================================
// CONSULTA DAS SOLICITAÇÕES
// ==========================================

// Recupera solicitações enviadas pelo usuário
function obterSolicitacoesEnviadas() {

    const sessao = JSON.parse(
        localStorage.getItem("usuarioLogado")
    );

    if (!sessao) return [];

    return obterSolicitacoesDoacao().filter(
        item => item.solicitanteId === sessao.id
    );
}


// Recupera solicitações recebidas pelo usuário
function obterSolicitacoesRecebidas() {

    const sessao = JSON.parse(
        localStorage.getItem("usuarioLogado")
    );

    if (!sessao) return [];

    return obterSolicitacoesDoacao().filter(
        item => item.destinatarioId === sessao.id
    );
}


// ==========================================
// RESPOSTA ÀS SOLICITAÇÕES
// ==========================================

function responderSolicitacaoDoacao(id, decisao) {

    const sessao = JSON.parse(
        localStorage.getItem("usuarioLogado")
    );

    if (!sessao) {
        return {
            sucesso: false,
            mensagem: "Entre na sua conta para responder."
        };
    }

    if (!["Aceita", "Recusada"].includes(decisao)) {
        return {
            sucesso: false,
            mensagem: "Resposta inválida."
        };
    }

    const solicitacoes = obterSolicitacoesDoacao();

    const solicitacao = solicitacoes.find(
        item => item.id === id
    );

    if (!solicitacao) {
        return {
            sucesso: false,
            mensagem: "Solicitação não encontrada."
        };
    }

    if (solicitacao.destinatarioId !== sessao.id) {
        return {
            sucesso: false,
            mensagem: "Você não pode responder a esta solicitação."
        };
    }

    if (solicitacao.status !== "Pendente") {
        return {
            sucesso: false,
            mensagem: "Esta solicitação já recebeu uma resposta."
        };
    }

    const anuncios = obterAnunciosUsuarios();

    const anuncio = anuncios.find(
        item => item.id === solicitacao.anuncioId
    );

    if (!anuncio || !anuncio.disponivel) {
        return {
            sucesso: false,
            mensagem: "Este livro não está mais disponível."
        };
    }

    solicitacao.status = decisao;
    solicitacao.dataResposta = new Date().toISOString();

    // Se aceitar, o anúncio deixa de receber solicitações
    if (decisao === "Aceita") {

        anuncio.disponivel = false;

        // Recusa automaticamente as outras solicitações pendentes
        solicitacoes.forEach(item => {

            if (
                item.id !== solicitacao.id &&
                item.anuncioId === solicitacao.anuncioId &&
                item.status === "Pendente"
            ) {
                item.status = "Recusada";
                item.dataResposta = new Date().toISOString();
                item.motivoResposta = "Outra solicitação foi aceita.";
            }

        });

        salvarAnunciosUsuarios(anuncios);
    }

    salvarSolicitacoesDoacao(solicitacoes);

    return {
        sucesso: true,
        mensagem: decisao === "Aceita"
            ? "Solicitação aceita! Agora combinem a entrega."
            : "Solicitação recusada.",
        solicitacao: solicitacao
    };
}

// ==========================================
// CONCLUSÃO DAS DOAÇÕES
// ==========================================

function concluirSolicitacaoDoacao(id) {

    const sessao = JSON.parse(
        localStorage.getItem("usuarioLogado")
    );

    if (!sessao) {
        return {
            sucesso: false,
            mensagem: "Entre na sua conta para continuar."
        };
    }

    const solicitacoes = obterSolicitacoesDoacao();

    const solicitacao = solicitacoes.find(
        item => item.id === id
    );

    if (!solicitacao) {
        return {
            sucesso: false,
            mensagem: "Solicitação não encontrada."
        };
    }

    // Somente os participantes podem concluir
    if (
        solicitacao.solicitanteId !== sessao.id &&
        solicitacao.destinatarioId !== sessao.id
    ) {
        return {
            sucesso: false,
            mensagem: "Você não participa desta doação."
        };
    }

    if (solicitacao.status !== "Aceita") {
        return {
            sucesso: false,
            mensagem: "Somente solicitações aceitas podem ser concluídas."
        };
    }

    solicitacao.status = "Concluída";
    solicitacao.dataConclusao = new Date().toISOString();

    salvarSolicitacoesDoacao(solicitacoes);

    return {
        sucesso: true,
        mensagem: "Doação registrada como concluída!",
        solicitacao: solicitacao
    };
}
