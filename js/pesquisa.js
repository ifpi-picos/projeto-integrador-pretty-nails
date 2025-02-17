function toggleFilters() {
    document.getElementById("filterPanel").classList.toggle("open");
}

document.addEventListener("DOMContentLoaded", function () {
    carregarEstados();
});

const estadosCidades = {
    "AC": ["Rio Branco", "Cruzeiro do Sul", "Sena Madureira"],
    "AL": ["Maceió", "Arapiraca", "Palmeira dos Índios"],
    "AP": ["Macapá", "Santana", "Laranjal do Jari"],
    "AM": ["Manaus", "Parintins", "Itacoatiara"],
    "BA": ["Salvador", "Feira de Santana", "Vitória da Conquista"],
    "CE": ["Fortaleza", "Caucaia", "Juazeiro do Norte"],
    "DF": ["Brasília"],
    "ES": ["Vitória", "Vila Velha", "Serra"],
    "GO": ["Goiânia", "Aparecida de Goiânia", "Anápolis"],
    "MA": ["São Luís", "Imperatriz", "Timon"],
    "MG": ["Belo Horizonte", "Uberlândia", "Contagem"],
    "PA": ["Belém", "Ananindeua", "Santarém"],
    "PI": ["Floriano", "Picos", "Terezina"],
    "PB": ["João Pessoa", "Campina Grande", "Santa Rita"],
    "PR": ["Curitiba", "Londrina", "Maringá"],
    "RJ": ["Rio de Janeiro", "São Gonçalo", "Duque de Caxias"],
    "SP": ["São Paulo", "Guarulhos", "Campinas"]
};

function carregarEstados() {
    const estadoSelect = document.getElementById("estado");
    for (const estado in estadosCidades) {
        const option = document.createElement("option");
        option.value = estado;
        option.textContent = estado;
        estadoSelect.appendChild(option);
    }
}

function carregarCidades() {
    const estadoSelecionado = document.getElementById("estado").value;
    const cidadeSelect = document.getElementById("cidade");

    cidadeSelect.innerHTML = "<option value=''>Selecione</option>";

    if (estadoSelecionado && estadosCidades[estadoSelecionado]) {
        estadosCidades[estadoSelecionado].forEach(cidade => {
            const option = document.createElement("option");
            option.value = cidade;
            option.textContent = cidade;
            cidadeSelect.appendChild(option);
        });
    }
}
