import { entries } from './portfolio-data.js';

const releaseList = document.querySelector('#release-list');

releaseList.className = 'artist-list';

const renderEntry = ({ number, title, type, href }) => `
  <a class="artist-row" href="${href}" aria-label="Открыть страницу: ${title}">
    <span class="artist-row__number">${number}</span>
    <h3 class="artist-row__title">${title}</h3>
    <span class="artist-row__type">${type}</span>
    <span class="artist-row__action">войти <span class="external-icon" aria-hidden="true"></span></span>
  </a>
`;

const musicEntries = entries.filter(({ category }) => category === 'music');
const tvEntries = entries.filter(({ category }) => category === 'tv');

releaseList.innerHTML = `
  ${musicEntries.map(renderEntry).join('')}
  <div class="artist-group-label"><span>ТВ‑проекты</span></div>
  ${tvEntries.map(renderEntry).join('')}
`;

const videoPoster = document.querySelector('.video-feature__poster');

videoPoster?.addEventListener('click', () => {
  const videoFrame = videoPoster.parentElement.querySelector('iframe[data-src]');
  videoFrame.src = videoFrame.dataset.src;
  videoFrame.hidden = false;
  videoPoster.remove();
});
