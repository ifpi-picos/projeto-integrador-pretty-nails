document.addEventListener("DOMContentLoaded", async () => {
  // Verifica se é mobile
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  
  // Função para testar diferentes endpoints
  async function testConnectivity() {
    const endpoints = [
      `${API_BASE_URL}/`,
      `${API_BASE_URL}/auth/login`, // teste de rota existente
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, { 
          method: 'HEAD', // Usa HEAD para não carregar o corpo da resposta
          timeout: 5000 
        });
        if (response.ok || response.status === 405) { // 405 = Method Not Allowed é aceitável
          return true;
        }
      } catch (error) {
        console.log(`Tentativa falhou para ${endpoint}:`, error.message);
      }
    }
    return false;
  }
  
  // Mostra mensagem de carregamento (usando modal normal para permitir allowOutsideClick)
  Swal.fire({
    title: 'Conectando com o servidor',
    text: 'Aguarde para usar o sistema',
    allowOutsideClick: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  try {
    const isConnected = await testConnectivity();
    // Após sucesso, fecha o loading e mostra confirmação
    Swal.close();

    if (isConnected) {
      Swal.fire({
        title: 'Conectado com o servidor!',
        text: 'Já pode usar o sistema!',
        icon: 'success',
        toast: true,
        position: isMobile ? 'top' : 'bottom-end',
        timer: 3000,
        showConfirmButton: false
      });
    } else {
      throw new Error('Nenhum endpoint respondeu');
    }
  } catch (error) {
    Swal.fire({
      title: 'Modo Offline',
      text: 'Sistema funcionando em modo local. Algumas funcionalidades podem estar limitadas.',
      icon: 'warning',
      toast: true,
      position: isMobile ? 'top' : 'bottom-end',
      timer: 5000,
      showConfirmButton: false
    });
    console.error("Erro ao conectar com o servidor:", error);
  }
});

async function adicionarUsuario() {
  // Verifica se é mobile para ajustar posição dos toasts
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const toastPosition = isMobile ? 'top' : 'bottom-end';

  // Captura os valores dos campos com validação adicional
  const campoNome = document.querySelector("#nome")?.value?.trim() || "";
  const campoEmail = document.querySelector("#cadastro-email")?.value?.trim() || "";
  const campoSenha = document.querySelector("#cadastro-senha")?.value || "";
  const campoTelefone = document.querySelector("#telefone")?.value?.trim() || "";
  const campoEstado = document.querySelector("#estado")?.value || "";
  const campoCidade = document.querySelector("#cidade")?.value || "";
  const campoTipo = document.querySelector("#tipo")?.value || "";

  // Validação de senha
  if (campoSenha.length < 6) {
    Swal.fire({
      icon: 'warning',
      title: 'Atenção',
      text: 'A senha deve ter pelo menos 6 caracteres.',
      toast: true,
      position: toastPosition,
      timer: 3000,
      showConfirmButton: false
    });
    return;
  }

  // Validação de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(campoEmail)) {
    Swal.fire({
      icon: 'warning',
      title: 'Atenção',
      text: 'Por favor, insira um email válido.',
      toast: true,
      position: toastPosition,
      timer: 3000,
      showConfirmButton: false
    });
    return;
  }

  // Validação de telefone
  const telefoneRegex = /^\(?[1-9]{2}\)? ?(?:[2-8]|9[0-9])[0-9]{3}\-?[0-9]{4}$/;
  if (campoTelefone && !telefoneRegex.test(campoTelefone.replace(/\D/g, ''))) {
    Swal.fire({
      icon: 'warning',
      title: 'Atenção',
      text: 'Por favor, insira um telefone válido.',
      toast: true,
      position: toastPosition,
      timer: 3000,
      showConfirmButton: false
    });
    return;
  }

  // Validação de campos obrigatórios
  if (!campoNome || !campoEmail || !campoSenha || !campoTelefone || !campoEstado || !campoCidade || !campoTipo) {
    Swal.fire({
      icon: 'warning',
      title: 'Atenção',
      text: 'Preencha todos os campos obrigatórios.',
      toast: true,
      position: toastPosition,
      timer: 3000,
      showConfirmButton: false
    });
    return;
  }

  const usuario = {
    nome: campoNome,
    email: campoEmail,
    password: campoSenha,
    telefone: campoTelefone,
    estado: campoEstado,
    cidade: campoCidade,
    tipo: campoTipo
  };

  console.log('Dados sendo enviados:', usuario);

  try {
    // Mostra loading (usando modal normal)
    Swal.fire({
      title: 'Criando sua conta...',
      text: 'Aguarde um momento',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const resposta = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(usuario)
    });

    // Fecha o loading
    Swal.close();

    const responseData = await resposta.json();
    console.log('Resposta do servidor:', responseData);

    if (!resposta.ok) {
      throw new Error(responseData.error || responseData.message || "Erro ao cadastrar usuário.");
    }

    Swal.fire({
      icon: 'success',
      title: 'Cadastro realizado com sucesso!',
      text: `Um email de confirmação foi enviado para ${campoEmail}.`,
      toast: true,
      position: toastPosition,
      timer: 4000,
      showConfirmButton: false
    });

    // Limpa os campos do formulário
    document.querySelector("#nome").value = "";
    document.querySelector("#cadastro-email").value = "";
    document.querySelector("#cadastro-senha").value = "";
    document.querySelector("#telefone").value = "";
    document.querySelector("#estado").value = "";
    document.querySelector("#cidade").value = "";
    document.querySelector("#tipo").value = "";

    // Volta para o formulário de login
    const container = document.getElementById('container');
    container.classList.remove('right-panel-active');

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: error.message,
      toast: true,
      position: toastPosition,
      timer: 4000,
      showConfirmButton: false
    });
    console.error("Erro ao cadastrar usuário:", error);
  }
}

async function loginUsuario() {
  // Verifica se é mobile para ajustar posição dos toasts
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const toastPosition = isMobile ? 'top' : 'bottom-end';

  // Captura os valores dos campos com validação adicional
  const campoEmail = document.querySelector("#login-email")?.value?.trim() || "";
  const campoSenha = document.querySelector("#login-senha")?.value || "";

  // Validação de campos obrigatórios
  if (!campoEmail || !campoSenha) {
    Swal.fire({
      icon: 'warning',
      title: 'Atenção',
      text: 'Preencha todos os campos obrigatórios.',
      toast: true,
      position: toastPosition,
      timer: 3000,
      showConfirmButton: false
    });
    return;
  }

  // Validação de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(campoEmail)) {
    Swal.fire({
      icon: 'warning',
      title: 'Atenção',
      text: 'Por favor, insira um email válido.',
      toast: true,
      position: toastPosition,
      timer: 3000,
      showConfirmButton: false
    });
    return;
  }

  const usuario = {
    email: campoEmail,
    password: campoSenha
  };

  console.log('Dados de login sendo enviados:', { email: campoEmail });

  try {
    // Mostra loading (usando modal normal)
    Swal.fire({
      title: 'Fazendo login...',
      text: 'Aguarde um momento',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const resposta = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(usuario)
    });

    // Fecha o loading
    Swal.close();

    const respostaJson = await resposta.json();
    console.log('Resposta de login:', respostaJson);

    if (!resposta.ok) {
      throw new Error(respostaJson.error || respostaJson.message || "Email ou senha inválidos.");
    }
    const { user, access_token } = respostaJson;

    // Armazena as informações do usuário no localStorage
    localStorage.setItem("token", access_token);
    localStorage.setItem("userId", user.id);
    localStorage.setItem("userName", user.nome);
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("userTelefone", user.telefone || "");
    localStorage.setItem("userEstado", user.estado || "");
    localStorage.setItem("userCidade", user.cidade || "");
    localStorage.setItem("userTipo", user.tipo);

    Swal.fire({
      icon: 'success',
      title: 'Login realizado com sucesso!',
      text: `Bem-vindo(a), ${user.nome}!`,
      toast: true,
      position: toastPosition,
      timer: 2000,
      showConfirmButton: false
    });

    // Limpa os campos do formulário
    document.querySelector("#login-email").value = "";
    document.querySelector("#login-senha").value = "";

    // Redireciona baseado no tipo de usuário
    setTimeout(() => {
      if (user.tipo === 'MANICURE') {
        window.location.href = '../app/manicure/principal.html';
      } else {
        window.location.href = '../app/cliente/principal.html';
      }
    }, 2000);

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: error.message,
      toast: true,
      position: toastPosition,
      timer: 4000,
      showConfirmButton: false
    });
    console.error("Erro ao fazer login:", error);
  }
}
