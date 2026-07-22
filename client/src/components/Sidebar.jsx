import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBots } from '../hooks/useBots';
import NameDialog from './NameDialog';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { icon: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { icon: 'smart_toy', label: 'Bot Builder', path: '/bot' },
  { icon: 'database', label: 'Knowledge Base', path: '/knowledge' },
  { icon: 'analytics', label: 'Analytics', path: '/analytics' },
  { icon: 'settings', label: 'Settings', path: '/settings' },
];

const BOTTOM_ITEMS = [
  { icon: 'help', label: 'Help', action: 'help' },
  { icon: 'logout', label: 'Logout', action: 'logout' },
];

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { bots, add } = useBots();
  const [showNameDialog, setShowNameDialog] = useState(false);

  const isActive = (path) => {
    if (path === '/bot') return location.pathname.startsWith('/bot');
    return location.pathname === path;
  };

  const handleCreateBot = async (name) => {
    setShowNameDialog(false);
    try {
      const bot = await add(name);
      toast.success(`Created "${bot.name}"`);
      handleNav(`/bot/${bot.id}`);
    } catch {
      toast.error('Failed to create bot');
    }
  };

  const handleBotBuilder = () => {
    if (bots.length > 0) {
      handleNav(`/bot/${bots[0].id}`);
    } else {
      setShowNameDialog(true);
    }
  };

  const handleNewBot = () => {
    setShowNameDialog(true);
  };

  const handleAction = (action) => {
    if (action === 'help') {
      toast('Help: Use the sidebar to navigate between pages.', { icon: '💡' });
    } else if (action === 'logout') {
      toast.success('Logged out (demo mode)');
    }
    onClose();
  };

  const handleNav = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <>
    <aside
      className={`h-screen w-[280px] md:w-[320px] fixed left-0 top-0 bg-surface-container border-r border-outline-variant flex flex-col py-6 px-4 z-40 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div className="mb-12 px-2">
        <h1 className="text-2xl font-bold text-primary">AI Studio</h1>
        <p className="text-sm text-on-surface-variant opacity-70">Pro Plan</p>
      </div>

      <nav className="flex-1 space-y-2">
        {NAV_ITEMS.map((item) => (
          <div
            key={item.label}
            onClick={() => item.path === '/bot' ? handleBotBuilder() : handleNav(item.path)}
            className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-all cursor-pointer active:scale-95 duration-150 ${
              isActive(item.path)
                ? 'text-primary font-bold border-r-2 border-primary bg-surface-variant'
                : 'text-on-surface-variant hover:bg-surface-variant'
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: isActive(item.path) ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="pt-4 border-t border-outline-variant space-y-2">
        <button
          onClick={handleNewBot}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-on-primary font-bold transition-transform active:scale-95 mb-4"
        >
          <span className="material-symbols-outlined">add</span>
          New Bot
        </button>
        {BOTTOM_ITEMS.map((item) => (
          <div
            key={item.label}
            onClick={() => handleAction(item.action)}
            className="flex items-center gap-3 p-3 rounded-lg text-on-surface-variant font-medium hover:bg-surface-variant transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </aside>
    {showNameDialog && (
      <NameDialog
        title="Name your bot"
        placeholder="e.g. Support Bot, Sales Bot..."
        defaultValue="New Bot"
        onSubmit={handleCreateBot}
        onCancel={() => setShowNameDialog(false)}
      />
    )}
  </>
  );
}
