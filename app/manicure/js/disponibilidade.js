//coleta de dados salvos nas disponibilidades

document.querySelector("button[type='submit']").addEventListener("click", (event) => {
    event.preventDefault(); // Previne o envio padrão do formulário

    const dias = ["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"];
    const disponibilidades = [];

    dias.forEach((dia) => {
        const diaSelecionado = document.getElementById(`${dia}-selecionar`).checked;
        if (diaSelecionado) {
            const turno = document.getElementById(`${dia}-turno`).value;
            const horarioInicio = document.getElementById(`${dia}-horario-inicio`).value;
            const horarioFim = document.getElementById(`${dia}-horario-fim`).value;

            disponibilidades.push({
                dia,
                turno,
                horarioInicio,
                horarioFim
            });
        }
    });

    console.log(disponibilidades); // Verifica os dados coletados no console do navegador

    // Enviar os dados para o backend
    fetch('https://back-end-jf0v.onrender.com/disponibilidades', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ disponibilidades })
    })
    .then(response => response.json())
    .then(data => {
        alert("Disponibilidades salvas com sucesso!");
    })
    .catch(error => {
        console.error("Erro ao salvar as disponibilidades:", error);
    });
});
