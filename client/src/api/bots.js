const API_BASE = '/api';

export async function fetchBots() {
  const res = await fetch(`${API_BASE}/bots`);
  if (!res.ok) throw new Error('Failed to fetch bots');
  return res.json();
}

export async function fetchBot(id) {
  const res = await fetch(`${API_BASE}/bots/${id}`);
  if (!res.ok) throw new Error('Failed to fetch bot');
  return res.json();
}

export async function createBot(name) {
  const res = await fetch(`${API_BASE}/bots`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error('Failed to create bot');
  return res.json();
}

export async function updateBot(id, data) {
  const res = await fetch(`${API_BASE}/bots/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update bot');
  return res.json();
}

export async function deleteBot(id) {
  const res = await fetch(`${API_BASE}/bots/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete bot');
  return res.json();
}

export async function publishBot(id) {
  const res = await fetch(`${API_BASE}/bots/${id}/publish`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to publish bot');
  return res.json();
}
