// n8n Chat Widget - v1.0.2
(function () {
    const styles = `
        /* ========================================
           CSS CUSTOM PROPERTIES (VARIABLES)
           Define color scheme and theming
           ======================================== */
        .n8n-chat-widget { 
            --chat--color-primary: var(--n8n-chat-primary-color, #854fff);
            --chat--color-secondary: var(--n8n-chat-secondary-color, #6b3fd4);
            --chat--color-background: var(--n8n-chat-background-color, #ffffff);
            --chat--color-font: var(--n8n-chat-font-color, #141414);
            font-family: 'Inter', sans-serif;
        }

        /* ========================================
           CHAT CONTAINER - Main chat window
           Desktop: Fixed position, bottom-right
           Mobile: Centered with margins
           ======================================== */
        .n8n-chat-widget .chat-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 2147483632;
            display: none;
            width: 380px;
            height: 600px;
            max-height: calc(100vh - 40px);
            background: var(--chat--color-background);
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
            border: 1px solid #e0e0e0;
            overflow: hidden;
            font-family: inherit;
            flex-direction: column;
        }

        /* Position variant: Left side */
        .n8n-chat-widget .chat-container.position-left { 
            right: auto; 
            left: 20px; 
        }

        /* Open state: Show chat container */
        .n8n-chat-widget .chat-container.open { 
            display: flex; 
        }

        /* ========================================
           BRAND HEADER - Top bar with logo/name
           ======================================== */
        .n8n-chat-widget .brand-header {
            display: flex;
            align-items: center;
            padding: 16px 24px 16px 16px;
            background: white;
            border-bottom: 1px solid #e0e0e0;
            gap: 12px;
            position: relative;
            z-index: 1;
        }

        .n8n-chat-widget .brand-header img { 
            width: 32px; 
            height: 32px; 
        }

        .n8n-chat-widget .brand-header span {
            font-size: 18px;
            font-weight: 500;
            color: var(--chat--color-font);
            flex-grow: 1;
        }

        .n8n-chat-widget .header-actions {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        /* Common style for header buttons */
        .n8n-chat-widget .new-chat-button {
            background: none;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            padding: 4px 8px;
            font-size: 12px;
            color: #666;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 4px;
            white-space: nowrap;
        }

        .n8n-chat-widget .new-chat-button:hover {
            background: #f5f5f5;
            color: var(--chat--color-primary);
            border-color: var(--chat--color-primary);
        }

        .n8n-chat-widget .close-button {
            background: none;
            border: none;
            font-size: 24px;
            color: #999;
            cursor: pointer;
            padding: 0;
            line-height: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s;
        }

        .n8n-chat-widget .close-button:hover { 
            color: #333;
        }

        /* ========================================
           WELCOME SCREEN - Entry point
           ======================================== */
        .n8n-chat-widget .new-conversation {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px;
            text-align: center;
            width: 100%;
            max-width: 300px;
            z-index: 2;
        }

        .n8n-chat-widget .welcome-text {
            font-size: 24px;
            font-weight: 600;
            color: var(--chat--color-font);
            margin-bottom: 24px;
            line-height: 1.3;
        }

        .n8n-chat-widget .new-chat-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            padding: 16px 24px;
            background: var(--chat--color-secondary);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            transition: transform 0.3s;
            font-weight: 500;
            font-family: inherit;
            margin-bottom: 12px;
        }

        .n8n-chat-widget .new-chat-btn:hover {
            transform: scale(1.02);
        }

        .n8n-chat-widget .message-icon {
            width: 20px;
            height: 20px;
        }

        .n8n-chat-widget .response-text {
            font-size: 14px;
            color: var(--chat--color-font);
            opacity: 0.7;
            margin: 0;
        }

        /* ========================================
           CHAT INTERFACE - Active messages area
           ======================================== */
        .n8n-chat-widget .chat-interface { 
            display: none; 
            flex-direction: column; 
            flex: 1;
            min-height: 0;
            position: relative; 
        }

        .n8n-chat-widget .chat-interface.active { 
            display: flex; 
        }

        .n8n-chat-widget .chat-messages { 
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: var(--chat--color-background);
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
        }

        /* ========================================
           CHAT MESSAGES - Individual bubbles
           ======================================== */
        .n8n-chat-widget .chat-message { 
            padding: 12px 16px; 
            margin: 8px 0; 
            border-radius: 12px; 
            max-width: 80%; 
            word-wrap: break-word; 
            font-size: 14px; 
            line-height: 1.6; 
        }

        .n8n-chat-widget .chat-message p {
            font-size: 14px;
            margin: 0;
        }

        /* User messages: Right aligned */
        .n8n-chat-widget .chat-message.user { 
            background: var(--chat--color-secondary); 
            color: white; 
            align-self: flex-end; 
            border: none; 
        }

        /* Bot messages: Left aligned */
        .n8n-chat-widget .chat-message.bot { 
            background: #f5f5f5; 
            border: 1px solid #e0e0e0; 
            color: var(--chat--color-font); 
            align-self: flex-start; 
        }
        
        /* Message formatting: Paragraphs and Lists */
        .n8n-chat-widget .chat-message.bot p { 
            margin: 0 0 12px 0; 
            line-height: 1.6; 
        }
        .n8n-chat-widget .chat-message.bot p:last-child { 
            margin-bottom: 0; 
        }
        .n8n-chat-widget .chat-message.bot ul, .n8n-chat-widget .chat-message.bot ol { 
            margin: 8px 0 12px 0; 
            padding-left: 24px; 
        }
        .n8n-chat-widget .chat-message.bot ul:last-child, .n8n-chat-widget .chat-message.bot ol:last-child { 
            margin-bottom: 0; 
        }
        .n8n-chat-widget .chat-message.bot li { 
            margin: 4px 0; 
            line-height: 1.5; 
        }
        .n8n-chat-widget .chat-message.bot ul { 
            list-style-type: disc; 
        }
        .n8n-chat-widget .chat-message.bot ol { 
            list-style-type: decimal; 
        }
        
        /* Links in chat messages */
        .n8n-chat-widget .chat-messages a {
            color: #08ACF2;
            text-decoration: underline;
            pointer-events: auto;
        }

        /* ========================================
           CHAT INPUT - Message text area
           ======================================== */
        .n8n-chat-widget .chat-input { 
            padding: 16px;
            background: var(--chat--color-background);
            border-top: 1px solid #e0e0e0;
            display: flex; 
            gap: 8px;
            z-index: 2;
        }

        .n8n-chat-widget .chat-input textarea {
            flex: 1;
            padding: 12px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            background: var(--chat--color-background);
            color: var(--chat--color-font);
            resize: none;
            font-family: inherit;
            font-size: 14px;
            min-height: 48px;
        }

        .n8n-chat-widget .chat-input button {
            background: var(--chat--color-secondary);
            color: white; 
            border: none; 
            border-radius: 8px; 
            padding: 0 20px; 
            cursor: pointer; 
            font-family: inherit; 
            font-weight: 500;
        }

        /* ========================================
           CHAT TOGGLE BUTTON - Floating icon
           ======================================== */
        .n8n-chat-widget .chat-toggle {
            position: fixed; 
            bottom: 15px; 
            right: 15px; 
            width: 45px; 
            height: 45px; 
            border-radius: 50%;
            background: var(--chat--color-secondary); 
            color: white; 
            border: none;
            cursor: pointer; 
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); 
            z-index: 999; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            overflow: hidden;
            transition: width 0.3s ease, border-radius 0.3s ease;
            padding: 0;
        }

        .n8n-chat-widget .chat-toggle .sign { 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            transition: all 0.3s ease; 
            flex-shrink: 0; 
        }
        .n8n-chat-widget .chat-toggle svg { 
            width: 20px; 
            height: 20px; 
            fill: currentColor; 
        }
        .n8n-chat-widget .chat-toggle .text { 
            opacity: 0; 
            max-width: 0; 
            color: white; 
            font-size: 16px; 
            font-weight: 500;
            white-space: nowrap; 
            transition: all 0.3s ease; 
            overflow: hidden; 
            margin-left: 0; 
        }

        .n8n-chat-widget .chat-toggle:hover { 
            width: 200px; 
            border-radius: 30px; 
        }
        .n8n-chat-widget .chat-toggle:hover .text { 
            opacity: 1; 
            max-width: 130px; 
            margin-left: 10px; 
        }
        .n8n-chat-widget .chat-toggle.hidden { 
            opacity: 0; 
            visibility: hidden; 
            pointer-events: none; 
        }

        /* ========================================
           CHAT FOOTER - Powered by
           ======================================== */
        .n8n-chat-widget .chat-footer { 
            padding: 8px; 
            text-align: center; 
            background: var(--chat--color-background); 
            border-top: 1px solid #e0e0e0; 
        }

        .n8n-chat-widget .chat-footer a { 
            color: #333333; 
            text-decoration: none; 
            font-size: 12px; 
            opacity: 0.8; 
        }
        
        /* ========================================
           MOBILE RESPONSIVE STYLES
           ======================================== */
        @media (max-width: 640px) {
            .n8n-chat-widget .chat-container { 
                width: auto; 
                height: 85vh; /* Match desktop height on mobile */
                max-height: 85vh; 
                right: 20px; 
                left: 20px; 
                bottom: 20px; /* Reduced from 80dp to prevent pushing up */
            }
        }
    `;


    // Load Fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    document.head.appendChild(fontLink);

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    const defaultConfig = {
        webhook: { url: '', route: '' },
        branding: {
            logo: '', name: '',
            welcomeText: '',
            responseTimeText: '',
            poweredBy: { text: 'Powered by n8n', link: 'https://n8n.partnerlinks.io/m8a94i19zhqq?utm_source=nocodecreative.io' }
        },
        style: { primaryColor: '', secondaryColor: '', position: 'right', backgroundColor: '#ffffff', fontColor: '#141414' }
    };

    const config = window.ChatWidgetConfig ? {
        webhook: { ...defaultConfig.webhook, ...window.ChatWidgetConfig.webhook },
        branding: { ...defaultConfig.branding, ...window.ChatWidgetConfig.branding },
        style: { ...defaultConfig.style, ...window.ChatWidgetConfig.style }
    } : defaultConfig;

    if (window.N8NChatWidgetInitialized) return;
    window.N8NChatWidgetInitialized = true;

    let currentSessionId = '';
    let chatMessages = [];

    const STORAGE_KEYS = {
        SESSION_ID: 'n8n-chat-session-id',
        MESSAGES: 'n8n-chat-messages',
        IS_OPEN: 'n8n-chat-is-open',
        LAST_ACTIVITY: 'n8n-chat-last-activity'
    };

    function saveSession() {
        if (currentSessionId) {
            localStorage.setItem(STORAGE_KEYS.SESSION_ID, currentSessionId);
            localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(chatMessages.filter(m => m.text !== 'Typing..')));
            localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString());
        }
        localStorage.setItem(STORAGE_KEYS.IS_OPEN, chatContainer.classList.contains('open'));
    }

    function clearSessionData() {
        Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
        currentSessionId = '';
        chatMessages = [];
        messagesContainer.innerHTML = '';
        chatInterface.classList.remove('active');
        const welcomeScreen = chatContainer.querySelector('.new-conversation');
        if (welcomeScreen) welcomeScreen.style.display = 'block';
    }

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'n8n-chat-widget';
    if (config.style.primaryColor) widgetContainer.style.setProperty('--chat--color-primary', config.style.primaryColor);
    if (config.style.secondaryColor) widgetContainer.style.setProperty('--chat--color-secondary', config.style.secondaryColor);
    if (config.style.backgroundColor) widgetContainer.style.setProperty('--chat--color-background', config.style.backgroundColor);
    if (config.style.fontColor) widgetContainer.style.setProperty('--chat--color-font', config.style.fontColor);

    const chatContainer = document.createElement('div');
    chatContainer.className = 'chat-container' + (config.style.position === 'left' ? ' position-left' : '');

    const welcomeHTML = `
        <div class="new-conversation">
            <h2 class="welcome-text">${config.branding.welcomeText}</h2>
            <button class="new-chat-btn">
                <svg class="message-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/>
                </svg>
                Send us a message
            </button>
            <p class="response-text">${config.branding.responseTimeText}</p>
        </div>
    `;

    const headerHTML = `
        <div class="brand-header">
            <img src="${config.branding.logo}" alt="${config.branding.name}">
            <span>${config.branding.name}</span>
            <div class="header-actions">
                <button class="new-chat-button" title="Start New Chat">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>
                    New
                </button>
                <button class="close-button">&times;</button>
            </div>
        </div>
    `;

    const interfaceHTML = `
        <div class="chat-interface">
            <div class="chat-messages"></div>
            <div class="chat-input">
                <textarea placeholder="Type here..." rows="1"></textarea>
                <button type="submit">Send</button>
            </div>
            <div class="chat-footer">
                <a href="${config.branding.poweredBy.link}" target="_blank" rel="noopener noreferrer">${config.branding.poweredBy.text}</a>
            </div>
        </div>
    `;

    chatContainer.innerHTML = headerHTML + welcomeHTML + interfaceHTML;
    widgetContainer.appendChild(chatContainer);
    document.body.appendChild(widgetContainer);

    const toggleButton = document.createElement('button');
    toggleButton.className = 'chat-toggle' + (config.style.position === 'left' ? ' position-left' : '');
    toggleButton.innerHTML = `
        <div class="sign"><svg viewBox="0 0 16 16" fill="currentColor"><path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/></svg></div>
        <div class="text">Chat with Sade</div>`;
    widgetContainer.appendChild(toggleButton);

    const chatInterface = chatContainer.querySelector('.chat-interface');
    const messagesContainer = chatContainer.querySelector('.chat-messages');
    const textarea = chatContainer.querySelector('textarea');
    const sendButton = chatContainer.querySelector('button[type="submit"]');

    function formatBotMessage(text) {
        if (!text) return '';
        const escapeHtml = (str) => { const div = document.createElement('div'); div.textContent = str; return div.innerHTML; };
        let normalized = text.replace(/(\S)\s+(\d+)[.)]\s+/g, '$1\n$2. ').replace(/(\S)\s+([-*•])\s+/g, '$1\n$2 ');
        let lines = normalized.split('\n').map(l => l.trim()).filter(l => l);
        let html = '';
        let inList = false;
        let listType = null;
        let listItems = [];

        const flushList = () => {
            if (inList && listItems.length > 0) {
                html += listType === 'ol' ? `<ol>${listItems.map(i => `<li>${i}</li>`).join('')}</ol>` : `<ul>${listItems.map(i => `<li>${i}</li>`).join('')}</ul>`;
                inList = false; listItems = []; listType = null;
            }
        };

        lines.forEach(line => {
            const numberedMatch = line.match(/^(\d+)[.)]\s+(.+)/);
            if (numberedMatch) {
                if (!inList || listType !== 'ol') { flushList(); inList = true; listType = 'ol'; }
                listItems.push(escapeHtml(numberedMatch[2]));
            } else {
                const bulletMatch = line.match(/^[-*•]\s+(.+)/);
                if (bulletMatch) {
                    if (!inList || listType !== 'ul') { flushList(); inList = true; listType = 'ul'; }
                    listItems.push(escapeHtml(bulletMatch[1]));
                } else {
                    flushList(); html += `<p>${escapeHtml(line)}</p>`;
                }
            }
        });
        flushList();
        return html;
    }

    const urlRegex = /(https?:\/\/[^\s<]+)/g;
    function linkify(container) {
        const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);

        var match;
        nodes.forEach(node => {
            if (node.parentNode?.closest('a')) return;
            const text = node.textContent;
            if (!urlRegex.test(text)) return;
            const frag = document.createDocumentFragment();
            let lastIdx = 0;
            urlRegex.lastIndex = 0;
            while ((match = urlRegex.exec(text)) !== null) {
                if (match.index > lastIdx) frag.appendChild(document.createTextNode(text.slice(lastIdx, match.index)));
                const a = document.createElement('a'); a.href = match[0]; a.textContent = match[0]; a.target = '_blank'; a.rel = 'noreferrer noopener';
                frag.appendChild(a);
                lastIdx = match.index + match[0].length;
            }
            frag.appendChild(document.createTextNode(text.slice(lastIdx)));
            node.parentNode.replaceChild(frag, node);
        });
    }

    function appendMessage(text, role, options = {}) {
        chatMessages.push({ text, role, options });
        const div = document.createElement('div');
        div.className = 'chat-message ' + role;
        if (options.formatText) {
            div.innerHTML = formatBotMessage(text);
            linkify(div);
        } else {
            div.textContent = text;
            linkify(div);
        }
        messagesContainer.appendChild(div);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        saveSession();
        return div;
    }

    function enterChatInterface() {
        chatInterface.classList.add('active');
        const welcome = chatContainer.querySelector('.new-conversation');
        if (welcome) welcome.style.display = 'none';
        setTimeout(() => textarea.focus(), 100);
    }

    async function startNewConversation() {
        enterChatInterface();

        currentSessionId = crypto.randomUUID();
        messagesContainer.innerHTML = '';
        chatMessages = [];
        textarea.value = '';

        appendMessage("Hi, I'm Sade, your digital assistant. How may I assist you today?", 'bot');

        if (!config.webhook.url) return;

        try {
            const res = await fetch(config.webhook.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'loadPreviousSession', sessionId: currentSessionId, route: config.webhook.route })
            });
            const data = await res.json();
            const text = Array.isArray(data) ? data[0]?.output : data?.output;
            if (text) appendMessage(text, 'bot', { formatText: true });
        } catch (e) {
            console.error('[N8N Chat Widget] Initialization Error:', e);
            appendMessage("I'm having trouble starting a new chat. Please try again or type your question below.", 'bot');
        }
    }

    async function sendMessage(text) {
        const cleanText = text.trim();
        if (!cleanText) return;
        if (!currentSessionId) await startNewConversation();

        appendMessage(cleanText, 'user');
        textarea.value = '';
        const placeholder = appendMessage('Typing..', 'bot');

        try {
            const res = await fetch(config.webhook.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'sendMessage', sessionId: currentSessionId, route: config.webhook.route, chatInput: cleanText })
            });

            if (!res.ok) {
                throw new Error(`Server responded with status: ${res.status}`);
            }

            const data = await res.json();
            const botText = Array.isArray(data) ? data[0]?.output : data?.output;
            const finalBotText = botText || "I'm sorry, something went wrong.";
            placeholder.innerHTML = formatBotMessage(finalBotText);
            linkify(placeholder);
            const msgIdx = chatMessages.findIndex(m => m.text === 'Typing..');
            if (msgIdx !== -1) chatMessages[msgIdx] = { text: finalBotText, role: 'bot', options: { formatText: true } };
            saveSession();
        } catch (e) {
            console.error('[N8N Chat Widget] Send Message Error:', e);
            if (e.name === 'TypeError' && e.message === 'Failed to fetch') {
                placeholder.textContent = "I'm having trouble connecting to my knowledge base. Please check your connection and try again.";
            } else {
                placeholder.textContent = "I'm sorry, I encountered an error. Please try again.";
            }
        }
    }

    toggleButton.addEventListener('click', () => {
        chatContainer.classList.toggle('open');
        toggleButton.classList.toggle('hidden', chatContainer.classList.contains('open'));
        saveSession();
    });

    chatContainer.querySelectorAll('.close-button').forEach(b => b.addEventListener('click', () => {
        chatContainer.classList.remove('open');
        toggleButton.classList.remove('hidden');
        saveSession();
    }));

    chatContainer.querySelector('.new-chat-btn').addEventListener('click', () => {
        if (currentSessionId && chatMessages.length > 0) {
            enterChatInterface();
        } else {
            startNewConversation();
        }
    });
    chatContainer.querySelector('.new-chat-button').addEventListener('click', () => {
        if (confirm('Start a new chat? This will clear your current chat history.')) clearSessionData();
    });

    sendButton.addEventListener('click', () => sendMessage(textarea.value));
    textarea.addEventListener('keypress', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(textarea.value); } });

    (function loadSession() {
        const sid = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
        const msgs = localStorage.getItem(STORAGE_KEYS.MESSAGES);
        const open = localStorage.getItem(STORAGE_KEYS.IS_OPEN);
        const lastActivity = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY);

        if (lastActivity && Date.now() - parseInt(lastActivity) > 5 * 60 * 1000) {
            clearSessionData();
            return;
        }

        if (sid) {
            currentSessionId = sid;
            // Removed auto-activation of chat interface to prioritize Welcome Screen on fresh load
        }
        if (msgs) {
            chatMessages = JSON.parse(msgs);
            chatMessages.forEach(m => {
                const div = document.createElement('div');
                div.className = 'chat-message ' + m.role;
                if (m.options?.formatText) div.innerHTML = formatBotMessage(m.text);
                else div.textContent = m.text;
                linkify(div);
                messagesContainer.appendChild(div);
            });
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
        if (open === 'true') {
            chatContainer.classList.add('open');
            toggleButton.classList.add('hidden');
        }
    })();

    window.N8NChatWidget = {
        open: () => { chatContainer.classList.add('open'); toggleButton.classList.add('hidden'); saveSession(); },
        close: () => { chatContainer.classList.remove('open'); toggleButton.classList.remove('hidden'); saveSession(); },
        sendMessage: (msg) => sendMessage(String(msg))
    };
})();
