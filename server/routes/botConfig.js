const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { botId } = req.query;

    let config;
    if (botId) {
      config = await prisma.botConfig.findUnique({
        where: { botId: parseInt(botId) },
      });
    } else {
      config = await prisma.botConfig.findFirst({
        orderBy: { updatedAt: 'desc' },
      });
    }

    res.json(config || { businessName: '', knowledgeBase: '', systemTone: 'Professional & Technical' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { botId, businessName, knowledgeBase, systemTone } = req.body;

    if (!botId) {
      return res.status(400).json({ error: 'botId is required' });
    }

    const existing = await prisma.botConfig.findUnique({
      where: { botId: parseInt(botId) },
    });

    let config;
    if (existing) {
      config = await prisma.botConfig.update({
        where: { botId: parseInt(botId) },
        data: { businessName, knowledgeBase, systemTone },
      });
    } else {
      config = await prisma.botConfig.create({
        data: {
          botId: parseInt(botId),
          businessName,
          knowledgeBase,
          systemTone,
        },
      });
    }

    res.json(config);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:botId', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const botId = parseInt(req.params.botId);

    if (isNaN(botId)) {
      return res.status(400).json({ error: 'Invalid botId' });
    }

    const existing = await prisma.botConfig.findUnique({ where: { botId } });

    if (existing) {
      await prisma.botConfig.delete({ where: { botId } });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
