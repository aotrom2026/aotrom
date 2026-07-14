import assert from 'node:assert/strict';
import {
  ALLOWED_SERVICES,
  formatInquiryMessage,
  validateInquiryPayload,
} from '../api/inquiry.js';

assert.equal(ALLOWED_SERVICES.length, 9);

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

console.log('inquiry API contract passes');
