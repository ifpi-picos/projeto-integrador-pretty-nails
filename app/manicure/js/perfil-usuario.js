document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
        console.warn("Redirecionando para login pois userId não foi encontrado.");
        window.location.href = 'login.html';
        return;
    }

    // Recuperar dados do usuário do localStorage
    const nome = localStorage.getItem('userName') || 'Usuário';
    const email = localStorage.getItem('userEmail') || 'email@example.com';
    const telefone = localStorage.getItem('userTelefone') || '(00) 00000-0000';
    const estado = localStorage.getItem('userEstado') || 'Estado';
    const cidade = localStorage.getItem('userCidade') || 'Cidade';

    // Exibir os dados na tela de perfil
    document.getElementById('nome').textContent = nome;
    document.getElementById('email').textContent = email;
    document.getElementById('telefone').textContent = telefone;
    document.getElementById('endereco').textContent = `${cidade}, ${estado}`;

    try {
        const response = await fetch(`https://back-end-jf0v.onrender.com/usuario/${userId}`);
        const usuario = await response.json();

        if (usuario) {
            document.getElementById('nome').textContent = usuario.nome;
            document.getElementById('email').textContent = usuario.email;
            document.getElementById('telefone').textContent = usuario.telefone;
            document.getElementById('endereco').textContent = `${usuario.cidade}, ${usuario.estado}`;
            document.getElementById('profile-img').src = usuario.foto || 'imagens/avatar.jpg';
        }
    } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
    }
});
