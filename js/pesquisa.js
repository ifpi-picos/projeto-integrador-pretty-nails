function toggleFilters() {
    document.getElementById("filterPanel").classList.toggle("open");
}

document.addEventListener("DOMContentLoaded", function () {
    carregarEstados();
});

const estadosCidades = {
    "AC": ["Rio Branco", "Cruzeiro do Sul", "Sena Madureira", "Tarauacá", "Feijó", "Brasiléia", "Epitaciolândia", "Xapuri", "Senador Guiomard", "Plácido de Castro"],
    "AL": ["Maceió", "Arapiraca", "Palmeira dos Índios", "Rio Largo", "Penedo", "União dos Palmares", "Delmiro Gouveia", "Coruripe", "Campo Alegre", "São Miguel dos Campos"],
    "AP": ["Macapá", "Santana", "Laranjal do Jari", "Oiapoque", "Mazagão", "Porto Grande", "Pedra Branca do Amapari", "Tartarugalzinho", "Vitória do Jari", "Calçoene"],
    "AM": ["Manaus", "Parintins", "Itacoatiara", "Manacapuru", "Coari", "Tefé", "Tabatinga", "Maués", "Humaitá", "Lábrea"],
    "BA": ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Juazeiro", "Itabuna", "Lauro de Freitas", "Ilhéus", "Jequié", "Teixeira de Freitas"],
    "CE": ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Maracanaú", "Sobral", "Crato", "Itapipoca", "Maranguape", "Iguatu", "Quixadá"],
    "DF": ["Brasília"],
    "ES": ["Vitória", "Vila Velha", "Serra", "Cariacica", "Linhares", "São Mateus", "Colatina", "Guarapari", "Aracruz", "Cachoeiro de Itapemirim"],
    "GO": ["Goiânia", "Aparecida de Goiânia", "Anápolis", "Rio Verde", "Luziânia", "Águas Lindas de Goiás", "Valparaíso de Goiás", "Trindade", "Formosa", "Novo Gama"],
    "MA": ["São Luís", "Imperatriz", "Timon", "Caxias", "Codó", "Paço do Lumiar", "Açailândia", "Bacabal", "Balsas", "Santa Inês"],
    "MG": ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim", "Montes Claros", "Ribeirão das Neves", "Uberaba", "Governador Valadares", "Ipatinga"],
    "PA": ["Belém", "Ananindeua", "Santarém", "Marabá", "Castanhal", "Parauapebas", "Abaetetuba", "Cametá", "Bragança", "Altamira"],
    "PI": ["Floriano", "Picos", "Terezina", "Parnaíba", "Piripiri", "Campo Maior", "Barras", "Altos", "Esperantina", "José de Freitas"],
    "PB": ["João Pessoa", "Campina Grande", "Santa Rita", "Patos", "Bayeux", "Sousa", "Cajazeiras", "Guarabira", "Sapé", "Mamanguape"],
    "PR": ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel", "São José dos Pinhais", "Foz do Iguaçu", "Colombo", "Guarapuava", "Paranaguá"],
    "RJ": ["Rio de Janeiro", "São Gonçalo", "Duque de Caxias", "Nova Iguaçu", "Niterói", "Belford Roxo", "Campos dos Goytacazes", "São João de Meriti", "Petrópolis", "Volta Redonda"],
    "SP": ["São Paulo", "Guarulhos", "Campinas", "São Bernardo do Campo", "Santo André", "Osasco", "São José dos Campos", "Ribeirão Preto", "Sorocaba", "Mauá"],
    "RS": ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas", "Santa Maria", "Gravataí", "Viamão", "Novo Hamburgo", "São Leopoldo", "Rio Grande"],
    "SC": ["Florianópolis", "Joinville", "Blumenau", "São José", "Chapecó", "Itajaí", "Criciúma", "Jaraguá do Sul", "Lages", "Palhoça"],
    "PE": ["Recife", "Jaboatão dos Guararapes", "Olinda", "Caruaru", "Petrolina", "Paulista", "Cabo de Santo Agostinho", "Camaragibe", "Garanhuns", "Vitória de Santo Antão"],
    "RN": ["Natal", "Mossoró", "Parnamirim", "São Gonçalo do Amarante", "Macau", "Ceará-Mirim", "Caicó", "Açu", "Currais Novos", "Santa Cruz"],
    "MS": ["Campo Grande", "Dourados", "Três Lagoas", "Corumbá", "Ponta Porã", "Naviraí", "Nova Andradina", "Sidrolândia", "Maracaju", "Aquidauana"],
    "MT": ["Cuiabá", "Várzea Grande", "Rondonópolis", "Sinop", "Tangará da Serra", "Sorriso", "Lucas do Rio Verde", "Primavera do Leste", "Barra do Garças", "Alta Floresta"],
    "SE": ["Aracaju", "Nossa Senhora do Socorro", "Lagarto", "Itabaiana", "Estância", "Tobias Barreto", "Simão Dias", "Nossa Senhora da Glória", "Propriá", "Capela"],
    "TO": ["Palmas", "Araguaína", "Gurupi", "Porto Nacional", "Paraíso do Tocantins", "Colinas do Tocantins", "Guaraí", "Tocantinópolis", "Miracema do Tocantins", "Dianópolis"],
    "RO": ["Porto Velho", "Ji-Paraná", "Ariquemes", "Vilhena", "Cacoal", "Rolim de Moura", "Jaru", "Guajará-Mirim", "Machadinho d'Oeste", "Ouro Preto do Oeste"],
    "RR": ["Boa Vista", "Rorainópolis", "Caracaraí", "Mucajaí", "Cantá", "Pacaraima", "Alto Alegre", "Bonfim", "Normandia", "São João da Baliza"]
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

document.addEventListener("DOMContentLoaded", function () {
    carregarEstados();
    adicionarPerfis();

    document.querySelector(".apply-btn").addEventListener("click", function () {
        const estado = document.getElementById("estado").value;
        const cidade = document.getElementById("cidade").value;
        adicionarPerfis(estado, cidade);
    });

    document.getElementById("searchInput").addEventListener("input", function () {
        const searchTerm = this.value.toLowerCase();
        const estado = document.getElementById("estado").value;
        const cidade = document.getElementById("cidade").value;
        adicionarPerfis(estado, cidade, searchTerm);
    });
});

function adicionarPerfis(filtroEstado = "", filtroCidade = "", filtroNome = "") {
    const perfis = [
        {
            nome: "Maria Silva",
            estrelas: 5,
            estado: "SP",
            cidade: "São Paulo",
            foto: "imagens/manicure4.png"
        },
        {
            nome: "Ana Souza",
            estrelas: 4,
            estado: "RJ",
            cidade: "Rio de Janeiro",
            foto: "imagens/ana_souza.jpg"
        },
        {
            nome: "João Pereira",
            estrelas: 3,
            estado: "MG",
            cidade: "Belo Horizonte",
            foto: "imagens/joao_pereira.jpg"
        },
        {
            nome: "Clara Nunes",
            estrelas: 5,
            estado: "BA",
            cidade: "Salvador",
            foto: "imagens/clara_nunes.jpg"
        },
        {
            nome: "Pedro Santos",
            estrelas: 4,
            estado: "RS",
            cidade: "Porto Alegre",
            foto: "imagens/pedro_santos.jpg"
        },
        {
            nome: "Fernanda Lima",
            estrelas: 5,
            estado: "PR",
            cidade: "Curitiba",
            foto: "imagens/fernanda_lima.jpg"
        }
        // Adicione mais perfis conforme necessário
    ];

    const perfilContainer = document.getElementById("perfilContainer");
    perfilContainer.innerHTML = ""; // Limpa os perfis existentes

    perfis.forEach(perfil => {
        if ((filtroEstado === "" || perfil.estado === filtroEstado) &&
            (filtroCidade === "" || perfil.cidade === filtroCidade) &&
            (filtroNome === "" || perfil.nome.toLowerCase().includes(filtroNome))) {
            const perfilDiv = document.createElement("div");
            perfilDiv.classList.add("perfil");

            perfilDiv.innerHTML = `
                <div class="perfil-foto-container">
                    <img src="${perfil.foto}" alt="Foto de ${perfil.nome}" class="perfil-foto">
                </div>
                <div class="perfil-info">
                    <h4>${perfil.nome}</h4>
                    <p>⭐ ${perfil.estrelas}</p>
                    <p>${perfil.cidade}, ${perfil.estado}</p>
                </div>
            `;

            perfilContainer.appendChild(perfilDiv);
        }
    });
}