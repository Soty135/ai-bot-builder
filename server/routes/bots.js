const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const bots = await prisma.bot.findMany({
      include: { config: true },
      orderBy: { updatedAt: 'desc' },
    });
    res.json(bots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { name } = req.body;

    const bot = await prisma.bot.create({
      data: {
        name: name || 'New Bot',
        config: {
          create: {
            businessName: '',
            knowledgeBase: '',
            systemTone: 'Professional & Technical',
          },
        },
      },
      include: { config: true },
    });

    res.json(bot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const bot = await prisma.bot.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { config: true },
    });
    if (!bot) return res.status(404).json({ error: 'Bot not found' });
    res.json(bot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { name } = req.body;
    const bot = await prisma.bot.update({
      where: { id: parseInt(req.params.id) },
      data: { name },
      include: { config: true },
    });
    res.json(bot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    await prisma.bot.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/publish', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const bot = await prisma.bot.update({
      where: { id: parseInt(req.params.id) },
      data: { published: true },
      include: { config: true },
    });

    const SERVER_URL = process.env.RENDER_EXTERNAL_URL || 'http://localhost:5000';
    const embedCode = `<!-- AI Support Widget -->
<script>
  (function() {
    var s = document.createElement('script');
    s.src = '${SERVER_URL}/api/embed/${bot.id}';
    s.async = true;
    document.body.appendChild(s);
  })();
</script>`;

    res.json({ bot, embedCode });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
