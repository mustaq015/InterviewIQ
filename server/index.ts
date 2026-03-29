import express, { Request, Response } from 'express';
import cors from 'cors';
import { config } from 'dotenv';

config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, apiKey, model = 'gpt-4o-mini' } = req.body;
    
    const key = apiKey || process.env.OPENAI_API_KEY;
    if (!key) {
      return res.status(400).json({ error: 'API key required' });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({ model, messages })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default app;
