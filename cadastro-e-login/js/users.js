function adicionarUsuario() {
  const campoNome = document.querySelector("#nome").value.trim();
  const campoEmail = document.querySelector("#email").value;
  const campoSenha = document.querySelector("#senha").value;
  const campoTelefone = document.querySelector("#telefone").value;
  const campoEstado = document.querySelector("#estado").value;
  const campoCidade = document.querySelector("#cidade").value;
  const campoTipo = document.querySelector("#tipo").value;
  const campoFoto = document.querySelector("#foto").files[0]; // Obtém o arquivo da imagem

  if (campoSenha.length < 5) {
    alert("A senha deve ter pelo menos 5 caracteres.");
    return;
  }

  const usuario = {
    name: campoNome,
    email: campoEmail,
    password: campoSenha,
    telefone: campoTelefone,
    estado: campoEstado,
    cidade: campoCidade,
    tipo: campoTipo,
  };

  if (campoFoto) {
    const reader = new FileReader();
    reader.readAsDataURL(campoFoto);
    reader.onload = function () {
      usuario.fotoBase64 = reader.result.split(",")[1]; // Converte a imagem para Base64

      enviarDados(usuario);
    };
    reader.onerror = function (error) {
      alert("Erro ao carregar a imagem. Tente novamente.");
      console.error("Erro ao carregar a imagem:", error);
    };
  } else {
    enviarDados(usuario); // Envia os dados mesmo sem imagem
  }
}

function enviarDados(usuario) {
  fetch("https://back-end-u9vj.onrender.com/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(usuario),
  })
    .then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao cadastrar usuário.");
      }
      return response.json();
    })
    .then((data) => {
      window.location.href = "login.html";
    })
    .catch((error) => {
      alert("Erro ao cadastrar. Confira suas informações e tente novamente.");
      console.error("Erro ao cadastrar usuário:", error);
    });
}


//FUNÇÃO PARA FAZER LOGIN
async function loginUsuario() {
  const campoEmail = document.querySelector("#email").value;
  const campoSenha = document.querySelector("#senha").value;

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
    localStorage.setItem("userId", user.id);
    localStorage.setItem("userName", user.name);
    localStorage.setItem("userTelefone", user.telefone);
    localStorage.setItem("userEstado", user.estado);
    localStorage.setItem("userCidade", user.cidade);
    localStorage.setItem("userTipo", user.tipo);
    localStorage.setItem("userFoto", user.fotoUrl);

    window.location.href = "../app/principal.html";
  } catch (error) {
    alert("Erro ao realizar login.");
    console.error("Erro no login:", error);
  }
}