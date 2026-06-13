import { LANGUAGE_PROFILES } from "./languageProfiles";
import { REMASTER_PROFILES, buildTransformationFormulaPrompt } from "./translationRules";

export interface IntegratedTranslation {
  title_translated: string;
  lyrics_translated: string;
  notes_adaptation: string;
  singing_guide: string;
  education_focus: string;
  timestamp: string;
}

// In-Memory cache or simple localStorage cache of generated translations
const TRANSLATION_CACHE_KEY = "gatlinkeys_translations_cache";

export function getCachedTranslation(rhymeId: string, remasterKey: string, langKey: string): IntegratedTranslation | null {
  try {
    const cachedData = localStorage.getItem(TRANSLATION_CACHE_KEY);
    if (!cachedData) return null;
    const db = JSON.parse(cachedData);
    const key = `${rhymeId}_${remasterKey}_${langKey}`;
    return db[key] || null;
  } catch (e) {
    console.warn("Could not read translations cache", e);
    return null;
  }
}

export function setCachedTranslation(
  rhymeId: string, 
  remasterKey: string, 
  langKey: string, 
  result: IntegratedTranslation
) {
  try {
    const cachedData = localStorage.getItem(TRANSLATION_CACHE_KEY) || "{}";
    const db = JSON.parse(cachedData);
    const key = `${rhymeId}_${remasterKey}_${langKey}`;
    db[key] = result;
    localStorage.setItem(TRANSLATION_CACHE_KEY, JSON.stringify(db));
  } catch (e) {
    console.warn("Could not write translations cache", e);
  }
}

/**
 * Execute dynamic translation and adaptation via Express server-side Gemini endpoint
 */
export async function generateLanguageVariant(
  canonicalRhyme: any,
  remasterKey: string,
  targetLangKey: string,
  forceRefresh = false
): Promise<IntegratedTranslation> {
  // 1. Check local cache first to save tokens
  if (!forceRefresh) {
    const cached = getCachedTranslation(canonicalRhyme.id, remasterKey, targetLangKey);
    if (cached) {
      console.log("Returning cached translation variant:", canonicalRhyme.id, remasterKey, targetLangKey);
      return cached;
    }
  }

  // 2. Fetch language profile config
  const langProfile = LANGUAGE_PROFILES[targetLangKey];
  if (!langProfile) {
    throw new Error(`Language profile for "${targetLangKey}" is not defined.`);
  }

  // 3. Query Express backend API endpoint
  console.log("Triggering on-demand Gatlinkeys adaptation pipeline...");
  const res = await fetch("/api/pipeline/translate-remaster", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      rhyme: canonicalRhyme,
      remasterKey,
      targetLanguageKey: targetLangKey
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Adaptation Server Error: ${errText || "Unknown API response"}`);
  }

  const data = await res.json();
  if (!data.success || !data.result) {
    throw new Error(data.error || "Gatlinkeys adaptation output was empty.");
  }

  const result: IntegratedTranslation = {
    ...data.result,
    timestamp: new Date().toISOString()
  };

  // 4. Save to Cache
  setCachedTranslation(canonicalRhyme.id, remasterKey, targetLangKey, result);

  return result;
}
