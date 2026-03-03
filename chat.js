document.addEventListener('DOMContentLoaded', () => {
    const chatApp = document.getElementById('chat-app');
    const threads = Array.from(document.querySelectorAll('.thread'));
    const backBtn = document.getElementById('chat-back');
    const clientName = document.getElementById('chat-client-name');
    const clientStatus = document.getElementById('chat-client-status');
    const clientAvatar = document.getElementById('chat-client-avatar');
    const chatBody = document.getElementById('chat-body');
    const composer = document.querySelector('.composer');
    const composerInput = composer ? composer.querySelector('input') : null;
    const contextToggleBtn = document.getElementById('chat-context-toggle');
    const contextCloseBtn = document.getElementById('context-close');
    const contextOverlay = document.getElementById('context-overlay');

    const isMobileChat = () => window.matchMedia('(max-width: 1140px)').matches;

    const threadMessages = {
        juliana: [
            { from: 'in', text: 'Oi, Carlos. Caiu a energia da cozinha e alguns cômodos. Consegue avaliar hoje?', time: '17:12' },
            { from: 'out', text: 'Consigo sim. Estou no Centro e tenho janela livre às 19h. Posso fazer diagnóstico e orçamento no local.', time: '17:14' },
            { from: 'in', text: 'Ótimo. Pode ser às 19h. Precisa de alguma informação antes?', time: '17:15' },
            { from: 'out', text: 'Se puder, envie foto do quadro elétrico e confirme o endereço. Já deixo o atendimento pré-agendado.', time: '17:16' }
        ],
        mercado: [
            { from: 'in', text: 'Perfeito, aprovado o orçamento.', time: '16:58' },
            { from: 'out', text: 'Excelente. Posso iniciar amanhã às 10h com equipe reduzida para não impactar a loja.', time: '17:01' },
            { from: 'in', text: 'Fechado. Vou deixar o acesso liberado no horário.', time: '17:03' }
        ],
        sonia: [
            { from: 'in', text: 'Enviei as fotos da instalação antiga.', time: 'ontem' },
            { from: 'out', text: 'Recebi. Com esse cenário, recomendo troca parcial e revisão do quadro para segurança.', time: 'ontem' },
            { from: 'in', text: 'Perfeito. Podemos agendar para quarta no final da tarde?', time: 'ontem' }
        ]
    };

    function appendMessage(message) {
        if (!chatBody) return;
        const bubble = document.createElement('div');
        bubble.className = `bubble bubble--${message.from}`;

        const text = document.createElement('p');
        text.textContent = message.text;
        bubble.appendChild(text);

        const time = document.createElement('span');
        time.textContent = message.time;
        bubble.appendChild(time);

        chatBody.appendChild(bubble);
    }

    function renderThread(threadId) {
        if (!chatBody) return;
        chatBody.innerHTML = '';
        const messages = threadMessages[threadId] || [];
        messages.forEach(appendMessage);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function openConversation() {
        if (!chatApp || !isMobileChat()) return;
        chatApp.classList.add('chat-app--conversation');
    }

    function closeConversation() {
        if (!chatApp) return;
        chatApp.classList.remove('chat-app--conversation');
    }

    function openContextPanel() {
        if (!isMobileChat()) return;
        document.body.classList.add('context-open');
        if (contextOverlay) contextOverlay.hidden = false;
        if (contextToggleBtn) contextToggleBtn.setAttribute('aria-expanded', 'true');
    }

    function closeContextPanel() {
        document.body.classList.remove('context-open');
        if (contextOverlay) contextOverlay.hidden = true;
        if (contextToggleBtn) contextToggleBtn.setAttribute('aria-expanded', 'false');
    }

    function setActiveThread(thread, shouldOpenConversation = false) {
        threads.forEach((item) => item.classList.remove('thread--active'));
        thread.classList.add('thread--active');

        const name = thread.dataset.client || 'Cliente';
        const status = thread.dataset.status || 'Online agora';
        const avatar = thread.dataset.avatar || '';
        const threadId = thread.dataset.threadId || 'juliana';

        if (clientName) clientName.textContent = name;
        if (clientStatus) clientStatus.textContent = status;
        if (clientAvatar && avatar) {
            clientAvatar.src = avatar;
            clientAvatar.alt = name;
        }

        renderThread(threadId);

        if (shouldOpenConversation) {
            openConversation();
        }
    }

    threads.forEach((thread) => {
        thread.addEventListener('click', () => setActiveThread(thread, true));
        thread.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setActiveThread(thread, true);
            }
        });
    });

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            closeContextPanel();
            closeConversation();
        });
    }

    if (contextToggleBtn) {
        contextToggleBtn.addEventListener('click', () => {
            if (document.body.classList.contains('context-open')) {
                closeContextPanel();
            } else {
                openContextPanel();
            }
        });
    }

    if (contextCloseBtn) {
        contextCloseBtn.addEventListener('click', closeContextPanel);
    }

    if (contextOverlay) {
        contextOverlay.addEventListener('click', closeContextPanel);
    }

    window.addEventListener('resize', () => {
        if (!isMobileChat()) {
            closeContextPanel();
            closeConversation();
        }
    }, { passive: true });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeContextPanel();
        }
    });

    if (composer && composerInput && chatBody) {
        composer.addEventListener('submit', (event) => {
            event.preventDefault();
            const value = composerInput.value.trim();
            if (!value) return;

            const now = new Date();
            const hh = String(now.getHours()).padStart(2, '0');
            const mm = String(now.getMinutes()).padStart(2, '0');
            appendMessage({ from: 'out', text: value, time: `${hh}:${mm}` });
            composerInput.value = '';
            chatBody.scrollTop = chatBody.scrollHeight;
        });
    }

    if (threads[0]) {
        setActiveThread(threads[0], false);
    }
});
