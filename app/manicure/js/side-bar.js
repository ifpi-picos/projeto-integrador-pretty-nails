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

// Alterna apenas a classe da sidebar, sem afetar o body
openBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open-sidebar');
});
    // Balão flutuante de descrição (desktop)
    document.querySelectorAll('.side-item').forEach(item => {
        item.addEventListener('mouseenter', function(e) {
            if (!sidebar.classList.contains('open-sidebar') && window.innerWidth > 1024) {
                let balloon = document.createElement('div');
                balloon.className = 'sidebar-balloon';
                balloon.textContent = item.querySelector('.item-description')?.textContent || '';
                document.body.appendChild(balloon);
                const rect = item.getBoundingClientRect();
                balloon.style.position = 'fixed';
                balloon.style.left = (rect.right + 12) + 'px';
                balloon.style.top = (rect.top + rect.height/2 - 18) + 'px';
                balloon.style.zIndex = 10001;
                balloon.style.pointerEvents = 'none';
                balloon.style.padding = '8px 16px';
                balloon.style.background = '#fff';
                balloon.style.borderRadius = '8px';
                balloon.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)';
                balloon.style.color = '#333';
                balloon.style.fontSize = '14px';
                balloon.style.whiteSpace = 'nowrap';
                balloon.style.fontFamily = 'inherit';
                balloon.classList.add('sidebar-balloon-active');
            }
        });
        item.addEventListener('mouseleave', function(e) {
            document.querySelectorAll('.sidebar-balloon-active').forEach(b => b.remove());
        });
    });


// Fecha a sidebar ao clicar fora (apenas remove a classe da sidebar)
document.addEventListener('click', function (event) {
    if (!sidebar.contains(event.target) && !openBtn.contains(event.target)) {
        sidebar.classList.remove('open-sidebar');
    }
});

// Logout
document.getElementById('logout_btn').addEventListener('click', function () {
    localStorage.clear();
    window.location.href = '../../cadastro-e-login/cadastro-e-login.html';
});

// Adicione esta função para lidar com a responsividade
function handleResponsiveSidebar() {
    const sidebar = document.getElementById('sidebar');
    const isMobile = window.innerWidth <= 600;
    
    if (isMobile) {
        sidebar.classList.remove('open-sidebar');
    }
}

// Chame a função quando a página carregar e quando a janela for redimensionada
document.addEventListener('DOMContentLoaded', function() {
    handleResponsiveSidebar();
    
    // Seu código existente de validação de usuário...
});

window.addEventListener('resize', handleResponsiveSidebar);

// Função logout para ser chamada pelo HTML
function logout() {
    localStorage.clear();
    window.location.href = '../../cadastro-e-login/cadastro-e-login.html';
}
