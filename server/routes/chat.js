const express = require('express');
const OpenAI = require('openai');
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.AI_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

router.post('/', async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { message, sessionId, botId } = req.body;

    if (!message || !sessionId || !botId) {
      return res.status(400).json({ error: 'message, sessionId, and botId are required' });
    }

    const config = await prisma.botConfig.findUnique({
      where: { botId: parseInt(botId) },
    });

    const businessName = config?.businessName || 'our company';
    const knowledgeBase = config?.knowledgeBase || 'No knowledge base provided.';
    const systemTone = config?.systemTone || 'Professional & Technical';

    const systemPrompt = `You are a helpful customer support assistant for ${businessName}.
Use ONLY the following knowledge base to answer the customer's question.
If the answer cannot be found in the knowledge base, politely say you don't have that information and direct them to human support.
Tone: ${systemTone}
Knowledge Base: ${knowledgeBase}`;

    let session = await prisma.chatSession.findUnique({
      where: { sessionId },
    });

    if (!session) {
      session = await prisma.chatSession.create({
        data: { sessionId, botId: parseInt(botId) },
      });
    }

    await prisma.chatHistory.create({
      data: { sessionId, role: 'user', content: message },
    });

    const chatHistory = await prisma.chatHistory.findMany({
      where: { sessionId },
      orderBy: { timestamp: 'asc' },
      take: 20,
    });

    const messages = [
      { role: 'system', content: systemPrompt },
      ...chatHistory.map((msg) => ({ role: msg.role, content: msg.content })),
    ];

    const completion = await openai.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      max_tokens: 1024,
      temperature: 0.7,
    });

    const aiMessage = completion.choices[0].message.content;

    await prisma.chatHistory.create({
      data: { sessionId, role: 'assistant', content: aiMessage },
    });

    await prisma.chatSession.update({
      where: { sessionId },
      data: { updatedAt: new Date() },
    });

    res.json({ response: aiMessage });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: err.message || 'Failed to process chat message' });
  }
});

module.exports = router;
