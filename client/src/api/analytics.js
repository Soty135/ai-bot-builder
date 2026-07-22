const API_BASE = '/api';

export async function fetchOverview() {
  const res = await fetch(`${API_BASE}/analytics/overview`);
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}

export async function fetchPerBot() {
  const res = await fetch(`${API_BASE}/analytics/per-bot`);
  if (!res.ok) throw new Error('Failed to fetch per-bot analytics');
  return res.json();
}
