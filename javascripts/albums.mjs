// One catalog for the listing, album pages and player. Keep newest albums first.
// Each track has a display name and links to both audio formats.
const tracks = (folder, names) => names.map(file => ({
  name: file.replace(/^\d+ - \d+ - /, ''),
  src: `/audio/${folder}/${file}.mp3`,
  ogg: `/audio/${folder}/${file}.ogg`,
}));

export default [
  {
    id: 'cartography-of-weights-and-scales', slug: 'cartography-of-weights-and-scales',
    title: 'Cartography of Weights and Scales', year: 2026, visible: false,
    genre: 'Dream rock / Art pop', cover: '/audio/cartography-of-weights-and-scales/cover.png',
    description: 'A private map of memory, belonging and the small things we carry. Dream rock, dark pop and restrained guitars leave room for the details.',
    detail: 'These songs trace inner geography through everyday objects and rituals: a mirror out of reach, a wrong address, the things too small to save and too intimate to leave behind.',
    tracks: tracks('cartography-of-weights-and-scales', [
      '04 - 01 - Nod Me a Waltz', '04 - 02 - Too High for Me', '04 - 03 - Creek Shlup',
      '04 - 04 - My Cherry Air', '04 - 05 - Life is Displace (Life in Displays)',
      '04 - 06 - First Train (Esplanadi)', '04 - 07 - every.wrong.existence', '04 - 08 - Little Things',
    ]),
  },
  {
    id: 'almost-home-again', slug: 'almost-home-again', title: 'Almost Home Again',
    year: 2026, visible: false, genre: 'Indie / Post-rock', cover: '/audio/almost-home-again/cover.png',
    description: 'A quiet journey from outer space into memory, ancestry and the feeling of finding your way home.',
    detail: 'Shimmering guitars and grounded rhythms move between distant horizons and small moments of warmth. Folklore, solitude and the stillness of Kallavesi sit alongside a search for belonging.',
    tracks: tracks('almost-home-again', [
      '03 - 01 - Fall into abyss', '03 - 02 - Dysmorphia', '03 - 03 - Sometimes it breaks all at once',
      '03 - 04 - IEF (Ancient father of yours)', '03 - 05 - Huldra', '03 - 06 - Kallavesi (カラベシの湖)',
      '03 - 07 - Almost home again', '03 - 08 - Stay awhile my hidden child',
    ]),
  },
  {
    id: 'zerone-be-side', slug: 'be-side', title: 'Zerone: Be-side', year: 2025, visible: true,
    genre: 'Indie rock / Post-rock', cover: '/audio/zerone-be-side/zerone-be-side.jpg',
    description: 'Long summer light, late-July rain and the slow arrival of autumn. A quieter record about atmosphere, memory and the passing of seasons.',
    detail: 'Guitars, piano and spacious drums move between indie rock, dream rock and soft post-metal. The songs follow summer into city routines, distant love and, finally, a quiet sauna hymn on a cold September evening.',
    tracks: tracks('zerone-be-side', [
      '02 - 01 - Chiaroscuro (Light and shadow)', "02 - 02 - Fruntimmersveckan (Women's day)",
      '02 - 03 - Oshiya', '02 - 04 - Pradenn', '02 - 05 - Calendar', '02 - 06 - Sargassum',
      '02 - 07 - The c-romance', '02 - 08 - Linnut liitelee ilman',
    ]),
  },
  {
    id: 'zerone', slug: 'zerone', title: 'Zerone', year: 2025, visible: true,
    genre: 'Post-rock', cover: '/audio/zerone/zerone.jpg',
    description: 'From autumn light to the frostbitten edge of spring. Guitars, slow crescendos and a little resistance to the thaw.',
    detail: 'An eight-track journey through the Nordic winter: autumn gives way to polar-night stillness, with folk-inspired stories and orchestral textures along the way. Spring arrives as a disruption rather than an easy resolution.',
    tracks: tracks('zerone', [
      '01 - 01 - Fading Horizons', '01 - 02 - Mirages of Light', '01 - 03 - Whispers of a Fading Dream',
      '01 - 04 - Eternal Shifts', '01 - 05 - Whispers of Spring', '01 - 06 - Kaamos',
      '01 - 07 - Snow walk', '01 - 08 - Spring goes to Hel',
    ]),
  },
];
