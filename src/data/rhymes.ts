import { NurseryRhyme } from "../types";

export const SEEDED_RHYMES: NurseryRhyme[] = [
  {
    id: "FR0001",
    title: "Ainsi font font font",
    language: "fr",
    origin: {
      country: "France",
      region: "Traditionnel"
    },
    type: "clapping_game",
    age_range: {
      min: 1,
      max: 5
    },
    skills: ["memory", "coordination", "rhythm", "fine_motor"],
    themes: ["movement", "puppets", "observation"],
    source: "Héritage Oral de France",
    lyrics_original: "Ainsi font, font, font\nLes petites marionnettes,\nAinsi font, font, font\nTrois petits tours et puis s'en vont.\n\nElles reviendront, dront, dront\nLes petites marionnettes,\nElles reviendront, dront, dront\nQuand les enfants dormiront.",
    translation_fr: "Ainsi font, font, font\nLes petites marionnettes...",
    variants: [
      "Ainsi dansent dandinent les marionnettes",
      "Qu'elles font font font de jolis petits bonds"
    ],
    cognitive_tags: ["observation", "pattern_recognition", "sequencing", "memory", "communication"],
    music: {
      tempo: 105,
      meter: "2/4",
      mood: "Joyful",
      cadence: "Rhythmic clapping cadence",
      call_response: false,
      repetition_level: "High",
      melody_complexity: "Simple"
    },
    linguistics: {
      vocabulary_level: "Beginner",
      phonetic_patterns: "Repetitive ending syllables (-ont, -ette)",
      syllable_count: 5,
      rhyme_scheme: "A-B-A-B",
      alliteration: true
    },
    heritage: {
      historical_period: "18th Century",
      region: "Anjou & Ile de France",
      oral_tradition: true,
      references: "Recueil des chants populaires de la France, Larousse (1889)",
      preservation_status: "Active"
    },
    ai_variants: {
      cognitive: "Focus game: Children fold and unfold hands to match the rhythm. Ask them to replace 'puppet' with nouns of different cognitive categories (animals, shapes).",
      creativity: "Create shadow puppets based on the hand shapes and tell a story about what the puppets do after they disappear.",
      science: "Inquiry into mechanical movement: discuss how joints in the wrist and hands act like puppet strings to pull fingers into rotation.",
      mathematics: "Count the turns ('trois petits tours'). Map out patterns of rotation: spin 3 times clockwise, then 3 times counter-clockwise.",
      language: "Introduce synonyms for movement (tourner, virevolter, tourbillonner) to enrich vocabulary of rotation.",
      leadership: "One child is the 'Puppeteer' who invents a new puppet gesture. All other children must mirror the action precisely, rotating roles.",
      entrepreneurship: "Plan a small puppet theater show: design ticketholding systems, assign rolls (advertiser, performer, stage manager).",
      health: "Stretching and hand therapy: use the rotating hand movements to warm up fingers and joints before cursive writing tasks.",
      emotional_intelligence: "Discuss feelings when things go away ('puis s'en vont') and the comforting anticipation of their return ('elles reviendront').",
      environmental_awareness: "Puppets made of natural upcycled leaves & sticks: reflect on materials found in forests versus artificial plastics."
    },
    knowledge_graph: [
      {
        id: "L1",
        skill: "Coordination Motrice",
        concept: "Rotation du poignet & synchronisation",
        activity: "Imiter la rotation des marionnettes au rythme de la comptine",
        evaluation: "Capacité à coordonner le geste circulaire avec le tempo musical"
      },
      {
        id: "L2",
        skill: "Séquençage Chronologique",
        concept: "Transition d'états (actif / sommeil)",
        activity: "Faire disparaître les mains sous l'assise au mot 'dormiront'",
        evaluation: "Réaction à l'indice verbal et gestion du temps de réaction"
      }
    ]
  },
  {
    id: "MFE001",
    title: "Zako a mase",
    language: "mfe",
    origin: {
      country: "Maurice",
      region: "Océan Indien"
    },
    type: "nursery_rhyme",
    age_range: {
      min: 2,
      max: 6
    },
    skills: ["rhythm", "language", "social_interaction", "observation"],
    themes: ["animals", "nature", "humor"],
    source: "Oral Tradition of Mauritius",
    lyrics_original: "Zako a masé,\nZako a bwaré,\nDan karo bannan,\nBann zako dans Sega,\nBwi, bwi, bwi so taba.\n\nTrap so lake tonton,\nTrap so lake!\nSinon li pou arete,\nLi pou bwar to kafe!",
    translation_fr: "Le singe a mangé,\nLe singe a bu,\nDans le champ de bananes,\nLes singes dansent le Séga,\nYé, yé, yé, sa pipe !\n\nAttrape sa queue mon oncle,\nAttrape sa queue !\nSinon il s'arrêtera,\nEt boira ton café !",
    variants: [
      "Zako vinn mase, zako bwar to dite",
      "Lapli tonton lapli, zako a mase"
    ],
    cognitive_tags: ["observation", "prediction", "sequencing", "communication"],
    music: {
      tempo: 120,
      meter: "6/8",
      mood: "Energetic",
      cadence: "Ternary Sega syncopation",
      call_response: true,
      repetition_level: "Medium",
      melody_complexity: "Moderate"
    },
    linguistics: {
      vocabulary_level: "Beginner",
      phonetic_patterns: "Mauritian creole typical vowels (-e, -an, -o)",
      syllable_count: 6,
      rhyme_scheme: "A-B-C-B",
      alliteration: false
    },
    heritage: {
      historical_period: "19th Century",
      region: "Pamplemousses",
      oral_tradition: true,
      references: "Kiltir ek Tradision Oral Morisien",
      preservation_status: "Active"
    },
    ai_variants: {
      cognitive: "Attention focus: Children listen for the word 'zako' and clap. If any other animal is named, they must keep silent.",
      creativity: "Invent a short story on why the monkey was stealing bananas and coffee. Paint or draw the monkey's secret jungle café.",
      science: "Examine monkey habitats: discuss why primates love bananas, the biology of prehensile tails, and rainforest survival.",
      mathematics: "Banana arithmetic: start with 10 bananas, monkey eats 2. Use the story to teach subtraction with physical props.",
      language: "Compare Mauritian Creole words (zako, lake) with French (singe, queue) to analyze linguistic creolization patterns.",
      leadership: "The 'Chief Monkey' leads a line dance. Everyone must follow the monkey through trees and rocks.",
      entrepreneurship: "Organize a mock banana harvest market: learn about farming cooperatives, trade, and exchange of goods.",
      health: "Balance game: walk on a line holding a fake heavy cardboard banana on the head without using hands.",
      emotional_intelligence: "Empathize with the farmer whose bananas were stolen, then discuss sharing resources with woodland animals.",
      environmental_awareness: "Examine human-wildlife conflict: respect animal habitats so monkeys don't need to raid plantations."
    },
    knowledge_graph: [
      {
        id: "L3",
        skill: "Discrimination Auditive",
        concept: "Indices rythmiques du Séga",
        activity: "Frapper le temps faible syncopé caractéristique du hochet Ravann",
        evaluation: "Stabilité du tempo syncopé en 6/8 créole"
      },
      {
        id: "L4",
        skill: "Analyse Comparée",
        concept: "Développement multilingue précoce",
        activity: "Faire correspondre les racines créoles aux mots équivalents français",
        evaluation: "Identification sémantique inter-langue"
      }
    ]
  },
  {
    id: "EN0001",
    title: "Twinkle Twinkle Little Star",
    language: "en",
    origin: {
      country: "United Kingdom",
      region: "England"
    },
    type: "lullaby",
    age_range: {
      min: 1,
      max: 4
    },
    skills: ["memory", "observation", "imagination", "auditive_memory"],
    themes: ["space", "nighttime", "wonder"],
    source: "Jane Taylor, Rhymes for the Nursery (1806)",
    lyrics_original: "Twinkle, twinkle, little star,\nHow I wonder what you are!\nUp above the world so high,\nLike a diamond in the sky.\n\nWhen the blazing sun is gone,\nWhen he nothing shines upon,\nThen you show your little light,\nTwinkle, twinkle, all the night.",
    translation_fr: "Brille, brille, petite étoile,\nComme je me demande ce que tu es !...",
    variants: [
      "Ah! vous dirai-je, maman (original French melody used)"
    ],
    cognitive_tags: ["observation", "prediction", "reasoning", "memory"],
    music: {
      tempo: 80,
      meter: "4/4",
      mood: "Calming",
      cadence: "Slow binary lullaby meter",
      call_response: false,
      repetition_level: "Medium",
      melody_complexity: "Simple"
    },
    linguistics: {
      vocabulary_level: "Beginner",
      phonetic_patterns: "Perfect rhyming couplets (star/are, high/sky)",
      syllable_count: 7,
      rhyme_scheme: "AA-BB-CC",
      alliteration: false
    },
    heritage: {
      historical_period: "Georgian Period",
      region: "London",
      oral_tradition: false,
      references: "Jane & Ann Taylor, 'Poems for Infant Minds' (1804)",
      preservation_status: "Active"
    },
    ai_variants: {
      cognitive: "Object classification: distinguish between objects that glow on their own (stars, fireflies, sun) and those that reflect light.",
      creativity: "Draw the little star landing on earth for a day: what does a star eat for breakfast, and what games does it play?",
      science: "Introductory astronomy: discuss what stars are made of (burning gases) and why the sun looks bigger than distant nighttime stars.",
      mathematics: "Symmetry and geometry: construct five-pointed stars using craft sticks and Count the vertices.",
      language: "Introduce synonyms for glowing (glistening, shimmering, beaming, sparkling) and sort them by intensity.",
      leadership: "The night guide: practice guiding a blindfolded peer safely through a room using only verbal 'guiding star' sound cues.",
      entrepreneurship: "Organize a stargazing evening: design tickets, calculate seating spaces, and plan warm cocoa sales.",
      health: "Sleep hygiene and wind-down routing: do deep breathing exercises with arm extensions mimicking a rising and falling star.",
      emotional_intelligence: "Discuss fear of the dark and how the star acts as a comforting, protective beacon in the sky.",
      environmental_awareness: "Light pollution: explain why stars are invisible in big cities and discuss energy conservation by turning off unused lights."
    },
    knowledge_graph: [
      {
        id: "L5",
        skill: "Raisonnement Scientifique",
        concept: "Permanence céleste (jour vs nuit)",
        activity: "Expliquer ce que devient l'étoile quand le soleil brille",
        evaluation: "Compréhension de l'occultation lumineuse par le soleil"
      },
      {
        id: "L6",
        skill: "Représentation Spatiale",
        concept: "Métaphores géométriques (diamant)",
        activity: "Associer des objets du quotidien à des formes géométriques brillantes",
        evaluation: "Sensibilité métaphorique et reconnaissance spatiale"
      }
    ]
  },
  {
    id: "AF0001",
    title: "Sanssa Kroma",
    language: "af",
    origin: {
      country: "Ghana",
      region: "West Africa"
    },
    type: "game_song",
    age_range: {
      min: 3,
      max: 8
    },
    skills: ["rhythm", "social_interaction", "coordination", "storytelling"],
    themes: ["animals", "empathy", "solidarity"],
    source: "Akan Traditional Folklore",
    lyrics_original: "Sanssa kroma, nea onye mma\nSanssa kroma, nea onye mma\nOkyer kookoo mma basabasa\nKyer kookoo mma basabasa\n\nNkyirimba onye ne koraa\nNkyirimba onye ne koraa\nOkyer kookoo mma basabasa\nKyer kookoo mma basabasa.",
    translation_fr: "Sansa la buse, oiseau orphelin,\nSansa la buse, tu n'as pas de parents,\nPourtant tu attrapes les petits poussins maladroitement,\nAttrapant les poussins d’un mouvement erratique.",
    variants: [
      "Sasabonsam song variants"
    ],
    cognitive_tags: ["sequencing", "memory", "communication", "creativity"],
    music: {
      tempo: 110,
      meter: "4/4",
      mood: "Joyful",
      cadence: "Highly syncopated playground stone-tossing cadence",
      call_response: true,
      repetition_level: "High",
      melody_complexity: "Moderate"
    },
    linguistics: {
      vocabulary_level: "Intermediate",
      phonetic_patterns: "Vowel harmony ( Akan Twi language sounds)",
      syllable_count: 8,
      rhyme_scheme: "A-A-B-B",
      alliteration: true
    },
    heritage: {
      historical_period: "Pre-colonial",
      region: "Ashanti Kingdom",
      oral_tradition: true,
      references: "Ghanaian Children Games Collection, Kwabena Nketia",
      preservation_status: "Active"
    },
    ai_variants: {
      cognitive: "Rhythm retention: children sit in a circle and pass a stone on the heavy beat. Tests multitasking (singing + hand movement).",
      creativity: "If Sanssa the Hawk wanted to make friends with the chicks instead of hunting them, what gift could he bring them?",
      science: "Predator-prey relationships: examine how birds of prey hunt, the design of talons, and why chickens protect their nests.",
      mathematics: "Stone-passing sequence timing: calculate optimal stone-pass latency at different tempos (80, 110, 130 BPM).",
      language: "Introduce Twi pronouns and simple verbs (okyer = he catches, mma = small ones) to introduce African grammatical structure.",
      leadership: "The Circle Overseer: check coordination of passing stones and gently slow down the rhythm if peers are desynchronized.",
      entrepreneurship: "Calculate efficiency of grain collection for the hen household to see how many chicks can be sustained.",
      health: "Reflex training: catch tossed light beanbags exactly in rhythm with the musical accents.",
      emotional_intelligence: "Sansa is described as an orphan ('nea onye mma'). Explore how loneliness can sometimes cause hostile behaviors.",
      environmental_awareness: "Avian biology: map bird species of Ghana and understand why keeping predators in the ecosystem avoids insect overpopulation."
    },
    knowledge_graph: [
      {
        id: "L7",
        skill: "Coordination Bilatérale",
        concept: "Passage d'objets rythmique (Stone Passing)",
        activity: "Passer une pierre au voisin de gauche précisément sur le premier battement",
        evaluation: "Indépendance motrice gauche/droite sous contrainte rythmique"
      },
      {
        id: "L8",
        skill: "Lien Social & Empathie",
        concept: "Compréhension des motivations (Orphelinat)",
        activity: "Discuter du sort de l'oiseau Sanssa et pourquoi il agit ainsié",
        evaluation: "Dénomination d'états affectifs chez les personnages d'un récit"
      }
    ]
  },
  {
    id: "JA0001",
    title: "Kagome Kagome",
    language: "ja",
    origin: {
      country: "Japan",
      region: "Traditional"
    },
    type: "game_song",
    age_range: {
      min: 4,
      max: 10
    },
    skills: ["sensory_perception", "auditory_localization", "social_interaction", "intuition"],
    themes: ["mystery", "birds", "nature"],
    source: "Ancient Japanese Play folklore",
    lyrics_original: "かごめかごめ 籠の中の鳥は\nいついつ出やる 夜明けの晩に\n鶴と亀が滑った\n後ろの正面だあれ？\n\nKagome kagome kago no naka no tori wa\nItsu itsu deyaru yoake no ban ni\nTsuru to kame ga subetta\nUshiro no shoumen dare?",
    translation_fr: "Kagome Kagome, l'oiseau dans la cage,\nQuand vas-tu sortir ?\nÀ l'aube de la nuit,\nLa grue et la tortue ont glissé.\nQui est juste derrière toi ?",
    variants: [
      "Edo period custom children game versions",
      "Kagome variants from Yamagata prefecture"
    ],
    cognitive_tags: ["prediction", "observation", "memory", "reasoning"],
    music: {
      tempo: 75,
      meter: "4/4",
      mood: "Hypnotic",
      cadence: "Pentatonic traditional minor scale cadence",
      call_response: false,
      repetition_level: "Medium",
      melody_complexity: "Moderate"
    },
    linguistics: {
      vocabulary_level: "Advanced",
      phonetic_patterns: "Traditional Japanese double meanings and rhythm constraints",
      syllable_count: 5,
      rhyme_scheme: "Irregular",
      alliteration: false
    },
    heritage: {
      historical_period: "Edo Period",
      region: "Kantō Region",
      oral_tradition: true,
      references: "Chamberlain, B.H. 'Things Japanese' (1890)",
      preservation_status: "Active"
    },
    ai_variants: {
      cognitive: "Auditory tracking spatial exercise. A blindfolded child sits in the middle; a peer behind them whispers. Blindfolded child locates sound coordinates.",
      creativity: "Write a myth of why the crane (long life) and tortoise (wisdom) slipped. Did they slip on ice or on grease?",
      science: "Examine crane (bird biomechanics) and sea turtle migrations. Why do Japanese cultures regard them as symbols of longevity?",
      mathematics: "Circle spatial calculations: measure angles of kids in the circle. Draw the center point.",
      language: "Explore ancient Japanese vocabulary (deyaru, ushiro no shoumen) and explain the double meanings typical of traditional poetry.",
      leadership: "The Silent Emperor: control the circle of players to move noiselessly so the blindfolded child cannot guess by footfalls.",
      entrepreneurship: "Learn origami: make paper cranes, compute paper dimensions needed and evaluate how many cranes you can fold in an hour.",
      health: "Blindfold sensory elevation: heighten non-visual senses to establish mental mappings of physical spaces.",
      emotional_intelligence: "Discuss inclusion: how to support the lonely bird ('kago no naka no tori') and make sure everyone gets a turn outside the cage.",
      environmental_awareness: "Marshland conservation: study marsh crane reserves in Hokkaido and the impact of wetland destruction on biodiversity."
    },
    knowledge_graph: [
      {
        id: "L9",
        skill: "Repérage Spatial Acoustique",
        concept: "Écholocalisation & attention focale",
        activity: "Identifier la personne qui chuchote derrière soi en ayant les yeux bandés",
        evaluation: "Précision angulaire de localisation spatiale de la source sonore"
      },
      {
        id: "L10",
        skill: "Symbolisme Culturel",
        concept: "Allégories de la longévité (grue, tortue)",
        activity: "Associer des animaux aux leçons morales correspondantes",
        evaluation: "Usage analogique des représentations métaphoriques japonaises"
      }
    ]
  },
  {
    id: "ZH0001",
    title: "The Snail and the Oriole Bird",
    language: "zh",
    origin: {
      country: "China",
      region: "Taiwan Traditional"
    },
    type: "nursery_rhyme",
    age_range: {
      min: 3,
      max: 9
    },
    skills: ["patience", "perseverance", "moral_reasoning", "tempo_perception"],
    themes: ["animals", "nature", "effort", "humor"],
    source: "Traditional Folk Song (Weng Qingxi)",
    lyrics_original: "门前一口葡萄树\n嫩嫩的绿叶刚发芽\n蜗牛背着那重重的壳呀\n一步一步地往上爬\n\n树上两只黄鹂鸟\n阿嘻阿哈哈在笑他\n葡萄成熟还早得很咧\n现在爬上去要干什么\n\n阿黄阿黄鹂儿不要笑\n等我爬上它就成熟了",
    translation_fr: "Devant la porte, il y a un cep de vigne,\nLes jeunes feuilles vertes viennent de bourgeonner.\nL'escargot porte sa lourde coquille,\nEt grimpe pas à pas, petit à petit.\n\nSur l'arbre, deux loriots d'or\nRient de lui en gloussant : 'Hé, hé, hé !'\nLa vigne est loin d'avoir des raisins mûrs,\nPourquoigrimpes-tu maintenant ?\n\nLoriot, loriot, ne riez pas de moi,\nLe temps que j'arrive en haut, ils seront mûrs !",
    variants: [
      "Wo Niu Yu Huang Li Niao standard Mandarin lyrics"
    ],
    cognitive_tags: ["sequencing", "reasoning", "prediction", "communication"],
    music: {
      tempo: 96,
      meter: "4/4",
      mood: "Joyful",
      cadence: "Upbeat walking rhythm",
      call_response: false,
      repetition_level: "Medium",
      melody_complexity: "Moderate"
    },
    linguistics: {
      vocabulary_level: "Intermediate",
      phonetic_patterns: "Mandarin Chinese tones (-a, -ao particle suffix rhymes)",
      syllable_count: 8,
      rhyme_scheme: "A-B-A-C",
      alliteration: false
    },
    heritage: {
      historical_period: "Modern Folk Tradition",
      region: "Fujian & Taiwan",
      oral_tradition: true,
      references: "Collecte des Chansons pour Enfants de la Dynastie Qing à nos jours",
      preservation_status: "Active"
    },
    ai_variants: {
      cognitive: "Perseverance tracking: kids evaluate slow movements versus fast movements. Discuss why snail climbs early (strategic intelligence) and map out natural growth cycles.",
      creativity: "Write a diary of the snail's journey. What did it meet on the grape branch? A ladybug, a caterpillar? Set up a tabletop journey model.",
      science: "Fructification timelines: study how grapevines flower and bear fruit. Discuss snail biology, slime functions, and why birds are insectivores.",
      mathematics: "Velocity and delay: if a snail travels at 5 cm/hour and the branch is 2 meters tall, compute the exact time needed to reach the grapes.",
      language: "Introduce basic Chinese characters for Tree (木), Grape (葡) and Bird (鸟). Contrast spelling methods.",
      leadership: "Persistence rewards: discuss in class an experience where persistent, slow effort beat immediate shortcuts.",
      entrepreneurship: "Time to market: analyze the advantage of shipping products early (like the snail climbing early) to hit high-demand periods.",
      health: "Slow-motion exercises (Tai Chi alignment): practice slow controlled strides, syncing balance with shallow breath cycles.",
      emotional_intelligence: "Resilience to mockery: how the snail remained calm and witty in the face of mockery (the oriole bird's laughter).",
      environmental_awareness: "Ecosystem interactions: explain how wind, rain, birds, and insects coexist in a small vine garden."
    },
    knowledge_graph: [
      {
        id: "L11",
        skill: "Persévérance éthique",
        concept: "Effort stratégique anticipé (Planification)",
        activity: "Mimer la lenteur appliquée de l'escargot face aux rires rapides des oiseaux",
        evaluation: "Compréhension rationnelle des bénéfices de la persévérance"
      },
      {
        id: "L12",
        skill: "Cycles Biologiques",
        concept: "Saisonnalité & maturation végétale",
        activity: "Tracer le cheminement de la sève et le développement de la grappe de raisin",
        evaluation: "Connexion des étapes de croissance de la nature aux paroles de la comptine"
      }
    ]
  },
  {
    id: "IND001",
    title: "Lakdi Ki Kathi",
    language: "hi",
    origin: {
      country: "India",
      region: "North India Folk"
    },
    type: "counting_rhyme",
    age_range: {
      min: 2,
      max: 7
    },
    skills: ["coordination", "rhythm", "auditive_memory", "storyboarding"],
    themes: ["animals", "horse", "adventure", "humor"],
    source: "Masoom Movie (1983) - Folk Roots",
    lyrics_original: "लकड़ी की काठी, काठी पे घोड़ा\nघोड़े की दुम पे जो मारा हथौड़ा\nदौड़ा दौड़ा दौड़ा घोड़ा दुम उठा के दौड़ा!\n\nघोड़ा पहुँचा चौक में, चौक में था नाई\nघोड़े जी की नाई ने हजामत जो बनाई\nदौड़ा दौड़ा दौड़ा घोड़ा दुम उठा के दौड़ा!\n\nघोड़ा था घमंडी, पहुँचा सब्जी मंडी\nसब्जी मंडी बरफ पड़ी थी, बर्फ में लग गई ठंडी !",
    translation_fr: "Une selle en bois, un cheval en bois,\nQuand on a tapé un petit marteau sur sa queue,\nLe cheval a galopé, queue en l'air, au galop, au galop !\n\nLe cheval est arrivé sur la place, chez le coiffeur,\nLe coiffeur lui a fait une coupe de cheveux,\nLe cheval a couru, queue en l'air, au galop !",
    variants: [
      "Traditional Hindi folk playful variants"
    ],
    cognitive_tags: ["sequencing", "observation", "reasoning", "memory"],
    music: {
      tempo: 115,
      meter: "4/4",
      mood: "Joyful",
      cadence: "Energetic trotting beat with high bounce",
      call_response: false,
      repetition_level: "High",
      melody_complexity: "Moderate"
    },
    linguistics: {
      vocabulary_level: "Beginner",
      phonetic_patterns: "Hindi rhythmic rhymes (Kathi, Kathi, Ghora, Daura)",
      syllable_count: 8,
      rhyme_scheme: "A-A-B-B",
      alliteration: true
    },
    heritage: {
      historical_period: "20th Century Adaption",
      region: "Punjab & Delhi",
      oral_tradition: true,
      references: "Classical Children Rhyme, Gulzar Collection",
      preservation_status: "Active"
    },
    ai_variants: {
      cognitive: "Spatial mapping: the teacher says 'daura, daura' and players run on the spot; on 'hathora', they clap hands down.",
      creativity: "Build horses using cardboard boxes and run a decorative equestrian race in the schoolyard.",
      science: "Thermal conduction: discuss why the horse felt cold in the vegetable market ('barf') and study states of water (ice, snow).",
      mathematics: "Rhythm sequencing: create mathematical fractions of movement (e.g. 1 hop, 2 trots, 3 claps = 1 cycle).",
      language: "Find Devanagari rhyming words for Ghora ( घोड़ा ), Daura ( दौड़ा ), aur Thanda ( ठंडा ).",
      leadership: "The Stable Lord: guide horses into different speed groups (walking, trotting, galloping) dynamically based on tempo changes.",
      entrepreneurship: "Toy horse craft shop: learn how toys are colored, calculate cost of wooden blocks and selling prices for woodcrafts.",
      health: "High-intensity cardio (Trotting/Galloping): mimic the horse trotting to encourage core engagement and leg muscle tone.",
      emotional_intelligence: "Pride lesson: examine why the horse got into trouble because of greed or pride ('ghora tha ghamandi').",
      environmental_awareness: "Equine animal welfare: analyze the role of working horses in agriculture and community heritage, and how to treat working animals with kindness."
    },
    knowledge_graph: [
      {
        id: "L13",
        skill: "Stimulation Cardiorespiratoire",
        concept: "Changements de cadence (pas, trot, galop)",
        activity: "Adapter le trot sur place selon les accélérations verbales de la comptine",
        evaluation: "Adaptation musculaire dynamique et ajustement de la foulée"
      },
      {
        id: "L14",
        skill: "Anatomie & Animaux",
        concept: "Grave vs Aigu (bruits de sabots)",
        activity: "Frapper le sol avec les mains pour imiter les sabots en bois",
        evaluation: "Reproduction de la rythmique gallopante et distinction de timbre sonore"
      }
    ]
  },
  {
    id: "RE0001",
    title: "Dodo mimi",
    language: "mfe",
    origin: {
      country: "La Réunion",
      region: "Océan Indien"
    },
    type: "lullaby",
    age_range: {
      min: 0,
      max: 3
    },
    skills: ["sensory_perception", "auditory_memory", "relaxation"],
    themes: ["sleep", "parental_bond", "nighttime"],
    source: "Héritage Oral de la Réunion",
    lyrics_original: "Dodo, mimi, dodo sa mimi,\nKokoti la pika ti poul o dodo.\nDodo, mimi, krapo la pante dodo,\nZako la mase, zandor la ferme kaye.\n\nFé dodo mon ti bébé dodo,\nSomin va rouve pli tar pou ou si le do.",
    translation_fr: "Dors, chaton, dors petit chaton,\nLe dindon a picoré, la petite poule s'est endormie.\nDors, chaton, le crapaud a grimpé pour dormir,\nLe singe a mangé, le loir a fermé les volets.\n\nFais dodo mon petit bébé dodo,\nLe chemin s'ouvrira plus tard pour toi sur le dos.",
    variants: [
      "Dodo la minette, dodo mon p'tit bélier"
    ],
    cognitive_tags: ["memory", "observation", "communication"],
    music: {
      tempo: 65,
      meter: "3/4",
      mood: "Hypnotic",
      cadence: "Slow warm rocking waltz swing",
      call_response: false,
      repetition_level: "High",
      melody_complexity: "Simple"
    },
    linguistics: {
      vocabulary_level: "Beginner",
      phonetic_patterns: "Soft sibilant sounds (do-do, mi-mi, k-o-ko-ti) for lullaby state",
      syllable_count: 5,
      rhyme_scheme: "A-B-A-B",
      alliteration: true
    },
    heritage: {
      historical_period: "18th Century",
      region: "Saint-Denis",
      oral_tradition: true,
      references: "Chansons créoles populaires réunionnaises",
      preservation_status: "Active"
    },
    ai_variants: {
      cognitive: "Sensory calming trigger: slowly decreases the volume of singing while kids regulate breathing to match the lullaby tempo.",
      creativity: "Draw a mural of all the sleeping creatures mentioned: the Turkey, the Hen, the Toad, the Monkey, and the Dormouse.",
      science: "Nocturnal animal biology: compare the sleep cycles of diurnal creatures (human, monkey) with nocturnal ones (toads).",
      mathematics: "Count the breaths: inhale for 3 beats, hold for 3, exhale for 3. Use this pattern to introduce the 3/4 meter time signature.",
      language: "Introduce Reunionese terms (Dodo mimi, Zandor) and compare with English equivalents (sleep, dormouse/mouse).",
      leadership: "The protector: speak in hushed quiet voices to comfort young peers and learn the social responsibilities of peace keepers.",
      entrepreneurship: "Create a lavender therapeutic sleep pillow: compute cost of cotton bags, lavender seeds, and layout.",
      health: "Parasympathetic system activation: slow physical resting beats to stabilize blood-pressure and promote restful sleep cycles.",
      emotional_intelligence: "Establish safe attachment bonds: the protective reassuring presence of caregivers through soothing vocals.",
      environmental_awareness: "Listen to the natural sounds of night: ocean waves, forest wind, frogs, and reflect on cohabitation in small islands."
    },
    knowledge_graph: [
      {
        id: "L15",
        skill: "Changements physiologiques",
        concept: "Relation relaxation et tempo lent",
        activity: "Ralentir la respiration pour calquer le rythme de 65 BPM",
        evaluation: "Observation de l'apaisement physique et de la baisse de motricité"
      },
      {
        id: "L16",
        skill: "Conscience Pholologique",
        concept: "Occlusives et fricatives réconfortantes",
        activity: "Murmurer phonétiquement les allitérations en 'do' et 'mi'",
        evaluation: "Précision d'imitation articulatoire douce"
      }
    ]
  }
];
