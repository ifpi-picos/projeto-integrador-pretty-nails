document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
        console.warn("Usuário não autenticado. Redirecionando para login.");
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`https://back-end-u9vj.onrender.com/users/${userId}`);

        if (!response.ok) {
            throw new Error("Erro ao buscar usuário: " + response.statusText);
        }

        const usuario = await response.json();

        if (!usuario || !usuario.id) {
            console.warn("Usuário não encontrado, redirecionando para login.");
            window.location.href = 'login.html';
            return;
        }

        document.getElementById('nome').textContent = nome; // Correção do nome do campo
        document.getElementById('email').textContent = email;
        document.getElementById('foto').src = foto || 'imagens/avatar.jpg'; // Avatar padrão
        document.getElementById('telefone').textContent = telefone;

    } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        alert("Erro ao carregar perfil. Tente novamente mais tarde.");
    }
});