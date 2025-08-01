// Alternar entre login e cadastro
const container = document.getElementById('container');
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const mobileSignUp = document.getElementById('mobileSignUp');
const mobileSignIn = document.getElementById('mobileSignIn');

// Eventos para desktop
signUpButton.addEventListener('click', () => {
  container.classList.add('right-panel-active');
});

signInButton.addEventListener('click', () => {
  container.classList.remove('right-panel-active');
});

// Eventos para mobile
mobileSignUp.addEventListener('click', () => {
  container.classList.add('right-panel-active');
});

mobileSignIn.addEventListener('click', () => {
  container.classList.remove('right-panel-active');
});

// API de Localização - IBGE para Estados e Cidades
document.addEventListener("DOMContentLoaded", function () {
    carregarEstados();
});

async function carregarEstados() {
    try {
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
        const estados = await response.json();
        
        const estadoSelect = document.getElementById("estado");
        estadoSelect.innerHTML = '<option value="" disabled selected>Estado</option>';
        
        estados.sort((a, b) => a.nome.localeCompare(b.nome)).forEach(estado => {
            const option = document.createElement("option");
            option.value = estado.sigla;
            option.textContent = estado.nome;
            estadoSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao carregar estados:", error);
        alert("Não foi possível carregar os estados. Por favor, tente novamente mais tarde.");
    }
}

async function carregarCidades() {
    const estadoSelecionado = document.getElementById("estado").value;
    const cidadeSelect = document.getElementById("cidade");

    cidadeSelect.innerHTML = "<option value='' disabled selected>Carregando cidades...</option>";
    cidadeSelect.disabled = true;

    if (!estadoSelecionado) return;

    try {
        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionado}/municipios`);
        const cidades = await response.json();
        
        cidadeSelect.innerHTML = '<option value="" disabled selected>Cidade</option>';
        
        cidades.sort((a, b) => a.nome.localeCompare(b.nome)).forEach(cidade => {
            const option = document.createElement("option");
            option.value = cidade.nome;
            option.textContent = cidade.nome;
            cidadeSelect.appendChild(option);
        });
        
        cidadeSelect.disabled = false;
    } catch (error) {
        console.error("Erro ao carregar cidades:", error);
        cidadeSelect.innerHTML = '<option value="" disabled selected>Erro ao carregar cidades</option>';
    }
}
