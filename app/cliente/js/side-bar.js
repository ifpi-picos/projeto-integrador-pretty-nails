const sidebar = document.getElementById('sidebar');
const openBtn = document.getElementById('open_btn');
const openIcon = document.getElementById('open_btn_icon');

openBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open-sidebar');
    document.body.classList.toggle('sidebar-aberta');
});

// Fecha a sidebar ao clicar fora
document.addEventListener('click', function (event) {
    if (!sidebar.contains(event.target) && !openBtn.contains(event.target)) {
        sidebar.classList.remove('open-sidebar');
        document.body.classList.remove('sidebar-aberta');
    }
});

// Logout
document.getElementById('logout_btn').addEventListener('click', function () {
    localStorage.clear();
    window.location.href = '../../cadastro-e-login/cadastro-e-login.html';
});
