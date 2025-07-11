// Função para adicionar usuário (cadastro)
async function adicionarUsuario() {
  const campoNome = document.querySelector("#nome").value.trim();
  const campoEmail = document.querySelector("#cadastro-email").value;
  const campoSenha = document.querySelector("#cadastro-senha").value;
  const campoTelefone = document.querySelector("#telefone").value;
  const campoEstado = document.querySelector("#estado").value;
  const campoCidade = document.querySelector("#cidade").value;
  const campoTipo = document.querySelector("#tipo").value;

  if (campoSenha.length < 5) {
    alert("A senha deve ter pelo menos 5 caracteres.");
    return;
  }

  if (!campoNome || !campoEmail || !campoSenha || !campoTelefone || !campoEstado || !campoCidade || !campoTipo) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  const usuario = {
    nome: campoNome,
    email: campoEmail,
    password: campoSenha,
    telefone: campoTelefone,
    estado: campoEstado,
    cidade: campoCidade,
    tipo: campoTipo,
    dias_trabalho: diasSelecionados, 
    horarios: horariosSelecionados, 
    servicos: servicosSelecionados,
    regras: regrasDigitadas
  };

  try {
    const resposta = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(usuario)
    });

    if (!resposta.ok) {
      const errorData = await resposta.json();
      throw new Error(errorData.message || "Erro ao cadastrar usuário.");
    }

    alert("Cadastro realizado com sucesso! Faça login.");

    // Troca para o formulário de login
    container.classList.remove('right-panel-active');

  } catch (error) {
    alert(error.message);
    console.error("Erro ao cadastrar usuário:", error);
  }
}

// Função para login
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
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(usuario)
    });

    if (!resposta.ok) {
      const errorData = await resposta.json();
      throw new Error(errorData.message || "Email ou senha inválidos.");
    }

    const respostaJson = await resposta.json();
    const { user, access_token } = respostaJson;

    // Salva dados no localStorage
    localStorage.setItem("token", access_token);
    localStorage.setItem("userId", user.id);
    localStorage.setItem("userName", user.nome);
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("userTelefone", user.telefone);
    localStorage.setItem("userEstado", user.estado);
    localStorage.setItem("userCidade", user.cidade);
    localStorage.setItem("userTipo", user.tipo);

    // Redireciona conforme o tipo de usuário
    if (user.tipo === "MANICURE") {
      window.location.href = "../app/manicure/principal.html";
    } else if (user.tipo === "CLIENTE") {
      window.location.href = "../app/cliente/principal.html";
    } else {
      alert("Tipo de usuário não reconhecido.");
    }
  } catch (error) {
    alert(error.message);
    console.error("Erro no login:", error);
  }
}