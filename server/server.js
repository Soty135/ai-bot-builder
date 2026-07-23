require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const botConfigRoutes = require('./routes/botConfig');
const chatRoutes = require('./routes/chat');
const botsRoutes = require('./routes/bots');
const sessionsRoutes = require('./routes/sessions');
const analyticsRoutes = require('./routes/analytics');
const embedRoutes = require('./routes/embed');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.set('prisma', prisma);

app.use('/api/bot-config', botConfigRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/bots', botsRoutes);
app.use('/api/chat/sessions', sessionsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/embed', embedRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

async function start() {
  try {
    await prisma.$connect();
    console.log('Database connected');

    const botCount = await prisma.bot.count();
    if (botCount === 0) {
      await prisma.bot.create({
        data: {
          name: 'My First Bot',
          config: {
            create: {
              businessName: 'My Business',
              knowledgeBase: 'Q: What are your hours?\nA: We are open Monday-Friday, 9am-5pm.\nQ: Do you offer refunds?\nA: Yes, within 30 days of purchase.',
              systemTone: 'Professional & Technical',
            },
          },
        },
      });
      console.log('Seeded default bot');
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
