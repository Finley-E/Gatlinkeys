import React, { useState } from "react";
import { PipelineExecutionState, NurseryRhyme } from "../types";
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

  const loadSample = (sample: typeof SAMPLES[0]) => {
    setTitleInput(sample.title);
    setLangInput(sample.language);
    setLyricsInput(sample.lyrics);
    resetPipeline();
  };

  const resetPipeline = () => {
    setActiveStep(1);
    setIsRunning(false);
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

  const getExportedString = (): string => {
    const obj = getAssembledRhymeObject();
    if (exportFormat === "json") {
      return JSON.stringify(obj, null, 2);
    }
    if (exportFormat === "yaml") {
      return `---
id: "${obj.id}"
title: "${obj.title}"
language: "${obj.language}"
origin:
  country: "${obj.origin.country}"
  region: "${obj.origin.region}"
type: "${obj.type}"
age_range:
  min: ${obj.age_range.min}
  max: ${obj.age_range.max}
skills: [${obj.skills.map(s => `"${s}"`).join(", ")}]
lyrics_original: |
  ${obj.lyrics_original.replace(/\n/g, "\n  ")}
cognitive_tags: [${obj.cognitive_tags.map(t => `"${t}"`).join(", ")}]
...`;
    }
    if (exportFormat === "csv") {
      return `ID,Title,Language,Country,AgeMin,AgeMax,Tempo,RhymeScheme\n"${obj.id}","${obj.title}","${obj.language}","${obj.origin.country}",${obj.age_range.min},${obj.age_range.max},${obj.music.tempo},"${obj.linguistics.rhyme_scheme}"`;
    }
    if (exportFormat === "markdown") {
      return `# ${obj.title} (${obj.id})
      
**Langue:** ${obj.language} | **Pays:** ${obj.origin.country} | **Âges:** ${obj.age_range.min}-${obj.age_range.max} ans

## Paroles Originales
\`\`\`text
${obj.lyrics_original}
\`\`\`

## Métadonnées
- **Tempo:** ${obj.music.tempo} BPM
- **Taxonomies Cognitives:** ${obj.cognitive_tags.join(", ")}

## Variantes Pédagogiques IA
- **Cognitif:** ${obj.ai_variants?.cognitive || "N/A"}
- **Mathematics:** ${obj.ai_variants?.mathematics || "N/A"}
`;
    }
    return "";
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(getExportedString());
    setCopiedFormat(true);
    setTimeout(() => setCopiedFormat(false), 2000);
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
      <div className="bg-stone-900 text-stone-100 p-5 rounded-lg border border-stone-800 flex flex-col md:flex-row justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-amber-500 font-mono text-xs">
            <Sparkles className="w-4 h-4" /> ENGINE PIPELINE PLAYGROUND
          </div>
          <h3 className="text-xl font-serif font-semibold text-white">
            Atelier de Prompting Maître
          </h3>
          <p className="text-xs text-stone-400 max-w-2xl">
            Saisissez de nouvelles paroles ci-dessous pour tester l'intégralité du pipeline d'analyses en temps réel de Google AI Studio. Les agents s'exécutent en série d'après notre taxonomie de vœux d'apprentissage.
          </p>
        </div>

        <button
          onClick={resetPipeline}
          className="self-start md:self-center px-3 py-1.5 font-mono text-xs text-stone-350 hover:text-white border border-stone-800 hover:border-stone-700 bg-stone-900 rounded transition flex items-center gap-1 shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Réinitialiser
        </button>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main split: left settings, right results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Input parameters panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-600" /> Saisie de la Comptine brute
            </h4>

            {/* Quick pre-loaders */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-stone-400 block">Charger un spécimen test :</span>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLES.map((sample) => (
                  <button
                    key={sample.title}
                    id={`quick-sample-${sample.title.toLowerCase().replace(/\s+/g, "-")}`}
                    onClick={() => loadSample(sample)}
                    className="p-1 px-2 text-[10px] bg-stone-50 hover:bg-stone-100 text-stone-700 font-mono border border-stone-200 rounded transition"
                  >
                    + {sample.title}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-stone-100" />

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-stone-600 mb-1 font-bold">Titre Présumé :</label>
                <input
                  type="text"
                  placeholder="e.g. Ainsi font font font"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded focus:ring-1 focus:ring-amber-500 text-stone-900"
                />
              </div>

              <div>
                <label className="block text-stone-600 mb-1 font-bold">Langue :</label>
                <select
                  value={langInput}
                  onChange={(e) => setLangInput(e.target.value)}
                  className="w-full p-2 border border-stone-300 bg-white rounded focus:ring-1 focus:ring-amber-500 text-stone-900"
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
                <label className="block text-stone-600 mb-1 font-bold">Paroles de la Comptine (lyrics) :</label>
                <textarea
                  rows={8}
                  placeholder="Collez ou saisissez la chanson ici (traditionnelle ou moderne) pour la concevoir comme base de connaissances..."
                  value={lyricsInput}
                  onChange={(e) => setLyricsInput(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded font-mono text-xs text-stone-900 leading-relaxed focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
            
            <div className="pt-2">
              <button
                id="start-pipeline-btn"
                disabled={isRunning || !lyricsInput}
                onClick={runStep1}
                className="w-full py-2 bg-stone-950 hover:bg-stone-850 text-white font-mono text-xs tracking-wide rounded font-bold shadow transition disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" /> Lancer l'Étape 1 (Collecteur)
              </button>
            </div>
          </div>

          {/* Micro Logs Terminal Console */}
          <div className="bg-stone-950 text-emerald-400 p-4 rounded-lg border border-stone-900 space-y-2 shadow-inner">
            <h5 className="text-[10px] font-mono tracking-widest text-stone-500 uppercase flex items-center gap-1 justify-between">
              <span className="flex items-center gap-1"><Terminal className="w-3 h-3" /> Logs d'Exécution en direct</span>
              <span className="text-[9px] lowercase opacity-60">gemini-3.5-flash</span>
            </h5>
            <div className="font-mono text-[10px] leading-relaxed max-h-40 overflow-y-auto space-y-1 select-text scrollbar-thin">
              {logs.length === 0 ? (
                <span className="text-stone-600 italic">// En attente du démarrage du pipeline...</span>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="border-b border-stone-900 pb-0.5 last:border-0">{log}</div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Stepper and Results Viewer on the right */}
        <div className="lg:col-span-7 bg-white border border-stone-200 rounded-lg p-5 shadow-sm space-y-5">
          
          {/* Elegant Stepper header */}
          <div className="flex justify-between items-center bg-stone-50 p-2.5 rounded-lg border border-stone-200/60 overflow-x-auto gap-2">
            {[1, 2, 3, 4, 5].map((step) => {
              const label = ["Collecteur", "Annotateur", "Remasteriseur", "Vérificateur", "Exporteur"][step - 1];
              const isPassed = stepStatuses[step as 1|2|3|4|5] === "success";
              const isCurrent = activeStep === step;
              const isRun = stepStatuses[step as 1|2|3|4|5] === "running";
              
              return (
                <button
                  key={step}
                  disabled={!isStepClickable(step)}
                  onClick={() => setActiveStep(step)}
                  className={`px-3 py-1.5 text-[10px] font-mono rounded flex items-center gap-1 shrink-0 ${
                    isCurrent 
                      ? "bg-amber-600 text-white font-bold" 
                      : isPassed 
                        ? "bg-emerald-50 text-emerald-850 hover:bg-emerald-100" 
                        : "bg-stone-100 hover:bg-stone-150 text-stone-600 disabled:opacity-50"
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full text-[9px] flex items-center justify-center font-bold ${
                    isCurrent ? "bg-white text-amber-600" : isPassed ? "bg-emerald-600 text-white" : "bg-stone-300 text-stone-700"
                  }`}>
                    {isPassed ? "✓" : step}
                  </span>
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Stepper active content area */}
          <div className="p-4 border border-stone-150 rounded-lg bg-stone-50/20 min-h-[300px]">
            
            {/* Step 1: Collecteur */}
            {activeStep === 1 && (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h5 className="font-serif font-semibold text-stone-900 border-b border-stone-200 pb-1 w-full flex items-center gap-2">
                    <span className="text-amber-600 font-mono">1.</span> Collecteur de Métadonnées
                  </h5>
                </div>
                
                {collecteurResult ? (
                  <div className="space-y-3 font-sans text-xs">
                    <p className="text-stone-600">Ce module extrait la structure de base documentaire de l'œuvre orale.</p>
                    <div className="grid grid-cols-2 gap-3 bg-white p-3 rounded border border-stone-200 font-mono text-[11px]">
                      <div>
                        <span className="text-stone-400">Titre Extrait :</span>
                        <div className="text-stone-950 font-bold">{collecteurResult.title}</div>
                      </div>
                      <div>
                        <span className="text-stone-400">Origine Pays :</span>
                        <div className="text-stone-950 font-bold">{collecteurResult.origin?.country}</div>
                      </div>
                      <div>
                        <span className="text-stone-400">Type Traditionnel :</span>
                        <div className="text-stone-950 font-bold text-amber-800 capitalize">{collecteurResult.type?.replace("_", " ")}</div>
                      </div>
                      <div>
                        <span className="text-stone-400">Âges Cibles :</span>
                        <div className="text-stone-950 font-bold">{collecteurResult.age_range?.min} à {collecteurResult.age_range?.max} ans</div>
                      </div>
                      <div>
                        <span className="text-stone-400">Tempo Estimé (Suno) :</span>
                        <div className="text-stone-950 font-bold text-emerald-800">{collecteurResult.music?.tempo} BPM ({collecteurResult.music?.mood})</div>
                      </div>
                      <div>
                        <span className="text-stone-400">Schéma des Rimes :</span>
                        <div className="text-stone-950 font-bold">{collecteurResult.linguistics?.rhyme_scheme}</div>
                      </div>
                    </div>
                    
                    <button
                      id="pipeline-step-2-run"
                      onClick={runStep2}
                      disabled={isRunning}
                      className="px-3.5 py-1.5 font-mono text-xs bg-stone-900 hover:bg-stone-800 text-stone-100 rounded flex items-center gap-1 text-xs"
                    >
                      Annoter sa structure (Étape 2) <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Clock className="w-10 h-10 text-stone-300 mx-auto animate-pulse mb-2" />
                    <p className="text-xs font-mono text-stone-500">Introduisez des paroles et cliquez sur lancer ci-contre.</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Annotateur */}
            {activeStep === 2 && (
              <div className="space-y-4">
                <h5 className="font-serif font-semibold text-stone-900 border-b border-stone-200 pb-1 w-full flex items-center gap-2">
                  <span className="text-amber-600 font-mono">2.</span> Annotateur d'Apprentissage & Graphe
                </h5>

                {annotateurResult ? (
                  <div className="space-y-4 font-sans text-xs">
                    <p className="text-stone-600 leading-relaxed">
                      L'Annotateur mappe les tags de taxonomie cognitive d'après les paroles de la comptine et conçoit des trajectoires d'activités pour le graphe de connaissances.
                    </p>

                    <div className="bg-white border border-stone-200 p-3 rounded space-y-2">
                      <span className="text-[10px] font-mono text-stone-400 uppercase">Tags Cognitifs de Taxonomie</span>
                      <div className="flex flex-wrap gap-1.5">
                        {annotateurResult.cognitive_tags?.map((tag: string) => (
                          <span key={tag} className="px-2 py-0.5 bg-purple-50 text-purple-900 border border-purple-100 rounded text-xs font-mono font-medium">#{tag}</span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border border-stone-200 p-3 rounded space-y-2">
                      <span className="text-[10px] font-mono text-stone-400 uppercase">Chemins Linguistiques / Mappings de Graphes</span>
                      <div className="space-y-2 text-[11px] font-sans text-stone-700">
                        {annotateurResult.knowledge_graph?.map((link: any) => (
                          <div key={link.id} className="border-l-2 border-amber-400 pl-2.5 pb-2 border-b last:border-b-0 border-stone-100 last:pb-0">
                            <div className="font-serif font-medium text-stone-900 leading-tight">Compétence : {link.skill}</div>
                            <div className="font-mono text-[10px] text-stone-500 mt-0.5">Concept : {link.concept}</div>
                            <p className="italic text-stone-600 mt-1">"Activité : {link.activity}"</p>
                            <div className="text-[10px] text-emerald-800 font-bold mt-0.5">Éval : {link.evaluation}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      id="pipeline-step-3-run"
                      onClick={runStep3}
                      disabled={isRunning}
                      className="px-3.5 py-1.5 font-mono text-xs bg-stone-900 hover:bg-stone-800 text-stone-100 rounded flex items-center gap-1"
                    >
                      Générer les 10 variantes IA (Étape 3) <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Clock className="w-10 h-10 text-stone-300 mx-auto animate-pulse mb-2" />
                    <p className="text-xs font-mono text-stone-500">Exécutez l'Étape 1 ou cliquez sur le bouton s'il est allumé.</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Remasteriseur */}
            {activeStep === 3 && (
              <div className="space-y-4">
                <h5 className="font-serif font-semibold text-stone-900 border-b border-stone-200 pb-1 w-full flex items-center gap-2">
                  <span className="text-amber-600 font-mono">3.</span> Remasteriseur d'Adaptations Éducatives
                </h5>

                {remasteriseurResult ? (
                  <div className="space-y-3 font-sans text-xs">
                    <p className="text-stone-600">Ces 10 variantes d'activités permettent de modeler le jeu physique ou des discussions adaptées.</p>
                    
                    <div className="bg-white border border-stone-200 rounded divide-y divide-stone-100 max-h-48 overflow-y-auto">
                      {Object.entries(remasteriseurResult).map(([pillar, content]) => (
                        <div key={pillar} className="p-2 text-[11px] font-sans">
                          <span className="font-serif font-bold text-stone-900 block capitalize">{pillar.replace("_", " ")}</span>
                          <span className="text-stone-600 leading-relaxed block">{String(content)}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      id="pipeline-step-4-run"
                      onClick={runStep4}
                      disabled={isRunning}
                      className="px-3.5 py-1.5 font-mono text-xs bg-stone-900 hover:bg-stone-800 text-stone-100 rounded flex items-center gap-1"
                    >
                      Lancer l'audit de sécurité (Étape 4) <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Clock className="w-10 h-10 text-stone-300 mx-auto animate-pulse mb-2" />
                    <p className="text-xs font-mono text-stone-400">Le Remasteriseur va concevoir simultanément les 10 extensions d'apprentissage.</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Vérificateur */}
            {activeStep === 4 && (
              <div className="space-y-4">
                <h5 className="font-serif font-semibold text-stone-900 border-b border-stone-200 pb-1 w-full flex items-center gap-2">
                  <span className="text-amber-600 font-mono">4.</span> Vérificateur & Audit de Conformité
                </h5>

                {verificateurResult ? (
                  <div className="space-y-3 font-sans text-xs">
                    <p className="text-stone-600">
                      Le vérificateur analyse la sécurité de l'enfant et la concordance rythmique pour rejeter ou valider l'entrée avant sa publication au corpus.
                    </p>

                    <div className="bg-white border border-stone-200 p-3 rounded flex items-center justify-between">
                      <span className="font-mono text-stone-500 uppercase">Statut d'approbation Générale :</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                        verificateurResult.status_global === "Approving" ? "bg-emerald-100 text-emerald-950" : "bg-red-100 text-red-950"
                      }`}>
                        {verificateurResult.status_global}
                      </span>
                    </div>

                    <div className="space-y-2 max-h-44 overflow-y-auto">
                      {verificateurResult.verification_logs?.map((vLog: any) => (
                        <div key={vLog.critere} className="p-2.5 bg-white border border-stone-150 rounded text-[11px]">
                          <div className="flex justify-between items-center mb-0.5">
                            <span className="font-mono font-semibold text-stone-850">{vLog.critere}</span>
                            <span className={`text-[10px] font-mono px-1 rounded ${
                              vLog.status === "Pass" ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"
                            }`}>{vLog.status}</span>
                          </div>
                          <p className="text-stone-600 font-sans leading-relaxed mt-0.5">{vLog.message}</p>
                        </div>
                      ))}
                    </div>

                    <button
                      id="pipeline-nav-step5"
                      onClick={() => setActiveStep(5)}
                      className="px-3.5 py-1.5 font-mono text-xs bg-stone-900 hover:bg-stone-800 text-stone-100 rounded flex items-center gap-1"
                    >
                      Axe d'Exportation multi-formats (Étape 5) <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Clock className="w-10 h-10 text-stone-300 mx-auto animate-pulse mb-2" />
                    <p className="text-xs font-mono text-stone-500">Audit de conformité de l'Héritage Oral à l'aide de l'agent Auditeur.</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Exporteur */}
            {activeStep === 5 && (
              <div className="space-y-4">
                <h5 className="font-serif font-semibold text-stone-900 border-b border-stone-200 pb-1 w-full flex items-center gap-2">
                  <span className="text-amber-600 font-mono">5.</span> Exporteur & Indexation RAG / ETL
                </h5>

                <div className="space-y-3 font-sans text-xs">
                  <p className="text-stone-600 leading-relaxed">
                    Le corpus final s'exporte sous divers formalismes standardisés de bases de connaissances pour RAG, LangChain, Suno, LlamaIndex ou Open WebUI.
                  </p>

                  <div className="flex justify-between items-center gap-2 bg-stone-100 p-2 rounded-lg border border-stone-200">
                    <span className="text-[10px] font-mono text-stone-500">Format d'exportation :</span>
                    <div className="flex gap-1">
                      {["json", "yaml", "csv", "markdown"].map((f: any) => (
                        <button
                          key={f}
                          onClick={() => setExportFormat(f)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                            exportFormat === f ? "bg-stone-900 text-white font-bold" : "bg-white text-stone-600 hover:bg-stone-50 border border-stone-200"
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Export Textarea */}
                  <div className="relative">
                    <textarea
                      readOnly
                      rows={6}
                      value={getExportedString()}
                      className="w-full p-2.5 bg-stone-950 text-emerald-400 border border-stone-900 rounded font-mono text-[10px] leading-relaxed resize-none cursor-text select-all"
                    />

                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        onClick={handleCopyText}
                        className="p-1 rounded bg-stone-800 hover:bg-stone-750 text-stone-200 hover:text-white border border-stone-700 transition"
                        title="Copier le document exporté"
                      >
                        {copiedFormat ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Inject block */}
                  <div className="bg-amber-50/50 border border-amber-200/60 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900 block">Publication Vivante</span>
                      <p className="text-[11px] font-sans text-stone-700 leading-tight">Ajouter immédiatement cette comptine entièrement annotée à la Bibliothèque du projet.</p>
                    </div>

                    <button
                      id="inject-corpus-btn"
                      disabled={isSuccessfullySaved}
                      onClick={injectIntoLibrary}
                      className={`px-3 py-1.5 font-mono text-xs rounded transition flex items-center gap-1 font-bold shrink-0 shadow-sm ${
                        isSuccessfullySaved 
                          ? "bg-emerald-600 text-white cursor-default" 
                          : "bg-amber-600 hover:bg-amber-700 text-white"
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
              <div className="absolute inset-0 bg-white/85 rounded-lg flex flex-col justify-center items-center gap-3 z-10">
                <div className="w-12 h-12 rounded-full border-4 border-amber-100 border-t-amber-600 animate-spin"></div>
                <div className="font-mono text-xs text-stone-850 font-semibold tracking-wide animate-pulse">
                  Appel de l'Agent IA [gemini-3.5-flash] en cours...
                </div>
                <p className="text-[10px] font-mono text-stone-500">Mise à jour des ontologies sémantiques sécurisées.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
