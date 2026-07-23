const express = require('express');
const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const botId = parseInt(req.params.id);

    const bot = await prisma.bot.findUnique({
      where: { id: botId },
      include: { config: true },
    });

    if (!bot) {
      return res.status(404).send('// Bot not found');
    }

    const businessName = bot.config?.businessName || 'Support';
    const SERVER_URL = process.env.RENDER_EXTERNAL_URL || `${req.protocol}://${req.get('host')}`;

    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', 'no-cache');
    res.send(`
(function() {
  if (window.__AIBotWidgetLoaded) return;
  window.__AIBotWidgetLoaded = true;

  var BOT_ID = ${botId};
  var SERVER_URL = '${SERVER_URL}';
  var BOT_NAME = ${JSON.stringify(businessName)};

  var shadowHost = document.createElement('div');
  shadowHost.id = 'ai-bot-widget-host';
  shadowHost.style.cssText = 'position:fixed;z-index:2147483647;bottom:0;right:0;pointer-events:none;';
  document.body.appendChild(shadowHost);
  var shadow = shadowHost.attachShadow({ mode: 'open' });

  var style = document.createElement('style');
  style.textContent = \`
    * { margin:0; padding:0; box-sizing:border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .widget-btn {
      position: fixed; bottom: 24px; right: 24px; width: 60px; height: 60px;
      border-radius: 50%; background: #1a73e8; border: none; cursor: pointer;
      box-shadow: 0 4px 16px rgba(26,115,232,0.4); display: flex;
      align-items: center; justify-content: center; transition: transform 0.2s, box-shadow 0.2s;
      pointer-events: auto;
    }
    .widget-btn:hover { transform: scale(1.1); box-shadow: 0 6px 24px rgba(26,115,232,0.5); }
    .widget-btn svg { width: 28px; height: 28px; fill: white; }
    .chat-panel {
      position: fixed; bottom: 96px; right: 24px; width: 380px; max-width: calc(100vw - 48px);
      height: 520px; max-height: calc(100vh - 140px); background: white;
      border-radius: 16px; box-shadow: 0 8px 40px rgba(0,0,0,0.18);
      display: none; flex-direction: column; overflow: hidden;
      border: 1px solid #e0e0e0; pointer-events: auto;
    }
    .chat-panel.open { display: flex; animation: slideUp 0.3s ease; }
    @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
    .chat-header {
      background: #1a73e8; color: white; padding: 16px 20px;
      display: flex; align-items: center; gap: 12px; flex-shrink: 0;
    }
    .chat-header-avatar {
      width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.2);
      display: flex; align-items: center; justify-content: center; font-size: 18px;
    }
    .chat-header-info h3 { font-size: 14px; font-weight: 600; }
    .chat-header-info span { font-size: 11px; opacity: 0.85; }
    .chat-header-close {
      margin-left: auto; background: none; border: none; color: white;
      cursor: pointer; font-size: 20px; padding: 4px; line-height: 1; opacity: 0.8;
    }
    .chat-header-close:hover { opacity: 1; }
    .chat-messages {
      flex: 1; overflow-y: auto; padding: 16px; display: flex;
      flex-direction: column; gap: 12px; background: #f8f9fa;
    }
    .msg { max-width: 80%; padding: 10px 14px; border-radius: 12px;
      font-size: 13px; line-height: 1.5; word-wrap: break-word; }
    .msg.user {
      align-self: flex-end; background: #1a73e8; color: white;
      border-bottom-right-radius: 4px;
    }
    .msg.bot {
      align-self: flex-start; background: white; color: #333;
      border: 1px solid #e0e0e0; border-bottom-left-radius: 4px;
    }
    .typing-dots { display: flex; gap: 4px; padding: 4px 0; }
    .typing-dots span {
      width: 7px; height: 7px; background: #aaa; border-radius: 50%;
      animation: bounce 1.2s infinite;
    }
    .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
    .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes bounce { 0%,60%,100% { transform:translateY(0); } 30% { transform:translateY(-4px); } }
    .chat-input-area {
      padding: 12px 16px; border-top: 1px solid #e0e0e0;
      display: flex; gap: 8px; background: white; flex-shrink: 0;
    }
    .chat-input-area input {
      flex: 1; border: 1px solid #ddd; border-radius: 24px; padding: 10px 16px;
      font-size: 13px; outline: none; transition: border-color 0.2s;
    }
    .chat-input-area input:focus { border-color: #1a73e8; }
    .chat-input-area button {
      width: 40px; height: 40px; border-radius: 50%; background: #1a73e8;
      border: none; cursor: pointer; display: flex; align-items: center;
      justify-content: center; transition: background 0.2s; flex-shrink: 0;
    }
    .chat-input-area button:hover { background: #1557b0; }
    .chat-input-area button:disabled { background: #ccc; cursor: not-allowed; }
    .chat-input-area button svg { width: 18px; height: 18px; fill: white; }
    .chat-footer {
      text-align: center; padding: 6px; font-size: 10px; color: #aaa;
      background: white; flex-shrink: 0;
    }
  \`;
  shadow.appendChild(style);

  var btn = document.createElement('button');
  btn.className = 'widget-btn';
  btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/><path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/></svg>';
  shadow.appendChild(btn);

  var panel = document.createElement('div');
  panel.className = 'chat-panel';
  panel.innerHTML = \`
    <div class="chat-header">
      <div class="chat-header-avatar">\uD83E\uDD16</div>
      <div class="chat-header-info">
        <h3>\${BOT_NAME}</h3>
        <span>Online</span>
      </div>
      <button class="chat-header-close">\u00D7</button>
    </div>
    <div class="chat-messages"></div>
    <div class="chat-input-area">
      <input type="text" placeholder="Type a message..." />
      <button disabled>
        <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
      </button>
    </div>
    <div class="chat-footer">Powered by AI Bot Builder</div>
  \`;
  shadow.appendChild(panel);

  var messagesEl = panel.querySelector('.chat-messages');
  var inputEl = panel.querySelector('input');
  var sendBtn = panel.querySelector('.chat-input-area button');
  var closeBtn = panel.querySelector('.chat-header-close');
  var isOpen = false;
  var sessionId = 'widget-' + BOT_ID + '-' + Math.random().toString(36).substr(2, 9);
  var isSending = false;

  function togglePanel() {
    isOpen = !isOpen;
    panel.classList.toggle('open', isOpen);
    if (isOpen) inputEl.focus();
  }

  btn.addEventListener('click', togglePanel);
  closeBtn.addEventListener('click', togglePanel);

  inputEl.addEventListener('input', function() {
    sendBtn.disabled = !inputEl.value.trim() || isSending;
  });

  inputEl.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputEl.value.trim() && !isSending) sendMessage();
    }
  });

  sendBtn.addEventListener('click', function() {
    if (inputEl.value.trim() && !isSending) sendMessage();
  });

  function addMessage(text, role) {
    var div = document.createElement('div');
    div.className = 'msg ' + role;
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  function showTyping() {
    var div = document.createElement('div');
    div.className = 'msg bot';
    div.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  function sendMessage() {
    var text = inputEl.value.trim();
    if (!text || isSending) return;
    isSending = true;
    sendBtn.disabled = true;
    addMessage(text, 'user');
    inputEl.value = '';

    var typingEl = showTyping();

    fetch(SERVER_URL + '/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, sessionId: sessionId, botId: BOT_ID }),
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      typingEl.remove();
      addMessage(data.response || 'Sorry, something went wrong.', 'bot');
    })
    .catch(function() {
      typingEl.remove();
      addMessage('Sorry, I could not connect. Please try again later.', 'bot');
    })
    .finally(function() {
      isSending = false;
      sendBtn.disabled = !inputEl.value.trim();
    });
  }
})();
`);
  } catch (err) {
    console.error('Embed error:', err);
    res.status(500).send('// Internal error');
  }
});

module.exports = router;
