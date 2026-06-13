export interface RawComptine {
  id: string;
  title: string;
  language: string;
  lyrics: string;
  difficulty: "Débutant" | "Intermédiaire" | "Avancé";
  region: string;
}

export const COMPTINES_1001_CATALOG: RawComptine[] = [
  {
    id: "RAW-FR-001",
    title: "Au clair de la lune",
    language: "fr",
    difficulty: "Débutant",
    region: "France",
    lyrics: "Au clair de la lune,\nMon ami Pierrot,\nPrête-moi ta plume\nPour écrire un mot.\nMa chandelle est morte,\nJe n'ai plus de feu,\nOuvre-moi ta porte,\nPour l'amour de Dieu."
  },
  {
    id: "RAW-FR-002",
    title: "Frère Jacques",
    language: "fr",
    difficulty: "Débutant",
    region: "France",
    lyrics: "Frère Jacques, Frère Jacques,\nDormez-vous ? Dormez-vous ?\nSonnez les matines ! Sonnez les matines !\nDin, dan, don ! Din, dan, don !"
  },
  {
    id: "RAW-FR-003",
    title: "Il pleut, il pleut, bergère",
    language: "fr",
    difficulty: "Intermédiaire",
    region: "Normandie",
    lyrics: "Il pleut, il pleut, bergère,\nRentre tes blancs moutons,\nAllons sous ma chaumière,\nBergère, vite, allons.\n\nJ'entends sous le feuillage\nL'eau qui tombe à grands bruits.\nVoici venir l'orage,\nVoilà l'éclair qui luit."
  },
  {
    id: "RAW-FR-004",
    title: "Une souris verte",
    language: "fr",
    difficulty: "Débutant",
    region: "Traditionnel",
    lyrics: "Une souris verte\nQui courait dans l'herbe\nJe l'attrape par la queue,\nJe la montre à ces messieurs\nCes messieurs me disent :\nTrempez-la dans l'eau,\nTrempez-la dans l'huile,\nÇa fera un escargot\nTout chaud !"
  },
  {
    id: "RAW-EN-001",
    title: "Twinkle Twinkle Little Star",
    language: "en",
    difficulty: "Débutant",
    region: "Angleterre",
    lyrics: "Twinkle, twinkle, little star,\nHow I wonder what you are!\nUp above the world so high,\nLike a diamond in the sky.\n\nWhen the blazing sun is gone,\nWhen he nothing shines upon,\nThen you show your little light,\nTwinkle, twinkle, all the night."
  },
  {
    id: "RAW-EN-002",
    title: "London Bridge Is Falling Down",
    language: "en",
    difficulty: "Intermédiaire",
    region: "Londres",
    lyrics: "London Bridge is falling down,\nFalling down, falling down.\nLondon Bridge is falling down,\nMy fair lady.\n\nBuild it up with wood and clay,\nWood and clay, wood and clay,\nWood and clay will wash away,\nMy fair lady."
  },
  {
    id: "RAW-MFE-001",
    title: "Mo deor, lapli pe tonbe",
    language: "mfe",
    difficulty: "Intermédiaire",
    region: "Maurice",
    lyrics: "Mo deor, lapli pe tonbe,\nTonton mo seve pe mouye.\nLouvri laport pou mo rantre,\nDonn mo enn ti bwar pou mo sofe."
  },
  {
    id: "RAW-JA-001",
    title: "Kagome Kagome",
    language: "ja",
    difficulty: "Avancé",
    region: "Kyoto, Japon",
    lyrics: "Kagome kagome / Kago no naka no tori wa\nItsu itsu deyaru / Yoake no ban ni\nTsuru to kame ga subetta\nUshiro no shoumen daare?"
  },
  {
    id: "RAW-HI-001",
    title: "Chanda Mama Door Ke",
    language: "hi",
    difficulty: "Intermédiaire",
    region: "Inde",
    lyrics: "Chanda mama door ke, puye pakaye boor ke.\nAap khaye thali mein, munne ko de pyali mein.\n\nPyali gayi toot, munna gaya rooth!\nLayenge nayi pyaliyan, baja baja ke taliyan!"
  },
  {
    id: "RAW-ZH-001",
    title: "Mo Li Hua (Fleur de Jasmin)",
    language: "zh",
    difficulty: "Avancé",
    region: "Traditionnel Chinois",
    lyrics: "Hao yi duo mei li de mo li hua\nHao yi duo mei li de mo li hua\nFen fang mei li man zhi ya\nYou bai you xiang ren ren kua\n\nXiang song gei bie ren jia\nMo li hua ya mo li hua"
  },
  {
    id: "RAW-AF-001",
    title: "Obwisana Saana Kroma",
    language: "af",
    difficulty: "Intermédiaire",
    region: "Ghana (Akan)",
    lyrics: "Obwisana saana kroma\nObwisana saana kroma\nObwisana saana kroma\nObwisana saana kroma\n\n(Chanson traditionnelle de jeu de pierres en cercle)."
  },
  {
    id: "RAW-FR-005",
    title: "Gentil coquelicot, Mesdames",
    language: "fr",
    difficulty: "Intermédiaire",
    region: "Poitou",
    lyrics: "J'ai descendu dans mon jardin\nPour y cueillir du romarin\nGentil coquelicot, Mesdames\nGentil coquelicot, nouveau\n\nJe n'en avais pas cueilli trois brins\nQu'un rossignol vint sur ma main"
  }
];
