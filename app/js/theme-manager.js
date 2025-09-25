/* ===== SISTEMA DE TEMA PRETTY NAILS ===== */

class ThemeManager {
    constructor() {
        this.storageKey = 'pretty-nails-theme';
        this.currentTheme = this.getStoredTheme();
        this.init();
    }

    init() {
        // Aplicar tema armazenado ou padrão
        this.applyTheme(this.currentTheme);
        
        // Escutar mudanças na preferência do sistema
        this.listenToSystemChanges();
        
        console.log('🎨 ThemeManager iniciado - Tema atual:', this.currentTheme);
    }

    getStoredTheme() {
        const stored = localStorage.getItem(this.storageKey);
        if (stored && ['light', 'dark', 'auto'].includes(stored)) {
            return stored;
        }
        
        // Detectar preferência do sistema como fallback
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    applyTheme(theme) {
        let finalTheme = theme;
        
        // Se for 'auto', detectar preferência do sistema
        if (theme === 'auto') {
            finalTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        
        // Aplicar no HTML
        document.documentElement.setAttribute('data-theme', finalTheme);
        
        // Salvar no localStorage
        localStorage.setItem(this.storageKey, theme);
        
        this.currentTheme = theme;
        this.currentActiveTheme = finalTheme; // tema realmente aplicado
        
        // Disparar evento customizado para outros componentes
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { 
                theme: theme,
                activeTheme: finalTheme
            } 
        }));
        
        // Atualizar interface automaticamente
        this.updateUIElements(theme);
        
        console.log('🎨 Tema aplicado:', { selected: theme, active: finalTheme });
    }

    setTheme(theme) {
        if (!['light', 'dark', 'auto'].includes(theme)) {
            console.warn('❌ Tema inválido:', theme);
            return false;
        }
        
        this.applyTheme(theme);
        return true;
    }

    toggleTheme() {
        const newTheme = this.currentActiveTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }

    getTheme() {
        return this.currentTheme;
    }

    getActiveTheme() {
        return this.currentActiveTheme;
    }

    listenToSystemChanges() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            // Só reagir se estiver em modo 'auto'
            if (this.currentTheme === 'auto') {
                this.applyTheme('auto');
            }
        });
    }

    // Método para integração com outros componentes
    onThemeChange(callback) {
        window.addEventListener('themeChanged', callback);
        return () => window.removeEventListener('themeChanged', callback);
    }

    // Método para atualizar elementos da UI automaticamente
    updateUIElements(theme) {
        // Atualizar texto do tema se existir
        const themeTextElement = document.getElementById('current-theme-text');
        if (themeTextElement) {
            let themeLabel;
            switch(theme) {
                case 'light':
                    themeLabel = 'Claro';
                    break;
                case 'dark':
                    themeLabel = 'Escuro';
                    break;
                case 'auto':
                    themeLabel = 'Automático';
                    break;
                default:
                    themeLabel = 'Claro';
            }
            themeTextElement.textContent = themeLabel;
        }

        // Atualizar select se existir
        const themeSelector = document.getElementById('theme-selector');
        if (themeSelector) {
            themeSelector.value = theme;
        }
    }
}

// Função utilitária para inicializar o tema em qualquer página
function initTheme() {
    if (!window.themeManager) {
        window.themeManager = new ThemeManager();
    }
    return window.themeManager;
}

// Função para criar o seletor de tema (usado nas configurações)
function createThemeSelector(containerId, currentTheme = null) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('❌ Container não encontrado:', containerId);
        return null;
    }

    const themeManager = window.themeManager || initTheme();
    const selectedTheme = currentTheme || themeManager.getTheme();

    const themeSection = document.createElement('div');
    themeSection.className = 'config-section theme-section';
    themeSection.innerHTML = `
        <h2><i class="fas fa-palette"></i> Aparência</h2>
        
        <div class="config-item theme-selector-item">
            <div class="config-item-left">
                <i class="fas fa-moon"></i>
                <span>Tema do Aplicativo</span>
            </div>
            <div class="config-item-right">
                <select id="theme-selector" class="theme-select">
                    <option value="light" ${selectedTheme === 'light' ? 'selected' : ''}>
                        🌞 Claro
                    </option>
                    <option value="dark" ${selectedTheme === 'dark' ? 'selected' : ''}>
                        🌙 Escuro
                    </option>
                    <option value="auto" ${selectedTheme === 'auto' ? 'selected' : ''}>
                        🔄 Automático
                    </option>
                </select>
            </div>
        </div>
    `;

    container.appendChild(themeSection);

    // Adicionar event listener
    const selector = document.getElementById('theme-selector');
    selector.addEventListener('change', (e) => {
        const newTheme = e.target.value;
        themeManager.setTheme(newTheme);
        
        // Feedback visual
        showThemeFeedback(newTheme);
    });

    return selector;
}

// Função para mostrar feedback de mudança de tema
function showThemeFeedback(theme) {
    const feedback = document.createElement('div');
    feedback.className = 'theme-feedback';
    
    let emoji = '🎨';
    let text = '';
    
    switch(theme) {
        case 'light':
            emoji = '🌞';
            text = 'Tema claro ativado!';
            break;
        case 'dark':
            emoji = '🌙';
            text = 'Tema escuro ativado!';
            break;
        case 'auto':
            emoji = '🔄';
            text = 'Tema automático ativado!';
            break;
    }
    
    feedback.innerHTML = `${emoji} ${text}`;
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary);
        color: var(--text-inverse);
        padding: 12px 20px;
        border-radius: var(--radius-sm);
        box-shadow: var(--shadow-lg);
        z-index: 9999;
        font-weight: 500;
        animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
        pointer-events: none;
    `;

    document.body.appendChild(feedback);

    // Remover após 3 segundos
    setTimeout(() => {
        feedback.remove();
    }, 3000);
}

// CSS para animações do feedback
const feedbackStyles = document.createElement('style');
feedbackStyles.textContent = `
@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes fadeOut {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
        transform: translateX(100%);
    }
}

.theme-select {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    padding: 8px 12px;
    font-family: inherit;
    cursor: pointer;
    min-width: 140px;
}

.theme-select:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.25);
}

.theme-section {
    margin-bottom: 20px;
}

.theme-selector-item {
    align-items: center;
}

.config-item-right {
    margin-left: auto;
}
`;

document.head.appendChild(feedbackStyles);

// Auto-inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
});

// Exportar para uso global
window.ThemeManager = ThemeManager;
window.initTheme = initTheme;
window.createThemeSelector = createThemeSelector;