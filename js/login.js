
// ===== SISTEMA DE LOGIN =====

const formularioLogin = document.getElementById("formulario-login");
const mensagemLogin = document.getElementById("mensagem-login");

// Recupera os usuários cadastrados
function obterUsuariosLogin() {
    return JSON.parse(localStorage.getItem("usuarios")) || [];
}

// Converte um buffer em hexadecimal
function converterHexLogin(buffer) {
    return Array.from(new Uint8Array(buffer))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}

// Gera o hash da senha informada
async function gerarHashLogin(senha, sal) {

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

    return converterHexLogin(resultado);
}

// Exibe mensagens
function mostrarMensagemLogin(texto, tipo) {

    mensagemLogin.textContent = texto;

    if (tipo === "sucesso") {
        mensagemLogin.style.color = "#37633D";
    } else {
        mensagemLogin.style.color = "#B3261E";
    }

}

// ===== ENVIO DO FORMULÁRIO =====

if (formularioLogin) {

    formularioLogin.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = document
            .getElementById("email-login")
            .value.trim()
            .toLowerCase();

        const senha = document
            .getElementById("senha-login")
            .value;

        mensagemLogin.textContent = "";

        // Busca o usuário pelo e-mail
        const usuarios = obterUsuariosLogin();

        const usuario = usuarios.find(function (item) {
            return item.email === email;
        });

        if (!usuario) {
            mostrarMensagemLogin(
                "E-mail ou senha incorretos.",
                "erro"
            );
            return;
        }

        try {

            // Confere a senha
            const hashInformado = await gerarHashLogin(
                senha,
                usuario.sal
            );

            if (hashInformado !== usuario.senhaHash) {

                mostrarMensagemLogin(
                    "E-mail ou senha incorretos.",
                    "erro"
                );

                return;
            }

            // Cria a sessão do usuário
            const sessao = {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            };

            localStorage.setItem(
                "usuarioLogado",
                JSON.stringify(sessao)
            );

            mostrarMensagemLogin(
                "Login realizado com sucesso! Redirecionando...",
                "sucesso"
            );

            formularioLogin.reset();

            // Aguarda antes de redirecionar
            setTimeout(function () {
                window.location.href = "index.html";
            }, 1200);

        } catch (erro) {

            mostrarMensagemLogin(
                "Não foi possível realizar o login. Tente novamente.",
                "erro"
            );

            console.error("Erro no login:", erro);

        }

    });

}
