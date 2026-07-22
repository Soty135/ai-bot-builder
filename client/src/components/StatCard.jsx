export default function StatCard({ icon, label, value, color = 'primary' }) {
  const colorMap = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-secondary-container/10 text-secondary border-secondary-container/20',
    tertiary: 'bg-tertiary-container/10 text-tertiary border-tertiary-container/20',
    error: 'bg-error-container/10 text-error border-error-container/20',
  };

  return (
    <div className="bg-surface-container-high rounded-xl p-5 border border-outline-variant flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorMap[color]}`}>
        <span className="material-symbols-outlined text-[24px]">{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-on-surface-variant">{label}</p>
      </div>
    </div>
  );
}
