require('dotenv').config();
const express = require('express');
const path = require('path');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname)));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'openai-voice-chat' });
});

app.post('/api/chat', async (req, res) => {
  const message = (req.body && req.body.message ? req.body.message : '').trim();

  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: 'OPENAI_API_KEY is missing. Add it to your .env file before starting the app.',
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content:
            'You are a friendly AI assistant for a futuristic 3D space web app. Keep responses short, clear, and conversational. Speak naturally and helpfully. If the user asks to control the scene, respond as if you are managing the app state.',
        },
        { role: 'user', content: message },
      ],
    });

    const reply = completion.choices?.[0]?.message?.content || 'I heard you. Ask me anything about the scene.';
    return res.json({ reply });
  } catch (error) {
    console.error('OpenAI request failed:', error);
    return res.status(500).json({
      error: 'The AI request failed. Check your OpenAI API key, model, and network connection.',
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`AI voice chat server running at http://localhost:${PORT}`);
});
