const fs = require('fs');
const path = require('path');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(500).json({ error: 'Gemini key is not configured' });

  try {
    const body = req.body || {};
    const message = body.message;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required' });
    }

    const file = path.join(process.cwd(), 'data', 'medical-center.json');
    const knowledge = JSON.parse(fs.readFileSync(file, 'utf8'));

    const instruction = [
      'أنت المساعد الذكي لمركز طبي.',
      'أجب باللغة العربية وبأسلوب واضح ومختصر وودود.',
      'استخدم فقط المعلومات الموجودة في قاعدة المعرفة.',
      'لا تخترع طبيبًا أو سعرًا أو موعدًا أو خدمة أو عنوانًا.',
      'إذا لم تجد المعلومة، قل إنها غير مسجلة حاليًا.',
      'لا تقدم تشخيصًا طبيًا أو علاجًا أو جرعات دوائية.',
      '',
      'قاعدة المعرفة:',
      JSON.stringify(knowledge)
    ].join('\n');

    const apiUrl = 'https://generativelanguage.googleapis.com/v1/interactions';
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': key
      },
      body: JSON.stringify({
        model: 'gemini-3.8-flash',
        system_instruction: instruction,
        input: message,
        generation_config: {
          temperature: 0.2,
          max_output_tokens: 500
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data && data.error ? data.error.message : 'Gemini request failed'
      });
    }

    let answer = data.output_text;
    if (!answer && Array.isArray(data.steps)) {
      const modelStep = data.steps.slice().reverse().find(step => step.type === 'model_output');
      if (modelStep && Array.isArray(modelStep.content)) {
        const textPart = modelStep.content.find(part => part.type === 'text');
        answer = textPart && textPart.text;
      }
    }

    if (!answer) return res.status(502).json({ error: 'No text response' });

    return res.status(200).json({ answer });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};
