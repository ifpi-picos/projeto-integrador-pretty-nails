// Função para alternar entre temas claro e escuro
function changeTheme() {
    const themeSelector = document.getElementById('theme');
    if (themeSelector.value === 'dark') {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
}

// Função para abrir configurações de privacidade
function openPrivacySettings() {
    alert("Abrindo configurações de Privacidade...");
    // Aqui você pode redirecionar para uma página de configurações de privacidade
    window.location.href = "privacidade.html";
}

// Função para abrir configurações de segurança
function openSecuritySettings() {
    alert("Abrindo configurações de Segurança...");
    // Aqui você pode redirecionar para uma página de configurações de segurança
    window.location.href = "seguranca.html";
}

// Função para abrir configurações de conta
function openAccountSettings() {
    alert("Aqui você pode configurar sua conta!");
    // Aqui você pode redirecionar para uma página de configurações de conta
    window.location.href = "conta.html";
}

// Função para abrir os Termos e Condições
function openTerms() {
    alert("Abrindo os Termos e Condições...");
    // Aqui você pode redirecionar para a página dos Termos e Condições
    window.location.href = "termos.html";
}

// Função para abrir a Política de Privacidade
function openPrivacyPolicy() {
    alert("Abrindo a Política de Privacidade...");
    // Aqui você pode redirecionar para a página da Política de Privacidade
    window.location.href = "politica_privacidade.html";
}
