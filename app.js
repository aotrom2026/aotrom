import { entries } from './portfolio-data.js';

const releaseList = document.querySelector('#release-list');

releaseList.className = 'artist-list';

const renderEntry = ({ number, title, type, href }) => `
  <article class="artist-row">
    <span class="artist-row__number">${number}</span>
    <h3 class="artist-row__title">${title}</h3>
    <span class="artist-row__type">${type}</span>
    <a class="artist-row__action" href="${href}" aria-label="войти: ${title}">войти <span aria-hidden="true">↗</span></a>
  </article>
`;

const musicEntries = entries.filter(({ category }) => category === 'music');
const tvEntries = entries.filter(({ category }) => category === 'tv');

releaseList.innerHTML = `
  ${musicEntries.map(renderEntry).join('')}
  <div class="artist-group-label"><span>ТВ‑проекты</span></div>
  ${tvEntries.map(renderEntry).join('')}
`;
