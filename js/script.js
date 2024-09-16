// Seletores dos elementos
const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const loginButton = document.querySelector(".sign-in-form .btn"); // Seleciona o botão de login

// Adicione a classe para iniciar com a tela de cadastro visível
container.classList.add("sign-up-mode");

// Adiciona o evento de clique para o botão de cadastro
sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

// Adiciona o evento de clique para o botão de login
sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

// Adiciona um evento de clique para o botão de login que redireciona para outra página
loginButton.addEventListener("click", (e) => {
  e.preventDefault(); // Evita o comportamento padrão do formulário de submit
  window.location.href = "principal.html"; // Substitua pelo caminho da próxima tela
});

//tela principal

// Seleciona o botão de menu pelo seu ID
const menuBtn = document.getElementById('menuBtn');
// Seleciona o menu dropdown pelo seu ID
const menuDropdown = document.getElementById('menuDropdown');

// Seleciona o botão de pesquisa e o campo de pesquisa
const searchBtn = document.getElementById('searchIcon');
const searchInput = document.getElementById('searchInput');

// Adiciona um evento de clique ao botão de menu para mostrar/ocultar o menu
menuBtn.addEventListener('click', () => {
    menuDropdown.classList.toggle('show');
});

// Adiciona um evento de clique ao botão de pesquisa para mostrar/ocultar o campo de pesquisa
searchBtn.addEventListener('click', () => {
    searchInput.classList.toggle('show');
});

