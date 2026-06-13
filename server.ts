import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { SEEDED_RHYMES } from "./src/data/rhymes.js";
import { NurseryRhyme } from "./src/types.js";

const app = express();
app.use(express.json());

const PORT = 3000;

// Shared in-memory list seeded with our initial dataset
let rhymesCollection: NurseryRhyme[] = [...SEEDED_RHYMES];

// Helper to instantiate Gemini client securely
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined. Please add your key to the Secrets panel in the Settings menu of AI Studio.");
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// REST API for managing corpus collection
app.get("/api/rhymes", (req, res) => {
  res.json({ success: true, count: rhymesCollection.length, rhymes: rhymesCollection });
});

app.post("/api/rhymes", (req, res) => {
  const newRhyme = req.body as NurseryRhyme;
  if (!newRhyme.id || !newRhyme.title || !newRhyme.lyrics_original) {
    return res.status(400).json({ success: false, error: "Missing required fields (id, title, lyrics_original)" });
  }

  // Check if id exists
  const existsIdx = rhymesCollection.findIndex(r => r.id === newRhyme.id);
  if (existsIdx > -1) {
    rhymesCollection[existsIdx] = newRhyme;
  } else {
    rhymesCollection.push(newRhyme);
  }
  res.json({ success: true, count: rhymesCollection.length, rhyme: newRhyme });
});

app.delete("/api/rhymes/:id", (req, res) => {
  const id = req.params.id;
  const initialLength = rhymesCollection.length;
  rhymesCollection = rhymesCollection.filter(r => r.id !== id);
  if (rhymesCollection.length < initialLength) {
    res.json({ success: true, message: `Rhyme ${id} deleted successfully.`, count: rhymesCollection.length });
  } else {
    res.status(404).json({ success: false, error: `Rhyme ${id} not found.` });
  }
});

// Seed API to reset collection to default
app.post("/api/rhymes/reset", (req, res) => {
  rhymesCollection = [...SEEDED_RHYMES];
  res.json({ success: true, count: rhymesCollection.length, message: "Corpus reset to default 8 specimen records." });
});

// Translation & Adaptation On-The-Fly Endpoint
app.post("/api/pipeline/translate", async (req, res) => {
  const { title, lyricsOriginal, sourceLanguage, targetLanguage } = req.body;

  if (!lyricsOriginal || !targetLanguage) {
    return res.status(400).json({ success: false, error: "Les paroles originales et la langue cible sont requises." });
  }

  try {
    const ai = getGeminiClient();
    const prompt = `Vous êtes un ethnomusicologue d'avant-garde et traducteur littéraire expert de la petite enfance (Gatlinkeys Translator).
Votre but est de traduire et d'ADAPTER de manière rythmée et chantable la comptine ci-dessous dans la langue cible : "${targetLanguage}".

Informations de base :
Titre original : "${title || 'Inconnu'}"
Langue d'origine : "${sourceLanguage || 'Inconnue'}"
Paroles originales :
"${lyricsOriginal}"

Critères cruciaux d'adaptation :
1. Conservatisme métrique & chantable : Les paroles de la langue cible doivent être faciles à chanter sur la même mélodie ou cadence rythmique que l'original.
2. Clarté phonologique & allitérations : Adaptez les sons pour qu'ils soient amusants, faciles à répéter et adaptés aux bébés ou jeunes enfants de la langue cible.
3. Transposition culturelle : Si certains termes ou concepts sont trop régionaux, transposez-les de manière équivalente et familière pour les enfants réceptifs à la langue cible.

Générez la réponse au format JSON strictly compatible avec ce schéma :
{
  "title_translated": "Titre traduit et adapté avec soin",
  "lyrics_translated": "Les paroles adaptées dans la langue cible (en plusieurs vers avec retours à la ligne \\n)",
  "notes_adaptation": "Détails explicatifs de 2-3 phrases sur vos choix d'adaptation phonétique ou culturelle spécifiques",
  "singing_guide": "Guide ludique de 1-2 phrases pour expliquer aux professeurs comment diriger le chant dans cette nouvelle langue (e.g. tempo, claquement de mains ou prononciation des allitérations)"
}

Retournez UNIQUEMENT du JSON pur, directement parsable, sans balise markdown de bloc de code.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ success: true, result: parsed });

  } catch (error: any) {
    console.error("Translation pipeline error:", error);
    res.status(500).json({ success: false, error: error.message || "Erreur lors de l'adaptation multilingue." });
  }
});

// Translation & Remaster Adaptive Formula Endpoint (Phase 3 & 7)
app.post("/api/pipeline/translate-remaster", async (req, res) => {
  const { rhyme, remasterKey, targetLanguageKey } = req.body;

  if (!rhyme || !remasterKey || !targetLanguageKey) {
    return res.status(400).json({ success: false, error: "Missing required parameters (rhyme, remasterKey, targetLanguageKey)." });
  }

  try {
    const ai = getGeminiClient();

    // Inline profiles database to secure bundle resilience and guarantee standalone cold starts
    const langLabels: Record<string, string> = {
      en: "English (Anglais)",
      fr: "Français (French)",
      es: "Espagnol (Español)",
      hi: "Hindi (हिन्दी)",
      zh: "Chinese (中文)",
      mfe: "Moorisien (Créole)"
    };

    const targetLabel = langLabels[targetLanguageKey] || targetLanguageKey;

    const prompt = `Vous êtes un ethnomusicologue d'avant-garde, chercheur de l'héritage oral (Gatlinkeys Master) et linguiste cognitif.
Votre mission est de projeter une œuvre d'origine en une version adaptée/remasterisée et chantable dans la langue cible en suivant scrupuleusement la formule d'adaptation Gatlinkeys.

====================================================
FORMULE GATLINKEYS D'ADAPTATION :
Output = Oeuvre Canonique + Profil de Remasterisation Éducatif + Profil de Langue Cible
====================================================

ŒUVRE CANONIQUE SOURCE :
ID : ${rhyme.id || "MFE0001"}
Titre d'Origine : "${rhyme.title}"
Langue d'Origine : "${rhyme.language || "Inconnue"}"
Paroles d'Origine :
"${rhyme.lyrics_original}"

PROFIL ÉDUCATIF DE REMASTERISATION SELECTIONNÉ : [${remasterKey.toUpperCase()}]
- Discipline d'éveil visée : ${remasterKey} (e.g. Cognitive elements, leadership, science triggers, financial barters, or AI logical conditional branches).
- Objectifs Pédagogiques : Ajustez l'histoire, les actions d'accompagnement ou les métaphores pour intégrer de façon organique des notions de cette discipline.
- Contraintes de chant : Les paroles dans la langue d'origine doivent être adaptées pour correspondre à cette thématique d'éveil d'enfant.

PROFIL DE LANGUE CIBLE SELECTIONNÉ : [${targetLabel}]
- Langue Cible : ${targetLanguageKey}
- Chantabilité absolue : Les vers de la langue cible doivent respecter scrupuleusement la métrique, le tempo, la cadence et les scansions rythmiques d'origine. Ils doivent pouvoir être chantés verbatim sur la même mélodie ou structure rythmique d'origine.
- Clarté phonologique : Utilisez des rimes, assonances, et allitérations musicales fluides adaptées aux de jeunes enfants (âges 2-8 ans).

GÉNÉREZ LA RÉPONSE AU FORMAT JSON STRICTEMENT COMPATIBLE AVEC CE SCHÉMA :
{
  "title_translated": "Titre adapté",
  "lyrics_translated": "Les paroles formées adaptées dans la langue cible (avec retours à la ligne \\n)",
  "notes_adaptation": "Choix minutieux sur la métrique, les allitérations, rimes et transpositions culturelles",
  "singing_guide": "Guide ludique pour guider les professeurs et élèves dans le chant syncopé et la cadence motrice",
  "education_focus": "Comment l'objectif de la discipline '${remasterKey}' s'est glissé dans la mélodie"
}

Retournez UNIQUEMENT du JSON brut, sans balises markdown de code block, pour qu'il soit directement parsable.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text || "{}";
    const parsed = JSON.parse(text);
    res.json({ success: true, result: parsed });

  } catch (error: any) {
    console.error("Gatlinkeys Master Transformation Engine error:", error);
    res.status(500).json({ success: false, error: error.message || "Erreur durant le calcul de l'adaptation." });
  }
});

// Master Prompt Pipelines run endpoint
app.post("/api/pipeline/run", async (req, res) => {
  const { stage, lyricsOriginal, currentData, titleInput, langInput } = req.body;

  if (!lyricsOriginal || lyricsOriginal.trim() === "") {
    return res.status(400).json({ success: false, error: "La comptine originale (paroles) est requise." });
  }

  try {
    const ai = getGeminiClient();

    if (stage === "collecteur") {
      const prompt = `Vous êtes un archiviste expert de l'héritage oral pour enfants (Collecteur).
Analysez les paroles de la comptine suivante et extrayez de manière scientifique toutes ses métadonnées.

Comptine originale :
"${lyricsOriginal}"

Titre présumé: "${titleInput || 'Inconnu'}"
Langue présumée: "${langInput || 'fr'}"

Générez la réponse au format JSON strictement compatible avec ce schéma :
{
  "title": "Titre extrait ou corrigé de la comptine",
  "language": "Code langue ISO double (par exemple: 'fr', 'en', 'mfe', 'ja', 'zh', 'hi', 'af')",
  "origin": {
    "country": "Pays d'origine authentifié",
    "region": "Région géographique ou culturelle d'origine"
  },
  "type": "Un de ces types majeurs : 'nursery_rhyme', 'lullaby', 'counting_rhyme', 'clapping_game', 'game_song'",
  "age_range": {
    "min": Âge minimum recommandé (entier, e.g. 2),
    "max": Âge maximum recommandé (entier, e.g. 6)
  },
  "skills": ["Liste de 3 à 4 compétences stimulées en anglais, e.g. 'memory', 'coordination', 'rhythm', 'language', 'fine_motor'"],
  "themes": ["Liste de 2 à 3 thématiques, e.g. 'animals', 'movement', 'nature', 'numbers'"],
  "source": "Source documentaire ou tradition orale présumée",
  "translation_fr": "Traduction ou résumé en français de l'esprit de la chanson s'il s'agit d'une autre langue",
  "music": {
    "tempo": Tempo estimé en battements par minute (BPM) (entier entre 60 et 140, e.g., 90),
    "meter": "Signature rythmique (par exemple: '4/4', '3/4', '2/4', '6/8')",
    "mood": "Ambiance émotionnelle (e.g. 'Joyful', 'Calming', 'Hypnotic', 'Energetic')",
    "cadence": "Brève description de la cadence ou accompagnement (e.g., 'Clapping rhythm', 'Slow lullaby sway')",
    "call_response": true/false indicatif d'un dialogue chanté,
    "repetition_level": "Un de : 'Low', 'Medium', 'High'",
    "melody_complexity": "Un de : 'Simple', 'Moderate', 'Complex'"
  },
  "linguistics": {
    "vocabulary_level": "Un de : 'Beginner', 'Intermediate', 'Advanced'",
    "phonetic_patterns": "Description brève des patterns phonétiques dominants",
    "syllable_count": Nombre approximatif moyen de syllabes par vers (entier, e.g. 7),
    "rhyme_scheme": "Schéma des rimes (e.g. 'A-A-B-B', 'A-B-A-B', 'Irregular')",
    "alliteration": true/false indicatif de la présence d'allitérations fortes
  },
  "heritage": {
    "historical_period": "Période historique estimée (e.g., '19th Century', 'Pre-colonial', 'Edo Period')",
    "region": "Détails régionaux additionnels",
    "oral_tradition": true/false indiquant si la transmission est principalement orale,
    "references": "Ouvrages de référence ou indicateurs ethnographiques",
    "preservation_status": "Un de : 'Active', 'Endangered', 'Under Research', 'Vulnerable'"
  }
}

Retournez UNIQUEMENT le JSON brut, sans balises markdown de code block, pour qu'il soit directement parsable.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({ success: true, stage, result: parsed, raw: response.text });
    }

    if (stage === "annotateur") {
      // Annotateur takes existing collecteur data and enriches cognitive tags & knowledge graph
      const mergedData = { ...currentData, lyrics_original: lyricsOriginal };
      const prompt = `Vous êtes un psychologue du développement de l'enfant et linguiste cognitif (Annotateur).
Analysez la comptine suivante et enrichissez-la avec une taxonomie cognitive d'apprentissage et des pistes de graphes de connaissances.

Comptine à analyser :
Titre : ${mergedData.title || "Inconnu"}
Paroles :
"${lyricsOriginal}"

Caractéristiques existantes :
Langue: ${mergedData.language}, Type: ${mergedData.type}, Âge cible: ${mergedData.age_range?.min} à ${mergedData.age_range?.max} ans.

Générez la réponse au format JSON strictement compatible avec ce schéma :
{
  "cognitive_tags": ["Sélection de 3 à 5 tags cognitifs précis depuis cette liste fermée : 'observation', 'pattern_recognition', 'sequencing', 'memory', 'reasoning', 'creativity', 'prediction', 'communication'"],
  "knowledge_graph": [
    {
      "id": "L1",
      "skill": "Compétence en français (e.g., Coordination Fine, Discrimination Auditive)",
      "concept": "Concept psychopédagogique clé sous-jacent (e.g., Synchronisation motrice, Permanence spatiale)",
      "activity": "Activité interactive explicite à mener avec les enfants",
      "evaluation": "Indicateur d'évaluation mesurable de succès"
    },
    {
      "id": "L2",
      "skill": "Autre compétence stimulée importante",
      "concept": "Concept psychopédagogique clé sous-jacent",
      "activity": "Autre activité interactive correspondante",
      "evaluation": "Indicateur d'évaluation mesurable correspondant"
    }
  ]
}

Retournez UNIQUEMENT du JSON pur, directement parsable.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({ success: true, stage, result: parsed, raw: response.text });
    }

    if (stage === "remasteriseur") {
      // Remasteriseur produces the 10 educational AI variants
      const prompt = `Vous êtes un concepteur de programmes éducatifs innovants (Remasteriseur).
Votre mission est de produire de manière créative et structurée 10 variantes thématiques éducatives de la comptine traditionnelle fournie.
Chaque variante fournit une explication de 2 à 3 phrases proposant une activité concrète de réinterprétation physique ou de discussion théorique.

Paroles de la Comptine :
"${lyricsOriginal}"

Vous devez obligatoirement formuler une activité éducative pour chacune de ces 10 disciplines pivots exactes :
1. Cognitive (Focus, mémorisation ou tri)
2. Creativity (Arts créatifs, expression théâtrale)
3. Science (Inquiry, biologie, physique ou météo en lien direct)
4. Mathematics (Dénombrement, géométrie ou rythme temporel)
5. Language (Vocabulaire, phonétique, étymologie ou plurilinguisme)
6. Leadership (Responsabilités de groupe, collaboration)
7. Entrepreneurship (Détermination d'objectifs, gestion de projet simple)
8. Health (Motricité, coordination, étirement, respiration)
9. Emotional Intelligence (Sensibilité affective, empathie, résilience)
10. Environmental Awareness (Nature locale, biodiversité, protection)

Générez la réponse au format JSON strictement compatible avec ce schéma :
{
  "cognitive": "Texte explicatif court",
  "creativity": "Texte explicatif court",
  "science": "Texte explicatif court",
  "mathematics": "Texte explicatif court",
  "language": "Texte explicatif court",
  "leadership": "Texte explicatif court",
  "entrepreneurship": "Texte explicatif court",
  "health": "Texte explicatif court",
  "emotional_intelligence": "Texte explicatif court",
  "environmental_awareness": "Texte explicatif court"
}

Retournez UNIQUEMENT du JSON pur, directement parsable.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({ success: true, stage, result: parsed, raw: response.text });
    }

    if (stage === "verificateur") {
      // Verificateur performs a check on target age compliance, safety, and rhythm structure.
      const prompt = `Vous êtes un auditeur senior de la sécurité de l'enfant et de la cohérence rythmique (Vérificateur).
Examinez la comptine originale et l'intégralité des métadonnées accumulées :

Paroles Originales:
"${lyricsOriginal}"

Données actuelles :
${JSON.stringify(currentData)}

Effectuez 4 vérifications méthodologiques fondamentales et exhaustives :
1. "SecuriteEnfant" : Vérifie qu'aucun propos violent, effrayant, sexiste ou dangereux ne s'y trouve.
2. "CoherenceAge" : Vérifie si la complexité de la mélodie, du tempo et du vocabulaire concorde de manière réaliste avec l'âge cible défini (e.g. min/max).
3. "StabiliteMetrique" : Analyse si le tempo, la signature rythmique (meter) et le nombre de syllabes par vers sont uniformément proportionnels.
4. "ExhaustiviteCorpus" : Vérifie que l'écriture comporte bien des annotations linguistiques, musicales et culturelles exhaustives.

Attribuez à chaque vérification un statut : "Pass" ou "Warning" ou "Fail", accompagné d'un commentaire explicatif précis de 1 phrase.
Établissez ensuite un diagnostic final récapitulatif globale (Status global : "Approving" ou "Needs_Revision").

Générez la réponse au format JSON strictement compatible avec ce schéma :
{
  "status_global": "Approving" ou "Needs_Revision",
  "verification_logs": [
    { "critere": "SecuriteEnfant", "status": "Pass" | "Warning" | "Fail", "message": "Raisonnement détaillé" },
    { "critere": "CoherenceAge", "status": "Pass" | "Warning" | "Fail", "message": "Raisonnement détaillé" },
    { "critere": "StabiliteMetrique", "status": "Pass" | "Warning" | "Fail", "message": "Raisonnement détaillé" },
    { "critere": "ExhaustiviteCorpus", "status": "Pass" | "Warning" | "Fail", "message": "Raisonnement détaillé" }
  ],
  "recommandations": "Conseils d'ajustement global ou félicitations."
}

Retournez UNIQUEMENT du JSON pur, directement parsable.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({ success: true, stage, result: parsed, raw: response.text });
    }

    res.status(400).json({ success: false, error: `L'étape de pipeline '${stage}' n'existe pas.` });

  } catch (error: any) {
    console.error("Pipeline run error:", error);
    res.status(500).json({ success: false, error: error.message || "Erreur interne lors du traitement par l'IA." });
  }
});

// Serve compiled static assets in production, otherwise mount Vite in development
async function startServer() {
  const isProd = process.env.NODE_ENV === "production";
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Start Server on Hardcoded Container Port 3000
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server runs on http://0.0.0.0:${PORT} [ENV:${process.env.NODE_ENV || 'production'}]`);
  });
}

startServer();
