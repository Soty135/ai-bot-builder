const API_BASE = '/api';

export async function fetchSessions(botId) {
  const url = botId ? `${API_BASE}/chat/sessions?botId=${botId}` : `${API_BASE}/chat/sessions`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch sessions');
  return res.json();
}

export async function fetchSession(sessionId) {
  const res = await fetch(`${API_BASE}/chat/sessions/${sessionId}`);
  if (!res.ok) throw new Error('Failed to fetch session');
  return res.json();
}

export async function deleteSession(sessionId) {
  const res = await fetch(`${API_BASE}/chat/sessions/${sessionId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete session');
  return res.json();
}
