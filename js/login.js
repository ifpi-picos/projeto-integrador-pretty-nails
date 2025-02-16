async function login(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();
    if (data.id) {
        localStorage.setItem('userId', data.id);
        console.log("Usuário salvo no localStorage:", localStorage.getItem('userId')); 
    
        setTimeout(() => {
            window.location.href = 'perfil_cliente.html';
        }, 500); // Pequeno atraso de 500ms
    } else {
        alert('Login inválido!');
    }
}    
