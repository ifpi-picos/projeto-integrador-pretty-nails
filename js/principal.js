document.getElementById('open_btn').addEventListener('click', function () {
    document.getElementById('sidebar').classList.toggle('open-sidebar');
});

function openPage(url) {
    window.location.href = url;
}

//rolagem perfil bem avaliados 

const container = document.getElementById("perfis-container");

let isDown = false;
let startX;
let scrollLeft;

container.addEventListener("mousedown", (e) => {
    isDown = true;
    container.classList.add("active"); // Adiciona um efeito ao clicar
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
});

container.addEventListener("mouseleave", () => {
    isDown = false;
    container.classList.remove("active");
});

container.addEventListener("mouseup", () => {
    isDown = false;
    container.classList.remove("active");
});

container.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2; // Velocidade do arrasto
    container.scrollLeft = scrollLeft - walk;
});
