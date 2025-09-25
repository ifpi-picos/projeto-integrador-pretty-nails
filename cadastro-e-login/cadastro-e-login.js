// Alternar entre login e cadastro
const container = document.getElementById('container');
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const mobileSignUp = document.getElementById('mobileSignUp');
const mobileSignIn = document.getElementById('mobileSignIn');

// Função para verificar se é mobile
function isMobileDevice() {
  return window.matchMedia("(max-width: 768px)").matches;
}

// Função para ajustar altura do viewport em mobile
function adjustViewportHeight() {
  if (isMobileDevice()) {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
}

// Ajusta altura no carregamento e redimensionamento
window.addEventListener('load', adjustViewportHeight);
window.addEventListener('resize', adjustViewportHeight);
window.addEventListener('orientationchange', () => {
  setTimeout(adjustViewportHeight, 100);
});

// Eventos para desktop
signUpButton?.addEventListener('click', () => {
  container.classList.add('right-panel-active');
});

signInButton?.addEventListener('click', () => {
  container.classList.remove('right-panel-active');
});

// Eventos para mobile
mobileSignUp?.addEventListener('click', () => {
  container.classList.add('right-panel-active');
});

mobileSignIn?.addEventListener('click', () => {
  container.classList.remove('right-panel-active');
});

// API de Localização - IBGE para Estados e Cidades
document.addEventListener("DOMContentLoaded", function () {
    carregarEstados();
    
    // Configura formatação do telefone
    configurarTelefone();
    
    // Adiciona event listeners para melhorar a experiência mobile
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        // Impede zoom automático no iOS quando focando em inputs
        if (isMobileDevice()) {
            input.addEventListener('focus', function() {
                if (this.type !== 'file') {
                    document.body.style.zoom = '1';
                    this.style.fontSize = '16px';
                }
            });
        }
    });
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

// Função para configurar a formatação do telefone
function configurarTelefone() {
    const telefoneInput = document.getElementById('telefone');
    
    if (!telefoneInput) return;

    // Formatação em tempo real
    telefoneInput.addEventListener('input', function(e) {
        let valor = e.target.value;
        
        // Remove tudo que não é número
        valor = valor.replace(/\D/g, '');
        
        // Aplica a formatação (xx)xxxxx-xxxx
        if (valor.length > 0) {
            if (valor.length <= 2) {
                valor = valor.replace(/(\d{1,2})/, '($1');
            } else if (valor.length <= 7) {
                valor = valor.replace(/(\d{2})(\d{1,5})/, '($1)$2');
            } else {
                valor = valor.replace(/(\d{2})(\d{5})(\d{1,4})/, '($1)$2-$3');
            }
        }
        
        // Limita a 14 caracteres (formato completo)
        if (valor.length > 14) {
            valor = valor.substring(0, 14);
        }
        
        e.target.value = valor;
    });

    // Validação ao sair do campo
    telefoneInput.addEventListener('blur', function(e) {
        const valor = e.target.value;
        const telefoneFormatado = /^\(\d{2}\)\d{5}-\d{4}$/;
        
        if (valor && !telefoneFormatado.test(valor)) {
            // Adiciona classe de erro
            e.target.classList.add('telefone-erro');
            
            // Mostra mensagem de erro
            mostrarErroTelefone(e.target);
        } else {
            // Remove classe de erro se existir
            e.target.classList.remove('telefone-erro');
            removerErroTelefone();
        }
    });

    // Remove erro quando o usuário começar a digitar novamente
    telefoneInput.addEventListener('focus', function(e) {
        e.target.classList.remove('telefone-erro');
        removerErroTelefone();
    });
}

// Função para mostrar erro do telefone
function mostrarErroTelefone(input) {
    // Remove mensagem de erro anterior se existir
    removerErroTelefone();
    
    // Cria elemento de erro
    const erroDiv = document.createElement('div');
    erroDiv.id = 'telefone-erro-msg';
    erroDiv.className = 'erro-telefone';
    erroDiv.textContent = 'Formato inválido. Use: (xx)xxxxx-xxxx';
    
    // Insere após o campo de telefone
    input.parentNode.insertAdjacentElement('afterend', erroDiv);
}

// Função para remover erro do telefone
function removerErroTelefone() {
    const erroExistente = document.getElementById('telefone-erro-msg');
    if (erroExistente) {
        erroExistente.remove();
    }
}

// Função para validar telefone (para usar na validação do formulário)
function validarTelefone(telefone) {
    const telefoneFormatado = /^\(\d{2}\)\d{5}-\d{4}$/;
    return telefoneFormatado.test(telefone);
}
