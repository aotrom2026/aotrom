export const entries = [
  { key: 'kauzatsiya', number: '01', title: 'каузация', type: 'артист', category: 'music', href: 'kauzatsiya/', image: 'assets/characters/kauzatsiya.jpg', monochrome: true },
  { key: 'alya', number: '02', title: 'ALYA', type: 'артист', category: 'music', href: 'alya/', image: 'assets/characters/alya.jpg', monochrome: true },
  { key: 'viktoriya-solomakhina', number: '03', title: 'Виктория Соломахина', type: 'артист', category: 'music', href: 'viktoriya-solomakhina/', image: 'assets/characters/viktoriya-solomakhina.jpg', monochrome: true },
  { key: 'nablyudateli', number: '04', title: 'Наблюдатели', type: 'артист', category: 'music', href: 'nablyudateli/', image: 'assets/characters/nablyudateli.jpg', monochrome: true },
  { key: 'aotrom', number: '05', title: 'aotrom', type: 'артист', category: 'music', href: 'aotrom/', image: null, monochrome: false },
  { key: 'laren', number: '06', title: 'LAREN', type: 'артист', category: 'music', href: 'laren/', image: null, monochrome: false },
  { key: 'vladimir-shirokov', number: '07', title: 'Владимир Широков', type: 'артист', category: 'music', href: 'vladimir-shirokov/', image: null, monochrome: false },
  { key: 'altro-coro', number: '08', title: 'ALTRO CORO', type: 'артист', category: 'music', href: 'altro-coro/', image: null, monochrome: false },
  { key: 'other-projects', number: '09', title: 'Остальные проекты', type: 'проект', category: 'music', href: 'other-projects/', image: null, monochrome: false },
  { key: 'golos', number: '10', title: 'Голос', type: 'проект', category: 'tv', href: 'golos/', image: 'assets/projects/golos.png', monochrome: false },
  { key: 'bravo-bis', number: '11', title: 'Браво Бис', type: 'проект', category: 'tv', href: 'bravo-bis/', image: 'assets/projects/bravo-bis.png', monochrome: false },
];

const link = (title, url) => ({ title, url });

export const portfolioGroups = [
  {
    key: 'viktoriya-solomakhina', title: 'Виктория Соломахина', kind: 'музыка',
    links: [
      link('Полюшко', 'https://band.link/__polushko'),
      link('Русалочка', 'https://bnd.lc/rusalochkaa'),
      link('Унеси', 'https://vikso.band.link/_unesi'),
      link('Проснись со мной', 'https://band.link/prosnissomnoy'),
      link('Прощай', 'https://band.link/proshay'),
      link('Мой городок', 'https://band.link/moygorodok'),
    ],
  },
  {
    key: 'kauzatsiya', title: 'каузация', kind: 'музыка',
    links: [
      link('От меня до тебя', 'https://aliy-mayak.band.link/otdt'),
      link('Научиться', 'https://band.link/nauchitsya'),
      link('Раньше', 'https://band.link/ranorano'),
    ],
  },
  {
    key: 'alya', title: 'ALYA', kind: 'музыка',
    links: [
      link('не любить', 'https://band.link/8Kxmc'),
      link('решено', 'https://band.link/Zqv4j'),
      link('не жди', 'https://band.link/Xo9Ts'),
      link('мимо', 'https://band.link/2cXdt'),
      link('последний вальс', 'https://band.link/nnkQj'),
      link('оглянись', 'https://band.link/MpXBr'),
      link('ближе', 'https://aliy-mayak.bnd.lc/blizhee'),
      link('я утону', 'https://band.link/rztpq'),
    ],
  },
  {
    key: 'aotrom', title: 'aotrom', kind: 'музыка',
    links: [
      link('Взрослый — aotrom Remix', 'http://lnk.embers.digital/remixed'),
      link('exposure', 'https://band.link/exposure?fbclid=PAZXh0bgNhZW0CMTEAAaY0xzLidKeyibymPVt1IPZ5uf4wNVWkUfV_o-khjTcl-UrdQbtd5WAOb6I_aem_WgGBvwBXBr_GXN6AUII5ZA'),
      link('loss', 'https://band.link/lossaotrom'),
      link('sympathy', 'https://band.link/sympathyaotrom'),
    ],
  },
  {
    key: 'laren', title: 'LAREN', kind: 'музыка',
    links: [
      link('Теряю контроль', 'https://zvonko.link/204890A'),
      link('Мне не хватило сил', 'https://zvonko.link/20F9445'),
      link('куда уходит свет?', 'https://zvonko.link/214A93B'),
      link('Мария', 'https://zvonko.link/2450304'),
    ],
  },
  {
    key: 'vladimir-shirokov', title: 'Владимир Широков', kind: 'музыка',
    links: [
      link('Ты танцуешь одна / Дыхание', 'https://band.link/DYHANIE_ALBUM'),
      link('Ты танцуешь одна', 'https://music.yandex.ru/album/36334657/track/138468675?utm_source=web&utm_medium=copy_link'),
    ],
  },
  {
    key: 'nablyudateli', title: 'Наблюдатели', kind: 'музыка',
    links: [
      link('Плесень', 'https://band.link/mjGPe'),
      link('Один на двоих', 'https://band.link/r0Ofj'),
    ],
  },
  {
    key: 'altro-coro', title: 'ALTRO CORO', kind: 'музыка',
    links: [
      link('Мой городок', 'https://band.link/moygorodok'),
      link('Друг', 'https://band.link/_dryg'),
    ],
  },
  {
    key: 'other-projects', title: 'Остальные проекты', kind: 'музыка',
    links: [
      link('Музыка внутри', 'https://band.link/XY8Vf'),
      link('Fire', 'https://band.link/keirafire'),
      link('Red', 'https://onerpm.link/902558270024?fbclid=PAAaaL8po36c9IoUv8oKC7uqG4Z_ISgOUNExysskmrLGhZ9Nb-qMdJip3TiKo_aem_AZH4Vq1xjNXrq4dsc3luA3Uz9z7mroiXfwwEeHjqD5q-DMxAB8hdz7voULFoW5mlJv0'),
      link('Что делать', 'https://band.link/U6sIy'),
      link('Лотерея', 'http://allstarmusic.link/vita_lotereya'),
    ],
  },
  {
    key: 'golos', title: 'Голос', kind: 'видео',
    links: [
      link('Владислав Зотов — Ты не верь слезам', 'https://www.1tv.ru/-/eqgkx'),
      link('Виктория Соломахина — Выше', 'https://www.1tv.ru/shows/golos-11/vystupleniya/viktoriya-solomahina-vyshe-golos-11-chetvertfinal-fragment-vypuska-ot-19-05-2023'),
      link('Мария Мирова — Только', 'https://www.1tv.ru/-/sesqmi'),
      link('Елизавета Качурак — Я тебя рисую', 'https://www.1tv.ru/-/lrzwdr'),
      link('Голос 12 — Поединки, 15.03.2024', 'https://www.1tv.ru/-/dxceoo'),
      link('Голос 12 — Поединки, 22.03.2024', 'https://www.1tv.ru/-/tercbf'),
      link('Голос 12 — Четвертьфинал, 12.04.2024', 'https://www.1tv.ru/-/jvwpcu'),
      link('Владимир Гринченко и Алон Низамов — Свободна', 'https://1tv.ru/-/mbqbkf'),
      link('Валерия Асонова и Юрий Курнаков — Если ты когда-нибудь меня простишь', 'https://1tv.ru/-/cvbljs'),
      link('Валентина Яньшина — Метелица', 'https://www.1tv.ru/shows/golos-13/vystupleniya/valentina-yanshina-metelica-nokauty-golos-vypusk-ot-04-04-2025'),
      link('Валерия Асонова — Несчастливая любовь', 'https://1tv.ru/-/cbxmde'),
      link('Валерия Асонова — Эти цветы так кстати', 'https://1tv.ru/-/gpupyv'),
      link('Наталья Сергиенко — Heaven', 'https://1tv.ru/-/vupmof'),
    ],
  },
  {
    key: 'bravo-bis', title: 'Браво Бис', kind: 'видео',
    links: [
      link('Виктория Соломахина — I Will Always Love You', 'https://vkvideo.ru/video-232371204_456239286?pl=-232371204_1&t=19s'),
      link('Виктория Соломахина — Пёрышко', 'https://vkvideo.ru/video-232371204_456239227?pl=-232371204_1&t=29s'),
    ],
  },
];

export const entryByKey = Object.fromEntries(entries.map((entry) => [entry.key, entry]));
export const groupByKey = Object.fromEntries(portfolioGroups.map((group) => [group.key, group]));
