document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
        console.warn("Redirecionando para login pois userId não foi encontrado.");
        window.location.href = '../cadastro-e-login/login.html';
        return;
    }

    // Recuperar dados do usuário do localStorage
    const nome = localStorage.getItem('userName') || 'Usuário';
    const email = localStorage.getItem('userEmail') || 'email@example.com';
    const telefone = localStorage.getItem('userTelefone') || '(00) 00000-0000';
    const estado = localStorage.getItem('userEstado') || 'Estado';
    const cidade = localStorage.getItem('userCidade') || 'Cidade';
    const fotoUrl = localStorage.getItem('userFoto') || 'imagens/user.png';

    // Exibir os dados da variável localStorage na tela de perfil
    document.getElementById('nome').textContent = nome;
    document.getElementById('email').textContent = email;
    document.getElementById('telefone').textContent = telefone;
    document.getElementById('endereco').textContent = `${cidade}, ${estado}`;
    document.getElementById('profile-img').src = fotoUrl; 

    try {
        const response = await fetch(`https://back-end-jf0v.onrender.com/auth/usuario/${userId}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar dados do usuário.');
        }

        const usuario = await response.json();

        if (usuario) {
            // Substitui as informações da tela apenas se o back-end retornar dados válidos
            document.getElementById('nome').textContent = usuario.nome || nome;
            document.getElementById('email').textContent = usuario.email || email;
            document.getElementById('telefone').textContent = usuario.telefone || telefone;
            document.getElementById('endereco').textContent = `${usuario.cidade || cidade}, ${usuario.estado || estado}`;
            document.getElementById('profile-img').src = usuario.foto || 'imagens/user.png';
        }
    } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
    }
});

