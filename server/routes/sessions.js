const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { botId } = req.query;

    const where = botId ? { botId: parseInt(botId) } : {};

    const sessions = await prisma.chatSession.findMany({
      where,
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
          take: 1,
        },
        bot: { select: { id: true, name: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const result = sessions.map((s) => ({
      id: s.id,
      sessionId: s.sessionId,
      botId: s.botId,
      botName: s.bot.name,
      firstMessage: s.messages[0]?.content || '',
      messageCount: s.messages.length,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:sessionId', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const session = await prisma.chatSession.findUnique({
      where: { sessionId: req.params.sessionId },
      include: {
        messages: { orderBy: { timestamp: 'asc' } },
        bot: { select: { id: true, name: true } },
      },
    });
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:sessionId', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    await prisma.chatSession.delete({
      where: { sessionId: req.params.sessionId },
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
