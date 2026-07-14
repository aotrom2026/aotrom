const TELEGRAM_USERNAME = 'aotrom0';
const TELEGRAM_HANDLE_PATTERN = /^[a-zA-Z0-9_]{5,32}$/;

export const normalizeTelegramHandle = (value = '') => {
  const trimmed = value.trim();
  const withoutUrl = trimmed.replace(/^https?:\/\/(?:www\.)?t\.me\//i, '');
  const username = withoutUrl.replace(/^@/, '');

  return TELEGRAM_HANDLE_PATTERN.test(username) ? `@${username}` : '';
};

export const buildTelegramDraft = ({ services = [], telegram = '', brief = '' } = {}) => {
  if (!services.length) {
    throw new Error('Выберите хотя бы одну услугу.');
  }

  const handle = normalizeTelegramHandle(telegram);
  if (!handle) {
    throw new Error('Укажите корректный ник в Telegram.');
  }

  const normalizedBrief = typeof brief === 'string' ? brief.trim() : '';

  return [
    'Здравствуйте! Хочу обсудить проект.',
    '',
    'Услуги:',
    ...services.map((service) => `— ${service}`),
    ...(normalizedBrief ? ['', 'О проекте:', normalizedBrief] : []),
    '',
    `Мой Telegram: ${handle}`,
    '',
    'Отправляя сообщение, подтверждаю согласие: https://aotrom.art/consent/',
  ].join('\n');
};

export const createTelegramFallbackUrl = (payload) => {
  const draft = buildTelegramDraft(payload);
  return `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(draft)}`;
};

export const submitInquiry = async (payload, fetchImpl = fetch) => {
  const response = await fetchImpl('/api/inquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || 'Не удалось отправить заявку.');
  return result;
};

const form = typeof document === 'undefined' ? null : document.querySelector('#inquiry-form');

if (form) {
  const servicesError = form.querySelector('#services-error');
  const telegramInput = form.elements.telegram;
  const briefInput = form.elements.brief;
  const telegramError = form.querySelector('#telegram-error');
  const consentInput = form.elements['personal-data-consent'];
  const consentError = form.querySelector('#consent-error');
  const status = form.querySelector('#inquiry-status');

  const clearErrors = () => {
    servicesError.textContent = '';
    telegramError.textContent = '';
    consentError.textContent = '';
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors();

    const services = [...form.querySelectorAll('input[name="services"]:checked')]
      .map(({ value }) => value);
    const handle = normalizeTelegramHandle(telegramInput.value);
    let firstInvalid = null;

    if (!services.length) {
      servicesError.textContent = 'Выберите хотя бы одну услугу.';
      firstInvalid = form.querySelector('input[name="services"]');
    }

    if (!handle) {
      telegramError.textContent = 'Укажите корректный ник: от 5 до 32 латинских букв, цифр или знаков подчёркивания.';
      firstInvalid ||= telegramInput;
    }

    if (!consentInput.checked) {
      consentError.textContent = 'Подтвердите согласие, чтобы продолжить.';
      firstInvalid ||= consentInput;
    }

    if (firstInvalid) {
      firstInvalid.focus();
      status.textContent = 'Проверьте отмеченные поля.';
      return;
    }

    telegramInput.value = handle;
    const submitButton = form.querySelector('.inquiry__submit');
    const payload = {
      services,
      telegram: handle,
      brief: briefInput.value.trim(),
      consent: consentInput.checked,
      website: form.elements.website.value,
    };
    submitButton.disabled = true;
    status.textContent = 'Отправляем заявку…';

    try {
      await submitInquiry(payload);
      form.reset();
      telegramInput.value = '';
      status.textContent = 'Заявка отправлена. Андрей ответит вам в Telegram.';
    } catch {
      const telegramUrl = createTelegramFallbackUrl(payload);
      form.dataset.telegramUrl = telegramUrl;
      status.textContent = 'Бот пока недоступен. Открылся резервный чат — отправьте подготовленное сообщение.';
      window.open(telegramUrl, '_blank', 'noopener,noreferrer');
    } finally {
      submitButton.disabled = false;
    }
  });
}
