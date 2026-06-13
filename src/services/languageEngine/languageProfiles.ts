export interface LanguageProfile {
  language: string; // e.g. "en", "fr", "es", "hi", "zh"
  label: string; // e.g. "English (Anglais)"
  preserve_rhyme: boolean;
  preserve_meter: boolean;
  target_age: "same" | "younger" | "older";
  maintain_singability: boolean;
  maintain_repetition: boolean;
  maintain_cultural_meaning: boolean;
  adaptation_directives: string[];
}

export const LANGUAGE_PROFILES: Record<string, LanguageProfile> = {
  en: {
    language: "en",
    label: "English (Anglais)",
    preserve_rhyme: true,
    preserve_meter: true,
    target_age: "same",
    maintain_singability: true,
    maintain_repetition: true,
    maintain_cultural_meaning: false,
    adaptation_directives: [
      "Prioritize English phonemic counterparts with rhythmic consistency.",
      "Preserve historical playfulness, replacing obsolete French idioms with familiar Anglo nursery references (e.g. replacing 'matines' with 'morning bell ringers').",
      "Favor mono- or disyllabic words to conserve timing structures."
    ]
  },
  fr: {
    language: "fr",
    label: "Français (French)",
    preserve_rhyme: true,
    preserve_meter: true,
    target_age: "same",
    maintain_singability: true,
    maintain_repetition: true,
    maintain_cultural_meaning: true,
    adaptation_directives: [
      "Preserve rigorous metric length based on french traditional syllable counts.",
      "Ensure vocal harmony with nasal and liquid alliterative French patterns.",
      "Anchor metaphors directly within classical French infant folk heritage structures."
    ]
  },
  es: {
    language: "es",
    label: "Español (Spanish)",
    preserve_rhyme: true,
    preserve_meter: true,
    target_age: "same",
    maintain_singability: true,
    maintain_repetition: true,
    maintain_cultural_meaning: true,
    adaptation_directives: [
      "Adapt lyrics to Spanish phonetic cadences with clear syllabic meter.",
      "Integrate rich vowel assonance typical of Spanish lullabies ('nanas') or clap games.",
      "Replace regional Creole flora/fauna with universal Spanish equivalents or preserve them with phonetic guidance."
    ]
  },
  hi: {
    language: "hi",
    label: "Hindi (हिन्दी)",
    preserve_rhyme: true,
    preserve_meter: true,
    target_age: "same",
    maintain_singability: true,
    maintain_repetition: true,
    maintain_cultural_meaning: false,
    adaptation_directives: [
      "Map sounds to classical rhythmic Hindi metrics like 'Tala' cycles.",
      "Use simple, singing infant Hindi phonemes (e.g., repeating baby-talk suffixes).",
      "Transpose cultural activities into highly familiar Indian playground dynamics."
    ]
  },
  zh: {
    language: "zh",
    label: "Chinese (中文)",
    preserve_rhyme: false, // Tone and pitch transitions are more critical in Chinese nursery lyrics
    preserve_meter: true,
    target_age: "same",
    maintain_singability: true,
    maintain_repetition: true,
    maintain_cultural_meaning: true,
    adaptation_directives: [
      "Render syllables as clean monocharacter equivalents matching the original metric beats.",
      "Keep standard rhythmic pacing while respecting Mandarin/Cantonese tonal rules.",
      "Ensure safe educational metaphors consistent with traditional children's games ('shange' rhythmic rules)."
    ]
  },
  mfe: {
    language: "mfe",
    label: "Moorisien (Créole)",
    preserve_rhyme: true,
    preserve_meter: true,
    target_age: "same",
    maintain_singability: true,
    maintain_repetition: true,
    maintain_cultural_meaning: true,
    adaptation_directives: [
      "Maintain the authentic Sega or Indian Ocean rhythmic sway.",
      "Use Mauritian Creole phonetic spelling (standard grafi harmonise).",
      "Retain tropical biodiversity metaphors (bananas, mangoes, geckos, sugar fields)."
    ]
  }
};
