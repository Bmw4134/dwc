import { Request, Response } from 'express';

// Environment check endpoint for API Vault Recovery
export const environmentCheck = async (req: Request, res: Response) => {
  try {
    const availableKeys = {
      OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
      PERPLEXITY_API_KEY: !!process.env.PERPLEXITY_API_KEY,
      STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
      VITE_STRIPE_PUBLIC_KEY: !!process.env.VITE_STRIPE_PUBLIC_KEY,
      DATABASE_URL: !!process.env.DATABASE_URL
    };
    
    res.json(availableKeys);
  } catch (error) {
    res.status(500).json({ error: 'Environment check failed' });
  }
};

// OpenAI test endpoint
export const testOpenAI = async (req: Request, res: Response) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(400).json({ error: 'OpenAI API key not configured' });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Test connection - respond with "OpenAI API connection successful"' }
        ],
        max_tokens: 50
      })
    });

    if (response.ok) {
      const data = await response.json();
      res.json({ 
        success: true, 
        message: data.choices[0].message.content,
        model: 'gpt-4o',
        status: 'operational'
      });
    } else {
      const error = await response.text();
      res.status(400).json({ error: `OpenAI API error: ${error}` });
    }
  } catch (error) {
    res.status(500).json({ error: `OpenAI connection failed: ${(error as Error).message}` });
  }
};

// OpenAI analysis endpoint
export const analyzeWithOpenAI = async (req: Request, res: Response) => {
  try {
    const { prompt, model = 'gpt-4o' } = req.body;
    
    if (!process.env.OPENAI_API_KEY) {
      return res.status(400).json({ error: 'OpenAI API key not configured' });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert system analyst. Provide detailed, actionable solutions for technical issues. Focus on specific fixes and code improvements.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.3
      })
    });

    if (response.ok) {
      const data = await response.json();
      res.json({ 
        analysis: data.choices[0].message.content,
        model,
        timestamp: new Date().toISOString()
      });
    } else {
      const error = await response.text();
      res.status(400).json({ error: `OpenAI analysis failed: ${error}` });
    }
  } catch (error) {
    res.status(500).json({ error: `Analysis failed: ${(error as Error).message}` });
  }
};

// OpenAI code generation endpoint
export const generateWithOpenAI = async (req: Request, res: Response) => {
  try {
    const { prompt, model = 'gpt-4o' } = req.body;
    
    if (!process.env.OPENAI_API_KEY) {
      return res.status(400).json({ error: 'OpenAI API key not configured' });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert developer. Generate clean, optimized, production-ready code. Include comments and follow best practices.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1500,
        temperature: 0.2
      })
    });

    if (response.ok) {
      const data = await response.json();
      res.json({ 
        code: data.choices[0].message.content,
        model,
        timestamp: new Date().toISOString()
      });
    } else {
      const error = await response.text();
      res.status(400).json({ error: `Code generation failed: ${error}` });
    }
  } catch (error) {
    res.status(500).json({ error: `Generation failed: ${(error as Error).message}` });
  }
};

// Perplexity search endpoint
export const searchWithPerplexity = async (req: Request, res: Response) => {
  try {
    const { query, model = 'llama-3.1-sonar-small-128k-online' } = req.body;
    
    if (!process.env.PERPLEXITY_API_KEY) {
      return res.status(400).json({ error: 'Perplexity API key not configured' });
    }

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [
          { 
            role: 'system', 
            content: 'You are a research assistant. Provide accurate, up-to-date information with specific solutions and examples.' 
          },
          { role: 'user', content: query }
        ],
        max_tokens: 800,
        temperature: 0.2,
        top_p: 0.9,
        search_recency_filter: 'month',
        return_images: false,
        return_related_questions: false,
        stream: false
      })
    });

    if (response.ok) {
      const data = await response.json();
      res.json({ 
        answer: data.choices[0].message.content,
        citations: data.citations || [],
        model,
        timestamp: new Date().toISOString()
      });
    } else {
      const error = await response.text();
      res.status(400).json({ error: `Perplexity search failed: ${error}` });
    }
  } catch (error) {
    res.status(500).json({ error: `Search failed: ${(error as Error).message}` });
  }
};