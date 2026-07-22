import { useState } from 'react';

export default function PublishModal({ botName, embedCode, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-surface-container-high rounded-2xl p-6 max-w-lg w-full mx-4 border border-outline-variant shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Publish "{botName}"</h3>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <p className="text-sm text-on-surface-variant mb-4">
          Copy this embed code and paste it into your website's HTML to add the AI support widget.
        </p>
        <div className="bg-surface-container-lowest rounded-lg p-4 border border-outline-variant mb-4">
          <pre className="text-xs text-on-surface font-code-sm overflow-x-auto whitespace-pre-wrap">{embedCode}</pre>
        </div>
        <button
          onClick={handleCopy}
          className="w-full py-3 rounded-xl font-bold bg-primary text-on-primary flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined">{copied ? 'check_circle' : 'content_copy'}</span>
          {copied ? 'Copied!' : 'Copy Embed Code'}
        </button>
      </div>
    </div>
  );
}
