const characters = [
  { number: '01', title: 'каузация', image: 'assets/characters/kauzatsiya.jpg', href: 'kauzatsiya/' },
  { number: '02', title: 'ALYA', image: 'assets/characters/alya.jpg', href: 'alya/' },
  { number: '03', title: 'Виктория Соломахина', image: 'assets/characters/viktoriya-solomakhina.jpg', href: 'viktoriya-solomakhina/' },
];

const releaseList = document.querySelector('#release-list');

releaseList.className = 'people-grid';

releaseList.innerHTML = characters.map(({ number, title, image, href }) => `
  <a class="person-card" href="${href}" aria-label="${title}">
    <figure class="polaroid">
      <img src="${image}" alt="${title}" loading="lazy">
      <figcaption><span>${number}</span><strong>${title}</strong></figcaption>
    </figure>
  </a>
`).join('');
