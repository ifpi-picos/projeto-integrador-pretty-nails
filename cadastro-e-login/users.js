document.addEventListener("DOMContentLoaded", async () => {
  // Verifica se é mobile
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  
  // Mostra mensagem de carregamento
  Swal.fire({
    title: 'Conectando com o servidor',
    text: 'Aguarde para usar o sistema',
    toast: true,
    position: isMobile ? 'top' : 'bottom-end',
    showConfirmButton: false,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  try {
    await fetch(`${API_BASE_URL}/api/test`);
    // Após sucesso, fecha o loading e mostra confirmação
    Swal.close();

    Swal.fire({
      title: 'Conectado com o servidor!',
      text: 'Já pode usar o sistema!',
      icon: 'success',
      toast: true,
      position: isMobile ? 'top' : 'bottom-end',
      timer: 3000,
      showConfirmButton: false
    });
  } catch (error) {
    Swal.fire({
      title: 'Erro ao conectar',
      text: 'Não foi possível se conectar com o servidor.',
      icon: 'error',
      toast: true,
      position: isMobile ? 'top' : 'bottom-end',
      timer: 4000,
      showConfirmButton: false
    });
    console.error("Erro ao conectar com o servidor:", error);
  }
});

async function adicionarUsuario() {
  const campoNome = document.querySelector("#nome").value.trim();
  const campoEmail = document.querySelector("#cadastro-email").value;
  const campoSenha = document.querySelector("#cadastro-senha").value;
  const campoTelefone = document.querySelector("#telefone").value;
  const campoEstado = document.querySelector("#estado").value;
  const campoCidade = document.querySelector("#cidade").value;
  const campoTipo = document.querySelector("#tipo").value;

  if (campoSenha.length < 6) {
    Swal.fire({
      icon: 'warning',
      title: 'Atenção',
      text: 'A senha deve ter pelo menos 6 caracteres.',
      toast: true,
      position: 'bottom-end',
      timer: 3000,
      showConfirmButton: false
    });
    return;
  }

  if (!campoNome || !campoEmail || !campoSenha || !campoTelefone || !campoEstado || !campoCidade || !campoTipo) {
    Swal.fire({
      icon: 'warning',
      title: 'Atenção',
      text: 'Preencha todos os campos obrigatórios.',
      toast: true,
      position: 'bottom-end',
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

  try {
    const resposta = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario)
    });

    if (!resposta.ok) {
      const errorData = await resposta.json();
      throw new Error(errorData.message || "Erro ao cadastrar usuário.");
    }

    Swal.fire({
      icon: 'success',
      title: 'Cadastro realizado com sucesso!',
      text: `Um email de confirmação foi enviado para ${campoEmail}.`,
      toast: true,
      position: 'bottom-end',
      timer: 4000,
      showConfirmButton: false
    });

    container.classList.remove('right-panel-active');

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: error.message,
      toast: true,
      position: 'bottom-end',
      timer: 4000,
      showConfirmButton: false
    });
    console.error("Erro ao cadastrar usuário:", error);
  }
}

async function loginUsuario() {
  const campoEmail = document.querySelector("#login-email").value;
  const campoSenha = document.querySelector("#login-senha").value;

  const usuario = {
    email: campoEmail,
    password: campoSenha
  };

  try {
    const resposta = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario)
    });

    if (!resposta.ok) {
      const errorData = await resposta.json();
      throw new Error(errorData.message || "Email ou senha inválidos.");
    }

    const respostaJson = await resposta.json();
    const { user, access_token } = respostaJson;

    localStorage.setItem("token", access_token);
    localStorage.setItem("userId", user.id);
    localStorage.setItem("userName", user.nome);
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("userTelefone", user.telefone);
    localStorage.setItem("userEstado", user.estado);
    localStorage.setItem("userCidade", user.cidade);
    localStorage.setItem("userTipo", user.tipo);

    Swal.fire({
      icon: 'success',
      title: 'Login realizado com sucesso!',
      toast: true,
      position: 'bottom-end',
      timer: 3000,
      showConfirmButton: false
    });

    if (user.tipo === "MANICURE") {
      window.location.href = "../app/manicure/principal.html";
    } else if (user.tipo === "CLIENTE") {
      window.location.href = "../app/cliente/principal.html";
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Tipo de usuário não reconhecido.',
        toast: true,
        position: 'bottom-end',
        timer: 3000,
        showConfirmButton: false
      });
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Erro no login',
      text: error.message,
      toast: true,
      position: 'bottom-end',
      timer: 4000,
      showConfirmButton: false
    });
    console.error("Erro no login:", error);
  }
}
