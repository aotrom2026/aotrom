import { entries } from './portfolio-data.js';

const releaseList = document.querySelector('#release-list');

releaseList.className = 'artist-list';

releaseList.innerHTML = entries.map(({ number, title, type, href }) => `
  <article class="artist-row">
    <span class="artist-row__number">${number}</span>
    <h3 class="artist-row__title">${title}</h3>
    <span class="artist-row__type">${type}</span>
    <a class="artist-row__action" href="${href}" aria-label="войти: ${title}">войти <span aria-hidden="true">↗</span></a>
  </article>
`).join('');
