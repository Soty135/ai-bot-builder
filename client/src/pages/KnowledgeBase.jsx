import { useState, useEffect } from 'react';
import { fetchBots } from '../api/bots';
import { fetchBotConfig, saveBotConfig, deleteBotConfig } from '../api/botConfig';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function KnowledgeBase() {
  const [bots, setBots] = useState([]);
  const [selectedBotId, setSelectedBotId] = useState(null);
  const [config, setConfig] = useState({ businessName: '', knowledgeBase: '', systemTone: 'Professional & Technical' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBots().then((data) => {
      setBots(data);
      if (data.length > 0) setSelectedBotId(data[0].id);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!selectedBotId) return;
    fetchBotConfig(selectedBotId).then(setConfig);
  }, [selectedBotId]);

  const handleSave = async () => {
    if (!config.businessName.trim() || !config.knowledgeBase.trim()) {
      toast.error('Business name and knowledge base are required');
      return;
    }
    setSaving(true);
    try {
      await saveBotConfig({ ...config, botId: selectedBotId });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBotConfig(selectedBotId);
      setConfig({ businessName: '', knowledgeBase: '', systemTone: 'Professional & Technical' });
      toast.success('Knowledge base cleared');
    } catch (err) {
      console.error('Delete failed:', err.message);
      toast.error('Failed to delete knowledge base');
    }
    setShowConfirmDelete(false);
  };

  const tokenCount = Math.ceil(config.knowledgeBase.length / 4);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="typing-dot" /><div className="typing-dot ml-1" /><div className="typing-dot ml-1" />
      </div>
    );
  }

  if (bots.length === 0) {
    return (
      <div className="p-4 md:p-8">
        <EmptyState
          icon="database"
          title="No bots yet"
          description="Create a bot first to manage its knowledge base."
          action={
            <button onClick={() => navigate('/dashboard')} className="bg-primary text-on-primary px-5 py-2 rounded-xl font-bold text-sm">
              Go to Dashboard
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Knowledge Base</h1>
        <p className="text-sm text-on-surface-variant">Manage the training data for your bots</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {bots.map((b) => (
          <button
            key={b.id}
            onClick={() => setSelectedBotId(b.id)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              selectedBotId === b.id
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-high text-on-surface-variant border border-outline-variant hover:border-primary/50'
            }`}
          >
            {b.name}
          </button>
        ))}
      </div>

      {selectedBotId && (
        <div className="space-y-6">
          <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold">Business Name</label>
            </div>
            <input
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm"
              value={config.businessName}
              onChange={(e) => setConfig({ ...config, businessName: e.target.value })}
              placeholder="Enter business name"
            />
          </div>

          <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold">Knowledge Base / FAQ</label>
              <span className={`text-[10px] uppercase font-bold tracking-widest ${tokenCount > 2048 ? 'text-error' : 'text-outline'}`}>
                {tokenCount.toLocaleString()} / 2,048 Tokens
              </span>
            </div>
            <textarea
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none text-sm font-code-sm"
              rows="12"
              value={config.knowledgeBase}
              onChange={(e) => setConfig({ ...config, knowledgeBase: e.target.value })}
              placeholder="Paste your company policies, FAQs, or pricing here...&#10;&#10;Example:&#10;Q: What is the turnaround time?&#10;A: Usually 3-5 business days."
            />
          </div>

          <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant space-y-4">
            <label className="text-sm font-bold">Tips for Effective Knowledge Bases</label>
            <ul className="text-xs text-on-surface-variant space-y-2">
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">1.</span> Use Q&A format for common questions</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">2.</span> Be specific and concise in answers</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">3.</span> Include pricing, policies, and procedures</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">4.</span> Update regularly as your business evolves</li>
            </ul>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-primary text-on-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined">{saved ? 'check_circle' : 'save'}</span>
            {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Knowledge Base'}
          </button>

          <button
            onClick={() => setShowConfirmDelete(true)}
            className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 border border-error/30 text-error hover:bg-error-container/20 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined">delete_forever</span>
            Clear Knowledge Base
          </button>
        </div>
      )}

      {showConfirmDelete && (
        <ConfirmDialog
          title={`Clear knowledge base for "${bots.find((b) => b.id === selectedBotId)?.name}"?`}
          message="This will permanently delete the business name and knowledge base data. This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setShowConfirmDelete(false)}
        />
      )}
    </div>
  );
}
