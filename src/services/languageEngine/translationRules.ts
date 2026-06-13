import { LanguageProfile } from "./languageProfiles";

export interface RemasterProfile {
  name: string;
  target_skills: string[];
  vocabulary_constraints: string[];
  age_range: { min: number; max: number };
  educational_objectives: string[];
  output_rules: string[];
}

export const REMASTER_PROFILES: Record<string, RemasterProfile> = {
  cognitive: {
    name: "Cognitive Remaster",
    target_skills: ["working_memory", "sequencing", "pattern_recognition", "focus"],
    vocabulary_constraints: ["high repetition", "alliterative baby syllables", "simple action verbs"],
    age_range: { min: 2, max: 6 },
    educational_objectives: [
      "Accelerate memory pathways via interactive incremental games.",
      "Encourage children to substitute lyrics to practice category sorting."
    ],
    output_rules: [
      "Keep identical syllable lines for rhythm conservation",
      "Focus on sequential intervals and state transitions (active vs restful)"
    ]
  },
  leadership: {
    name: "Leadership & Cooperation Remaster",
    target_skills: ["cooperation", "role_taking", "group coordination", "turn-taking"],
    vocabulary_constraints: ["peer supportive words", "collaborative action verbs"],
    age_range: { min: 3, max: 8 },
    educational_objectives: [
      "Establish a game where children take turns directing movements.",
      "Teach collaborative play and group cohesion."
    ],
    output_rules: [
      "Structure song lyrics to feature divided interactive tasks",
      "Use call-and-response mechanisms"
    ]
  },
  entrepreneurship: {
    name: "Early Entrepreneurship & Maker Remaster",
    target_skills: ["problem_solving", "resourcefulness", "initiative", "shared creation"],
    vocabulary_constraints: ["creation action verbs", "resource sorting terms"],
    age_range: { min: 4, max: 8 },
    educational_objectives: [
      "Inspire early problem solving and building.",
      "Cultivate the identity of a young maker coordinating a small team."
    ],
    output_rules: [
      "Align verses with progressive stages (plan, gather, assemble, pitch)",
      "Focus on repurposing natural background objects creatively"
    ]
  },
  health: {
    name: "Somatic Health & Mindful Breathing Remaster",
    target_skills: ["breathing regulation", "gross motor balance", "vocal decompression"],
    vocabulary_constraints: ["slow rhythmic phrases", "respiratory sounds"],
    age_range: { min: 1, max: 6 },
    educational_objectives: [
      "Synchronize breathing cycles with lyrics phrasing.",
      "Foster gross motor control and inner stillness."
    ],
    output_rules: [
      "Enforce tempo-diminishing markers (below 95 BPM)",
      "Include explicit pause and quiet breathing indicators"
    ]
  },
  financial: {
    name: "Financial Literacy & Token Remaster",
    target_skills: ["barter systems", "delayed gratification", "counting tokens", "resource valuation"],
    vocabulary_constraints: ["basic commerce nouns", "counting numbers"],
    age_range: { min: 4, max: 8 },
    educational_objectives: [
      "Explore value exchange, and difference between desires and needs.",
      "Use tangible metrics like seeds or stones to count exchanges."
    ],
    output_rules: [
      "Lyrics must weave in progressive arithmetic operations (adding, trade, shares)",
      "Explicitly mention sharing surplus with the community"
    ]
  },
  ai_literacy: {
    name: "AI Literacy & Algorithmics Remaster",
    target_skills: ["conditional logic", "loops", "sequential instructions", "debugging gestures"],
    vocabulary_constraints: ["clear triggers", "if-then conditionals", "iteration adverbs"],
    age_range: { min: 3, max: 8 },
    educational_objectives: [
      "Establish tangible conditional loops ('if monkey jumps, everyone claps three times').",
      "Unveil looping repetitions as a repeating computer program."
    ],
    output_rules: [
      "Explicitly frame the song as sequential cycles",
      "Weave conditional action triggers directly into the lyrics"
    ]
  }
};

/**
 * Renders the transformation formula prompt
 */
export function buildTransformationFormulaPrompt(
  canonicalRhyme: any,
  remasterKey: string,
  targetLangKey: string,
  langProfile: LanguageProfile,
  remasterProfile?: RemasterProfile
): string {
  const selectedRemaster = remasterProfile || REMASTER_PROFILES[remasterKey] || {
    name: "Base Adaptation",
    target_skills: [],
    vocabulary_constraints: [],
    age_range: canonicalRhyme.age_range || { min: 2, max: 6 },
    educational_objectives: ["General translation of original lyrics."],
    output_rules: ["Maintain singable rhyme and cadences."]
  };

  return `Vous êtes un ethnomusicologue d'avant-garde, ingénieur d'apprentissage et traducteur artistique.
Votre but est d'exécuter la formule d'adaptation Gatlinkeys pour projeter une comptine d'origine en une version remasterisée chantable dans la langue cible.

====================================================
FORMULE GATLINKEYS :
Version Cible = Oeuvre Canonique + Spécification Métrique + Profil Éducatif + Profil de Langue Cible
====================================================

DOCUMENT CANONIQUE SOURCE :
Ref-ID: ${canonicalRhyme.id || "MFE001"}
Titre Original: ${canonicalRhyme.title}
Langue d'Origine: ${canonicalRhyme.language}
Pays: ${canonicalRhyme.origin?.country || "Inconnu"}
Paroles Originales:
"""
${canonicalRhyme.lyrics_original}
"""

PROFIL ÉDUCATIF DE REMASTERISATION SELECTIONNÉ : [${selectedRemaster.name}]
- Compétences Cibles : ${selectedRemaster.target_skills.join(", ")}
- Contraintes de Vocabulaire : ${selectedRemaster.vocabulary_constraints.join(", ")}
- Tranche d'Âge : de ${selectedRemaster.age_range.min} à ${selectedRemaster.age_range.max} ans
- Objectifs d'Éducation :
${selectedRemaster.educational_objectives.map(o => `  * ${o}`).join("\n")}
- Règles de Restructuration :
${selectedRemaster.output_rules.map(r => `  * ${r}`).join("\n")}

PROFIL DE LANGUE CIBLE DE TRANSLATION : [${langProfile.label}]
- Préserver Rimes : ${langProfile.preserve_rhyme ? "OUI" : "NON"}
- Préserver Signature Rythmique : ${langProfile.preserve_meter ? "OUI" : "NON"}
- Maintenir Chantabilité : ${langProfile.maintain_singability ? "OUI" : "NON"}
- Conserver Répétitions : ${langProfile.maintain_repetition ? "OUI" : "NON"}
- Directives d'adaptation linguistiques de la langue :
${langProfile.adaptation_directives.map(d => `  * ${d}`).join("\n")}

====================================================
CRITÈRES DE LIVRABLE :
1. Les paroles traduites DOIVENT avoir exactement le même rythme rythmique musical ou la même structure métrique (syllabes et placement des accents) afin de se chanter verbatim sur la mélodie d'origine.
2. Les paroles doivent intégrer les concepts liés au profil sélectionné de manière simple et ludique pour des enfants.
3. Le résultat doit inclure un guide de chant et des notes d'adaptation expliquant vos arbitrages.

EXIGENCES STRICTES DE SORTIE :
Générez un JSON strictement valide compatible avec ce schéma :
{
  "title_translated": "Titre adapté",
  "lyrics_translated": "Les paroles formées adaptées (avec \\n pour séparer les vers)",
  "notes_adaptation": "Explication sur les choix d'allitération, de rime ou d'adaptation d'idiome",
  "singing_guide": "Guide ludique destiné aux professeurs/parents indiquant le rythme ou la gestuelle",
  "education_focus": "Description en 1 phrase de comment l'objectif éducatif a été tissé dans la chanson"
}

Retournez UNIQUEMENT du JSON pur sans balises de bloc de code Markdown, sans explications d'introduction ou de conclusion !`;
}
