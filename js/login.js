async function fazerLogin() {
  const campoEmailInserido = document.querySelector("#emailInserido");
  const campoSenhaInserida = document.querySelector("#senhaInserida");

  const usuarioLogin = {
    email: campoEmailInserido.value,
    password: campoSenhaInserida.value
  };

  try {
    // Envia a requisição POST para a rota /users no back-end
    const resposta = await fetch('https://back-end-6der.onrender.com/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(usuarioLogin)
    });

    if (resposta.ok) {
      const user = await resposta.json(); // Recebe os dados do usuário autenticado

      // Se o login for bem-sucedido, armazena as informações no localStorage
      localStorage.setItem('name', user.name);
      localStorage.setItem('email', user.email);

      // Redireciona para a página principal
      window.location.href = '/principal.html';
    } else {
      console.log('Credenciais inválidas');
      alert("Login ou senha inválidos. Tente novamente.");
    }
  } catch (error) {
    console.log('Erro ao tentar fazer login:', error);
    alert("Houve um erro na comunicação com o servidor. Tente novamente.");
  }
}
