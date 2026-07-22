import { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import TypingDots from './TypingDots';
import toast from 'react-hot-toast';

export default function ChatPanel({ botId, botName }) {
  const { messages, isLoading, send, clearChat } = useChat(botId);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    send(input);
    setInput('');
  };

  const handleAttach = () => {
    toast('File upload coming soon!', { icon: '📎' });
  };

  return (
    <section className="bg-surface-dim relative flex flex-col overflow-hidden h-full">
      <div className="glass-panel sticky top-0 z-20 px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
              <span className="material-symbols-outlined">smart_toy</span>
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary border-2 border-surface-container rounded-full" />
          </div>
          <div>
            <h3 className="text-sm font-bold">{botName || 'AI Assistant'}</h3>
            <span className="text-[11px] text-primary uppercase font-bold tracking-widest flex items-center gap-1">
              <span className="w-1 h-1 bg-primary rounded-full animate-pulse" />
              Online
            </span>
          </div>
        </div>
        <button
          className="text-on-surface-variant hover:text-error transition-colors flex items-center gap-2 text-sm font-medium"
          onClick={clearChat}
        >
          <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
          <span className="hidden md:inline">Clear Chat</span>
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6 flex flex-col relative z-10">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 max-w-[85%] animate-fade-in ${
              msg.role === 'user' ? 'self-end flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center mt-1 ${
                msg.role === 'user'
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'bg-surface-container-highest'
              }`}
            >
              <span
                className="material-symbols-outlined text-[16px]"
                style={msg.role === 'user' ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {msg.role === 'user' ? 'person' : 'smart_toy'}
              </span>
            </div>
            <div
              className={`p-4 rounded-2xl border shadow-sm ${
                msg.role === 'user'
                  ? 'bg-secondary-container/20 text-on-surface border-secondary-container/30 rounded-tr-none'
                  : 'bg-surface-container-high text-on-surface border-outline-variant rounded-tl-none'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 max-w-[85%] animate-fade-in">
            <div className="w-8 h-8 shrink-0 rounded-full bg-surface-container-highest flex items-center justify-center mt-1">
              <span className="material-symbols-outlined text-[16px]">smart_toy</span>
            </div>
            <div className="bg-surface-container-high p-4 rounded-2xl rounded-tl-none border border-outline-variant flex items-center shadow-sm">
              <TypingDots />
            </div>
          </div>
        )}

      </div>

      <div className="p-4 md:p-8 bg-surface-dim relative z-20">
        <form onSubmit={handleSubmit} className="glass-panel rounded-2xl flex items-center px-4 py-2 border border-outline-variant group focus-within:border-primary/50 transition-all">
          <button type="button" onClick={handleAttach} className="p-3 text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">attach_file</span>
          </button>
          <input
            className="flex-1 min-w-0 bg-transparent border-none focus:ring-0 text-on-surface text-sm px-3 outline-none"
            placeholder="Test your bot's knowledge..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center active:scale-90 transition-transform shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </form>
        <p className="text-center text-[10px] text-outline mt-3 uppercase font-bold tracking-widest">
          Powered by Groq + Llama 3.3 70B
        </p>
      </div>
    </section>
  );
}
