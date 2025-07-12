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
    const editPhone = document.getElementById('editPhone');
    const editCity = document.getElementById('editCity');
    const editState = document.getElementById('editState');
    const addTimeBtn = document.getElementById('addTimeBtn');
    const addServBtn = document.getElementById('addServBtn');
    const timeSlotsContainer = document.getElementById('timeSlotsContainer');
    const servSlotsContainer = document.getElementById('servSlotsContainer');
    const workDaysCheckbox = document.getElementById('workDaysCheckbox');

    // Verificar autenticação
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userType = localStorage.getItem('userType');

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

            // Preencher dados do modal
            editPhotoPreview.src = data.foto || 'imagens/user.png';
            editName.value = data.nome || '';
            editPhone.value = data.telefone || '';
            editCity.value = data.cidade || '';
            editState.value = data.estado || '';
            if (data.dias_trabalho && Array.isArray(data.dias_trabalho)) {
                document.querySelectorAll('input[name="workDay"]').forEach(checkbox => {
                    checkbox.checked = data.dias_trabalho.includes(parseInt(checkbox.value));
                });
            }

            // Dias de trabalho
            if (data.dias_trabalho && Array.isArray(data.dias_trabalho) && data.dias_trabalho.length > 0) {
                // Exemplo de nomes dos dias da semana (ajuste conforme necessário)
                const diasSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
                workDaysContainer.innerHTML = data.dias_trabalho
                    .map(dia => `<span class="hour">${diasSemana[dia]}</span>`)
                    .join('');
            } else {
                workDaysContainer.innerHTML = '<span class="work-day">Nenhum dia cadastrado</span>';
            }

            // Horários
            if (data.horarios && data.horarios.length > 0) {
                workHoursContainer.innerHTML = data.horarios
                    .map(h => `<span class="hour">${h}</span>`)
                    .join('');

                // Preencher horários no modal
                timeSlotsContainer.innerHTML = '';
                data.horarios.forEach(horario => {
                    addTimeSlot(horario);
                });
                // Adiciona o botão de adicionar horário
                const addTimeBtn = document.createElement('button');
                addTimeBtn.type = 'button';
                addTimeBtn.className = 'add-time-btn';
                addTimeBtn.id = 'addTimeBtn';
                addTimeBtn.innerHTML = '<i class="fas fa-plus"></i> Adicionar horário';
                addTimeBtn.addEventListener('click', () => addTimeSlot());
                timeSlotsContainer.appendChild(addTimeBtn);
            } else {
                workHoursContainer.innerHTML = '<span class="hour">Nenhum horário cadastrado</span>';
            }

            // Serviços oferecidos
            if (data.servicos && data.servicos.length > 0) {
                servicesList.innerHTML = data.servicos
                    .map(s => `<span class="service">${s.nome ? s.nome : s}${s.preco ? ` (R$${s.preco})` : ''}</span>`)
                    .join('');

                // Preencher serviços no modal
                servSlotsContainer.innerHTML = '';
                data.servicos.forEach(servico => {
                    addServSlot(servico.nome || servico, servico.preco);
                });
                // Adiciona o botão de adicionar serviço
                const addServBtn = document.createElement('button');
                addServBtn.type = 'button';
                addServBtn.className = 'add-serv-btn';
                addServBtn.id = 'addServBtn';
                addServBtn.innerHTML = '<i class="fas fa-plus"></i> Adicionar serviço';
                addServBtn.addEventListener('click', () => addServSlot());
                servSlotsContainer.appendChild(addServBtn);
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

    // Função para adicionar novo time-slot
    function addTimeSlot(horario = '') {
        const timeSlot = document.createElement('div');
        timeSlot.className = 'time-slot';
        timeSlot.innerHTML = `
        <input type="time" class="timeFrom" value="${horario}">
        <button type="button" class="remove-btn">
            <i class="fas fa-times"></i>
        </button>
    `;
        const addBtn = timeSlotsContainer.querySelector('.add-time-btn');
        timeSlotsContainer.insertBefore(timeSlot, addBtn);

        const removeBtn = timeSlot.querySelector('.remove-btn');
        removeBtn.addEventListener('click', () => {
            timeSlotsContainer.removeChild(timeSlot);
        });
    }

    // Função para adicionar novo serv-slot
    function addServSlot(nome = '', preco = '') {
        const servSlot = document.createElement('div');
        servSlot.className = 'serv-slot';
        servSlot.innerHTML = `
            <input type="text" class="servico" placeholder="Serviço" value="${nome}">
            <span>-</span>
            <input type="number" class="preco" placeholder="R$" value="${preco}">
            <button type="button" class="remove-btn">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Inserir antes do botão de adicionar
        const addBtn = servSlotsContainer.querySelector('.add-serv-btn');
        servSlotsContainer.insertBefore(servSlot, addBtn);

        // Adicionar evento para remover
        const removeBtn = servSlot.querySelector('.remove-btn');
        removeBtn.addEventListener('click', () => {
            servSlotsContainer.removeChild(servSlot);
        });
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

            // Horários
            const horarios = [];
            document.querySelectorAll('.time-slot').forEach(slot => {
                const horario = slot.querySelector('.timeFrom')?.value;
                if (horario) horarios.push(horario);
            });

            // Serviços
            const servicos = [];
            document.querySelectorAll('.serv-slot').forEach(slot => {
                const nome = slot.querySelector('.servico')?.value;
                const preco = slot.querySelector('.preco')?.value;
                if (nome) servicos.push({ nome, preco: preco || null });
            });

            // Foto (se mudou)
            let fotoUrl = editPhotoPreview.src;
            if (fotoUrl.startsWith('data:')) {
                // Se for uma nova imagem (data URL), enviar para o servidor
                const response = await fetch(`${API_BASE_URL}/upload`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ image: fotoUrl })
                });

                if (!response.ok) throw new Error('Erro ao enviar imagem');

                const data = await response.json();
                fotoUrl = data.url;
            }

            // Montar objeto com dados atualizados
            const profileData = {
                nome: editName.value,
                telefone: editPhone.value,
                cidade: editCity.value,
                estado: editState.value,
                dias_trabalho: diasTrabalho,
                horarios: horarios,
                servicos: servicos
            };

            if (fotoUrl && !fotoUrl.includes('imagens/user.png')) {
                profileData.foto = fotoUrl;
            }

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

    // Inicialização
    loadProfileData();

    // Adicionar eventos aos botões dinâmicos
    document.addEventListener('click', function (e) {
        if (e.target && e.target.id === 'addTimeBtn') {
            addTimeSlot();
        }
        if (e.target && e.target.id === 'addServBtn') {
            addServSlot();
        }
    });
});