document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const manicureId = params.get('id'); // Obtém o ID da manicure da URL

    if (manicureId) {
        fetch(`http://localhost:3000/manicures/${manicureId}`)
            .then(response => response.json())
            .then(manicure => {
                const perfilContainer = document.getElementById("perfil-container");
                perfilContainer.innerHTML = `
                    <img src="${manicure.foto || 'https://via.placeholder.com/150'}" alt="${manicure.name}">
                    <h2>${manicure.name}</h2>
                    <p>Estado: ${manicure.estado}</p>
                    <p>Cidade: ${manicure.cidade}</p>
                    <p>Avaliação: ${'★'.repeat(manicure.rating)}</p>
                    <p>Descrição: ${manicure.descricao}</p>
                `;
            })
            .catch(error => console.error("Erro ao carregar o perfil da manicure:", error));
    } else {
        alert("Manicure não encontrada.");
    }
});
