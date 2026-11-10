
// ===== SISTEMA DE CADASTRO =====

const formularioCadastro = document.getElementById("formulario-cadastro");
const mensagemCadastro = document.getElementById("mensagem-cadastro");

// Recupera os usuários já cadastrados
function obterUsuarios() {
    return JSON.parse(localStorage.getItem("usuarios")) || [];
}

// Transforma um texto em hexadecimal
function converterParaHexadecimal(buffer) {
    return Array.from(new Uint8Array(buffer))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}

// Gera um hash da senha usando PBKDF2
async function gerarHashSenha(senha, sal) {
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

    return converterParaHexadecimal(resultado);
}

// ===== ENVIO DO FORMULÁRIO =====

if (formularioCadastro) {

    formularioCadastro.addEventListener("submit", async function(event) {

        event.preventDefault();

        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const senha = document.getElementById("senha").value;
        const confirmarSenha = document.getElementById("confirmar-senha").value;

        mensagemCadastro.textContent = "";
        mensagemCadastro.style.color = "";

        // Verifica os campos
        if (!nome || !email || !senha || !confirmarSenha) {
            mostrarMensagem("Preencha todos os campos.", "erro");
            return;
        }

        if (nome.length < 3) {
            mostrarMensagem("Digite um nome com pelo menos 3 caracteres.", "erro");
            return;
        }

        if (senha.length < 6) {
            mostrarMensagem("A senha precisa ter pelo menos 6 caracteres.", "erro");
            return;
        }

        if (senha !== confirmarSenha) {
            mostrarMensagem("As senhas não são iguais.", "erro");
            return;
        }

        // Verifica se o e-mail já está cadastrado
        const usuarios = obterUsuarios();

        const emailExiste = usuarios.some(function(usuario) {
            return usuario.email === email;
        });

        if (emailExiste) {
            mostrarMensagem("Este e-mail já possui uma conta.", "erro");
            return;
        }

        // Cria um identificador e um sal aleatórios
        const id = crypto.randomUUID();

        const sal = converterParaHexadecimal(
            crypto.getRandomValues(new Uint8Array(16))
        );

        try {

            const senhaHash = await gerarHashSenha(senha, sal);

            // Cria o novo usuário
            const novoUsuario = {
                id: id,
                nome: nome,
                email: email,
                senhaHash: senhaHash,
                sal: sal,
                dataCadastro: new Date().toISOString()
            };

            // Salva o usuário
            usuarios.push(novoUsuario);

            localStorage.setItem("usuarios", JSON.stringify(usuarios));

            mostrarMensagem(
                "Conta criada com sucesso! Você já pode fazer login.",
                "sucesso"
            );

            formularioCadastro.reset();

        } catch (erro) {

            mostrarMensagem(
                "Não foi possível criar sua conta. Tente novamente.",
                "erro"
            );

            console.error("Erro no cadastro:", erro);

        }

    });

}

// ===== MENSAGENS =====

function mostrarMensagem(texto, tipo) {

    mensagemCadastro.textContent = texto;

    if (tipo === "sucesso") {
        mensagemCadastro.style.color = "#37633D";
    } else {
        mensagemCadastro.style.color = "#B3261E";
    }

}
