import assert from 'node:assert/strict';
import {
  buildTelegramDraft,
  createTelegramFallbackUrl,
  normalizeTelegramHandle,
  submitInquiry,
} from '../inquiry-form.js';

assert.equal(normalizeTelegramHandle('  @musicclient  '), '@musicclient');
assert.equal(normalizeTelegramHandle('music_client'), '@music_client');
assert.equal(normalizeTelegramHandle('https://t.me/musicclient'), '@musicclient');
assert.equal(normalizeTelegramHandle('bad handle!'), '');

const draft = buildTelegramDraft({
  services: ['песня под ключ', 'сведение вокала'],
  telegram: 'music_client',
});

assert.equal(
  draft,
  'Здравствуйте! Хочу обсудить проект.\n\nУслуги:\n— песня под ключ\n— сведение вокала\n\nМой Telegram: @music_client\n\nОтправляя сообщение, подтверждаю согласие: https://aotrom.art/consent/'
);
assert.throws(() => buildTelegramDraft({ services: [], telegram: '@music_client' }), /Выберите хотя бы одну услугу/);
assert.throws(() => buildTelegramDraft({ services: ['мастеринг'], telegram: 'bad handle!' }), /Укажите корректный ник/);
assert.match(buildTelegramDraft({ services: ['мастеринг'], telegram: '@music_client', brief: 'Нужна финальная полировка трека.' }), /О проекте:[\s\S]*финальная полировка/);

assert.equal(
  createTelegramFallbackUrl({ services: ['мастеринг'], telegram: '@music_client' }),
  'https://t.me/aotrombot'
);

const calls = [];
const result = await submitInquiry({
  services: ['мастеринг'],
  telegram: '@music_client',
  consent: true,
  website: '',
}, async (url, options) => {
  calls.push({ url, options });
  return { ok: true, json: async () => ({ ok: true }) };
});

assert.deepEqual(result, { ok: true });
assert.equal(calls[0].url, '/api/inquiry');
assert.equal(calls[0].options.method, 'POST');
assert.deepEqual(JSON.parse(calls[0].options.body), {
  services: ['мастеринг'],
  telegram: '@music_client',
  consent: true,
  website: '',
});

await assert.rejects(
  submitInquiry({ services: ['мастеринг'], telegram: '@music_client', consent: true }, async () => ({
    ok: false,
    status: 503,
    json: async () => ({ error: 'Бот временно недоступен.' }),
  })),
  /Бот временно недоступен/
);

console.log('inquiry form contract passes');
