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

// mostrar telas na div "telas"
function loadPage(url) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            document.getElementById('telas').innerHTML = html;
        })
        .catch(error => {
            console.error('Error loading page:', error);
        });
}

document.addEventListener('DOMContentLoaded', function () {
    loadPage('html/principal.html');
});


document.querySelectorAll('#sidebar button').forEach(button => {
    button.addEventListener('click', function () {
        const url = this.getAttribute('data-url');
        loadPage(url);
    });
});

document.getElementById('logout_btn').addEventListener('click', function () {
    localStorage.clear();
    window.location.href = '../landingPage/html/login.html';
});