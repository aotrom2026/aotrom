const releases = [
  { year: '2026', title: 'новая музыка', status: 'скоро' },
  { year: '2026', title: 'неизданное', status: 'скоро' },
  { year: '2025', title: 'архив', status: 'скоро' },
];

const releaseList = document.querySelector('#release-list');

releaseList.innerHTML = releases.map(({ year, title, status }, index) => `
  <article class="release">
    <span class="release__number">${String(index + 1).padStart(2, '0')}</span>
    <h3 class="release__title">${title}</h3>
    <span class="release__year">${year}</span>
    <span class="release__status">${status}</span>
  </article>
`).join('');
