document.addEventListener('DOMContentLoaded', function() {
    const userId = localStorage.getItem('userId'); // Supondo que o ID do usuário esteja salvo no localStorage

    fetch(`https://back-end-u9vj.onrender.com/users/${userId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('profile-picture').src = data.foto || 'imagens/perfil_cliente.png';
            document.getElementById('user-name').textContent = data.name;
            document.getElementById('user-email').textContent = data.email;
            document.getElementById('user-telefone').textContent = data.telefone;
            document.getElementById('user-endereco').textContent = `${data.estado}, ${data.cidade}`;
        })
        .catch(error => {
            console.error('Erro ao buscar dados do usuário:', error);
        });
});