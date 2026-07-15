import assert from 'node:assert/strict';
import {
  ALLOWED_SERVICES,
  verifyTelegramBot,
  formatInquiryMessage,
  validateInquiryPayload,
} from '../api/inquiry.js';
import handler from '../api/inquiry.js';

assert.equal(ALLOWED_SERVICES.length, 10);
assert.ok(ALLOWED_SERVICES.includes('написание текстов'));

const validPayload = {
  services: ['песня под ключ', 'сведение вокала'],
  telegram: '@music_client',
  brief: '',
  consent: true,
  website: '',
};

assert.deepEqual(validateInquiryPayload(validPayload), {
  ok: true,
  data: validPayload,
});

assert.match(formatInquiryMessage(validPayload), /Новая заявка с aotrom\.art/);
assert.match(formatInquiryMessage(validPayload), /песня под ключ/);
assert.match(formatInquiryMessage(validPayload), /@music_client/);

const describedPayload = { ...validPayload, brief: 'Нужна аранжировка демо и мягкое сведение вокала.' };
assert.match(formatInquiryMessage(describedPayload), /О проекте:/);
assert.match(formatInquiryMessage(describedPayload), /мягкое сведение вокала/);
assert.equal(validateInquiryPayload({ ...validPayload, brief: 'x'.repeat(1201) }).ok, false);

assert.deepEqual(validateInquiryPayload({ ...validPayload, services: [] }), {
  ok: false,
  error: 'Выберите хотя бы одну услугу.',
});
assert.equal(validateInquiryPayload({ ...validPayload, telegram: 'bad handle!' }).ok, false);
assert.equal(validateInquiryPayload({ ...validPayload, services: ['несуществующая услуга'] }).ok, false);
assert.equal(validateInquiryPayload({ ...validPayload, consent: false }).ok, false);
assert.deepEqual(validateInquiryPayload({ ...validPayload, website: 'spam.example' }), {
  ok: true,
  honeypot: true,
});

const botChecks = [];
assert.equal(
  await verifyTelegramBot('kept-server-side', async (url) => {
    botChecks.push(url);
    return {
      ok: true,
      json: async () => ({ ok: true, result: { username: 'aotrombot' } }),
    };
  }),
  true
);
assert.equal(botChecks[0], 'https://api.telegram.org/botkept-server-side/getMe');
assert.equal(
  await verifyTelegramBot('wrong-bot-token', async () => ({
    ok: true,
    json: async () => ({ ok: true, result: { username: 'another_bot' } }),
  })),
  false
);

const originalToken = process.env.TELEGRAM_BOT_TOKEN;
const originalChatId = process.env.TELEGRAM_CHAT_ID;
const originalFetch = globalThis.fetch;
const requests = [];
const responseRecorder = () => ({
  statusCode: null,
  body: null,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  },
});

try {
  process.env.TELEGRAM_BOT_TOKEN = 'handler-test-token';
  process.env.TELEGRAM_CHAT_ID = 'owner-chat-id';
  globalThis.fetch = async (url, options) => {
    requests.push({ url, options });
    if (url.endsWith('/getMe')) {
      return { ok: true, json: async () => ({ ok: true, result: { username: 'aotrombot' } }) };
    }
    return { ok: true, json: async () => ({ ok: true }) };
  };

  const successResponse = responseRecorder();
  await handler({
    method: 'POST',
    headers: { origin: 'https://aotrom.art', host: 'aotrom.art' },
    body: validPayload,
  }, successResponse);
  assert.equal(successResponse.statusCode, 200);
  assert.equal(requests[0].url, 'https://api.telegram.org/bothandler-test-token/getMe');
  assert.equal(requests[1].url, 'https://api.telegram.org/bothandler-test-token/sendMessage');

  requests.length = 0;
  globalThis.fetch = async (url) => {
    requests.push({ url });
    return { ok: true, json: async () => ({ ok: true, result: { username: 'another_bot' } }) };
  };
  const wrongBotResponse = responseRecorder();
  await handler({ method: 'POST', headers: {}, body: validPayload }, wrongBotResponse);
  assert.equal(wrongBotResponse.statusCode, 503);
  assert.equal(requests.length, 1);
} finally {
  if (originalToken === undefined) delete process.env.TELEGRAM_BOT_TOKEN;
  else process.env.TELEGRAM_BOT_TOKEN = originalToken;
  if (originalChatId === undefined) delete process.env.TELEGRAM_CHAT_ID;
  else process.env.TELEGRAM_CHAT_ID = originalChatId;
  globalThis.fetch = originalFetch;
}

console.log('inquiry API contract passes');
