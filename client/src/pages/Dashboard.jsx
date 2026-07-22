import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalytics } from '../hooks/useAnalytics';
import { useBots } from '../hooks/useBots';
import StatCard from '../components/StatCard';
import NameDialog from '../components/NameDialog';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { overview, loading } = useAnalytics();
  const { add } = useBots();
  const navigate = useNavigate();
  const [showNameDialog, setShowNameDialog] = useState(false);

  const handleConfirmCreate = async (name) => {
    setShowNameDialog(false);
    try {
      const bot = await add(name);
      toast.success(`Created "${bot.name}"`);
      navigate(`/bot/${bot.id}`);
    } catch {
      toast.error('Failed to create bot');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="typing-dot" /><div className="typing-dot ml-1" /><div className="typing-dot ml-1" />
      </div>
    );
  }

  return (
    <>
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-on-surface-variant">Overview of your AI bots and activity</p>
        </div>
        <button
          onClick={() => setShowNameDialog(true)}
          className="bg-primary text-on-primary px-5 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Create Bot
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="smart_toy" label="Total Bots" value={overview?.totalBots || 0} color="primary" />
        <StatCard icon="chat" label="Total Sessions" value={overview?.totalSessions || 0} color="secondary" />
        <StatCard icon="forum" label="Total Messages" value={overview?.totalMessages || 0} color="tertiary" />
        <StatCard icon="rocket_launch" label="Published" value={overview?.publishedBots || 0} color="primary" />
      </div>

      <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant">
        <h3 className="font-bold mb-4">Messages (Last 7 Days)</h3>
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
        <h3 className="font-bold mb-4">Recent Conversations</h3>
        {overview?.recentSessions?.length === 0 ? (
          <p className="text-sm text-on-surface-variant text-center py-8">No conversations yet. Start chatting to see activity here.</p>
        ) : (
          <div className="space-y-3">
            {overview?.recentSessions?.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/50">
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-primary">{s.botName}</span>
                  <p className="text-sm text-on-surface-variant truncate">{s.firstMessage}</p>
                </div>
                <div className="text-right ml-4">
                  <span className="text-xs text-outline">{s.messageCount} msgs</span>
                  <p className="text-[10px] text-outline">{new Date(s.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    {showNameDialog && (
      <NameDialog
        title="Name your bot"
        placeholder="e.g. Support Bot, Sales Bot..."
        defaultValue="New Bot"
        onSubmit={handleConfirmCreate}
        onCancel={() => setShowNameDialog(false)}
      />
    )}
    </>
  );
}
