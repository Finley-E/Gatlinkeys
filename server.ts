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
