// Lista de imagens disponíveis
const images = [
    "https://www.dicasdemulher.com.br/wp-content/uploads/2019/01/unhas-nude-21-730x730.jpg",
    "https://www.dicasdemulher.com.br/wp-content/uploads/2019/01/unhas-nude-1-730x730.jpg",
    "https://www.dicasdemulher.com.br/wp-content/uploads/2019/01/unhas-nude-8-730x730.jpg",
    "https://www.dicasdemulher.com.br/wp-content/uploads/2019/01/unhas-nude-12-730x730.jpg",
    "https://www.dicasdemulher.com.br/wp-content/uploads/2019/01/unhas-nude-14-730x730.jpg",
    "https://www.dicasdemulher.com.br/wp-content/uploads/2019/01/unhas-nude-19-730x730.jpg",
    "https://www.dicasdemulher.com.br/wp-content/uploads/2019/01/unhas-nude-22-730x730.jpg",
    "https://www.oibonita.com.br/wp-content/uploads/2023/03/unhas-nude-4-730x811.jpg"
];

// Captura o parâmetro da URL
const urlParams = new URLSearchParams(window.location.search);
const imgIndex = urlParams.get('img');

// Carrega a imagem selecionada
const selectedImage = document.getElementById('selected-image');
if (imgIndex && imgIndex >= 1 && imgIndex <= images.length) {
    selectedImage.src = images[imgIndex - 1]; // Subtrai 1 porque o array começa em 0
    selectedImage.alt = `Modelo de unhas ${imgIndex}`;
} else {
    // Se o parâmetro for inválido, redireciona para a página inicial
    window.location.href = 'index.html';
}

