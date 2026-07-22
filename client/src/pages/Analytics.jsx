import { useAnalytics } from '../hooks/useAnalytics';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useState, useEffect } from 'react';
import { fetchSessions, deleteSession } from '../api/sessions';

const COLORS = ['#4edea3', '#c0c1ff', '#7bd0ff', '#10b981', '#ffb4ab'];

export default function Analytics() {
  const { overview, perBot, loading } = useAnalytics();
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetchSessions().then(setSessions).catch(console.error);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="typing-dot" /><div className="typing-dot ml-1" /><div className="typing-dot ml-1" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-on-surface-variant">Insights into your bot usage and performance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant">
          <h3 className="font-bold mb-4">Messages Over Time</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overview?.dailyData || []}>
                <XAxis dataKey="label" tick={{ fill: '#bbcabf', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#bbcabf', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#222a3d', border: '1px solid #3c4a42', borderRadius: '8px', fontSize: 12 }}
                  labelStyle={{ color: '#dae2fd' }}
                  itemStyle={{ color: '#4edea3' }}
                />
                <Bar dataKey="messages" fill="#4edea3" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant">
          <h3 className="font-bold mb-4">Conversations by Bot</h3>
          {perBot.length === 0 ? (
            <p className="text-sm text-on-surface-variant text-center py-8">No data yet</p>
          ) : (
            <div className="h-48 flex flex-col sm:flex-row items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={perBot} dataKey="sessionCount" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                    {perBot.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#222a3d', border: '1px solid #3c4a42', borderRadius: '8px', fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {perBot.map((b, i) => (
                  <div key={b.id} className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-on-surface-variant">{b.name}</span>
                    <span className="font-bold">{b.sessionCount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant">
        <h3 className="font-bold mb-4">Per-Bot Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant">
                <th className="text-left py-3 text-on-surface-variant font-medium">Bot</th>
                <th className="text-left py-3 text-on-surface-variant font-medium">Status</th>
                <th className="text-right py-3 text-on-surface-variant font-medium">Sessions</th>
                <th className="text-right py-3 text-on-surface-variant font-medium">Messages</th>
              </tr>
            </thead>
            <tbody>
              {perBot.map((b) => (
                <tr key={b.id} className="border-b border-outline-variant/50">
                  <td className="py-3 font-bold">{b.name}</td>
                  <td className="py-3">
                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${b.published ? 'bg-primary/20 text-primary' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                      {b.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-3 text-right text-on-surface-variant">{b.sessionCount}</td>
                  <td className="py-3 text-right text-on-surface-variant">{b.messageCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant">
        <h3 className="font-bold mb-4">Recent Sessions</h3>
        {sessions.length === 0 ? (
          <p className="text-sm text-on-surface-variant text-center py-8">No sessions yet</p>
        ) : (
          <div className="space-y-2">
            {sessions.slice(0, 10).map((s) => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/50">
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-primary">{s.botName}</span>
                  <p className="text-xs text-on-surface-variant truncate">{s.firstMessage || 'Empty session'}</p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <span className="text-xs text-outline">{s.messageCount} msgs</span>
                  <button
                    onClick={async () => {
                      await deleteSession(s.sessionId);
                      setSessions((prev) => prev.filter((x) => x.sessionId !== s.sessionId));
                    }}
                    className="text-on-surface-variant hover:text-error transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
