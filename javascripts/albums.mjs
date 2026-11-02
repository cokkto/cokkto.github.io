// One catalog for the listing, album pages and player. Keep newest albums first.
// Each track has a display name and links to both audio formats.
const tracks = (folder, names) =>
  names.map((file) => ({
    name: file.replace(/^\d+ - [^-]+ - /, ""),
    src: `/audio/${folder}/${file}.mp3`,
    ogg: `/audio/${folder}/${file}.ogg`,
  }));

export const musicCopy =
  "I started with words, moods and sounds recorded at home, then shaped them into songs with guitars, piano and AI tools. The voices are synthetic; the stories and feelings are my own. Coming from graphic design, this is my way of learning to compose with sound instead of images.";

export default [
  {
    id: "norenval-nikudjshnoe",
    slug: "norenval-nikudjshnoe",
    artist: { name: "Norenval", type: "MusicGroup" },
    title: "Никудышное",
    year: 2026,
    releaseDate: null,
    visible: false,
    featured: false,
    genre: "Rock",
    showReleaseDate: false,
    language: "ru",
    introEyebrow: "Русскоязычный проект",
    cover: "/audio/norenval-nikudjshnoe/cover.png",
    metaImage: "/metaimages/norenval-nikudjshnoe.png",
    description:
      "Из-за странных вывертов психики мне лично иногда нужно послушать что-нибудь грустное и безнадёжное — это добавляет мне оптимизма. Если вдруг вам, как и мне, для поднятия боевого духа нужен похожий эмоциональный толчок или просто есть желание похандрить серым осенним вечером, то добро пожаловать — послушайте альбом «Никудышное» от виртуального проекта Norenval.",
    metaDescription:
      "Слушайте «Никудышное» — альбом виртуального проекта Norenval: восемь песен для грустного настроения и серых осенних вечеров.",
    intro: [
      "Если мир полон красок и радости и вы не хотите нарушать эту идиллию, отложите этот альбом до более подходящего настроения. Он получился не очень жизнерадостным.",
      "Я предупредил.",
    ],
    detail: [
      "Однажды я написал песню на русском для своей жены. У меня в тот момент было острое желание послушать что-то с лёгким привкусом ретро-эстрады семидесятых, и английский для этого мне совсем не годился. Лирикой я надеялся передать свою любовь, через образы моря и ветра рассказать, как моя жена помогает мне двигаться дальше вопреки всему. Так получилась «Дальняя даль моя». Но ей этот трек категорически не понравился: слишком мрачно и печально, сказала она. В общем, рыдать хочется. И, возможно, здесь должна была бы последовать какая-то моя эмоциональная реакция или мораль, но её нет.",
      "Я извинился, потому что то, что придаёт мне сил, может оказаться угнетающим для другого. Мы просто договорились, что если я опять насочиняю какую-нибудь тоску, то просто расскажу, что и этот трек я написал исключительно для неё, жена меня похвалит и оценит моё внимание, но слушать не станет.",
    ],
    releaseLinks: [],
    tracks: tracks("norenval-nikudjshnoe", [
      "01 - Norenval - Никудышное",
      "02 - Norenval - Дальняя Даль Моя",
      "03 - Norenval - Город Роботов",
      "04 - Norenval - Кто Раскачивает Ветку",
      "05 - Norenval - Мы Последние",
      "06 - Norenval - Трещины На Асфальте (Переживём И Переначнём)",
      "07 - Norenval - В одиночестве",
      "08 - Norenval - Новогодняя",
    ]),
  },
  {
    id: "cartography-of-weights-and-scales",
    slug: "cartography-of-weights-and-scales",
    artist: { name: "Cold Return", type: "MusicGroup" },
    title: "Cartography of Weights and Scales",
    year: 2026,
    releaseDate: null,
    visible: false,
    featured: false,
    genre: "Dream rock / Art pop",
    showReleaseDate: true,
    language: "en",
    introEyebrow: "",
    intro: [],
    releaseLinks: [],
    cover: "/audio/cartography-of-weights-and-scales/cover.png",
    metaImage: "/metaimages/cartography-of-weights-and-scales.png",
    description:
      "A private map of memory, belonging and the small things we carry. Dream rock, dark pop and restrained guitars leave room for the details.",
    metaDescription:
      "Listen to Cartography of Weights and Scales by Cold Return: dream rock and art pop exploring memory, belonging and everyday rituals.",
    detail: [
      "These songs trace inner geography through everyday objects and rituals: a mirror out of reach, a wrong address, the things too small to save and too intimate to leave behind.",
    ],
    tracks: tracks("cartography-of-weights-and-scales", [
      "04 - 01 - Nod Me a Waltz",
      "04 - 02 - Too High for Me",
      "04 - 03 - Creek Shlup",
      "04 - 04 - My Cherry Air",
      "04 - 05 - Life is Displace (Life in Displays)",
      "04 - 06 - First Train (Esplanadi)",
      "04 - 07 - every.wrong.existence",
      "04 - 08 - Little Things",
    ]),
  },
  {
    id: "almost-home-again",
    slug: "almost-home-again",
    title: "Almost Home Again",
    artist: { name: "Cold Return", type: "MusicGroup" },
    year: 2026,
    releaseDate: "2026-10-30",
    visible: true,
    featured: true,
    genre: "Indie / Post-rock",
    showReleaseDate: true,
    language: "en",
    cover: "/audio/almost-home-again/cover.png",
    metaImage: "/metaimages/almost-home-again.png",
    description:
      "A quiet journey from outer space into memory, ancestry and the feeling of finding your way home.",
    metaDescription:
      "Listen to Almost Home Again by Cold Return: atmospheric indie rock and post-rock exploring memory, ancestry and finding your way home.",
    detail: [
      "Shimmering guitars and grounded rhythms move between distant horizons and small moments of warmth. Folklore, solitude and the stillness of Kallavesi sit alongside a search for belonging.",
    ],
    introEyebrow: "Listen everywhere",
    intro: [
      "<em>Almost Home Again</em> is a new album from <strong>Cold Return</strong>, an independent music project combining atmospheric indie rock, folk rock, and nordic mood.",
      "The music and lyrics are written by a human musician, while AI gives them voices and instruments. Discover the cool, introspective sound of Cold Return, straight from the remote northern reaches of Scandinavia.",
    ],
    releaseLinks: [
      {
        name: "Spotify",
        icon: "spotify",
        url: "https://open.spotify.com/artist/3HaKfCi8b0DBggcu3BzLgt",
      },
      {
        name: "YouTube Music",
        icon: "youtubemusic",
        url: "https://music.youtube.com/playlist?list=OLAK5uy_mgJAk90dwJDdGq0QEUOodq3D6U-GN0Oaw",
      },
      {
        name: "Apple Music",
        icon: "applemusic",
        url: "https://music.apple.com/us/artist/cold-return/6823736555",
      },
      {
        name: "Amazon Music",
        icon: "amazonmusic",
        url: "https://music.amazon.com/albums/B0HNKTHKRH",
      },
      {
        name: "SoundCloud",
        icon: "soundcloud",
        url: "https://soundcloud.com/coldreturn",
      },
    ],
    tracks: tracks("almost-home-again", [
      "03 - 01 - Fall into abyss",
      "03 - 02 - Dysmorphia",
      "03 - 03 - Sometimes it breaks all at once",
      "03 - 04 - IEF (Ancient father of yours)",
      "03 - 05 - Huldra",
      "03 - 06 - Kallavesi (カラベシの湖)",
      "03 - 07 - Almost home again",
      "03 - 08 - Stay awhile my hidden child",
    ]),
  },
  {
    id: "zerone-be-side",
    slug: "be-side",
    title: "Zerone: Be-side",
    artist: { name: "Aleksi Salo", type: "Person", url: "https://cocteau.name/" },
    year: 2025,
    releaseDate: null,
    visible: true,
    featured: false,
    genre: "Indie rock / Post-rock",
    showReleaseDate: true,
    language: "en",
    introEyebrow: "",
    intro: [],
    releaseLinks: [],
    cover: "/audio/zerone-be-side/zerone-be-side.jpg",
    metaImage: "/metaimages/zerone-be-side.png",
    description:
      "Long summer light, late-July rain and the slow arrival of autumn. A quieter record about atmosphere, memory and the passing of seasons.",
    metaDescription:
      "Listen to Zerone: Be-side by Aleksi Salo, an indie and post-rock album about summer light, memory and the slow arrival of autumn.",
    detail: [
      "Guitars, piano and spacious drums move between indie rock, dream rock and soft post-metal. The songs follow summer into city routines, distant love and, finally, a quiet sauna hymn on a cold September evening.",
      musicCopy,
    ],
    tracks: tracks("zerone-be-side", [
      "02 - 01 - Chiaroscuro (Light and shadow)",
      "02 - 02 - Fruntimmersveckan (Women's day)",
      "02 - 03 - Oshiya",
      "02 - 04 - Pradenn",
      "02 - 05 - Calendar",
      "02 - 06 - Sargassum",
      "02 - 07 - The c-romance",
      "02 - 08 - Linnut liitelee ilman",
    ]),
  },
  {
    id: "zerone",
    slug: "zerone",
    title: "Zerone",
    artist: { name: "Aleksi Salo", type: "Person", url: "https://cocteau.name/" },
    year: 2025,
    releaseDate: null,
    visible: true,
    featured: false,
    genre: "Post-rock",
    showReleaseDate: true,
    language: "en",
    introEyebrow: "",
    intro: [],
    releaseLinks: [],
    cover: "/audio/zerone/zerone.jpg",
    metaImage: "/metaimages/zerone.png",
    description:
      "From autumn light to the frostbitten edge of spring. Guitars, slow crescendos and a little resistance to the thaw.",
    metaDescription:
      "Listen to Zerone by Aleksi Salo, a post-rock album tracing Nordic winter from autumn light through polar night to spring.",
    detail: [
      "An eight-track journey through the Nordic winter: autumn gives way to polar-night stillness, with folk-inspired stories and orchestral textures along the way. Spring arrives as a disruption rather than an easy resolution.",
    ],
    tracks: tracks("zerone", [
      "01 - 01 - Fading Horizons",
      "01 - 02 - Mirages of Light",
      "01 - 03 - Whispers of a Fading Dream",
      "01 - 04 - Eternal Shifts",
      "01 - 05 - Whispers of Spring",
      "01 - 06 - Kaamos",
      "01 - 07 - Snow walk",
      "01 - 08 - Spring goes to Hel",
    ]),
  },
];
