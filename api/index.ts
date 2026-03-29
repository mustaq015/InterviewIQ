import { readFileSync, existsSync } from 'fs';
import { extname, join } from 'path';
import { parse } from 'url';

const distPath = join(process.cwd(), 'dist');
const indexPath = join(distPath, 'index.html');

const mimeTypes: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

interface VercelRequest {
  method: string;
  headers: Record<string, string | string[] | undefined>;
  url: string;
  query?: Record<string, string>;
  body?: string;
}

interface VercelResponse {
  statusCode: number;
  headers: Record<string, string>;
  body?: string;
}

const handler = async (req: VercelRequest, res: VercelResponse) => {
  const { pathname } = parse(req.url || '/', true);
  const path = pathname || '/';
  
  res.headers = { 'Content-Type': 'text/html; charset=utf-8' };

  if (path.startsWith('/api/')) {
    const apiPath = path.replace('/api/', '');
    
    if (apiPath === 'health' && req.method === 'GET') {
      res.statusCode = 200;
      res.body = JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() });
      res.headers['Content-Type'] = 'application/json';
      return;
    }
    
    if (apiPath === 'chat' && req.method === 'POST') {
      try {
        const body = req.body ? JSON.parse(req.body) : {};
        const { messages, apiKey } = body;
        
        const key = apiKey || process.env.GROQ_API_KEY;
        if (!key) {
          res.statusCode = 400;
          res.body = JSON.stringify({ error: 'API key required. Please provide a Groq API key.' });
          res.headers['Content-Type'] = 'application/json';
          return;
        }

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`
          },
          body: JSON.stringify({
            model: 'llama-3.1-70b-versatile',
            messages: messages
          })
        });

        const data = await response.json();
        res.statusCode = 200;
        res.body = JSON.stringify(data);
        res.headers['Content-Type'] = 'application/json';
        return;
      } catch (error) {
        res.statusCode = 500;
        res.body = JSON.stringify({ error: 'Internal server error' });
        res.headers['Content-Type'] = 'application/json';
        return;
      }
    }
    
    res.statusCode = 404;
    res.body = JSON.stringify({ error: 'Not found' });
    res.headers['Content-Type'] = 'application/json';
    return;
  }

  let filePath = join(distPath, path === '/' ? 'index.html' : path);
  
  if (!existsSync(filePath) || !extname(filePath)) {
    filePath = join(distPath, path, 'index.html');
  }
  
  if (!existsSync(filePath)) {
    filePath = indexPath;
  }

  const ext = extname(filePath);
  res.headers['Content-Type'] = mimeTypes[ext] || 'text/plain';
  
  try {
    const content = readFileSync(filePath);
    res.body = content.toString();
    res.statusCode = 200;
  } catch {
    res.statusCode = 404;
    res.body = 'Not found';
  }
};

export default handler;
