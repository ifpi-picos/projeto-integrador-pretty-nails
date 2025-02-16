//FUNÇÃO PARA CADASTRAR
function adicionarUsuario() {
  const campoNome = document.querySelector("#nome").value.trim();
  const campoEmail = document.querySelector("#email").value;
  const campoSenha = document.querySelector("#senha").value;
  const campoTelefone = document.querySelector("#telefone").value;
  const campoEstado = document.querySelector("#estado").value;
  const campoCidade = document.querySelector("#cidade").value;
  const campoTipo = document.querySelector("#tipo").value;
  //const campoFoto = document.querySelector("#imagem").files[0];

  // Validações básicas
  if (!campoNome || !campoEmail || !campoSenha || !campoTelefone || !campoEstado || !campoCidade || !campoTipo) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  if (!/\S+@\S+\.\S+/.test(campoEmail)) {
    alert("Por favor, insira um email válido.");
    return;
  }

  if (campoSenha.length < 5) {
    alert("A senha deve ter pelo menos 5 caracteres.");
    return;
  }

  const formData = new FormData();
  formData.append("name", campoNome);
  formData.append("email", campoEmail);
  formData.append("password", campoSenha);
  formData.append("telefone", campoTelefone);
  formData.append("estado", campoEstado);
  formData.append("cidade", campoCidade);
  formData.append("tipo", campoTipo);
  //formData.append("foto", campoFoto);

  fetch("https://back-end-u9vj.onrender.com/signup", {
    method: "POST",
    body: formData,
  })
    .then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao cadastrar usuário.");
      }
      return response.json();
    })
    .then((data) => {
      alert("Usuário cadastrado com sucesso!");
      window.location.href = "principal.html";
    })
    .catch((error) => {
      alert(error.message);
      console.error("Erro ao cadastrar usuário:", error);
    });
}



//FUNÇÃO PARA FAZER LOGIN
async function loginUsuario() {
  const campoEmail = document.querySelector("#email").value;
  const campoSenha = document.querySelector("#senha").value;

  // Validações básicas
  if (!campoEmail || !campoSenha) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  if (!/\S+@\S+\.\S+/.test(campoEmail)) {
    alert("Por favor, insira um email válido.");
    return;
  }

  const usuario = {
    email: campoEmail,
    password: campoSenha,
  };

  try {
    const resposta = await fetch("https://back-end-u9vj.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuario),
    });

    if (!resposta.ok) {
      const errorData = await resposta.json();
      throw new Error(errorData.message || "Email ou senha inválidos.");
    }

    const { user, token } = await resposta.json();
    
    localStorage.setItem("token", token);
    localStorage.setItem("email", campoEmail);

    alert("Login realizado com sucesso!");
    window.location.href = "principal.html";
  } catch (error) {
    alert(error.message);
    console.error("Erro no login:", error);
  }
}