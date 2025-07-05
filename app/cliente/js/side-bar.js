const sidebar = document.getElementById('sidebar');
const openBtn = document.getElementById('open_btn');
const openIcon = document.getElementById('open_btn_icon');

// Exibir nome do usuário e avatar na sidebar
document.addEventListener('DOMContentLoaded', async function () {
    const mensagemDiv = document.getElementById('mensagem-usuario');
    const nomeUsuarioDiv = document.getElementById('user-name');
    const avatarUsuario = document.getElementById('user_avatar');
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    // Função para exibir mensagem apenas no console e na tela
    function exibirMensagemNoConsole(mensagem) {
        if (mensagemDiv) {
            mensagemDiv.textContent = mensagem;
            mensagemDiv.style.color = 'red';
        }
        console.error(mensagem);
    }

    // Verificação completa de autenticação
    if (!token || !userId) {
        exibirMensagemNoConsole('Acesso restrito. Faça login para continuar.');
        window.location.href = '../../cadastro-e-login/cadastro-e-login.html';
        return;
    }

    try {
        const resposta = await fetch(`${API_BASE_URL}/auth/usuario/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!resposta.ok) {
            if (resposta.status === 401 || resposta.status === 403) {
                exibirMensagemNoConsole('Permissão negada.');
                window.location.href = '../../cadastro-e-login/cadastro-e-login.html';
            } else {
                exibirMensagemNoConsole('Erro ao validar usuário');
            }
            return;
        }

        const usuario = await resposta.json();

        // Exibir nome
        const primeiroNome = usuario.nome ? usuario.nome.split(' ')[0] : 'Usuário';
        if (nomeUsuarioDiv) nomeUsuarioDiv.textContent = primeiroNome;

        // Exibir avatar
        if (avatarUsuario && usuario.foto) {
            avatarUsuario.src = usuario.foto;
        }

    } catch (err) {
        console.error('Erro na validação:', err);
        exibirMensagemNoConsole('Erro de conexão');
    }
});

// Alterna a classe de ícone ao abrir/fechar a sidebar
openBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open-sidebar');
    document.body.classList.toggle('sidebar-aberta');
});


// Fecha a sidebar ao clicar fora
document.addEventListener('click', function (event) {
    if (!sidebar.contains(event.target) && !openBtn.contains(event.target)) {
        sidebar.classList.remove('open-sidebar');
        document.body.classList.remove('sidebar-aberta');
    }
});

// Logout
document.getElementById('logout_btn').addEventListener('click', function () {
    localStorage.clear();
    window.location.href = '../../cadastro-e-login/cadastro-e-login.html';
});
