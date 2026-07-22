import { useState, useEffect, useCallback } from 'react';
import { fetchBots, createBot, deleteBot, publishBot } from '../api/bots';

export function useBots() {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchBots();
      setBots(data);
    } catch (err) {
      console.error('Failed to load bots:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const add = useCallback(async (name) => {
    const bot = await createBot(name);
    setBots((prev) => [bot, ...prev]);
    return bot;
  }, []);

  const remove = useCallback(async (id) => {
    await deleteBot(id);
    setBots((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const publish = useCallback(async (id) => {
    const result = await publishBot(id);
    setBots((prev) => prev.map((b) => b.id === id ? { ...b, published: true } : b));
    return result;
  }, []);

  return { bots, loading, add, remove, publish, reload: load };
}
