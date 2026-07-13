import { entryByKey, groupByKey } from './portfolio-data.js';

const key = document.body.dataset.portfolioKey;
const entry = entryByKey[key];
const group = groupByKey[key];
const root = document.querySelector('#work-page-content');

if (!entry || !group || !root) {
  throw new Error('Страница портфолио не настроена.');
}

const action = group.kind === 'видео' ? 'смотреть' : 'слушать';
const imagePath = entry.image ? `../${entry.image}` : '';
const renderLabel = (label) => {
  if (label === 'album') {
    return '<span class="release-label release-label--album" aria-label="album"><img src="../assets/stamps/album.png" alt=""></span>';
  }

  return `<span class="release-label">${label}</span>`;
};
const media = entry.image ? `
  <figure class="work-page__polaroid${entry.monochrome ? ' work-page__polaroid--mono' : ''}">
    <img src="${imagePath}" alt="${entry.title}" fetchpriority="high">
  </figure>
` : '';

root.innerHTML = `
  <section class="work-page section" aria-labelledby="work-page-title">
    <div class="work-page__bar">
      <a class="work-page__back" href="../" aria-label="Вернуться на главную aotrom"><span class="back-icon" aria-hidden="true"></span> назад</a>
      <span>${entry.number} / ${entry.type}</span>
    </div>
    <div class="work-page__intro${entry.image ? '' : ' work-page__intro--text-only'}">
      <h1 id="work-page-title">${entry.title}</h1>
      ${media}
    </div>
    <section class="work-page__works" aria-labelledby="work-page-works-title">
      <div class="work-page__works-heading">
        <p class="section__kicker">работы</p>
        <h2 id="work-page-works-title">${group.kind}</h2>
      </div>
      <ol class="work-page__links">
        ${group.links.map(({ title, url, label }, index) => `
          <li>
            <span>${String(index + 1).padStart(2, '0')}</span>
            <a href="${url}" target="_blank" rel="noreferrer">
              <span class="work-page__release-name">${title}${label ? renderLabel(label) : ''}</span>
              <em>${action}<span class="external-icon" aria-hidden="true"></span></em>
            </a>
          </li>
        `).join('')}
      </ol>
    </section>
  </section>
`;
