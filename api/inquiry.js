const TELEGRAM_HANDLE_PATTERN = /^@[a-zA-Z0-9_]{5,32}$/;
export const TELEGRAM_BOT_USERNAME = 'aotrombot';
export const BRIEF_MAX_LENGTH = 1200;

export const ALLOWED_SERVICES = [
  'песня под ключ',
  'написание текстов',
  'аранжировка',
  'сведение',
  'мастеринг',
  'запись вокала',
  'сведение вокала',
  'тюн вокала',
  'сведение подкастов',
  'саунд-дизайн (GSN audio)',
];

export const validateInquiryPayload = (payload = {}) => {
  const website = typeof payload.website === 'string' ? payload.website.trim() : '';
  if (website) return { ok: true, honeypot: true };

  const services = Array.isArray(payload.services) ? payload.services : [];
  if (!services.length) return { ok: false, error: 'Выберите хотя бы одну услугу.' };
  if (services.length > ALLOWED_SERVICES.length || services.some((service) => !ALLOWED_SERVICES.includes(service))) {
    return { ok: false, error: 'В заявке указана неизвестная услуга.' };
  }

  const telegram = typeof payload.telegram === 'string' ? payload.telegram.trim() : '';
  if (!TELEGRAM_HANDLE_PATTERN.test(telegram)) {
    return { ok: false, error: 'Укажите корректный ник в Telegram.' };
  }
  const brief = typeof payload.brief === 'string' ? payload.brief.trim() : '';
  if (brief.length > BRIEF_MAX_LENGTH) {
    return { ok: false, error: `Описание проекта не должно быть длиннее ${BRIEF_MAX_LENGTH} символов.` };
  }
  if (payload.consent !== true) return { ok: false, error: 'Необходимо согласие на обработку данных.' };

  return { ok: true, data: { services, telegram, brief, consent: true, website: '' } };
};

export const formatInquiryMessage = ({ services, telegram, brief = '' }) => {
  const normalizedBrief = typeof brief === 'string' ? brief.trim() : '';

  return [
    'Новая заявка с aotrom.art',
    '',
    'Услуги:',
    ...services.map((service) => `— ${service}`),
    ...(normalizedBrief ? ['', 'О проекте:', normalizedBrief] : []),
    '',
    `Telegram клиента: ${telegram}`,
    '',
    'Согласие на обработку данных отмечено в форме.',
  ].join('\n');
};

const parseBody = (body) => {
  if (!body) return {};
  if (typeof body === 'string') return JSON.parse(body);
  return body;
};

const isSameOrigin = (request) => {
  const origin = request.headers?.origin;
  const host = request.headers?.['x-forwarded-host'] || request.headers?.host;
  if (!origin || !host) return true;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
};

export const verifyTelegramBot = async (token, fetchImpl = fetch) => {
  try {
    const telegramResponse = await fetchImpl(`https://api.telegram.org/bot${token}/getMe`);
    const result = await telegramResponse.json().catch(() => ({}));
    return telegramResponse.ok
      && result.ok === true
      && result.result?.username?.toLowerCase() === TELEGRAM_BOT_USERNAME;
  } catch {
    return false;
  }
};

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Метод не поддерживается.' });
  if (!isSameOrigin(request)) return response.status(403).json({ error: 'Запрос отклонён.' });

  let payload;
  try {
    payload = parseBody(request.body);
  } catch {
    return response.status(400).json({ error: 'Некорректный формат заявки.' });
  }

  const validation = validateInquiryPayload(payload);
  if (!validation.ok) return response.status(400).json({ error: validation.error });
  if (validation.honeypot) return response.status(200).json({ ok: true });

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return response.status(503).json({ error: 'Бот временно недоступен.' });

  try {
    if (!await verifyTelegramBot(token)) {
      return response.status(503).json({ error: `Бот @${TELEGRAM_BOT_USERNAME} временно недоступен.` });
    }

    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: formatInquiryMessage(validation.data),
        disable_web_page_preview: true,
      }),
    });
    if (!telegramResponse.ok) throw new Error('Telegram rejected the request');
    return response.status(200).json({ ok: true });
  } catch {
    return response.status(502).json({ error: 'Не удалось доставить заявку в бот.' });
  }
}
