const API_BASE = '/api';

export async function fetchBotConfig(botId) {
  const url = botId ? `${API_BASE}/bot-config?botId=${botId}` : `${API_BASE}/bot-config`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch bot config');
  return res.json();
}

export async function saveBotConfig(data) {
  const res = await fetch(`${API_BASE}/bot-config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save bot config');
  return res.json();
}

export async function deleteBotConfig(botId) {
  const res = await fetch(`${API_BASE}/bot-config/${botId}`, { method: 'DELETE' });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || 'Failed to delete bot config');
  return body;
}
