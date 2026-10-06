const fs = require('fs');
const path = require('path');

const VERIFY_TOKEN = process.env.MESSENGER_VERIFY_TOKEN;

async function sendMessengerMessage(recipientId, text) {
  const token = process.env.MESSENGER_PAGE_ACCESS_TOKEN;

  if (!token) {
    throw new Error('Messenger page token is not configured');
  }

  const response = await fetch(
    'https://graph.facebook.com/v24.0/me/messages?access_token=' +
      encodeURIComponent(token),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        recipient: {
          id: recipientId
        },
        messaging_type: 'RESPONSE',
        message: {
          text
        }
      })
    }
  );

  const raw = await response.text();

  let data;

  try {
    data = JSON.parse(raw);
  } catch {
    data = { raw };
  }

  if (!response.ok) {
    throw new Error(
      data?.error?.message || 'Messenger API request failed'
    );
  }
}

async function getGeminiAnswer(message) {
  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    throw new Error('Gemini key is not configured');
  }

  const file = path.join(
    process.cwd(),
    'data',
    'medical-center.json'
  );

  const knowledge = JSON.parse(
    fs.readFileSync(file, 'utf8')
  );

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

  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': key
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: instruction
            }
          ]
        },
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: message
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 500
        }
      })
    }
  );

  const raw = await response.text();

  let data;

  try {
    data = JSON.parse(raw);
  } catch {
    data = { raw };
  }

  if (!response.ok) {
    throw new Error(
      data?.error?.message || 'Gemini request failed'
    );
  }

  const answer =
    data?.candidates?.[0]?.content?.parts
      ?.map((p) => p.text || '')
      .join('') || '';

  if (!answer) {
    throw new Error('Gemini returned no text response');
  }

  return answer;
}

module.exports = async function handler(req, res) {
  res.setHeader(
    'Access-Control-Allow-Origin',
    '*'
  );

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS'
  );

  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type'
  );

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Meta Webhook verification
  if (req.method === 'GET') {
    const mode = req.query?.['hub.mode'];
    const token = req.query?.['hub.verify_token'];
    const challenge = req.query?.['hub.challenge'];

    if (
      mode === 'subscribe' &&
      token === VERIFY_TOKEN &&
      challenge
    ) {
      return res.status(200).send(challenge);
    }

    return res.status(403).send('Forbidden');
  }

  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body || {};

    if (body.object !== 'page') {
      return res
        .status(404)
        .json({ error: 'Not a page webhook' });
    }

    for (const entry of body.entry || []) {
      for (const event of entry.messaging || []) {
        if (
          !event.message ||
          event.message.is_echo
        ) {
          continue;
        }

        const senderId = event.sender?.id;
        const message = event.message?.text;

        if (!senderId || !message) {
          continue;
        }

        try {
          const answer =
            await getGeminiAnswer(message);

          await sendMessengerMessage(
            senderId,
            answer
          );
        } catch (error) {
          console.error(
            'Messenger message error:',
            error
          );

          await sendMessengerMessage(
            senderId,
            'عذرًا، حدث خطأ مؤقتًا أثناء معالجة رسالتك. يرجى المحاولة مرة أخرى.'
          );
        }
      }
    }

    return res
      .status(200)
      .json({ success: true });

  } catch (error) {
    console.error(
      'Messenger webhook error:',
      error
    );

    return res
      .status(500)
      .json({ error: 'Server error' });
  }
};
