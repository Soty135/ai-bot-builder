import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchBot } from '../api/bots';
import BotConfigPanel from '../components/BotConfigPanel';
import ChatPanel from '../components/ChatPanel';

export default function BotBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bot, setBot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchBot(id)
      .then(setBot)
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="typing-dot" /><div className="typing-dot ml-1" /><div className="typing-dot ml-1" />
      </div>
    );
  }

  if (!bot) return null;

  return (
    <main className="h-full flex flex-col min-h-0">
      <div className="md:hidden flex border-b border-outline-variant bg-surface-container shrink-0">
        <button
          onClick={() => setActiveTab('config')}
          className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'config'
              ? 'text-primary border-b-2 border-primary'
              : 'text-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">settings_suggest</span>
          Config
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'chat'
              ? 'text-primary border-b-2 border-primary'
              : 'text-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">chat</span>
          Chat
        </button>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2">
        <div className={`${activeTab === 'config' ? 'block' : 'hidden'} md:block h-full`}>
          <BotConfigPanel botId={id} botName={bot.name} />
        </div>
        <div className={`${activeTab === 'chat' ? 'block' : 'hidden'} md:block h-full`}>
          <ChatPanel botId={id} botName={bot.name} />
        </div>
      </div>
    </main>
  );
}
