
function atualizarContadorNavbar() {
    const contador = document.getElementById("contador-carrinho");

    if (!contador) return;

    let carrinho = [];

    try {
        carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    } catch (erro) {
        carrinho = [];
    }

    const quantidadeTotal = carrinho.reduce((total, item) => {
        return total + Number(item.quantidade || 1);
    }, 0);

    contador.textContent = quantidadeTotal;
}


// ==========================================
// ATUALIZA A ÁREA DO USUÁRIO
// ==========================================

function atualizarNavbarUsuario() {
    const areaUsuario = document.querySelector(".acoes-usuario");

    if (!areaUsuario) return;

    let usuarioLogado = null;

    try {
        usuarioLogado = JSON.parse(
            localStorage.getItem("usuarioLogado")
        );
    } catch (erro) {
        usuarioLogado = null;
    }

    const botaoLogin = areaUsuario.querySelector('a[href="login.html"]');
    const botaoCadastro = areaUsuario.querySelector('a[href="cadastro.html"]');

    // Procura um avatar já existente.
    let avatar = areaUsuario.querySelector(".avatar-usuario");

    // Se não houver usuário conectado.
    if (!usuarioLogado) {
        if (botaoLogin) botaoLogin.hidden = false;
        if (botaoCadastro) botaoCadastro.hidden = false;

        if (avatar) avatar.remove();

        return;
    }

    // Esconde somente os botões de login e cadastro.
    if (botaoLogin) botaoLogin.hidden = true;
    if (botaoCadastro) botaoCadastro.hidden = true;

    // Gera as iniciais do nome.
    const nome = String(usuarioLogado.nome || "Usuário").trim();
    const partesNome = nome.split(/\s+/);

    let iniciais = partesNome[0][0] || "U";

    if (partesNome.length > 1) {
        iniciais += partesNome[partesNome.length - 1][0];
    }

    iniciais = iniciais.toUpperCase();

    // Cria o avatar somente se ainda não existir.
    if (!avatar) {
        avatar = document.createElement("a");
        avatar.href = "minha-conta.html";
        avatar.classList.add("avatar-usuario");

        areaUsuario.appendChild(avatar);
    }

    avatar.textContent = iniciais;
    avatar.title = `Minha conta - ${nome}`;
    avatar.setAttribute("aria-label", "Acessar minha conta");
}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

atualizarContadorNavbar();
atualizarNavbarUsuario();
