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

