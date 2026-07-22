import { useState } from 'react';
import { useBots } from '../hooks/useBots';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { bots, remove } = useBots();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (deleteTarget) {
      await remove(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-on-surface-variant">Manage your bots and application settings</p>
      </div>

      <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant space-y-4">
        <h3 className="font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">key</span>
          API Configuration
        </h3>
        <div className="space-y-2">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">AI Provider</label>
          <div className="bg-surface-container-lowest rounded-lg px-4 py-3 border border-outline-variant text-sm">
            Groq (Llama 3.3 70B) — Free Tier
          </div>
        </div>
      </div>

      <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant space-y-4">
        <h3 className="font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">smart_toy</span>
          Manage Bots
        </h3>
        {bots.length === 0 ? (
          <EmptyState
            icon="smart_toy"
            title="No bots"
            description="Create a bot to get started."
            action={
              <button onClick={() => navigate('/dashboard')} className="bg-primary text-on-primary px-5 py-2 rounded-xl font-bold text-sm">
                Go to Dashboard
              </button>
            }
          />
        ) : (
          <div className="space-y-2">
            {bots.map((b) => (
              <div key={b.id} className="flex items-center justify-between p-4 rounded-lg bg-surface-container-lowest border border-outline-variant/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">smart_toy</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">{b.name}</p>
                    <p className="text-xs text-on-surface-variant">
                      {b.published ? 'Published' : 'Draft'} · Created {new Date(b.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/bot/${b.id}`)}
                    className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-variant transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button
                    onClick={() => setDeleteTarget(b)}
                    className="p-2 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant space-y-4">
        <h3 className="font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">info</span>
          About
        </h3>
        <div className="text-sm text-on-surface-variant space-y-1">
          <p><span className="font-bold text-on-surface">AI Support Bot Builder</span> v1.0.0</p>
          <p>Built with React, Express, Prisma, and Groq AI</p>
          <p className="text-xs text-outline mt-2">A full-stack AI customer support widget builder</p>
        </div>
      </div>

      {deleteTarget && (
        <ConfirmDialog
          title={`Delete "${deleteTarget.name}"?`}
          message="This will permanently delete the bot, its configuration, and all chat history. This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
