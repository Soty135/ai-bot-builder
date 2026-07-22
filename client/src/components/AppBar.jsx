import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBots } from '../hooks/useBots';
import { fetchSessions } from '../api/sessions';
import NotificationDropdown from './NotificationDropdown';
import toast from 'react-hot-toast';

export default function AppBar({ onMenuToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { bots, publish } = useBots();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [publishResult, setPublishResult] = useState(null);

  useEffect(() => {
    fetchSessions().then(setSessions).catch(() => {});
  }, []);

  const activeBotId = location.pathname.startsWith('/bot/')
    ? parseInt(location.pathname.split('/bot/')[1])
    : null;

  const activeBot = bots.find((b) => b.id === activeBotId);

  const handlePublish = async () => {
    if (!activeBotId) {
      toast.error('Navigate to a bot first to publish it');
      return;
    }
    try {
      const result = await publish(activeBotId);
      setPublishResult(result);
    } catch {
      toast.error('Failed to publish');
    }
  };

  const handleCopyEmbed = () => {
    if (publishResult?.embedCode) {
      navigator.clipboard.writeText(publishResult.embedCode);
      toast.success('Embed code copied!');
      setPublishResult(null);
    }
  };

  const filteredBots = searchQuery
    ? bots.filter((b) => b.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <>
      <header className="fixed top-0 right-0 left-0 md:left-[320px] h-16 bg-surface-container-high border-b border-outline-variant shadow-sm flex justify-between items-center px-4 md:px-8 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 -ml-2 rounded-lg hover:bg-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <span className="text-lg md:text-2xl font-black text-primary">Bot Builder</span>
          {activeBot && (
            <span className="text-sm text-on-surface-variant hidden lg:inline">/ {activeBot.name}</span>
          )}
          <nav className="hidden lg:flex items-center gap-8 ml-8">
            <a className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-all" href="https://console.groq.com/docs" target="_blank" rel="noreferrer">Docs</a>
            <a className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-all" href="https://github.com" target="_blank" rel="noreferrer">Community</a>
            <a className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-all" href="https://groq.com/support" target="_blank" rel="noreferrer">Support</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-surface-container-lowest px-4 py-2 rounded-full border border-outline-variant relative">
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-sm w-40 placeholder:text-outline outline-none"
              placeholder="Search bots..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && filteredBots.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-high rounded-xl border border-outline-variant shadow-xl overflow-hidden z-50">
                {filteredBots.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => { navigate(`/bot/${b.id}`); setSearchQuery(''); }}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-surface-variant transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px] text-primary">smart_toy</span>
                    {b.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handlePublish}
            className="bg-primary text-on-primary px-3 md:px-5 py-2 rounded-full font-bold text-sm active:opacity-80 transition-opacity flex items-center justify-center"
          >
            <span className="hidden sm:inline">Publish Bot</span>
            <span className="sm:hidden material-symbols-outlined text-[18px]">upload</span>
          </button>
          <div className="flex items-center gap-3 text-on-surface-variant relative">
            <button
              onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
              className="hover:text-on-surface transition-colors relative"
            >
              <span className="material-symbols-outlined">notifications</span>
              {sessions.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
              )}
            </button>
            <button
              onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
              className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center border border-outline-variant cursor-pointer hover:border-primary/50 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">person</span>
            </button>
          </div>
        </div>
      </header>

      {showNotifications && (
        <NotificationDropdown sessions={sessions} onClose={() => setShowNotifications(false)} />
      )}

      {showProfile && (
        <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)}>
          <div className="absolute top-16 right-4 md:right-8 w-48 bg-surface-container-high rounded-xl border border-outline-variant shadow-2xl overflow-hidden animate-fade-in">
            <button
              onClick={() => { navigate('/settings'); setShowProfile(false); }}
              className="w-full text-left px-4 py-3 text-sm hover:bg-surface-variant transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">settings</span>
              Settings
            </button>
            <button
              onClick={() => { toast.success('Logged out (demo mode)'); setShowProfile(false); }}
              className="w-full text-left px-4 py-3 text-sm hover:bg-surface-variant transition-colors flex items-center gap-2 text-error"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              Logout
            </button>
          </div>
        </div>
      )}

      {publishResult && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setPublishResult(null)}>
          <div className="bg-surface-container-high rounded-2xl p-6 max-w-lg w-full mx-4 border border-outline-variant shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-2">Bot Published!</h3>
            <p className="text-sm text-on-surface-variant mb-4">Copy this embed code into your website's HTML.</p>
            <div className="bg-surface-container-lowest rounded-lg p-4 border border-outline-variant mb-4">
              <pre className="text-xs text-on-surface font-code-sm overflow-x-auto whitespace-pre-wrap">{publishResult.embedCode}</pre>
            </div>
            <button onClick={handleCopyEmbed} className="w-full py-3 rounded-xl font-bold bg-primary text-on-primary flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all">
              <span className="material-symbols-outlined">content_copy</span>
              Copy Embed Code
            </button>
          </div>
        </div>
      )}
    </>
  );
}
