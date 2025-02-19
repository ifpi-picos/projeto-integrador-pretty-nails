function toggleFilters() {
    document.getElementById("filterPanel").classList.toggle("open");
}

document.addEventListener("DOMContentLoaded", function () {
    carregarEstados();
    carregarUsuarios();

    document.querySelector(".apply-btn").addEventListener("click", function () {
        const estado = document.getElementById("estado").value;
        const cidade = document.getElementById("cidade").value;
        carregarUsuarios(estado, cidade);
    });

    document.getElementById("searchInput").addEventListener("input", function () {
        const searchTerm = this.value.toLowerCase();
        const estado = document.getElementById("estado").value;
        const cidade = document.getElementById("cidade").value;
        carregarUsuarios(estado, cidade, searchTerm);
    });
});

const estadosCidades = {
    "AC": { nome: "Acre", cidades: ["Rio Branco", "Cruzeiro do Sul", "Sena Madureira", "Tarauacá", "Feijó", "Brasiléia", "Epitaciolândia", "Xapuri", "Senador Guiomard", "Plácido de Castro"] },
  "AL": { nome: "Alagoas", cidades: ["Maceió", "Arapiraca", "Palmeira dos Índios", "Rio Largo", "Penedo", "União dos Palmares", "Delmiro Gouveia", "Coruripe", "Campo Alegre", "São Miguel dos Campos"] },
  "AP": { nome: "Amapá", cidades: ["Macapá", "Santana", "Laranjal do Jari", "Oiapoque", "Mazagão", "Porto Grande", "Pedra Branca do Amapari", "Tartarugalzinho", "Vitória do Jari", "Calçoene"] },
  "AM": { nome: "Amazonas", cidades: ["Manaus", "Parintins", "Itacoatiara", "Manacapuru", "Coari", "Tefé", "Tabatinga", "Maués", "Humaitá", "Lábrea"] },
  "BA": { nome: "Bahia", cidades: ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Juazeiro", "Itabuna", "Lauro de Freitas", "Ilhéus", "Jequié", "Teixeira de Freitas"] },
  "CE": { nome: "Ceará", cidades: ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Maracanaú", "Sobral", "Crato", "Itapipoca", "Maranguape", "Iguatu", "Quixadá"] },
  "DF": { nome: "Distrito Federal", cidades: ["Brasília"] },
  "ES": { nome: "Espírito Santo", cidades: ["Vitória", "Vila Velha", "Serra", "Cariacica", "Linhares", "São Mateus", "Colatina", "Guarapari", "Aracruz", "Cachoeiro de Itapemirim"] },
  "GO": { nome: "Goiás", cidades: ["Goiânia", "Aparecida de Goiânia", "Anápolis", "Rio Verde", "Luziânia", "Águas Lindas de Goiás", "Valparaíso de Goiás", "Trindade", "Formosa", "Novo Gama"] },
  "MA": { nome: "Maranhão", cidades: ["São Luís", "Imperatriz", "Timon", "Caxias", "Codó", "Paço do Lumiar", "Açailândia", "Bacabal", "Balsas", "Santa Inês"] },
  "MG": { nome: "Minas Gerais", cidades: ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim", "Montes Claros", "Ribeirão das Neves", "Uberaba", "Governador Valadares", "Ipatinga"] },
  "PA": { nome: "Pará", cidades: ["Belém", "Ananindeua", "Santarém", "Marabá", "Castanhal", "Parauapebas", "Abaetetuba", "Cametá", "Bragança", "Altamira"] },
  "PI": { nome: "Piauí", cidades: ["Floriano", "Picos", "Terezina", "Parnaíba", "Piripiri", "Campo Maior", "Barras", "Altos", "Esperantina", "José de Freitas"] },
  "PB": { nome: "Paraíba", cidades: ["João Pessoa", "Campina Grande", "Santa Rita", "Patos", "Bayeux", "Sousa", "Cajazeiras", "Guarabira", "Sapé", "Mamanguape"] },
  "PR": { nome: "Paraná", cidades: ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel", "São José dos Pinhais", "Foz do Iguaçu", "Colombo", "Guarapuava", "Paranaguá"] },
  "RJ": { nome: "Rio de Janeiro", cidades: ["Rio de Janeiro", "São Gonçalo", "Duque de Caxias", "Nova Iguaçu", "Niterói", "Belford Roxo", "Campos dos Goytacazes", "São João de Meriti", "Petrópolis", "Volta Redonda"] },
  "SP": { nome: "São Paulo", cidades: ["São Paulo", "Guarulhos", "Campinas", "São Bernardo do Campo", "Santo André", "Osasco", "São José dos Campos", "Ribeirão Preto", "Sorocaba", "Mauá"] },
  "RS": { nome: "Rio Grande do Sul", cidades: ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas", "Santa Maria", "Gravataí", "Viamão", "Novo Hamburgo", "São Leopoldo", "Rio Grande"] },
  "SC": { nome: "Santa Catarina", cidades: ["Florianópolis", "Joinville", "Blumenau", "São José", "Chapecó", "Itajaí", "Criciúma", "Jaraguá do Sul", "Lages", "Palhoça"] },
  "PE": { nome: "Pernambuco", cidades: ["Recife", "Jaboatão dos Guararapes", "Olinda", "Caruaru", "Petrolina", "Paulista", "Cabo de Santo Agostinho", "Camaragibe", "Garanhuns", "Vitória de Santo Antão"] },
  "RN": { nome: "Rio Grande do Norte", cidades: ["Natal", "Mossoró", "Parnamirim", "São Gonçalo do Amarante", "Macau", "Ceará-Mirim", "Caicó", "Açu", "Currais Novos", "Santa Cruz"] },
  "MS": { nome: "Mato Grosso do Sul", cidades: ["Campo Grande", "Dourados", "Três Lagoas", "Corumbá", "Ponta Porã", "Naviraí", "Nova Andradina", "Sidrolândia", "Maracaju", "Aquidauana"] },
  "MT": { nome: "Mato Grosso", cidades: ["Cuiabá", "Várzea Grande", "Rondonópolis", "Sinop", "Tangará da Serra", "Sorriso", "Lucas do Rio Verde", "Primavera do Leste", "Barra do Garças", "Alta Floresta"] },
  "SE": { nome: "Sergipe", cidades: ["Aracaju", "Nossa Senhora do Socorro", "Lagarto", "Itabaiana", "Estância", "Tobias Barreto", "Simão Dias", "Nossa Senhora da Glória", "Propriá", "Capela"] },
  "TO": { nome: "Tocantins", cidades: ["Palmas", "Araguaína", "Gurupi", "Porto Nacional", "Paraíso do Tocantins", "Colinas do Tocantins", "Guaraí", "Tocantinópolis", "Miracema do Tocantins", "Dianópolis"] },
  "RO": { nome: "Rondônia", cidades: ["Porto Velho", "Ji-Paraná", "Ariquemes", "Vilhena", "Cacoal", "Rolim de Moura", "Jaru", "Guajará-Mirim", "Machadinho d'Oeste", "Ouro Preto do Oeste"] },
  "RR": { nome: "Roraima", cidades: ["Boa Vista", "Rorainópolis", "Caracaraí", "Mucajaí", "Cantá", "Pacaraima", "Alto Alegre", "Bonfim", "Normandia", "São João da Baliza"] }
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

function carregarUsuarios(estado = "", cidade = "", searchTerm = "") {
    let url = 'https://back-end-u9vj.onrender.com/users?tipo=MANICURE';

    if (estado) {
        url += `&estado=${estado}`;
    }
    if (cidade) {
        url += `&cidade=${cidade}`;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const perfilContainer = document.getElementById("perfilContainer");
            perfilContainer.innerHTML = ""; // Limpa o contêiner antes de adicionar novos perfis

            data.forEach(perfil => {
                if ((estado === "" || perfil.estado === estado) &&
                    (cidade === "" || perfil.cidade === cidade) &&
                    (searchTerm === "" || perfil.name.toLowerCase().includes(searchTerm))) {
                    const perfilDiv = document.createElement("div");
                    perfilDiv.classList.add("perfil");

                    perfilDiv.innerHTML = `
                        <div class="perfil-foto-container">
                            <img src="${perfil.foto}" alt="Foto de ${perfil.name}" class="perfil-foto">
                        </div>
                        <div class="perfil-info">
                            <h4>${perfil.name}</h4>
                            <p>${perfil.cidade}, ${perfil.estado}</p>
                        </div>
                    `;

                    perfilContainer.appendChild(perfilDiv);
                }
            });
        })
        .catch(error => {
            console.error("Erro ao carregar usuários:", error);
        });
}
