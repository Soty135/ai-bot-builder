import { useBotConfig } from '../hooks/useBotConfig';
import toast from 'react-hot-toast';

const TONE_OPTIONS = [
  'Professional & Technical',
  'Friendly & Approachable',
  'Concise & Direct',
  'Empathetic & Warm',
];

export default function BotConfigPanel({ botId, botName }) {
  const { config, loading, saving, saveSuccess, updateField, save } = useBotConfig(botId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!config.businessName.trim() || !config.knowledgeBase.trim()) {
      toast.error('Business name and knowledge base are required');
      return;
    }
    save();
    toast.success('Bot configuration saved!');
  };

  if (loading) {
    return (
      <section className="bg-surface p-4 md:p-8 h-full overflow-y-auto border-b lg:border-b-0 lg:border-r border-outline-variant flex items-center justify-center">
        <div className="typing-dot" /><div className="typing-dot ml-1" /><div className="typing-dot ml-1" />
      </section>
    );
  }

  return (
    <section className="bg-surface p-4 md:p-8 h-full overflow-y-auto border-b lg:border-b-0 lg:border-r border-outline-variant">
      <div className="max-w-xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Bot Configuration</h2>
            <p className="text-sm text-on-surface-variant">
              Configure <span className="text-primary font-bold">{botName}</span>'s personality and knowledge.
            </p>
          </div>
          <div className="w-12 h-12 bg-primary-container/20 rounded-xl flex items-center justify-center text-primary border border-primary/20">
            <span className="material-symbols-outlined text-[28px]">settings_suggest</span>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface">Business Name</label>
            <input
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-5 py-3 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
              placeholder="Enter your business name"
              type="text"
              value={config.businessName}
              onChange={(e) => updateField('businessName', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-on-surface">Knowledge Base / FAQ</label>
              <span className="text-[10px] uppercase font-bold tracking-widest text-outline">
                Context Limit: 2,048 Tokens
              </span>
            </div>
            <textarea
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-5 py-3 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none text-code-sm"
              placeholder="Paste your company policies, FAQs, or pricing here..."
              rows="8"
              value={config.knowledgeBase}
              onChange={(e) => updateField('knowledgeBase', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface">AI Response Tone</label>
            <div className="relative">
              <select
                className="w-full appearance-none bg-surface-container-lowest border border-outline-variant rounded-lg px-5 py-3 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                value={config.systemTone}
                onChange={(e) => updateField('systemTone', e.target.value)}
              >
                {TONE_OPTIONS.map((tone) => (
                  <option key={tone}>{tone}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                expand_more
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 py-2">
            <span className="px-4 py-1 bg-secondary-container/20 border border-secondary-container text-secondary text-[11px] font-bold rounded-full uppercase tracking-tighter">
              LLM: Llama 3.3 70B (Groq)
            </span>
            <span className="px-4 py-1 bg-primary-container/20 border border-primary-container text-primary text-[11px] font-bold rounded-full uppercase tracking-tighter">
              Intent: Sales & Support
            </span>
            <span className="px-4 py-1 bg-surface-container-highest border border-outline-variant text-on-surface-variant text-[11px] font-bold rounded-full uppercase tracking-tighter">
              Streaming: Enabled
            </span>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/10 disabled:opacity-50"
          >
            {saveSuccess ? (
              <>
                <span className="material-symbols-outlined">check_circle</span>
                Saved Successfully!
              </>
            ) : saving ? (
              <>
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                Saving...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">auto_fix_high</span>
                Save &amp; Update Bot Configuration
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
