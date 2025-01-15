async function adicionarUsuario() {
    const campoNome = document.querySelector("#nome")
    const campoEmail = document.querySelector("#email")
    const campoSenha = document.querySelector("#senha")
  
    const usuario = {
      name: campoNome.value,
      email: campoEmail.value,
      password: campoSenha.value
    }
  
    const resposta = await fetch('https://back-end-6der.onrender.com/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(usuario)
    })
  
    if (resposta.ok) {
      console.log('Cadastro realizado com sucesso!!')
      const user = await resposta.json();
      localStorage.setItem('name', user.name)
      localStorage.setItem('email', user.email)
      window.location.href = 'https://nailan-nobre.github.io/pretty-nails-mobile-prototipo/www/'
    } else {
      console.error('Erro no cadastro:', error);
      alert('Erro ao realizar cadastro. Tente novamente mais tarde.');
    }
}