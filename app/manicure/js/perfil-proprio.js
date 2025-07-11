document.addEventListener('DOMContentLoaded', async () => {
    // Elementos do DOM
    const foto = document.getElementById('foto');
    const nome = document.getElementById('nome');
    const email = document.getElementById('email');
    const telefone = document.getElementById('telefone');
    const endereco = document.getElementById('endereco');
    const workDaysContainer = document.getElementById('workDays');
    const workHoursContainer = document.getElementById('workHours');
    const servicesList = document.getElementById('servicesList');

    // Elementos do modal
    const editModal = document.getElementById('editModal');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    const editPhotoPreview = document.getElementById('editPhotoPreview');
    const editPhoto = document.getElementById('editPhoto');
    const editName = document.getElementById('editName');
    const editEmail = document.getElementById('editEmail');
    const editPhone = document.getElementById('editPhone');
    const editCity = document.getElementById('editCity');
    const editState = document.getElementById('editState');

    // Verificar autenticação
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userType = localStorage.getItem('userType'); // 'cliente' ou 'profissional'

    if (!token || !userId) {
        window.location.href = 'login.html';
        return;
    }

    // Carregar dados do perfil
    async function loadProfileData() {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/usuario/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Erro ao carregar perfil');

            const data = await response.json();

            // Preencher dados na tela
            foto.src = data.foto || 'imagens/user.png';
            nome.textContent = data.nome || 'Nome não informado';
            email.innerHTML = `<i class="fas fa-envelope"></i> ${data.email || 'Email não informado'}`;
            telefone.innerHTML = `<i class="fas fa-phone"></i> ${data.telefone || 'Telefone não informado'}`;
            endereco.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${data.cidade || 'Cidade não informada'}, ${data.estado || 'Estado não informado'}`;

            // Dias de trabalho dinâmico
            if (data.dias_trabalho && data.dias_trabalho.length > 0) {
                const days = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
                workDaysContainer.innerHTML = data.dias_trabalho
                    .map(idx => `<span class="day">${days[idx]}</span>`)
                    .join('');
            } else {
                workDaysContainer.innerHTML = '<span class="day">Nenhum dia cadastrado</span>';
            }

            // Horários de trabalho dinâmico
            if (data.horarios && data.horarios.length > 0) {
                workHoursContainer.innerHTML = data.horarios
                    .map(h => `<span class="hour">${h.inicio} - ${h.fim}</span>`)
                    .join('');
            } else {
                workHoursContainer.innerHTML = '<span class="hour">Nenhum horário cadastrado</span>';
            }

            // Serviços oferecidos dinâmico
            if (data.servicos && data.servicos.length > 0) {
                servicesList.innerHTML = data.servicos
                    .map(s => `<span class="service">${s.nome ? s.nome : s}${s.preco ? ` (R$${s.preco})` : ''}</span>`)
                    .join('');
            } else {
                servicesList.innerHTML = '<span class="service">Nenhum serviço cadastrado</span>';
            }

        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
            showNotification('Erro ao carregar dados do perfil', 'error');
        }
    }

    // Mostrar/ocultar modal
    function toggleModal(show) {
        if (show) {
            editModal.classList.add('active');
        } else {
            editModal.classList.remove('active');
        }
    }

    // Event listeners
    editProfileBtn.addEventListener('click', () => toggleModal(true));
    closeModalBtn.addEventListener('click', () => toggleModal(false));
    cancelEditBtn.addEventListener('click', () => toggleModal(false));

    // Preview da foto ao selecionar
    editPhoto.addEventListener('change', function (e) {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                editPhotoPreview.src = e.target.result;
            }
            reader.readAsDataURL(this.files[0]);
        }
    });

    // Salvar alterações
    saveProfileBtn.addEventListener('click', async () => {
        try {
            // Coletar dados do formulário
            const diasTrabalho = [];
            document.querySelectorAll('input[name="workDay"]:checked').forEach(checkbox => {
                diasTrabalho.push(parseInt(checkbox.value));
            });

            const horarios = [];
            const inicio1 = document.getElementById('timeFrom1').value;
            const fim1 = document.getElementById('timeTo1').value;
            if (inicio1 && fim1) horarios.push({ inicio: inicio1, fim: fim1 });

            const inicio2 = document.getElementById('timeFrom2').value;
            const fim2 = document.getElementById('timeTo2').value;
            if (inicio2 && fim2) horarios.push({ inicio: inicio2, fim: fim2 });

            const servicos = [];
            document.querySelectorAll('input[name="service"]:checked').forEach(checkbox => {
                servicos.push({ nome: checkbox.value });
            });

            // Foto (se mudou)
            let fotoUrl = editPhotoPreview.src;

            const profileData = {
                nome: editName.value,
                email: editEmail.value,
                telefone: editPhone.value,
                cidade: editCity.value,
                estado: editState.value,
                foto: fotoUrl,
                dias_trabalho: diasTrabalho,
                horarios: horarios,
                servicos: servicos
            };

            const response = await fetch(`${API_BASE_URL}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao atualizar perfil');
            }

            const updatedData = await response.json();
            showNotification('Perfil atualizado com sucesso!', 'success');

            // Atualizar localStorage se necessário
            if (updatedData.nome) localStorage.setItem('userName', updatedData.nome);
            if (updatedData.foto) localStorage.setItem('userFoto', updatedData.foto);

            toggleModal(false);
            loadProfileData(); // Recarregar dados

        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            showNotification(error.message || 'Erro ao atualizar perfil', 'error');
        }
    });

    // Função para mostrar notificações
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Carregar dados iniciais
    loadProfileData();
});