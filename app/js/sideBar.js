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

document.addEventListener("DOMContentLoaded", function () {
        const telas = document.getElementById("telas");
        const links = document.querySelectorAll(".side-item a");

        // Função para carregar a página dentro da div
        function carregarPagina(url) {
            fetch(url)
                .then(response => response.text())
                .then(data => {
                    telas.innerHTML = data;
                })
                .catch(error => console.error("Erro ao carregar a página:", error));
        }

        // Adiciona evento de clique em cada link da sidebar
        links.forEach(link => {
            link.addEventListener("click", function (event) {
                event.preventDefault(); // Evita que a página recarregue
                const pagina = this.getAttribute("href"); // Obtém a URL do link
                carregarPagina(pagina);
            });
        });

        // Carrega a página inicial ao abrir o site
        carregarPagina("principal.html");
    });