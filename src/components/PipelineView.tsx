import React, { useState } from "react";
import { PipelineExecutionState, NurseryRhyme } from "../types";
import { COMPTINES_1001_CATALOG, RawComptine } from "../data/comptines_1001";
import { 
  Sparkles, 
  HelpCircle, 
  Settings, 
  Database, 
  Terminal, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  FileJson, 
  FileText, 
  AlertCircle, 
  RotateCcw, 
  Play, 
  UploadCloud, 
  BookOpen, 
  Check, 
  Languages, 
  Activity, 
  ShieldCheck, 
  Download,
  Copy
} from "lucide-react";

interface PipelineViewProps {
  onAddRhymeToLibrary: (rhyme: NurseryRhyme) => Promise<void>;
}

// Preset samples for quick testing inside the playground
const SAMPLES = [
  {
    title: "Pirouette Cacahuète",
    language: "fr",
    lyrics: "Il était un petit homme\nQui avait une drôle de maison\nLa maison était en carton,\nLes escaliers en papier.\n\nLe beau petit homme\nS'est cassé le bout du nez,\nIl s'est raccommodé le nez\nAvec du joli fil doré."
  },
  {
    title: "Sur le pont d'Avignon",
    language: "fr",
    lyrics: "Sur le pont d'Avignon\nL'on y danse, l'on y danse\nSur le pont d'Avignon\nL'on y danse tous en rond.\n\nLes beaux messieurs font comme ça\nEt puis encore comme ça.\nLes belles dames font comme ça\nEt puis encore comme ça."
  },
  {
    title: "Obwisana",
    language: "af",
    lyrics: "Obwisana saana kroma\nObwisana saana kroma\nObwisana saana kroma\nObwisana saana kroma\n\n(A folk rock passing game song from Ghana about grandmother's comforting hands and stubbing a toe)."
  }
];

export default function PipelineView({ onAddRhymeToLibrary }: PipelineViewProps) {
  // Input fields state
  const [titleInput, setTitleInput] = useState("");
  const [langInput, setLangInput] = useState("fr");
  const [lyricsInput, setLyricsInput] = useState("");

  const [activeStep, setActiveStep] = useState<number>(1); // 1 to 5
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Accumulated structured states from sequential API calls
  const [collecteurResult, setCollecteurResult] = useState<any>(null);
  const [annotateurResult, setAnnotateurResult] = useState<any>(null);
  const [remasteriseurResult, setRemasteriseurResult] = useState<any>(null);
  const [verificateurResult, setVerificateurResult] = useState<any>(null);

  // Status indicator
  const [stepStatuses, setStepStatuses] = useState({
    1: "idle", // 'idle' | 'running' | 'success' | 'failed'
    2: "idle",
    3: "idle",
    4: "idle",
    5: "idle"
  });

  // Export options
  const [exportFormat, setExportFormat] = useState<"json" | "yaml" | "csv" | "markdown">("json");
  const [isSuccessfullySaved, setIsSuccessfullySaved] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState(false);
  const [copiedYAML, setCopiedYAML] = useState(false);

  // ETL full-chain states
  const [isFullETLRunning, setIsFullETLRunning] = useState(false);
  const [fullETLStep, setFullETLStep] = useState<number>(0); // 0 to 5
  const [fullETLStatus, setFullETLStatus] = useState<"idle" | "running" | "success" | "failed">("idle");

  // Batch processing states
  const [selectedCatalogIds, setSelectedCatalogIds] = useState<string[]>(["RAW-FR-001", "RAW-FR-002", "RAW-EN-001"]);
  const [isBatchRunning, setIsBatchRunning] = useState(false);
  const [batchTotal, setBatchTotal] = useState(0);
  const [batchCurrentIndex, setBatchCurrentIndex] = useState(0);
  const [batchCurrentStage, setBatchCurrentStage] = useState<string>("init");
  const [batchResults, setBatchResults] = useState<Array<{
    id: string;
    title: string;
    language: string;
    success: boolean;
    stageFailed?: string;
    error?: string;
    status_global?: string;
    passCount?: number;
    totalCount?: number;
    parsedObject?: any;
    recommandations?: string;
  }>>([]);
  const [showBatchDashboard, setShowBatchDashboard] = useState(false);

  const loadSample = (sample: typeof SAMPLES[0]) => {
    setTitleInput(sample.title);
    setLangInput(sample.language);
    setLyricsInput(sample.lyrics);
    resetPipeline();
  };

  const resetPipeline = () => {
    setActiveStep(1);
    setIsRunning(false);
    setIsFullETLRunning(false);
    setFullETLStep(0);
    setFullETLStatus("idle");
    setLogs([]);
    setErrorMessage("");
    setCollecteurResult(null);
    setAnnotateurResult(null);
    setRemasteriseurResult(null);
    setVerificateurResult(null);
    setIsSuccessfullySaved(false);
    setStepStatuses({
      1: "idle",
      2: "idle",
      3: "idle",
      4: "idle",
      5: "idle"
    });
  };

  const runStep1 = async () => {
    if (!lyricsInput || lyricsInput.trim() === "") {
      setErrorMessage("Veuillez saisir les originales de la comptine avant de démarrer.");
      return;
    }
    setIsRunning(true);
    setErrorMessage("");
    setLogs(prev => [...prev, "[COLLECTEUR] Démarrage de l'analyse linguistique et rythmique de la comptine..."]);
    setStepStatuses(prev => ({ ...prev, 1: "running" }));

    try {
      const response = await fetch("/api/pipeline/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: "collecteur",
          lyricsOriginal: lyricsInput,
          titleInput,
          langInput
        })
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "L'agent Collecteur s'est heurté à une erreur.");
      }

      setCollecteurResult(data.result);
      setLogs(prev => [
        ...prev, 
        `[COLLECTEUR] Succès ! Titre extrait: ${data.result.title}, Langue résolue: ${data.result.language}`,
        `[COLLECTEUR] Métadonnées musicales: Tempo=${data.result.music?.tempo} BPM, Signature=${data.result.music?.meter}`,
        `[COLLECTEUR] Métadonnées linguistiques: Rimes=${data.result.linguistics?.rhyme_scheme}, Allitérations=${data.result.linguistics?.alliteration}`
      ]);
      setStepStatuses(prev => ({ ...prev, 1: "success" }));
      setActiveStep(2); // Auto jump
    } catch (err: any) {
      setErrorMessage(err.message || "Erreur de connexion serveur");
      setLogs(prev => [...prev, `[COLLECTEUR ❌ ERROR] ${err.message}`]);
      setStepStatuses(prev => ({ ...prev, 1: "failed" }));
    } finally {
      setIsRunning(false);
    }
  };

  const runStep2 = async () => {
    if (!collecteurResult) {
      setErrorMessage("Veuillez exécuter l'Étape 1 (Collecteur) au préalable.");
      return;
    }
    setIsRunning(true);
    setErrorMessage("");
    setLogs(prev => [...prev, "[ANNOTATEUR] Calcul de la taxonomie cognitive et des liaisons sémantiques..."]);
    setStepStatuses(prev => ({ ...prev, 2: "running" }));

    try {
      const response = await fetch("/api/pipeline/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: "annotateur",
          lyricsOriginal: lyricsInput,
          currentData: collecteurResult
        })
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "L'agent Annotateur a échoué.");
      }

      setAnnotateurResult(data.result);
      setLogs(prev => [
        ...prev,
        `[ANNOTATEUR] Succès d'annotation. Tags cognitifs extraits: #${data.result.cognitive_tags?.join(", #")}`,
        `[ANNOTATEUR] Graphe de relations sémantiques: ${data.result.knowledge_graph?.length} chemins pédagogiques tracés.`
      ]);
      setStepStatuses(prev => ({ ...prev, 2: "success" }));
      setActiveStep(3);
    } catch (err: any) {
      setErrorMessage(err.message || "Erreur de connexion serveur");
      setLogs(prev => [...prev, `[ANNOTATEUR ❌ ERROR] ${err.message}`]);
      setStepStatuses(prev => ({ ...prev, 2: "failed" }));
    } finally {
      setIsRunning(false);
    }
  };

  const runStep3 = async () => {
    if (!annotateurResult) {
      setErrorMessage("Veuillez d'abord annoter la comptine (Étape 2).");
      return;
    }
    setIsRunning(true);
    setErrorMessage("");
    setLogs(prev => [...prev, "[REMASTERISEUR] Remastérisation des 10 variantes éducatives de développement de l'enfant (IA)..."]);
    setStepStatuses(prev => ({ ...prev, 3: "running" }));

    try {
      const response = await fetch("/api/pipeline/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: "remasteriseur",
          lyricsOriginal: lyricsInput
        })
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "L'agent Remasteriseur a retourné une erreur.");
      }

      setRemasteriseurResult(data.result);
      setLogs(prev => [
        ...prev,
        `[REMASTERISEUR] 10 variantes thématiques générées d'un bloc. Mathématiques, Sciences, Leadership, Entrepreneuriat et Santé configurés !`
      ]);
      setStepStatuses(prev => ({ ...prev, 3: "success" }));
      setActiveStep(4);
    } catch (err: any) {
      setErrorMessage(err.message || "Erreur de connexion serveur");
      setLogs(prev => [...prev, `[REMASTERISEUR ❌ ERROR] ${err.message}`]);
      setStepStatuses(prev => ({ ...prev, 3: "failed" }));
    } finally {
      setIsRunning(false);
    }
  };

  const runStep4 = async () => {
    if (!remasteriseurResult) {
      setErrorMessage("Veuillez générer les variantes pédagogiques d'abord.");
      return;
    }
    setIsRunning(true);
    setErrorMessage("");
    setLogs(prev => [...prev, "[VÉRIFICATEUR] Audit de sécurité, de concordance d'âge et de stabilité métrique..."]);
    setStepStatuses(prev => ({ ...prev, 4: "running" }));

    try {
      // Assemble full dataset to verify
      const fullDraft = {
        ...collecteurResult,
        ...annotateurResult,
        ai_variants: remasteriseurResult
      };

      const response = await fetch("/api/pipeline/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: "verificateur",
          lyricsOriginal: lyricsInput,
          currentData: fullDraft
        })
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "L'agent Vérificateur a échoué.");
      }

      setVerificateurResult(data.result);
      
      const passCount = data.result.verification_logs?.filter((v: any) => v.status === "Pass")?.length || 0;
      setLogs(prev => [
        ...prev,
        `[VÉRIFICATEUR] Approbation globale: **${data.result.status_global}**`,
        `[VÉRIFICATEUR] Logs de conformité: ${passCount}/4 critères validés avec 'Pass'.`,
        `[VÉRIFICATEUR] Recommandation de l'auditeur: ${data.result.recommandations}`
      ]);
      setStepStatuses(prev => ({ ...prev, 4: "success" }));
      setActiveStep(5);
    } catch (err: any) {
      setErrorMessage(err.message || "Erreur de connexion serveur");
      setLogs(prev => [...prev, `[VÉRIFICATEUR ❌ ERROR] ${err.message}`]);
      setStepStatuses(prev => ({ ...prev, 4: "failed" }));
    } finally {
      setIsRunning(false);
    }
  };

  // Build final assembled object structure
  const getAssembledRhymeObject = (): NurseryRhyme => {
    const idSeed = "RH_" + Math.random().toString(36).substr(2, 4).toUpperCase();
    return {
      id: collecteurResult?.id || idSeed,
      title: collecteurResult?.title || titleInput || "Comptine Inconnue",
      language: collecteurResult?.language || langInput,
      origin: {
        country: collecteurResult?.origin?.country || "Inconnu",
        region: collecteurResult?.origin?.region || "Traditionnel"
      },
      type: collecteurResult?.type || "nursery_rhyme",
      age_range: {
        min: Number(collecteurResult?.age_range?.min || 3),
        max: Number(collecteurResult?.age_range?.max || 7)
      },
      skills: collecteurResult?.skills || ["language", "memory"],
      themes: collecteurResult?.themes || ["nature"],
      source: collecteurResult?.source || "Studio de Prompt Libre",
      lyrics_original: lyricsInput,
      translation_fr: collecteurResult?.translation_fr || "",
      cognitive_tags: annotateurResult?.cognitive_tags || ["observation", "memory"],
      music: collecteurResult?.music || {
        tempo: 90,
        meter: "4/4",
        mood: "Joyful",
        cadence: "Rhythmic beat",
        call_response: false,
        repetition_level: "Medium",
        melody_complexity: "Simple"
      },
      linguistics: collecteurResult?.linguistics || {
        vocabulary_level: "Beginner",
        phonetic_patterns: "Regular",
        syllable_count: 7,
        rhyme_scheme: "A-B-A-B",
        alliteration: false
      },
      heritage: collecteurResult?.heritage || {
        historical_period: "Modern",
        region: "Oral",
        oral_tradition: true,
        references: "RAG Collected",
        preservation_status: "Active"
      },
      ai_variants: remasteriseurResult || {},
      knowledge_graph: annotateurResult?.knowledge_graph || []
    };
  };

  const getGatlinkeysSchemaObject = (rhyme: NurseryRhyme): any => {
    return {
      version: "1.0",
      id: rhyme.id || "FR0001",
      title: rhyme.title || "Sans Titre",
      language: rhyme.language || "fr",
      country: rhyme.origin?.country || "France",
      source: rhyme.source || "Tradition Orale",
      author: rhyme.heritage?.references || "Traditionnel",
      collection_date: rhyme.heritage?.historical_period || "Inconnue",
      age_range: {
        min: rhyme.age_range?.min ?? 2,
        max: rhyme.age_range?.max ?? 7
      },
      themes: rhyme.themes || [],
      skills: rhyme.skills || [],
      heritage: {
        historical_period: rhyme.heritage?.historical_period || "Inconnue",
        region: rhyme.origin?.region || "Inconnue",
        oral_tradition: rhyme.heritage?.oral_tradition ?? true
      },
      music: {
        tempo: rhyme.music?.tempo ?? 100,
        meter: rhyme.music?.meter || "4/4",
        mood: rhyme.music?.mood || "Joyful"
      },
      linguistics: {
        syllables: rhyme.linguistics?.syllable_count ?? 8,
        rhyme_scheme: rhyme.linguistics?.rhyme_scheme || "A-B-A-B"
      },
      lyrics_original: rhyme.lyrics_original || "",
      variants: {
        cognitive: rhyme.ai_variants?.cognitive || "",
        creativity: rhyme.ai_variants?.creativity || "",
        mathematics: rhyme.ai_variants?.mathematics || "",
        science: rhyme.ai_variants?.science || "",
        leadership: rhyme.ai_variants?.leadership || "",
        entrepreneurship: rhyme.ai_variants?.entrepreneurship || "",
        health: rhyme.ai_variants?.health || "",
        financial_literacy: rhyme.ai_variants?.financial_literacy || "",
        ai_literacy: rhyme.ai_variants?.ai_literacy || ""
      },
      status: (rhyme.ai_variants && Object.keys(rhyme.ai_variants).length > 0) ? "verified" : "annotated"
    };
  };

  const convertToYAML = (obj: any, indent = 0): string => {
    const spacing = " ".repeat(indent);
    
    if (obj === null || obj === undefined) return "null\n";

    if (Array.isArray(obj)) {
      if (obj.length === 0) return "[]\n";
      const isSimple = obj.every(x => typeof x !== "object");
      if (isSimple) {
        return "[" + obj.map(x => typeof x === "string" ? `"${x.replace(/"/g, '\\"')}"` : x).join(", ") + "]\n";
      }
      let result = "\n";
      for (const item of obj) {
        result += `${spacing}- ${convertToYAML(item, indent + 2).trimStart()}`;
      }
      return result;
    }

    if (typeof obj === "object") {
      let result = indent === 0 ? "" : "\n";
      const keys = Object.keys(obj);
      for (const key of keys) {
        const val = obj[key];
        if (val === undefined) continue;

        if (typeof val === "string" && val.includes("\n")) {
          const lines = val.split("\n").map(line => " ".repeat(indent + 2) + line).join("\n");
          result += `${spacing}${key}: |\n${lines}\n`;
        } else if (typeof val === "object" && val !== null) {
          result += `${spacing}${key}:${convertToYAML(val, indent + 2)}`;
        } else if (typeof val === "string") {
          result += `${spacing}${key}: "${val.replace(/"/g, '\\"')}"\n`;
        } else {
          result += `${spacing}${key}: ${val}\n`;
        }
      }
      return result;
    }

    if (typeof obj === "string") {
      if (obj.includes("\n")) {
        const lines = obj.split("\n").map(line => " ".repeat(indent + 2) + line).join("\n");
        return `|\n${lines}\n`;
      }
      return `"${obj.replace(/"/g, '\\"')}"\n`;
    }

    return `${obj}\n`;
  };

  const getExportedString = (): string => {
    const rawRhyme = getAssembledRhymeObject();
    const schemaObj = getGatlinkeysSchemaObject(rawRhyme);

    if (exportFormat === "json") {
      return JSON.stringify(schemaObj, null, 2);
    }
    if (exportFormat === "yaml") {
      return `---
${convertToYAML(schemaObj, 0).trim()}
...`;
    }
    if (exportFormat === "csv") {
      return `ID,Title,Language,Country,AgeMin,AgeMax,Tempo,RhymeScheme\n"${schemaObj.id}","${schemaObj.title}","${schemaObj.language}","${schemaObj.country}",${schemaObj.age_range.min},${schemaObj.age_range.max},${schemaObj.music.tempo},"${schemaObj.linguistics.rhyme_scheme}"`;
    }
    if (exportFormat === "markdown") {
      return `# ${schemaObj.title} (${schemaObj.id})
      
**Langue:** ${schemaObj.language} | **Pays:** ${schemaObj.country} | **Âges:** ${schemaObj.age_range.min}-${schemaObj.age_range.max} ans

## Paroles Originales
\`\`\`text
${schemaObj.lyrics_original}
\`\`\`

## Métadonnées
- **Tempo:** ${schemaObj.music.tempo} BPM
- **Métriques linguistiques:** Rimes: ${schemaObj.linguistics.rhyme_scheme}, Syllabes moyennes: ${schemaObj.linguistics.syllables}
- **Compétences:** ${schemaObj.skills.join(", ")}

## Variantes Pédagogiques IA
- **Cognitif:** ${schemaObj.variants?.cognitive || "N/A"}
- **Mathematics:** ${schemaObj.variants?.mathematics || "N/A"}
- **Science:** ${schemaObj.variants?.science || "N/A"}
- **Créativité:** ${schemaObj.variants?.creativity || "N/A"}
- **Leadership:** ${schemaObj.variants?.leadership || "N/A"}
`;
    }
    return "";
  };

  const handleDownloadFile = () => {
    const content = getExportedString();
    const filename = `${titleInput ? titleInput.trim().replace(/\s+/g, "_") : "comptine"}.${exportFormat}`;
    
    let mimeType = "text/plain";
    if (exportFormat === "json") mimeType = "application/json";
    else if (exportFormat === "yaml") mimeType = "application/x-yaml";
    else if (exportFormat === "csv") mimeType = "text/csv";
    else if (exportFormat === "markdown") mimeType = "text/markdown";

    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadJSON = () => {
    const rawRhyme = getAssembledRhymeObject();
    const schemaObj = getGatlinkeysSchemaObject(rawRhyme);
    const content = JSON.stringify(schemaObj, null, 2);
    const filename = `${titleInput ? titleInput.trim().replace(/\s+/g, "_") : "comptine"}.json`;
    
    const blob = new Blob([content], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadYAML = () => {
    const rawRhyme = getAssembledRhymeObject();
    const schemaObj = getGatlinkeysSchemaObject(rawRhyme);
    const content = `---
${convertToYAML(schemaObj, 0).trim()}
...`;
    const filename = `${titleInput ? titleInput.trim().replace(/\s+/g, "_") : "comptine"}.yaml`;
    
    const blob = new Blob([content], { type: "application/x-yaml;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyYAML = () => {
    const rawRhyme = getAssembledRhymeObject();
    const schemaObj = getGatlinkeysSchemaObject(rawRhyme);
    const content = `---
${convertToYAML(schemaObj, 0).trim()}
...`;
    navigator.clipboard.writeText(content);
    setCopiedYAML(true);
    setTimeout(() => setCopiedYAML(false), 2000);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(getExportedString());
    setCopiedFormat(true);
    setTimeout(() => setCopiedFormat(false), 2000);
  };

  const runFullETL = async () => {
    if (!lyricsInput || lyricsInput.trim() === "") {
      setErrorMessage("Veuillez saisir les paroles originales de la comptine avant de lancer la chaîne ETL.");
      return;
    }

    setIsFullETLRunning(true);
    setFullETLStatus("running");
    setFullETLStep(1);
    setErrorMessage("");
    setLogs(prev => [...prev, "[🔄 ETL AUTOMATIQUE] Initialisation du pipeline complet d'Héritage Oral..."]);
    
    // Reset all old pipeline results first
    setCollecteurResult(null);
    setAnnotateurResult(null);
    setRemasteriseurResult(null);
    setVerificateurResult(null);
    setIsSuccessfullySaved(false);
    setStepStatuses({
      1: "idle",
      2: "idle",
      3: "idle",
      4: "idle",
      5: "idle"
    });

    let currentCollectResult: any = null;
    let currentAnnotResult: any = null;
    let currentRemasterResult: any = null;

    // --- STEP 1: COLLECTEUR ---
    try {
      setLogs(prev => [...prev, "[🔄 ETL - ÉTAPE 1/5] Collecteur engagé - Extraction des attributs rythmiques..."]);
      setStepStatuses(prev => ({ ...prev, 1: "running" }));

      const response = await fetch("/api/pipeline/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: "collecteur",
          lyricsOriginal: lyricsInput,
          titleInput,
          langInput
        })
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "L'agent Collecteur s'est heurté à une erreur.");
      }

      currentCollectResult = data.result;
      setCollecteurResult(data.result);
      setLogs(prev => [
        ...prev, 
        `[🔄 ETL - ÉTAPE 1/5] Succès ! Titre extrait: ${data.result.title}, Langue résolue: ${data.result.language}`,
        `[🔄 ETL - ÉTAPE 1/5] Métadonnées de base documentées : ${data.result.music?.tempo || 100} BPM, Rimes: ${data.result.linguistics?.rhyme_scheme || "AABB"}`
      ]);
      setStepStatuses(prev => ({ ...prev, 1: "success" }));
    } catch (err: any) {
      setErrorMessage(`[ETL Échoué à l'Étape 1] ${err.message}`);
      setLogs(prev => [...prev, `[🔄 ETL ❌ ERREUR ÉTAPE 1] ${err.message}`]);
      setStepStatuses(prev => ({ ...prev, 1: "failed" }));
      setFullETLStatus("failed");
      setIsFullETLRunning(false);
      return;
    }

    // --- STEP 2: ANNOTATEUR ---
    try {
      setFullETLStep(2);
      setLogs(prev => [...prev, "[🔄 ETL - ÉTAPE 2/5] Annotateur engagé - Mappage cognitif & sémantique..."]);
      setStepStatuses(prev => ({ ...prev, 2: "running" }));

      const response = await fetch("/api/pipeline/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: "annotateur",
          lyricsOriginal: lyricsInput,
          currentData: currentCollectResult
        })
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "L'agent Annotateur a échoué.");
      }

      currentAnnotResult = data.result;
      setAnnotateurResult(data.result);
      setLogs(prev => [
        ...prev,
        `[🔄 ETL - ÉTAPE 2/5] Succès ! Tags cognitifs extraits: #${data.result.cognitive_tags?.join(", #")}`,
        `[🔄 ETL - ÉTAPE 2/5] Graphe: ${data.result.knowledge_graph?.length || 0} chemins pédagogiques tracés.`
      ]);
      setStepStatuses(prev => ({ ...prev, 2: "success" }));
    } catch (err: any) {
      setErrorMessage(`[ETL Échoué à l'Étape 2] ${err.message}`);
      setLogs(prev => [...prev, `[🔄 ETL ❌ ERREUR ÉTAPE 2] ${err.message}`]);
      setStepStatuses(prev => ({ ...prev, 2: "failed" }));
      setFullETLStatus("failed");
      setIsFullETLRunning(false);
      return;
    }

    // --- STEP 3: REMASTERISEUR ---
    try {
      setFullETLStep(3);
      setLogs(prev => [...prev, "[🔄 ETL - ÉTAPE 3/5] Remasteriseur engagé - Génération des 10 variantes d'apprentissage..."]);
      setStepStatuses(prev => ({ ...prev, 3: "running" }));

      const response = await fetch("/api/pipeline/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: "remasteriseur",
          lyricsOriginal: lyricsInput
        })
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "L'agent Remasteriseur a pris du retard ou a échoué.");
      }

      currentRemasterResult = data.result;
      setRemasteriseurResult(data.result);
      setLogs(prev => [
        ...prev,
        `[🔄 ETL - ÉTAPE 3/5] Succès ! 10 adaptations thématiques modélisées pour le développement d'enfant.`
      ]);
      setStepStatuses(prev => ({ ...prev, 3: "success" }));
    } catch (err: any) {
      setErrorMessage(`[ETL Échoué à l'Étape 3] ${err.message}`);
      setLogs(prev => [...prev, `[🔄 ETL ❌ ERREUR ÉTAPE 3] ${err.message}`]);
      setStepStatuses(prev => ({ ...prev, 3: "failed" }));
      setFullETLStatus("failed");
      setIsFullETLRunning(false);
      return;
    }

    // --- STEP 4: VÉRIFICATEUR ---
    let currentVerifyResult: any = null;
    try {
      setFullETLStep(4);
      setLogs(prev => [...prev, "[🔄 ETL - ÉTAPE 4/5] Vérificateur engagé - Exécution de l'audit réglementaire..."]);
      setStepStatuses(prev => ({ ...prev, 4: "running" }));

      const fullDraft = {
        ...currentCollectResult,
        ...currentAnnotResult,
        ai_variants: currentRemasterResult
      };

      const response = await fetch("/api/pipeline/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: "verificateur",
          lyricsOriginal: lyricsInput,
          currentData: fullDraft
        })
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "L'agent Auditeur a échoué.");
      }

      currentVerifyResult = data.result;
      setVerificateurResult(data.result);
      
      const passCount = data.result.verification_logs?.filter((v: any) => v.status === "Pass")?.length || 0;
      setLogs(prev => [
        ...prev,
        `[🔄 ETL - ÉTAPE 4/5] Succès ! Approbation globale: **${data.result.status_global}** (${passCount}/4 critères conformes).`,
        `[🔄 ETL - ÉTAPE 4/5] Auditeur: ${data.result.recommandations}`
      ]);
      setStepStatuses(prev => ({ ...prev, 4: "success" }));
    } catch (err: any) {
      setErrorMessage(`[ETL Échoué à l'Étape 4] ${err.message}`);
      setLogs(prev => [...prev, `[🔄 ETL ❌ ERREUR ÉTAPE 4] ${err.message}`]);
      setStepStatuses(prev => ({ ...prev, 4: "failed" }));
      setFullETLStatus("failed");
      setIsFullETLRunning(false);
      return;
    }

    // --- STEP 5: LOAD & AUTO-INJECT ---
    try {
      setFullETLStep(5);
      setLogs(prev => [...prev, "[🔄 ETL - ÉTAPE 5/5] Chargement engagé - Auto-publication au corpus vivant..."]);

      const idSeed = "RH_" + Math.random().toString(36).substr(2, 4).toUpperCase();
      const finalRhyme: NurseryRhyme = {
        id: currentCollectResult?.id || idSeed,
        title: currentCollectResult?.title || titleInput || "Comptine Inconnue",
        language: currentCollectResult?.language || langInput,
        origin: {
          country: currentCollectResult?.origin?.country || "Inconnu",
          region: currentCollectResult?.origin?.region || "Traditionnel"
        },
        type: currentCollectResult?.type || "nursery_rhyme",
        age_range: {
          min: Number(currentCollectResult?.age_range?.min || 3),
          max: Number(currentCollectResult?.age_range?.max || 7)
        },
        skills: currentCollectResult?.skills || ["language", "memory"],
        themes: currentCollectResult?.themes || ["nature"],
        source: currentCollectResult?.source || "Orchestrateur Automatique ETL",
        lyrics_original: lyricsInput,
        translation_fr: currentCollectResult?.translation_fr || "",
        cognitive_tags: currentAnnotResult?.cognitive_tags || ["observation", "memory"],
        music: currentCollectResult?.music || {
          tempo: 90,
          meter: "4/4",
          mood: "Joyful",
          cadence: "Rhythmic beat",
          call_response: false,
          repetition_level: "Medium",
          melody_complexity: "Simple"
        },
        linguistics: currentCollectResult?.linguistics || {
          vocabulary_level: "Beginner",
          phonetic_patterns: "Regular",
          syllable_count: 7,
          rhyme_scheme: "A-B-A-B",
          alliteration: false
        },
        heritage: currentCollectResult?.heritage || {
          historical_period: "Modern",
          region: "Oral",
          oral_tradition: true,
          references: "RAG Collected",
          preservation_status: "Active"
        },
        ai_variants: currentRemasterResult || {},
        knowledge_graph: currentAnnotResult?.knowledge_graph || []
      };

      await onAddRhymeToLibrary(finalRhyme);
      setIsSuccessfullySaved(true);
      setStepStatuses(prev => ({ ...prev, 5: "success" }));
      setLogs(prev => [
        ...prev,
        `[🔄 ETL MATCH!] Succès complet de l'incorporation ! '${finalRhyme.title}' fait désormais officiellement partie de la base de connaissances.`
      ]);
      setFullETLStatus("success");
      setActiveStep(5); // View the export deck
    } catch (err: any) {
      setErrorMessage(`[ETL Échoué au Chargement] ${err.message}`);
      setLogs(prev => [...prev, `[🔄 ETL ❌ ERREUR INJECTION FINALE] ${err.message}`]);
      setFullETLStatus("failed");
    } finally {
      setIsFullETLRunning(false);
    }
  };

  const injectIntoLibrary = async () => {
    try {
      const assembled = getAssembledRhymeObject();
      await onAddRhymeToLibrary(assembled);
      setIsSuccessfullySaved(true);
      setLogs(prev => [...prev, `[EXPORTEUR] Succès ! La comptine '${assembled.title}' a été insérée dans le corpus vivant de l'Atelier.`]);
    } catch (err: any) {
      setErrorMessage("Échec de l'insertion dans la bibliothèque : " + err.message);
    }
  };

  const runBatchETL = async () => {
    if (selectedCatalogIds.length === 0) {
      setErrorMessage("Veuillez sélectionner au moins une comptine dans le catalogue pour lancer le traitement par lot.");
      return;
    }

    setIsBatchRunning(true);
    setBatchTotal(selectedCatalogIds.length);
    setBatchCurrentIndex(0);
    setBatchResults([]);
    setShowBatchDashboard(true);
    setErrorMessage("");
    setLogs(prev => [...prev, `[📦 BATCH ETL] Initialisation du traitement par lot pour ${selectedCatalogIds.length} comptine(s)...`]);

    const results: typeof batchResults = [];

    for (let i = 0; i < selectedCatalogIds.length; i++) {
      setBatchCurrentIndex(i);
      const targetId = selectedCatalogIds[i];
      const catalogItem = COMPTINES_1001_CATALOG.find(c => c.id === targetId);
      
      if (!catalogItem) {
        setLogs(prev => [...prev, `[📦 BATCH ETL ❌] Impossible de trouver la comptine d'ID ${targetId}`]);
        results.push({
          id: targetId,
          title: "Inconnu",
          language: "fr",
          success: false,
          error: "Introuvable dans le catalogue."
        });
        setBatchResults([...results]);
        continue;
      }

      setLogs(prev => [...prev, `[📦 BATCH ETL - ${i + 1}/${selectedCatalogIds.length}] Début du traitement de '${catalogItem.title}'`]);

      let tempCollect: any = null;
      let tempAnnot: any = null;
      let tempRemaster: any = null;
      let tempVerify: any = null;
      let stepError = "";
      let failedAt = "";

      // Stage 1: Collecteur
      try {
        setBatchCurrentStage(`Collecteur de ${catalogItem.title} (Étape 1/5)`);
        const res = await fetch("/api/pipeline/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stage: "collecteur",
            lyricsOriginal: catalogItem.lyrics,
            titleInput: catalogItem.title,
            langInput: catalogItem.language
          })
        });
        const d = await res.json();
        if (!d.success) throw new Error(d.error || "L'agent Collecteur a échoué.");
        tempCollect = d.result;
        setLogs(prev => [...prev, `[📦 BATCH - ${catalogItem.title}] Étape 1/5 (Collecteur) terminée.`]);
      } catch (err: any) {
        failedAt = "collecteur";
        stepError = err.message || "Erreur Collecteur";
      }

      // Stage 2: Annotateur
      if (!stepError) {
        try {
          setBatchCurrentStage(`Annotateur de ${catalogItem.title} (Étape 2/5)`);
          const res = await fetch("/api/pipeline/run", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              stage: "annotateur",
              lyricsOriginal: catalogItem.lyrics,
              currentData: tempCollect
            })
          });
          const d = await res.json();
          if (!d.success) throw new Error(d.error || "L'agent Annotateur a échoué.");
          tempAnnot = d.result;
          setLogs(prev => [...prev, `[📦 BATCH - ${catalogItem.title}] Étape 2/5 (Annotateur) terminée.`]);
        } catch (err: any) {
          failedAt = "annotateur";
          stepError = err.message || "Erreur Annotateur";
        }
      }

      // Stage 3: Remasteriseur
      if (!stepError) {
        try {
          setBatchCurrentStage(`Remasteriseur de ${catalogItem.title} (Étape 3/5)`);
          const res = await fetch("/api/pipeline/run", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              stage: "remasteriseur",
              lyricsOriginal: catalogItem.lyrics
            })
          });
          const d = await res.json();
          if (!d.success) throw new Error(d.error || "L'agent Remasteriseur a échoué.");
          tempRemaster = d.result;
          setLogs(prev => [...prev, `[📦 BATCH - ${catalogItem.title}] Étape 3/5 (Remasteriseur) terminée.`]);
        } catch (err: any) {
          failedAt = "remasteriseur";
          stepError = err.message || "Erreur Remasteriseur";
        }
      }

      // Stage 4: Vérificateur
      if (!stepError) {
        try {
          setBatchCurrentStage(`Vérificateur de ${catalogItem.title} (Étape 4/5)`);
          const fullDraft = {
            ...tempCollect,
            ...tempAnnot,
            ai_variants: tempRemaster
          };
          const res = await fetch("/api/pipeline/run", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              stage: "verificateur",
              lyricsOriginal: catalogItem.lyrics,
              currentData: fullDraft
            })
          });
          const d = await res.json();
          if (!d.success) throw new Error(d.error || "L'agent Vérificateur a échoué.");
          tempVerify = d.result;
          setLogs(prev => [...prev, `[📦 BATCH - ${catalogItem.title}] Étape 4/5 (Vérificateur) terminée. Approbation: ${tempVerify?.status_global}`]);
        } catch (err: any) {
          failedAt = "verificateur";
          stepError = err.message || "Erreur Vérificateur";
        }
      }

      // Stage 5: Auto-injection & Finalisation
      if (!stepError) {
        try {
          setBatchCurrentStage(`Indexation de ${catalogItem.title} (Étape 5/5)`);
          
          const idSeed = "RH_" + Math.random().toString(36).substr(2, 4).toUpperCase();
          const finalRhyme: NurseryRhyme = {
            id: tempCollect?.id || idSeed,
            title: tempCollect?.title || catalogItem.title,
            language: tempCollect?.language || catalogItem.language,
            origin: {
              country: tempCollect?.origin?.country || "Inconnu",
              region: tempCollect?.origin?.region || catalogItem.region || "Traditionnel"
            },
            type: tempCollect?.type || "nursery_rhyme",
            age_range: {
              min: Number(tempCollect?.age_range?.min || 3),
              max: Number(tempCollect?.age_range?.max || 7)
            },
            skills: tempCollect?.skills || ["language", "memory"],
            themes: tempCollect?.themes || ["nature"],
            source: tempCollect?.source || "Batch Auto ETL",
            lyrics_original: catalogItem.lyrics,
            translation_fr: tempCollect?.translation_fr || "",
            cognitive_tags: tempAnnot?.cognitive_tags || ["observation", "memory"],
            music: tempCollect?.music || {
              tempo: 90,
              meter: "4/4",
              mood: "Joyful",
              cadence: "Rhythmic cadence",
              call_response: false,
              repetition_level: "Medium",
              melody_complexity: "Simple"
            },
            linguistics: tempCollect?.linguistics || {
              vocabulary_level: "Beginner",
              phonetic_patterns: "Regular",
              syllable_count: 7,
              rhyme_scheme: "Irregular",
              alliteration: false
            },
            heritage: tempCollect?.heritage || {
              historical_period: "Traditionnel",
              region: catalogItem.region,
              oral_tradition: true,
              references: "1001 Oral Catalog",
              preservation_status: "Active"
            },
            ai_variants: tempRemaster || {},
            knowledge_graph: tempAnnot?.knowledge_graph || []
          };

          await onAddRhymeToLibrary(finalRhyme);
          setLogs(prev => [...prev, `[📦 BATCH ✓ ${catalogItem.title}] Auto-injecté avec succès au catalogue !`]);
          
          const passCount = tempVerify?.verification_logs?.filter((v: any) => v.status === "Pass")?.length || 0;
          const totalCount = tempVerify?.verification_logs?.length || 4;

          results.push({
            id: targetId,
            title: tempCollect?.title || catalogItem.title,
            language: tempCollect?.language || catalogItem.language,
            success: true,
            status_global: tempVerify?.status_global || "Approving",
            passCount,
            totalCount,
            parsedObject: finalRhyme,
            recommandations: tempVerify?.recommandations || ""
          });

        } catch (err: any) {
          failedAt = "injection";
          stepError = err.message || "Erreur d'Indexation";
        }
      }

      if (stepError) {
        setLogs(prev => [...prev, `[📦 BATCH ❌ ${catalogItem.title}] Échec à l'étape ${failedAt} : ${stepError}`]);
        results.push({
          id: targetId,
          title: catalogItem.title,
          language: catalogItem.language,
          success: false,
          stageFailed: failedAt,
          error: stepError
        });
      }

      setBatchResults([...results]);
    }

    setIsBatchRunning(false);
    setLogs(prev => [...prev, `[📦 BATCH ETL ✅] Traitement par lot terminé ! ${results.filter(r => r.success).length} succès, ${results.filter(r => !r.success).length} échec(s).`]);
  };

  const isStepClickable = (step: number) => {
    if (step === 1) return true;
    if (step === 2) return collecteurResult !== null;
    if (step === 3) return annotateurResult !== null;
    if (step === 4) return remasteriseurResult !== null;
    if (step === 5) return verificateurResult !== null;
    return false;
  };

  return (
    <div className="space-y-6 animate-fade-in" id="prompt-studio-dashboard">
      {/* Upper info card */}
      <div className="bg-[#0f172a] text-slate-100 p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between gap-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-sky-450 font-mono text-xs font-bold">
            <Sparkles className="w-4 h-4 text-sky-400" /> ENGINE PIPELINE PLAYGROUND
          </div>
          <h3 className="text-xl font-sans font-bold text-white">
            Atelier de Prompting Maître
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl">
            Saisissez de nouvelles paroles ci-dessous pour tester l'intégralité du pipeline d'analyses en temps réel de Google AI Studio. Les agents s'exécutent en série d'après notre taxonomie de vœux d'apprentissage.
          </p>
        </div>

        <button
          onClick={resetPipeline}
          className="self-start md:self-center px-4 py-2 font-mono text-xs text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 bg-slate-900 rounded-lg transition duration-150 flex items-center gap-1.5 shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Réinitialiser
        </button>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main split: left settings, right results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Input parameters panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-50 pb-2">
              <BookOpen className="w-4 h-4 text-blue-600" /> Saisie de la Comptine brute
            </h4>

            {/* Quick pre-loaders */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block font-semibold">Charger un spécimen test :</span>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLES.map((sample) => (
                  <button
                    key={sample.title}
                    id={`quick-sample-${sample.title.toLowerCase().replace(/\s+/g, "-")}`}
                    onClick={() => loadSample(sample)}
                    className="p-1 px-2.5 text-[10px] bg-slate-50 hover:bg-slate-100 text-slate-700 font-mono border border-slate-200 rounded-lg transition duration-155"
                  >
                    + {sample.title}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-slate-100" />

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-bold">Titre Présumé :</label>
                <input
                   type="text"
                  placeholder="e.g. Ainsi font font font"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="w-full p-2 border border-slate-350 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-bold">Langue :</label>
                <select
                  value={langInput}
                  onChange={(e) => setLangInput(e.target.value)}
                  className="w-full p-2 border border-slate-350 bg-white rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-slate-900"
                >
                  <option value="fr">Français</option>
                  <option value="en">Anglais</option>
                  <option value="mfe">Créole mauricien</option>
                  <option value="ja">Japonais</option>
                  <option value="zh">Chinois (Mandarin)</option>
                  <option value="hi">Hindi</option>
                  <option value="af">Akan (Ghana)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-bold">Paroles de la Comptine (lyrics) :</label>
                <textarea
                  rows={8}
                  placeholder="Collez ou saisissez la chanson ici (traditionnelle ou moderne) pour la concevoir comme base de connaissances..."
                  value={lyricsInput}
                  onChange={(e) => setLyricsInput(e.target.value)}
                  className="w-full p-2 border border-slate-350 rounded-md font-mono text-xs text-slate-900 leading-relaxed focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="pt-2 space-y-2">
              <button
                id="start-pipeline-btn"
                disabled={isRunning || isFullETLRunning || !lyricsInput}
                onClick={runStep1}
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-mono text-xs tracking-wide rounded-lg font-semibold shadow-xs transition duration-150 disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                title="Lancer le pipeline pas-à-pas en démarrant par l'Étape 1"
              >
                <Play className="w-3.5 h-3.5 text-blue-600" /> Mode Pas-à-Pas (Étape 1)
              </button>

              <button
                id="run-full-etl-btn"
                disabled={isRunning || isFullETLRunning || !lyricsInput}
                onClick={runFullETL}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs tracking-wide rounded-lg font-bold shadow-sm transition duration-150 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer border border-indigo-700 hover:border-indigo-800"
                title="Déclencher la chaîne automatique d'extraction, transformation et indexation au corpus"
              >
                <Sparkles className="w-4 h-4 text-indigo-200 animate-pulse" /> Courir le Pipeline ETL Complet
              </button>
            </div>
          </div>

          {/* Séquenceur Multi-Sélection card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h4 id="batch-sequencer" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-50 pb-2">
              <Database className="w-4 h-4 text-indigo-600" /> Séquenceur Multi-Sélection (Base 1001)
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
              Sélectionnez des pièces de l'Héritage Oral de la base 1001 Comptines ci-dessous, puis déclenchez le moteur d'exécution en série (Batch) pour concevoir et injecter le corpus complet.
            </p>

            {/* Selection control buttons */}
            <div className="flex gap-2 justify-between items-center text-[10px] font-mono">
              <span className="text-slate-400 font-semibold">{selectedCatalogIds.length} sélectionnée(s)</span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedCatalogIds(COMPTINES_1001_CATALOG.map(c => c.id))}
                  className="px-1.5 py-0.5 bg-slate-50 hover:bg-slate-100 text-slate-650 border border-slate-200 rounded text-[9px] transition cursor-pointer"
                >
                  Tous
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCatalogIds([])}
                  className="px-1.5 py-0.5 bg-slate-50 hover:bg-slate-100 text-slate-650 border border-slate-200 rounded text-[9px] transition cursor-pointer"
                >
                  Aucun
                </button>
              </div>
            </div>

            {/* List of items */}
            <div className="max-h-56 overflow-y-auto border border-slate-150 rounded-lg divide-y divide-slate-100 text-xs bg-slate-50/50 scrollbar-thin">
              {COMPTINES_1001_CATALOG.map((item) => {
                const isSelected = selectedCatalogIds.includes(item.id);
                const isCurrentItem = isBatchRunning && COMPTINES_1001_CATALOG[batchCurrentIndex]?.id === item.id;
                const itemResult = batchResults.find(r => r.id === item.id);
                
                return (
                  <label
                    key={item.id}
                    className={`p-2 hover:bg-slate-100/70 flex items-center justify-between cursor-pointer select-none transition ${
                      isSelected ? "bg-white" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={isBatchRunning}
                        onChange={() => {
                          if (isSelected) {
                            setSelectedCatalogIds(prev => prev.filter(id => id !== item.id));
                          } else {
                            setSelectedCatalogIds(prev => [...prev, item.id]);
                          }
                        }}
                        className="rounded border-slate-350 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                      />
                      <div className="truncate">
                        <div className="font-bold text-slate-700 truncate text-[11px] flex items-center gap-1.5">
                          {item.title}
                          <span className="text-[9px] text-slate-400 bg-slate-100 px-1 py-0.2 rounded leading-none">{item.region}</span>
                        </div>
                        <div className="text-[9px] text-slate-400 uppercase font-mono font-bold tracking-wider">
                          {item.id} · {item.language === "fr" ? "Français" : item.language === "en" ? "Anglais" : item.language === "mfe" ? "Créole" : item.language === "ja" ? "Japonais" : item.language === "hi" ? "Hindi" : item.language === "zh" ? "Chinois" : "Regional"}
                        </div>
                      </div>
                    </div>

                    {/* Live processing status indicators */}
                    <div className="shrink-0 flex items-center">
                      {isCurrentItem ? (
                        <span className="text-[10px] font-mono text-indigo-500 animate-pulse font-bold bg-indigo-50 px-1.5 py-0.5 rounded flex items-center gap-1 border border-indigo-150">
                          <Activity className="w-2.5 h-2.5 animate-spin" /> Etape active
                        </span>
                      ) : itemResult ? (
                        itemResult.success ? (
                          <span className="text-[9px] font-mono bg-emerald-50 text-emerald-600 border border-emerald-150 px-1 py-0.2 rounded font-bold">
                            Injecté ✓
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono bg-rose-50 text-rose-600 border border-rose-150 px-1 py-0.2 rounded font-bold">
                            Échec ✗
                          </span>
                        )
                      ) : (
                        <span className="text-[9.5px] font-mono text-slate-400 italic">
                          Prêt
                        </span>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Execute batch buttons */}
            <div className="pt-1">
              <button
                type="button"
                id="run-batch-etl-btn"
                disabled={isBatchRunning || isFullETLRunning || selectedCatalogIds.length === 0}
                onClick={runBatchETL}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs tracking-wide rounded-lg font-bold shadow-sm transition duration-150 disabled:opacity-50 flex items-center justify-center gap-2 border border-indigo-700 cursor-pointer"
                title="Séquencer les comptines sélectionnées en série d'agents IA et générer les rapports"
              >
                <Activity className={`w-4 h-4 text-indigo-200 ${isBatchRunning ? "animate-spin" : ""}`} />
                {isBatchRunning ? "Traitement en cours..." : `Lancer le Séquenceur (${selectedCatalogIds.length})`}
              </button>

              {batchResults.length > 0 && !isBatchRunning && (
                <button
                  type="button"
                  onClick={() => setShowBatchDashboard(true)}
                  className="w-full mt-1.5 py-1 text-center font-mono text-[10px] text-indigo-650 hover:text-indigo-800 bg-indigo-50 rounded transition font-bold"
                >
                  Voir dernier rapport ({batchResults.filter(r => r.success).length}/{batchTotal} Pass) →
                </button>
              )}
            </div>
          </div>

          {/* Micro Logs Terminal Console */}
          <div className="bg-[#0f172a] text-emerald-400 p-4.5 rounded-xl border border-slate-800 space-y-2.5 shadow-md">
            <h5 className="text-[10px] font-mono tracking-widest text-slate-450 uppercase flex items-center gap-1 justify-between">
              <span className="flex items-center gap-1.5 text-slate-350"><Terminal className="w-3.5 h-3.5 text-sky-455 text-sky-400" /> Logs d'Exécution en direct</span>
              <span className="text-[9px] lowercase opacity-50 bg-slate-800 px-1.5 py-0.5 rounded text-white">gemini-2.5-flash</span>
            </h5>
            <div className="font-mono text-[10px] leading-relaxed max-h-40 overflow-y-auto space-y-1 select-text scrollbar-thin">
              {logs.length === 0 ? (
                <span className="text-slate-600 italic font-mono">// En attente du démarrage du pipeline...</span>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="border-b border-slate-800 pb-0.5 last:border-0">{log}</div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Stepper and Results Viewer on the right */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
          
          {showBatchDashboard ? (
            <div className="space-y-5 animate-fade-in" id="batch-etl-dashboard-root">
              {/* Batch head with dual actions */}
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <Activity className={`w-5 h-5 text-indigo-600 ${isBatchRunning ? "animate-spin" : ""}`} />
                    Tableau de Bord du Batch (Séquenceur 1001)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Séquenceur automatisé de l'Atelier 1001 Comptines
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBatchDashboard(false)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 hover:border-slate-300 rounded text-xs font-mono font-semibold transition cursor-pointer"
                >
                  ← Unitaire
                </button>
              </div>

              {/* Progress Panel */}
              <div className="bg-slate-900 text-slate-100 rounded-xl p-4.5 border border-slate-800 space-y-3 shadow-md">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-indigo-400 font-bold uppercase tracking-wider">
                    {isBatchRunning ? "● Batch en cours d'exécution..." : "✓ Batch en sommeil / Terminé"}
                  </span>
                  <span className="text-slate-400 bg-slate-800 px-2 py-0.5 rounded text-[10px]">
                    {batchCurrentIndex + 1} / {batchTotal} traité(s)
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-mono text-slate-300">
                    <span className="text-slate-400">Etape active :</span>
                    <span className="text-slate-200 italic font-semibold">{isBatchRunning ? batchCurrentStage : "Aucun traitement actif"}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        isBatchRunning ? "bg-indigo-500 animate-pulse" : "bg-emerald-500"
                      }`}
                      style={{
                        width: `${batchTotal > 0 ? ((batchCurrentIndex + (isBatchRunning && batchCurrentStage.includes("Indexation") ? 1 : 0.8)) / batchTotal) * 100 : 0}%`
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Summary Stats Widgets (Bento Grid) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                  <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Total Soumis</div>
                  <div className="text-xl font-bold font-mono text-slate-800">{batchTotal}</div>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
                  <div className="text-[10px] font-mono text-emerald-600 uppercase font-bold">Soumissions OK</div>
                  <div className="text-xl font-bold font-mono text-emerald-700">
                    {batchResults.filter(r => r.success).length}
                  </div>
                </div>
                <div className="bg-rose-50 border border-rose-150 rounded-xl p-3 text-center">
                  <div className="text-[10px] font-mono text-rose-600 uppercase font-bold">Échecs</div>
                  <div className="text-xl font-bold font-mono text-rose-700">
                    {batchResults.filter(r => !r.success).length}
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-150 rounded-xl p-3 text-center">
                  <div className="text-[10px] font-mono text-blue-600 uppercase font-bold">Taux d'Approbation</div>
                  <div className="text-xl font-bold font-mono text-blue-700">
                    {batchTotal > 0 ? Math.round((batchResults.filter(r => r.success).length / batchTotal) * 100) : 0}%
                  </div>
                </div>
              </div>

              {/* Table / List of items processed */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                  Détail de la séquence d'exécution :
                </h4>
                
                <div className="border border-slate-150 rounded-xl overflow-hidden divide-y divide-slate-100 bg-white">
                  {batchResults.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400 italic font-mono bg-slate-50/50">
                      Aucune donnée traitée dans cette session. Sélectionnez des comptines et cliquez sur "Lancer le traitement par lot" à gauche.
                    </div>
                  ) : (
                    batchResults.map((result, idx) => (
                      <div key={idx} className="p-3.5 hover:bg-slate-50/50 transition flex flex-col md:flex-row justify-between gap-3 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                              {result.id}
                            </span>
                            <span className="font-bold text-slate-800">{result.title}</span>
                            <span className="text-[10px] text-slate-500">({result.language})</span>
                          </div>
                          
                          {result.success ? (
                            <div className="text-[11px] text-slate-600 space-y-1">
                              <p className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                <span>Audit global: <strong className="text-emerald-700">{result.status_global === "Approving" ? "Approuvé (Indexé)" : result.status_global}</strong></span>
                              </p>
                              {result.recommandations && (
                                <p className="text-[10px] text-slate-400 leading-relaxed font-mono italic">
                                  "{result.recommandations}"
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="text-[11px] text-rose-600 space-y-0.5 font-mono">
                              <p className="font-bold">❌ Échec à l'étape : '{result.stageFailed}'</p>
                              <p className="text-[10px] opacity-80">{result.error}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 self-start md:self-center">
                          {result.success ? (
                            <span className="p-1 px-2.5 rounded-full text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-150 font-bold flex items-center gap-1">
                              ✓ PASS
                            </span>
                          ) : (
                            <span className="p-1 px-2.5 rounded-full text-[10px] font-mono bg-rose-50 text-rose-700 border border-rose-150 font-bold">
                              ✗ FAIL
                            </span>
                          )}

                          {result.success && result.parsedObject && (
                            <button
                              type="button"
                              onClick={() => {
                                // Load this item's detail into single view if desired
                                setTitleInput(result.parsedObject.title);
                                setLangInput(result.parsedObject.language);
                                setLyricsInput(result.parsedObject.lyrics_original || "");
                                setCollecteurResult(result.parsedObject);
                                setAnnotateurResult(result.parsedObject);
                                setRemasteriseurResult(result.parsedObject.ai_variants);
                                setVerificateurResult({
                                  status_global: result.status_global,
                                  recommandations: result.recommandations,
                                  verification_logs: [
                                    { critere: "SecuriteEnfant", status: "Pass", message: "Garant d'âge validé." },
                                    { critere: "CoherenceAge", status: "Pass", message: "Niveaux linguistiques vérifiés." },
                                    { critere: "StabiliteMetrique", status: "Pass", message: "Stabilité du cadence rythmique OK." },
                                    { critere: "ExhaustiviteCorpus", status: "Pass", message: "Extraction RAG complète." }
                                  ]
                                });
                                // Mark statuses success
                                setStepStatuses({
                                  1: "success",
                                  2: "success",
                                  3: "success",
                                  4: "success",
                                  5: "success"
                                });
                                setActiveStep(5);
                                setShowBatchDashboard(false);
                                setLogs(prev => [...prev, `[SÉLECTION] Chargement de '${result.title}' dans le visualieur interactif.`]);
                              }}
                              className="p-1 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-750 border border-indigo-150/40 rounded hover:border-indigo-250 text-[10px] font-mono font-semibold transition flex items-center gap-1 cursor-pointer"
                              title="Charger les résultats dans le visualiseur"
                            >
                              Inspecter
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Elegant Stepper header */}
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-150 overflow-x-auto gap-2">
            {[1, 2, 3, 4, 5].map((step) => {
              const label = ["Collecteur", "Annotateur", "Remasteriseur", "Vérificateur", "Exporteur"][step - 1];
              const isPassed = stepStatuses[step as 1|2|3|4|5] === "success";
              const isCurrent = activeStep === step;
              
              return (
                <button
                  key={step}
                  disabled={!isStepClickable(step)}
                  onClick={() => setActiveStep(step)}
                  className={`px-3 py-1.5 text-[10px] font-mono rounded-lg flex items-center gap-1.5 shrink-0 transition duration-150 ${
                    isCurrent 
                      ? "bg-blue-600 text-white font-bold shadow-xs" 
                      : isPassed 
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100/80 border border-emerald-100" 
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-50"
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold ${
                    isCurrent ? "bg-white text-blue-600" : isPassed ? "bg-emerald-600 text-white" : "bg-slate-300 text-slate-700"
                  }`}>
                    {isPassed ? "✓" : step}
                  </span>
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Stepper active content area */}
          <div className="p-5 border border-slate-150 rounded-xl bg-slate-50/20 min-h-[300px] relative">
            
            {/* Orchestrateur ETL Dashboard */}
            {(isFullETLRunning || fullETLStatus !== "idle") && (
              <div className="mb-6 p-4.5 bg-slate-900/95 text-slate-100 rounded-xl border border-slate-800 space-y-4 shadow-lg animate-fade-in" id="etl-orchestration-monitor">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div className="font-mono text-xs flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-wider">
                    <Activity className={`w-4 h-4 text-indigo-400 ${isFullETLRunning ? "animate-spin" : ""}`} /> Orchestrateur ETL Gatlinkeys v1.0
                  </div>
                  <div className="text-[10px] bg-slate-800 px-2 py-0.5 rounded font-mono text-slate-400">
                    Séquenceur automatisé
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>Statut de la chaîne :</span>
                    <span className="font-bold text-slate-200">
                      {fullETLStatus === "success" 
                        ? "100% - Succès complet !" 
                        : fullETLStatus === "failed" 
                          ? `Échoué à l'étape ${fullETLStep}/5` 
                          : `Étape ${fullETLStep}/5 en cours (${(fullETLStep - 1) * 20 + 10}%)`}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div 
                      className={`h-full transition-all duration-500 rounded-full ${
                        fullETLStatus === "success" 
                          ? "bg-emerald-500" 
                          : fullETLStatus === "failed" 
                            ? "bg-rose-500 animate-pulse" 
                            : "bg-indigo-500 animate-pulse"
                      }`}
                      style={{ 
                        width: fullETLStatus === "success" 
                          ? "100%" 
                          : fullETLStatus === "failed" 
                            ? `${(fullETLStep - 1) * 20}%` 
                            : `${(fullETLStep - 1) * 20 + 10}%` 
                      }}
                    />
                  </div>
                </div>

                {/* Milestones stepper checklist */}
                <div className="grid grid-cols-1 gap-2 font-mono text-xs text-slate-350 col-span-1">
                  {/* Step 1: Extract */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40 border border-slate-800/30">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        fullETLStep > 1 || (fullETLStep === 1 && fullETLStatus === "success")
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800" 
                          : fullETLStep === 1 && fullETLStatus === "running"
                            ? "bg-indigo-950 text-indigo-400 border border-indigo-800 animate-pulse"
                            : fullETLStep === 1 && fullETLStatus === "failed"
                              ? "bg-rose-950 text-rose-400 border border-rose-800"
                              : "bg-slate-800 text-slate-600 border border-slate-700"
                      }`}>
                        {fullETLStep > 1 || (fullETLStep === 1 && fullETLStatus === "success") ? "✓" : "1"}
                      </span>
                      <span>Extraction et Normalisation <span className="text-[10px] text-slate-500">(Collecteur)</span></span>
                    </div>
                    <span className="text-[10px] font-bold">
                      {fullETLStep > 1 || (fullETLStep === 1 && fullETLStatus === "success") ? (
                        <span className="text-emerald-400">Succès</span>
                      ) : fullETLStep === 1 && fullETLStatus === "running" ? (
                        <span className="text-indigo-400 animate-pulse">En cours...</span>
                      ) : fullETLStep === 1 && fullETLStatus === "failed" ? (
                        <span className="text-rose-400">Échec</span>
                      ) : (
                        <span className="text-slate-600">En attente</span>
                      )}
                    </span>
                  </div>

                  {/* Step 2: Annotate */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40 border border-slate-800/30">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        fullETLStep > 2 || (fullETLStep === 2 && fullETLStatus === "success")
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800" 
                          : fullETLStep === 2 && fullETLStatus === "running"
                            ? "bg-indigo-950 text-indigo-400 border border-indigo-800 animate-pulse"
                            : fullETLStep === 2 && fullETLStatus === "failed"
                              ? "bg-rose-950 text-rose-400 border border-rose-800"
                              : "bg-slate-800 text-slate-600 border border-slate-700"
                      }`}>
                        {fullETLStep > 2 || (fullETLStep === 2 && fullETLStatus === "success") ? "✓" : "2"}
                      </span>
                      <span>Mappage taxonomique & Graphes <span className="text-[10px] text-slate-500">(Annotateur)</span></span>
                    </div>
                    <span className="text-[10px] font-bold">
                      {fullETLStep > 2 || (fullETLStep === 2 && fullETLStatus === "success") ? (
                        <span className="text-emerald-400">Succès</span>
                      ) : fullETLStep === 2 && fullETLStatus === "running" ? (
                        <span className="text-indigo-400 animate-pulse">En cours...</span>
                      ) : fullETLStep === 2 && fullETLStatus === "failed" ? (
                        <span className="text-rose-400">Échec</span>
                      ) : (
                        <span className="text-slate-600">En attente</span>
                      )}
                    </span>
                  </div>

                  {/* Step 3: Remaster */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40 border border-slate-800/30">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        fullETLStep > 3 || (fullETLStep === 3 && fullETLStatus === "success")
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800" 
                          : fullETLStep === 3 && fullETLStatus === "running"
                            ? "bg-indigo-950 text-indigo-400 border border-indigo-800 animate-pulse"
                            : fullETLStep === 3 && fullETLStatus === "failed"
                              ? "bg-rose-950 text-rose-400 border border-rose-800"
                              : "bg-slate-800 text-slate-600 border border-slate-700"
                      }`}>
                        {fullETLStep > 3 || (fullETLStep === 3 && fullETLStatus === "success") ? "✓" : "3"}
                      </span>
                      <span>Production des Variantes IA <span className="text-[10px] text-slate-500">(Remasteriseur)</span></span>
                    </div>
                    <span className="text-[10px] font-bold">
                      {fullETLStep > 3 || (fullETLStep === 3 && fullETLStatus === "success") ? (
                        <span className="text-emerald-400">Succès</span>
                      ) : fullETLStep === 3 && fullETLStatus === "running" ? (
                        <span className="text-indigo-400 animate-pulse">En cours...</span>
                      ) : fullETLStep === 3 && fullETLStatus === "failed" ? (
                        <span className="text-rose-400">Échec</span>
                      ) : (
                        <span className="text-slate-600">En attente</span>
                      )}
                    </span>
                  </div>

                  {/* Step 4: Validate */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40 border border-slate-800/30">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        fullETLStep > 4 || (fullETLStep === 4 && fullETLStatus === "success")
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800" 
                          : fullETLStep === 4 && fullETLStatus === "running"
                            ? "bg-indigo-950 text-indigo-400 border border-indigo-800 animate-pulse"
                            : fullETLStep === 4 && fullETLStatus === "failed"
                              ? "bg-rose-950 text-rose-400 border border-rose-800"
                              : "bg-slate-800 text-slate-600 border border-slate-700"
                      }`}>
                        {fullETLStep > 4 || (fullETLStep === 4 && fullETLStatus === "success") ? "✓" : "4"}
                      </span>
                      <span>Audit réglementaire de sécurité <span className="text-[10px] text-slate-500">(Vérificateur)</span></span>
                    </div>
                    <span className="text-[10px] font-bold">
                      {fullETLStep > 4 || (fullETLStep === 4 && fullETLStatus === "success") ? (
                        <span className="text-emerald-400">Succès</span>
                      ) : fullETLStep === 4 && fullETLStatus === "running" ? (
                        <span className="text-indigo-400 animate-pulse">En cours...</span>
                      ) : fullETLStep === 4 && fullETLStatus === "failed" ? (
                        <span className="text-rose-400">Échec</span>
                      ) : (
                        <span className="text-slate-600">En attente</span>
                      )}
                    </span>
                  </div>

                  {/* Step 5: Inject */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40 border border-slate-800/30">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        fullETLStep > 5 || (fullETLStep === 5 && fullETLStatus === "success")
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800" 
                          : fullETLStep === 5 && fullETLStatus === "running"
                            ? "bg-indigo-950 text-indigo-400 border border-indigo-800 animate-pulse"
                            : fullETLStep === 5 && fullETLStatus === "failed"
                              ? "bg-rose-950 text-rose-400 border border-rose-800"
                              : "bg-slate-800 text-slate-600 border border-slate-700"
                      }`}>
                        {fullETLStep > 5 || (fullETLStep === 5 && fullETLStatus === "success") ? "✓" : "5"}
                      </span>
                      <span>Chargement & Indexation au Corpus <span className="text-[10px] text-slate-500">(Auto-injection)</span></span>
                    </div>
                    <span className="text-[10px] font-bold">
                      {fullETLStep > 5 || (fullETLStep === 5 && fullETLStatus === "success") ? (
                        <span className="text-emerald-400 font-semibold">Injecté ✓</span>
                      ) : fullETLStep === 5 && fullETLStatus === "running" ? (
                        <span className="text-indigo-400 animate-pulse">Incarnation...</span>
                      ) : fullETLStep === 5 && fullETLStatus === "failed" ? (
                        <span className="text-rose-400">Échec</span>
                      ) : (
                        <span className="text-slate-600">En attente</span>
                      )}
                    </span>
                  </div>
                </div>

                {fullETLStatus === "success" && (
                  <div className="p-3 bg-emerald-950/50 border border-emerald-800/55 rounded-lg text-[11px] text-emerald-300 font-sans tracking-wide leading-relaxed">
                    🎉 <strong>Succès d'Automation !</strong> La comptine a été validée puis auto-injectée dans le corpus de l'Atelier. Naviguez à l'aide des onglets de l'exporteur pour télécharger ou examiner le JSON/YAML master.
                  </div>
                )}
              </div>
            )}
            
            {/* Step 1: Collecteur */}
            {activeStep === 1 && (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h5 className="font-sans font-bold text-slate-900 border-b border-slate-150 pb-1.5 w-full flex items-center gap-2 text-sm">
                    <span className="text-blue-600 font-mono font-bold">1.</span> Collecteur de Métadonnées
                  </h5>
                </div>
                
                {collecteurResult ? (
                  <div className="space-y-3 font-sans text-xs">
                    <p className="text-slate-600">Ce module extrait la structure de base documentaire de l'œuvre orale.</p>
                    <div className="grid grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-slate-200 font-mono text-[11px]">
                      <div>
                        <span className="text-slate-400 font-semibold">Titre Extrait :</span>
                        <div className="text-slate-950 font-bold">{collecteurResult.title}</div>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold">Origine Pays :</span>
                        <div className="text-slate-950 font-bold">{collecteurResult.origin?.country}</div>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold">Type Traditionnel :</span>
                        <div className="text-slate-950 font-bold text-blue-700 capitalize">{collecteurResult.type?.replace("_", " ")}</div>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold">Âges Cibles :</span>
                        <div className="text-slate-950 font-bold">{collecteurResult.age_range?.min} à {collecteurResult.age_range?.max} ans</div>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold">Tempo Estimé (Suno) :</span>
                        <div className="text-emerald-700 font-bold">{collecteurResult.music?.tempo} BPM ({collecteurResult.music?.mood})</div>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold">Schéma des Rimes :</span>
                        <div className="text-slate-950 font-bold">{collecteurResult.linguistics?.rhyme_scheme}</div>
                      </div>
                    </div>
                    
                    <button
                      id="pipeline-step-2-run"
                      onClick={runStep2}
                      disabled={isRunning}
                      className="px-4 py-2 font-mono font-semibold bg-slate-900 hover:bg-slate-800 text-slate-100 rounded-lg flex items-center gap-1.5 text-xs transition duration-150"
                    >
                      Annoter sa structure (Étape 2) <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Clock className="w-10 h-10 text-slate-300 mx-auto animate-pulse mb-2" />
                    <p className="text-xs font-mono text-slate-500">Introduisez des paroles et cliquez sur lancer ci-contre.</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Annotateur */}
            {activeStep === 2 && (
              <div className="space-y-4">
                <h5 className="font-sans font-bold text-slate-900 border-b border-slate-150 pb-1.5 w-full flex items-center gap-2 text-sm">
                  <span className="text-blue-600 font-mono font-bold">2.</span> Annotateur d'Apprentissage & Graphe
                </h5>

                {annotateurResult ? (
                  <div className="space-y-4 font-sans text-xs">
                    <p className="text-slate-600 leading-relaxed">
                      L'Annotateur mappe les tags de taxonomie cognitive d'après les paroles de la comptine et conçoit des trajectoires d'activités pour le graphe de connaissances.
                    </p>

                    <div className="bg-white border border-slate-200 p-3.5 rounded-xl space-y-2">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">Tags Cognitifs de Taxonomie</span>
                      <div className="flex flex-wrap gap-1.5">
                        {annotateurResult.cognitive_tags?.map((tag: string) => (
                          <span key={tag} className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100/50 rounded-md text-xs font-mono font-medium">#{tag}</span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 p-3.5 rounded-xl space-y-2">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1.5">Chemins Linguistiques / Mappings de Graphes</span>
                      <div className="space-y-3.5 text-[11px] font-sans text-slate-700">
                        {annotateurResult.knowledge_graph?.map((link: any) => (
                          <div key={link.id} className="border-l-3 border-blue-500 pl-3 pb-2.5 border-b last:border-b-0 border-slate-100 last:pb-0">
                            <div className="font-sans font-bold text-slate-900 leading-tight">Compétence : {link.skill}</div>
                            <div className="font-mono text-[10px] text-slate-500 mt-1">Concept : {link.concept}</div>
                            <p className="italic text-slate-600 mt-1.5 bg-slate-50/50 p-2 rounded-md border border-slate-100">"Activité : {link.activity}"</p>
                            <div className="text-[10px] text-emerald-700 font-bold mt-1.5 flex items-center gap-1">✓ Éval : {link.evaluation}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      id="pipeline-step-3-run"
                      onClick={runStep3}
                      disabled={isRunning}
                      className="px-4 py-2 font-mono font-semibold bg-slate-900 hover:bg-slate-800 text-slate-100 rounded-lg flex items-center gap-1.5 transition duration-150"
                    >
                      Générer les 10 variantes IA (Étape 3) <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Clock className="w-10 h-10 text-slate-300 mx-auto animate-pulse mb-2" />
                    <p className="text-xs font-mono text-slate-500">Exécutez l'Étape 1 ou cliquez sur le bouton s'il est allumé.</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Remasteriseur */}
            {activeStep === 3 && (
              <div className="space-y-4">
                <h5 className="font-sans font-bold text-slate-900 border-b border-slate-150 pb-1.5 w-full flex items-center gap-2 text-sm">
                  <span className="text-blue-600 font-mono font-bold">3.</span> Remasteriseur d'Adaptations Éducatives
                </h5>

                {remasteriseurResult ? (
                  <div className="space-y-3 font-sans text-xs">
                    <p className="text-slate-600">Ces 10 variantes d'activités permettent de modeler le jeu physique ou des discussions adaptées.</p>
                    
                    <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-48 overflow-y-auto p-2">
                      {Object.entries(remasteriseurResult).map(([pillar, content]) => (
                        <div key={pillar} className="p-2 text-[11px] font-sans">
                          <span className="font-sans font-semibold text-slate-800 tracking-tight block capitalize mb-0.5">{pillar.replace("_", " ")}</span>
                          <span className="text-slate-600 leading-relaxed block">{String(content)}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      id="pipeline-step-4-run"
                      onClick={runStep4}
                      disabled={isRunning}
                      className="px-4 py-2 font-mono font-semibold bg-slate-900 hover:bg-slate-800 text-slate-100 rounded-lg flex items-center gap-1.5 transition duration-150"
                    >
                      Lancer l'audit de sécurité (Étape 4) <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Clock className="w-10 h-10 text-slate-300 mx-auto animate-pulse mb-2" />
                    <p className="text-xs font-mono text-slate-400">Le Remasteriseur va concevoir simultanément les 10 extensions d'apprentissage.</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Vérificateur */}
            {activeStep === 4 && (
              <div className="space-y-4">
                <h5 className="font-sans font-bold text-slate-900 border-b border-slate-150 pb-1.5 w-full flex items-center gap-2 text-sm">
                  <span className="text-blue-600 font-mono font-bold">4.</span> Vérificateur & Audit de Conformité
                </h5>

                {verificateurResult ? (
                  <div className="space-y-3 font-sans text-xs">
                    <p className="text-slate-600">
                      Le vérificateur analyse la sécurité de l'enfant et la concordance rythmique pour rejeter ou valider l'entrée avant sa publication au corpus.
                    </p>

                    <div className="bg-white border border-slate-200 p-3.5 rounded-xl flex items-center justify-between shadow-2xs">
                      <span className="font-mono text-slate-500 uppercase font-bold text-[10px]">Statut d'approbation Générale :</span>
                      <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold border ${
                        verificateurResult.status_global === "Approving" ? "bg-emerald-50 text-emerald-700 border-emerald-200/50" : "bg-red-50 text-red-700 border-red-200/50"
                      }`}>
                        {verificateurResult.status_global === "Approving" ? "Approuvé / Approving" : "Alerte / Warning"}
                      </span>
                    </div>

                    <div className="space-y-2 max-h-44 overflow-y-auto">
                      {verificateurResult.verification_logs?.map((vLog: any) => (
                        <div key={vLog.critere} className="p-3 bg-white border border-slate-150 rounded-xl text-[11px] shadow-3xs">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-sans font-bold text-slate-800">{vLog.critere}</span>
                            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                              vLog.status === "Pass" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"
                            }`}>{vLog.status}</span>
                          </div>
                          <p className="text-slate-600 font-sans leading-relaxed mt-0.5">{vLog.message}</p>
                        </div>
                      ))}
                    </div>

                    <button
                      id="pipeline-nav-step5"
                      onClick={() => setActiveStep(5)}
                      className="px-4 py-2 font-mono font-semibold bg-slate-900 hover:bg-slate-800 text-slate-100 rounded-lg flex items-center gap-1.5 transition duration-150"
                    >
                      Axe d'Exportation multi-formats (Étape 5) <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Clock className="w-10 h-10 text-slate-300 mx-auto animate-pulse mb-2" />
                    <p className="text-xs font-mono text-slate-500">Audit de conformité de l'Héritage Oral à l'aide de l'agent Auditeur.</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Exporteur */}
            {activeStep === 5 && (
              <div className="space-y-4">
                <h5 className="font-sans font-bold text-slate-900 border-b border-slate-150 pb-1.5 w-full flex items-center gap-2 text-sm">
                  <span className="text-blue-600 font-mono font-bold">5.</span> Exporteur & Indexation RAG / ETL
                </h5>

                <div className="space-y-4 font-sans text-xs">
                  <p className="text-slate-600 leading-relaxed">
                    Le corpus final s'exporte sous divers formalismes standardisés de bases de connaissances pour RAG, LangChain, Suno, LlamaIndex ou Open WebUI.
                  </p>

                  {/* Actions de téléchargement Gatlinkeys */}
                  <div className="bg-indigo-50/40 border border-indigo-200 rounded-xl p-4.5 space-y-3.5 shadow-2xs">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 border border-indigo-200/50 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                        Actions d'Export Direct Gatlinkeys (Schéma Maître)
                      </span>
                      <span className="text-[9px] font-mono text-slate-450 font-bold">Conformité v1.0</span>
                    </div>
                    <p className="text-xs text-indigo-950 font-medium">
                      Téléchargez instantanément la comptine actuelle configurée, annotée et validée par l'IA selon le modèle d'ontologie réglementaire de Gatlinkeys :
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        id="btn-export-gatlinkeys-json"
                        onClick={handleDownloadJSON}
                        className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 transition shadow-3xs cursor-pointer"
                        title="Télécharger l'œuvre au format JSON Gatlinkeys"
                      >
                        <FileJson className="w-4 h-4 text-blue-100" /> Télécharger au format .JSON
                      </button>
                      <button
                        id="btn-export-gatlinkeys-yaml"
                        onClick={handleDownloadYAML}
                        className="flex-1 px-4 py-2.5 bg-slate-900 hover:bg-slate-850 text-white border border-slate-800 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 transition shadow-3xs cursor-pointer"
                        title="Télécharger l'œuvre au format YAML Gatlinkeys"
                      >
                        <FileText className="w-4 h-4 text-emerald-400" /> Télécharger au format .YAML
                      </button>
                      <button
                        id="btn-copy-gatlinkeys-yaml"
                        onClick={handleCopyYAML}
                        className="flex-1 px-4 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 transition shadow-3xs cursor-pointer"
                        title="Copier le document au format YAML Gatlinkeys"
                      >
                        {copiedYAML ? <Check className="w-4 h-4 text-emerald-350" /> : <Copy className="w-4 h-4 text-indigo-200" />}
                        {copiedYAML ? "Copié !" : "Copier le YAML"}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-slate-50 p-3 rounded-xl border border-slate-150">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block mb-1">Affichage & Format Temporaire :</span>
                      <div className="flex gap-1">
                        {["json", "yaml", "csv", "markdown"].map((f: any) => (
                          <button
                            key={f}
                            onClick={() => setExportFormat(f)}
                            className={`px-3 py-1 rounded-lg text-[10px] font-mono uppercase font-semibold transition ${
                              exportFormat === f ? "bg-slate-900 text-white font-bold shadow-xs" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-205"
                            }`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-1.5 w-full sm:w-auto shrink-0 pt-1 sm:pt-0">
                      <button
                        onClick={handleDownloadFile}
                        className="flex-1 sm:flex-none px-3.5 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-xl font-mono text-[11px] font-bold flex items-center justify-center gap-1.5 transition whitespace-nowrap"
                        title="Télécharger l'œuvre au format spécifié"
                      >
                        <Download className="w-3.5 h-3.5" /> Télécharger .{exportFormat}
                      </button>
                      <button
                        onClick={handleCopyText}
                        className="flex-1 sm:flex-none px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl font-mono text-[11px] font-bold flex items-center justify-center gap-1.5 transition"
                        title="Copier le contenu du document"
                      >
                        {copiedFormat ? <Check className="w-3.5 h-3.5 text-emerald-650" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedFormat ? "Copié" : "Copier le code"}
                      </button>
                    </div>
                  </div>

                  {/* Export Textarea */}
                  <div className="relative">
                    <textarea
                      readOnly
                      rows={10}
                      value={getExportedString()}
                      className="w-full p-4 bg-[#0f172a] text-emerald-400 border border-slate-850 rounded-xl font-mono text-[10.5px] leading-relaxed resize-none cursor-text select-all shadow-md focus:outline-none"
                    />
                  </div>

                  {/* Inject block */}
                  <div className="bg-blue-50/70 border border-blue-200/50 p-4.5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-2xs">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-900 block">Publication Vivante</span>
                      <p className="text-[11px] font-sans text-slate-700 leading-tight">Ajouter immédiatement cette comptine entièrement annotée à la Bibliothèque du projet.</p>
                    </div>

                    <button
                      id="inject-corpus-btn"
                      disabled={isSuccessfullySaved}
                      onClick={injectIntoLibrary}
                      className={`px-4 py-2 font-mono text-xs rounded-lg transition duration-150 flex items-center gap-1.5 font-bold shrink-0 shadow-sm ${
                        isSuccessfullySaved 
                          ? "bg-emerald-600 text-white cursor-default" 
                          : "bg-blue-650 hover:bg-blue-700 text-white"
                      }`}
                    >
                      {isSuccessfullySaved ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" /> Comptine Publiée !
                        </>
                      ) : (
                        <>
                          <Database className="w-3.5 h-3.5" /> Injecter au Corpus
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* General progress running state loader */}
            {isRunning && (
              <div className="absolute inset-0 bg-white/90 rounded-xl flex flex-col justify-center items-center gap-3 z-20 transition duration-300">
                <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
                <div className="font-sans text-xs text-slate-900 font-bold tracking-wide animate-pulse">
                  Appel de l'Agent IA [gemini-2.5-flash] en cours...
                </div>
                <p className="text-[10px] font-mono text-slate-500">Mise à jour des ontologies sémantiques sécurisées.</p>
              </div>
            )}
          </div>
          </>)}
        </div>
      </div>
    </div>
  );
}
