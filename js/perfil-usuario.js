document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('userId');
    console.log("Recuperando userId:", userId); // Para depuração

    if (!userId) {
        console.warn("Redirecionando para login pois userId não foi encontrado.");
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/usuario/${userId}`);
        const usuario = await response.json();

        if (usuario) {
            document.getElementById('nomeUsuario').textContent = usuario.nome;
            document.getElementById('emailUsuario').textContent = usuario.email;
            document.getElementById('fotoUsuario').src = usuario.foto || 'imagens/avatar.jpg';
        }
    } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
    }
});
