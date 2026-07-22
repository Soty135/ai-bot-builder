import { useState, useEffect, useCallback } from 'react';
import { fetchOverview, fetchPerBot } from '../api/analytics';

export function useAnalytics() {
  const [overview, setOverview] = useState(null);
  const [perBot, setPerBot] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [ov, pb] = await Promise.all([fetchOverview(), fetchPerBot()]);
      setOverview(ov);
      setPerBot(pb);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { overview, perBot, loading, reload: load };
}
