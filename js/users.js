function adicionarUsuario() {
  const campoNome = document.querySelector("#nome").value.trim();
  const campoEmail = document.querySelector("#email").value;
  const campoSenha = document.querySelector("#senha").value;
  const campoTelefone = document.querySelector("#telefone").value;
  const campoEstado = document.querySelector("#estado").value;
  const campoCidade = document.querySelector("#cidade").value;
  const campoTipo = document.querySelector("#tipo").value;

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

  fetch('https://back-end-u9vj.onrender.com/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(usuario)
  }).then(async (response) => {
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao cadastrar usuário.");
    }
    return response.json();
  })
  .then((data) => {
    // Salvar o ID do usuário no localStorage
    localStorage.setItem("userId", data.userId);
    
    // Salvar também os outros dados do usuário
    localStorage.setItem("userName", usuario.name);
    localStorage.setItem("userEmail", usuario.email);
    localStorage.setItem("userTelefone", usuario.telefone);
    localStorage.setItem("userEstado", usuario.estado);
    localStorage.setItem("userCidade", usuario.cidade);
    localStorage.setItem("userTipo", usuario.tipo);

    alert("Usuário cadastrado com sucesso!");
    window.location.href = "perfil_cliente.html"; // Redireciona para o perfil após cadastro
  })
  .catch((error) => {
    alert(error.message);
    console.error("Erro ao cadastrar usuário:", error);
  });
}
