document.getElementById('open_btn').addEventListener('click', function () {
    document.getElementById('sidebar').classList.toggle('open-sidebar');
});

function openPage(url) {
    window.location.href = url;
}

document.addEventListener('click', function (event) {
    const sidebar = document.getElementById('sidebar');
    const openBtn = document.getElementById('open_btn');
    if (!sidebar.contains(event.target) && !openBtn.contains(event.target)) {
        sidebar.classList.remove('open-sidebar');
    }
});

// Função para mudar a cor quando outro botão for clicado. Tbm é uma função para quando a página for recarregada vc continuar na mesma página e não voltar para o menu
document.addEventListener("DOMContentLoaded", () => {
    const sideItems = document.querySelectorAll(".side-item");

    sideItems.forEach(item => {
        item.addEventListener("click", function () {
            // Remove 'active' de todos os itens
            sideItems.forEach(i => i.classList.remove("active"));

            // Adiciona 'active' ao item clicado
            this.classList.add("active");
        });
    });
});

// Função para carregar a página dentro da div
document.addEventListener("DOMContentLoaded", function () {
    const telas = document.getElementById("telas");
    const links = document.querySelectorAll(".side-item a");

    function carregarPagina(url) {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                telas.innerHTML = data;
            })
            .catch(error => console.error("Erro ao carregar a página:", error));
    }

    links.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const pagina = this.getAttribute("href");
            carregarPagina(pagina);
        });
    });

    // Carrega a página inicial ao abrir o site
    carregarPagina("principal.html");
});