import { useState, useRef, useEffect } from 'react';

export default function NameDialog({ title, placeholder, defaultValue = '', onSubmit, onCancel }) {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) onSubmit(trimmed);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onCancel}>
      <div
        className="bg-surface-container-high rounded-2xl p-6 max-w-sm w-full mx-4 border border-outline-variant shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm mb-6"
          />
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-variant transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!value.trim()}
              className="px-4 py-2 rounded-lg text-sm font-bold bg-primary text-on-primary hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
