import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { idea, tone } = req.body;

  if (!idea || !tone) {
    return res.status(400).json({ error: 'Missing idea or tone' });
  }

  const prompt = `Write 3 engaging Instagram captions about "${idea}" in a ${tone} tone.`;

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const captions = response.data.choices[0].message.content;

    res.status(200).json({ captions });
  } catch (error) {
    res.status(500).json({ error: 'OpenAI error', details: error.message });
  }
}
