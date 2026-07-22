import { useState, useEffect, useCallback } from 'react';
import { fetchBotConfig, saveBotConfig } from '../api/botConfig';

export function useBotConfig(botId) {
  const [config, setConfig] = useState({
    businessName: '',
    knowledgeBase: '',
    systemTone: 'Professional & Technical',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!botId) { setLoading(false); return; }
    setLoading(true);
    fetchBotConfig(botId)
      .then(setConfig)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [botId]);

  const updateField = useCallback((field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const updated = await saveBotConfig({ ...config, botId: parseInt(botId) });
      setConfig(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } finally {
      setSaving(false);
    }
  }, [config, botId]);

  return { config, loading, saving, saveSuccess, updateField, save };
}
