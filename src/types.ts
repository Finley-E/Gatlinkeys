/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface HeritageMetadata {
  historical_period: string;
  region: string;
  oral_tradition: boolean;
  references: string;
  preservation_status: "Active" | "Endangered" | "Under Research" | "Vulnerable";
}

export interface LinguisticMetadata {
  vocabulary_level: "Beginner" | "Intermediate" | "Advanced";
  phonetic_patterns: string;
  syllable_count: number;
  rhyme_scheme: string;
  alliteration: boolean;
}

export interface MusicalMetadata {
  tempo: number; // BPM
  meter: string; // e.g., "4/4", "3/4", "6/8"
  mood: string; // e.g., "Joyful", "Calming", "Hypnotic", "Energetic"
  cadence: string;
  call_response: boolean;
  repetition_level: "Low" | "Medium" | "High";
  melody_complexity: "Simple" | "Moderate" | "Complex";
}

export interface KnowledgeGraphLink {
  id: string;
  skill: string;
  concept: string;
  activity: string;
  evaluation: string;
}

export interface AIVariants {
  cognitive?: string;
  creativity?: string;
  science?: string;
  mathematics?: string;
  language?: string;
  leadership?: string;
  entrepreneurship?: string;
  health?: string;
  emotional_intelligence?: string;
  environmental_awareness?: string;
}

export interface NurseryRhyme {
  id: string;
  title: string;
  language: string; // 'fr' | 'en' | 'mfe' | 'ja' | 'zh' | 'ja' | 'de' | 'af' | 'hi'
  origin: {
    country: string;
    region?: string;
  };
  type: "nursery_rhyme" | "lullaby" | "counting_rhyme" | "clapping_game" | "game_song";
  age_range: {
    min: number;
    max: number;
  };
  skills: string[]; // e.g., memory, language, coordination, rhythm
  themes: string[]; // e.g., movement, animals, nature, numbers
  source?: string;
  lyrics_original: string;
  translation_fr?: string;
  variants?: string[];
  cognitive_tags: string[]; // observation, pattern_recognition, sequencing, memory, reasoning, creativity, prediction, communication
  music: MusicalMetadata;
  linguistics: LinguisticMetadata;
  heritage: HeritageMetadata;
  ai_variants: AIVariants;
  knowledge_graph: KnowledgeGraphLink[];
}

export interface PipelineExecutionState {
  stage: "idle" | "collecteur" | "annotateur" | "remasteriseur" | "verificateur" | "exporteur" | "completed" | "failed";
  progress: number;
  logs: string[];
  results: Partial<NurseryRhyme>;
  rawResponse?: string;
}
