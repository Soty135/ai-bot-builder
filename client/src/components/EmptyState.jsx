export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-3xl text-on-surface-variant">{icon}</span>
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-on-surface-variant max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}
