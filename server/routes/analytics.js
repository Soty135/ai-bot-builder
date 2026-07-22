const express = require('express');
const router = express.Router();

router.get('/overview', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');

    const [totalBots, totalSessions, totalMessages, publishedBots] = await Promise.all([
      prisma.bot.count(),
      prisma.chatSession.count(),
      prisma.chatHistory.count(),
      prisma.bot.count({ where: { published: true } }),
    ]);

    const recentSessions = await prisma.chatSession.findMany({
      take: 10,
      orderBy: { updatedAt: 'desc' },
      include: {
        bot: { select: { name: true } },
        messages: { take: 1, orderBy: { timestamp: 'asc' } },
        _count: { select: { messages: true } },
      },
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const messagesByDay = await prisma.chatHistory.groupBy({
      by: ['timestamp'],
      where: { timestamp: { gte: sevenDaysAgo } },
      _count: true,
    });

    const dailyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStr = date.toISOString().split('T')[0];
      const count = messagesByDay.filter(
        (m) => m.timestamp.toISOString().split('T')[0] === dayStr
      ).reduce((sum, m) => sum + m._count, 0);
      dailyData.push({
        date: dayStr,
        label: date.toLocaleDateString('en-US', { weekday: 'short' }),
        messages: count,
      });
    }

    res.json({
      totalBots,
      totalSessions,
      totalMessages,
      publishedBots,
      recentSessions: recentSessions.map((s) => ({
        id: s.id,
        sessionId: s.sessionId,
        botName: s.bot.name,
        firstMessage: s.messages[0]?.content || '',
        messageCount: s._count.messages,
        createdAt: s.createdAt,
      })),
      dailyData,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/per-bot', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');

    const bots = await prisma.bot.findMany({
      include: {
        _count: { select: { sessions: true } },
        sessions: {
          include: { _count: { select: { messages: true } } },
        },
      },
    });

    const result = bots.map((b) => ({
      id: b.id,
      name: b.name,
      published: b.published,
      sessionCount: b._count.sessions,
      messageCount: b.sessions.reduce((sum, s) => sum + s._count.messages, 0),
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
