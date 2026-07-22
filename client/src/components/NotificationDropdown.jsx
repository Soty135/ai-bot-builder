export default function NotificationDropdown({ sessions, onClose }) {
  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div className="absolute top-16 right-4 md:right-20 w-80 bg-surface-container-high rounded-xl border border-outline-variant shadow-2xl overflow-hidden animate-fade-in">
        <div className="px-4 py-3 border-b border-outline-variant">
          <h4 className="font-bold text-sm">Recent Activity</h4>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="p-4 text-center text-sm text-on-surface-variant">No recent activity</div>
          ) : (
            sessions.slice(0, 5).map((s) => (
              <div key={s.id} className="px-4 py-3 border-b border-outline-variant/50 hover:bg-surface-variant/50 transition-colors">
                <p className="text-xs font-bold text-primary">{s.botName}</p>
                <p className="text-xs text-on-surface-variant truncate mt-1">{s.firstMessage || 'New conversation'}</p>
                <p className="text-[10px] text-outline mt-1">
                  {new Date(s.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
