// Configurações - Manicure
document.addEventListener("DOMContentLoaded", function() {
    // Carregar nome do usuário
    const userName = localStorage.getItem("userName") || "Manicure";
    const userNameElement = document.getElementById("user-name");
    if (userNameElement) {
        userNameElement.textContent = userName.split(" ")[0]; // Primeiro nome apenas
    }

    // Adicionar event listeners para os itens de configuração
    const configItems = document.querySelectorAll('.config-item');
    configItems.forEach(item => {
        item.addEventListener('click', function() {
            // Adicionar efeito visual de click
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-1px)';
            }, 100);

            // Aqui você pode adicionar a lógica específica para cada configuração
            console.log('Configuração clicada:', this.querySelector('.config-item-left').textContent);
        });
    });
});

// Função de logout (compartilhada com outras telas)
function logout() {
    if (confirm("Tem certeza que deseja sair?")) {
        localStorage.clear();
        window.location.href = "../../cadastro-e-login/cadastro-e-login.html";
    }
}
