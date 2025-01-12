import { usuario } from './users.js';

async function comparandoLogin() {
    const campoEmail = document.querySelector("#email");
    const campoSenha = document.querySelector("#senha");
  
    // Pegando os dados inseridos pelo usuário
    const emailInserido = campoEmail.value;
    const senhaInserida = campoSenha.value;
  
    // Comparando com os dados do "banco de dados"
    if (emailInserido === usuario.email && senhaInserida === usuario.password) {
      window.location.href = 'menu_principal.html';
    } else {
      alert('Email ou senha incorretos');
    }
}
  
document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault();
    comparandoLogin();
});

  