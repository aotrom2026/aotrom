import assert from 'node:assert/strict';
import { buildTelegramDraft, normalizeTelegramHandle } from '../inquiry-form.js';

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

console.log('inquiry form contract passes');
