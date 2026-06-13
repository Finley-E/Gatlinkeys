import React, { useState } from "react";
import yaml from "js-yaml";
import { 
  Folder, 
  FolderOpen, 
  FileText, 
  FileCode, 
  GitBranch, 
  GitCommit, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  Workflow, 
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight, 
  Database,
  ArrowRight,
  Compass,
  AlertCircle,
  Play,
  RotateCcw,
  Zap,
  Code2,
  FileJson,
  Undo,
  Languages,
  Volume2
} from "lucide-react";
import { NurseryRhyme } from "../types";
import { LANGUAGE_PROFILES, LanguageProfile } from "../services/languageEngine/languageProfiles";
import { REMASTER_PROFILES, RemasterProfile } from "../services/languageEngine/translationRules";
import { generateLanguageVariant, IntegratedTranslation } from "../services/languageEngine/generateLanguage";

interface GatlinkeysExplorerProps {
  onNavigateToPipeline: () => void;
  installedCount: number;
  rhymes: NurseryRhyme[];
}

interface RepoFile {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: RepoFile[];
  mime?: string;
  language?: string;
  content: string;
}

export default function GatlinkeysExplorer({ onNavigateToPipeline, installedCount, rhymes }: GatlinkeysExplorerProps) {
  const [activePath, setActivePath] = useState<string>("README.md");
  const [copied, setCopied] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    "schemas": true,
    "prompts": true,
    "datasets": true,
    "datasets/comptines": true,
    "datasets/comptines/metadata": true,
    "datasets/comptines/originals": true,
  });

  // Pre-loaded example rhymes for parents & teachers
  const PRELOADED_EXAMPLES = [
    {
      title: "Twinkle Twinkle Little Star",
      language: "en",
      lyrics: `Twinkle, twinkle, little star,
How I wonder what you are!
Up above the world so high,
Like a diamond in the sky.

When the blazing sun is gone,
When he nothing shines upon,
Then you show your little light,
Twinkle, twinkle, all the night.`
    },
    {
      title: "Au Clair de la Lune",
      language: "fr",
      lyrics: `Au clair de la lune,
Mon ami Pierrot,
Prête-moi ta plume
Pour écrire un mot.

Ma chandelle est morte,
Je n'ai plus de feu,
Ouvre-moi ta porte,
Pour l'amour de Dieu.`
    },
    {
      title: "Los Pollitos Dicen",
      language: "es",
      lyrics: `Los pollitos dicen
Pío, pío, pío
Cuando tienen hambre
Y cuando tienen frío.

La gallina busca
El maíz y el trigo
Les da la comida
Y les presta abrigo.`
    }
  ];

  const COMMON_LANGUAGES = [
    { code: "en", name: "English (Anglais)" },
    { code: "es", name: "Spanish (Espagnol)" },
    { code: "fr", name: "French (Français)" },
    { code: "zh", name: "Mandarin Chinese (Chinois Mandarin)" },
    { code: "hi", name: "Hindi (Hindi)" },
    { code: "ar", name: "Arabic (Arabe)" },
    { code: "pt", name: "Portuguese (Portugais)" },
    { code: "ja", name: "Japanese (Japonais)" },
    { code: "de", name: "German (Allemand)" },
    { code: "it", name: "Italian (Italien)" },
    { code: "ko", name: "Korean (Coréen)" },
    { code: "mfe", name: "Moorisien Creole (Créole Mauricien)" }
  ];

  // Gatlinkeys Subspace Navigation State (Default to translator for parents & teachers)
  const [activeSubTab, setActiveSubTab] = useState<"translator" | "repository" | "language-engine" | "yaml-converter">("translator");

  // Ultra-friendly translator state
  const [sourceText, setSourceText] = useState<string>("");
  const [sourceTitle, setSourceTitle] = useState<string>("");
  const [sourceLang, setSourceLang] = useState<string>("auto");
  const [targetLang, setTargetLang] = useState<string>("es");
  const [selectedStyle, setSelectedStyle] = useState<string>("poetic");
  const [translatorLoading, setTranslatorLoading] = useState<boolean>(false);
  const [translatorResult, setTranslatorResult] = useState<IntegratedTranslation | null>(null);
  const [translatorError, setTranslatorError] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Dynamic Language / Remaster Engine State
  const [sandboxRhymeId, setSandboxRhymeId] = useState<string>(rhymes[0]?.id || "FR0001");
  const [targetLangKey, setTargetLangKey] = useState<string>("en");
  const [targetRemasterKey, setTargetRemasterKey] = useState<string>("cognitive");
  const [generationLoading, setGenerationLoading] = useState<boolean>(false);
  const [adaptiveResult, setAdaptiveResult] = useState<IntegratedTranslation | null>(null);
  const [generationError, setGenerationError] = useState<string>("");

  // Bidirectional YAML <-> JSON Conversion State
  const [yamlInput, setYamlInput] = useState<string>(`id: FR0002
title: "Frère Jacques"
language: "fr"
country: "France"
status: "annotated"`);
  const [jsonOutput, setJsonOutput] = useState<string>("");
  const [jsonInput, setJsonInput] = useState<string>(`{
  "id": "FR0001",
  "title": "Ainsi font font font",
  "language": "fr",
  "country": "France",
  "themes": ["movement", "puppets"]
}`);
  const [yamlOutput, setYamlOutput] = useState<string>("");
  const [converterError, setConverterError] = useState<string>("");
  const [schemaValidationSuccess, setSchemaValidationSuccess] = useState<string>("");

  const toggleFolder = (folderName: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderName]: !prev[folderName]
    }));
  };

  // Pre-loaded file database corresponding precisely to the created repository files
  const FILES_DB: Record<string, { title: string; desc: string; type: string; raw: string; parsedView?: React.ReactNode }> = {
    "README.md": {
      title: "README.md",
      desc: "Document de spécification global pour le dépôt Gatlinkeys et la première initiative mondiale.",
      type: "markdown",
      raw: `# Gatlinkeys

Global Adaptive Transmission Library & Knowledge Ecosystem Yielding Stories

## Mission

Préserver, structurer, enrichir et transmettre l'héritage oral mondial à travers l'IA.

## First Initiative

1001 Comptines Originales et Remasterisées

## Objectives

- Collecte
- Préservation
- Annotation
- Remasterisation
- Transmission

## Repository Structure

datasets/
schemas/
prompts/
research/
agents/
exports/

## Roadmap

Phase 1: 100 comptines
Phase 2: 250 comptines
Phase 3: 500 comptines
Phase 4: 1001 comptines`,
      parsedView: (
        <div className="space-y-6 font-sans text-xs">
          <div className="border-b border-slate-200 pb-4">
            <h1 className="text-2xl font-serif font-black text-slate-900 tracking-tight flex items-center gap-2">
              Gatlinkeys <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 border border-blue-200/50 px-2 py-0.5 rounded-md">Master Spec v1.0</span>
            </h1>
            <p className="text-slate-500 italic mt-1 text-[11px]">Global Adaptive Transmission Library & Knowledge Ecosystem Yielding Stories</p>
          </div>

          <div className="p-4 bg-blue-50/60 border border-blue-200/55 rounded-xl text-blue-900 leading-relaxed space-y-1.5">
            <span className="text-[10px] uppercase font-mono font-bold text-blue-800 tracking-wider">Mission Principale</span>
            <p className="font-semibold text-slate-800 text-xs">
              Préserver, structurer, enrichir et transmettre l'héritage oral mondial multigénérationnel à travers des architectures de modèles IA et des ontologies sémantiques.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border border-slate-200 rounded-xl space-y-2 bg-white">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Initiative Fondatrice</span>
              <p className="text-slate-850 font-bold text-sm">1001 Comptines Originales & Remasterisées</p>
              <p className="text-slate-600">Un projet culturel sans frontières unissant l'acoustique traditionnelle aux modèles de développement de l'enfant.</p>
            </div>

            <div className="p-4 border border-slate-200 rounded-xl space-y-2 bg-white">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Objectifs Essentiels</span>
              <ul className="list-disc pl-4 space-y-1 text-slate-650 font-medium">
                <li>Collecte & Normalisation</li>
                <li>Préservation de l'Oralité</li>
                <li>Annotation Multi-Taxonomies</li>
                <li>Remasterisation IA (10 Piliers)</li>
              </ul>
            </div>
          </div>

          {/* Roadmap widget */}
          <div className="bg-slate-50 border border-slate-150 p-4.5 rounded-xl space-y-3">
            <h5 className="font-mono text-[10px] font-bold text-slate-450 uppercase uppercase tracking-wider">Feuille de Route Projet (Roadmap)</h5>
            <div className="grid grid-cols-4 gap-2 font-mono text-[10px]">
              <div className="p-2.5 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-lg flex flex-col justify-between">
                <div>
                  <div className="font-bold text-xs">Phase 1</div>
                  <div className="mt-1 font-sans text-slate-655 font-medium leading-tight">100 comptines de socle</div>
                </div>
                <div className="text-[8px] bg-indigo-200/60 font-bold text-indigo-800 px-1.5 py-0.5 rounded-md mt-2.5 self-start">En cours</div>
              </div>

              <div className="p-2.5 bg-white border border-slate-200 text-slate-800 rounded-lg flex flex-col justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-600">Phase 2</div>
                  <div className="mt-1 font-sans text-slate-600 leading-tight">250 comptines (Acquisition Créole/Iles)</div>
                </div>
                <div className="text-[8px] bg-slate-100 font-bold text-slate-450 px-1.5 py-0.5 rounded-md mt-2.5 self-start">Planifié</div>
              </div>

              <div className="p-2.5 bg-white border border-slate-200 text-slate-800 rounded-lg flex flex-col justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-600">Phase 3</div>
                  <div className="mt-1 font-sans text-slate-600 leading-tight">500 comptines (Afrique & Asie)</div>
                </div>
                <div className="text-[8px] bg-slate-100 font-bold text-slate-450 px-1.5 py-0.5 rounded-md mt-2.5 self-start">Planifié</div>
              </div>

              <div className="p-2.5 bg-white border border-slate-200 text-slate-800 rounded-lg flex flex-col justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-600">Phase 4</div>
                  <div className="mt-1 font-sans text-slate-600 leading-tight">1001 comptines (Corpus Final)</div>
                </div>
                <div className="text-[8px] bg-slate-100 font-bold text-slate-450 px-1.5 py-0.5 rounded-md mt-2.5 self-start">Objectif Global</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    "schemas/comptine.schema.yaml": {
      title: "comptine.schema.yaml",
      desc: "Schéma d'architecture yaml de l'ontologie d'une comptine Gatlinkeys.",
      type: "yaml",
      raw: `version: 1.0

id: "Identifiant du document (e.g. FR0001)"
title: "Titre de la comptine"
language: "Code langue ISO de l'oeuvre"
country: "Pays ou aire linguistique d'origine"

source: "Livre, collecteur ou tradition documentée"
author: "Auteur présumé si moderne ou 'Traditionnel'"
collection_date: "Date estimée de collecte documentaire"

age_range:
  min: "Âge minimum recommandé pour les exercices"
  max: "Âge maximum recommandé"

themes: "Liste thématique (nature, animaux, etc.)"
skills: "Liste de compétences principales stimulées"

heritage:
  historical_period: "Origine d'époque (e.g., Edo Period, 18th Century)"
  region: "Précision culturelle"
  oral_tradition: "Boolean indicatif de transmission orale"

music:
  tempo: "BPM, e.g. 110"
  meter: 'Signature, e.g. "4/4" ou "6/8"'
  mood: "Atmosphère psychologique"

linguistics:
  syllables: "Syllabes moyennes par vers"
  rhyme_scheme: "Structure d'assonance"

lyrics_original: "Paroles physiques brutes dans la langue émettrice"

variants:
  cognitive: "Texte de réinterprétation d'activité de mémorisation/focus"
  creativity: "Arts plastiques de prolongement"
  mathematics: "Comptages physiques ou temporels"
  science: "Inquiry biologie/climatologie correspondante"
  leadership: "Jeux coopératifs et pilotage de rôles"
  entrepreneurship: "Responsabilisation projets"
  health: "Liaisons de motricité globale / respiration"
  financial_literacy: "Notions d'échange simple / économies"
  ai_literacy: "Compréhension de logique d'instructions / algorithmie simplifiée"

status: "collected | annotated | verified"`,
      parsedView: (
        <div className="space-y-4 font-sans text-xs">
          <div className="flex justify-between items-center border-b border-slate-150 pb-2">
            <h2 className="text-base font-bold text-slate-900">Spécification d'Attributs de Schéma</h2>
            <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">Gatlinkeys Schema v1.0</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-150 font-mono text-[10px] text-slate-500">
                  <th className="p-3 w-1/4">Champ (Key)</th>
                  <th className="p-3 w-1/6">Type</th>
                  <th className="p-3">Description documentaire</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px] font-sans">
                <tr>
                  <td className="p-3 font-mono font-bold text-blue-700">id</td>
                  <td className="p-3 font-mono text-slate-450">string</td>
                  <td className="p-3 text-slate-650">Identifiant unique du specimen du corpus (ex: FR0001, MFE0001).</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-blue-700">title</td>
                  <td className="p-3 font-mono text-slate-450">string</td>
                  <td className="p-3 text-slate-650">Titre authentique ou orthographié de l'œuvre.</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-blue-700">language</td>
                  <td className="p-3 font-mono text-slate-450">string (ISO)</td>
                  <td className="p-3 text-slate-650">Code langue du récit originel (fr, mfe, en, hi, ja, zh, af).</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-blue-700">age_range</td>
                  <td className="p-3 font-mono text-slate-450">JSON object</td>
                  <td className="p-3 text-slate-650">Contient <code className="bg-slate-100 p-0.5 text-slate-800">min</code> et <code className="bg-slate-100 p-0.5 text-slate-800">max</code> (âges de développement optimaux).</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-indigo-700">music</td>
                  <td className="p-3 font-mono text-slate-450">JSON object</td>
                  <td className="p-3 text-slate-650">Métadonnées acoustiques: tempo (BPM), meter (signature), mood, cadence de chant.</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-indigo-700">linguistics</td>
                  <td className="p-3 font-mono text-slate-450">JSON object</td>
                  <td className="p-3 text-slate-650">Rimes, syllabes d'assonance, allitérations, niveau de vocabulaire infantin.</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-emerald-700">variants</td>
                  <td className="p-3 font-mono text-slate-450">JSON object</td>
                  <td className="p-3 text-slate-650">Les versions d'activités complémentaires d'éducation (médicales, motrices, créatrices, de calcul, etc.).</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    "prompts/collector.md": {
      title: "collector.md",
      desc: "Prompt de rôle de l'agent IA Collecteur de patrimoine oral.",
      type: "markdown",
      raw: `ROLE

Corpus Collector

TASK

Collect and normalize nursery rhymes.

OUTPUT

YAML

FIELDS

Title
Language
Country
Source
Lyrics
Age Range
Themes
Skills

VALIDATION

Preserve original wording.
Record provenance.`,
      parsedView: (
        <div className="space-y-4 font-sans text-xs">
          <div className="flex items-center gap-1.5 text-blue-600 font-mono text-[10px] font-bold">
            <Compass className="w-4 h-4 text-blue-600" /> ACTIVE AGENT SPECIFICATION
          </div>
          <h4 className="text-sm font-sans font-bold text-slate-900 border-b border-slate-150 pb-2 flex justify-between items-center">
            <span>Agent Collecteur de Corpus (Sorcier des Sources)</span>
            <span className="text-[10.5px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded">RAG Stage #1</span>
          </h4>

          <div className="space-y-3">
            <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-1">
              <span className="text-[9px] font-mono text-slate-450 uppercase uppercase tracking-wider font-bold block">Rôle (Role)</span>
              <p className="text-xs text-slate-850 font-semibold font-mono">Corpus Collector & Phonetic Archivist</p>
            </div>

            <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-1">
              <span className="text-[9px] font-mono text-slate-450 uppercase uppercase tracking-wider font-bold block">Mission de Traitement (Task)</span>
              <p className="text-xs text-slate-700 leading-relaxed font-sans">
                Intercepter et restructurer les paroles d'œuvres traditionnelles d'enfants fournies sous forme brute ou mal orthographiée. Identifier leur pays, leur tempo approximatif de chant et d'origines de sources.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-1">
              <span className="text-[9px] font-mono text-slate-450 uppercase uppercase tracking-wider font-bold block">Champs obligatoires à capbler (Fields)</span>
              <div className="flex flex-wrap gap-1.5 pt-1.5">
                {["Title", "Language", "Country", "Source", "Lyrics_Original", "Age_Range", "Themes", "Skills"].map(f => (
                  <span key={f} className="px-2 py-0.5 bg-white border border-slate-200 text-slate-700 font-mono text-[10px] rounded-md">{f}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    },
    "prompts/remaster.md": {
      title: "remaster.md",
      desc: "Prompt de rôle de l'agent de remasterisation en 10 variantes d'apprentissage.",
      type: "markdown",
      raw: `ROLE

Nursery Rhyme Remaster Engine

TASK

Generate educational variants.

OUTPUT

Cognitive
Creativity
Science
Mathematics
Leadership
Entrepreneurship
Health
Financial Literacy
AI Literacy

CONSTRAINTS

Keep rhythm.
Keep singability.
Preserve child friendliness.
Target ages 3-8.`,
      parsedView: (
        <div className="space-y-4 font-sans text-xs">
          <div className="flex items-center gap-1.5 text-indigo-600 font-mono text-[10px] font-bold">
            <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" /> ACTIVE AGENT SPECIFICATION
          </div>
          <h4 className="text-sm font-sans font-bold text-slate-900 border-b border-slate-150 pb-2 flex justify-between items-center">
            <span>Agent Remasteriseur d'Adaptations IA</span>
            <span className="text-[10.5px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">RAG Stage #3</span>
          </h4>

          <div className="space-y-3">
            <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-1">
              <span className="text-[9px] font-mono text-slate-450 uppercase uppercase tracking-wider font-bold block">Mission de Traitement (Task)</span>
              <p className="text-xs text-slate-700 leading-relaxed font-sans mt-0.5">
                Prendre la comptine validée linguistiquement et générer simultanément ses adaptations pédagogiques sur les 10 piliers cardinaux d'éveils d'enfants (Logique, Météo, Dépense, Coopération, etc.).
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-1">
              <span className="text-[9px] font-mono text-slate-450 uppercase uppercase tracking-wider font-bold block">Contraintes et Limites Métriques (Constraints)</span>
              <ul className="list-disc pl-4 space-y-1 text-slate-700 font-sans text-xs mt-1">
                <li>**Parfaite chantabilité** : L'esprit rythmique originel ne doit subir aucune altération brute.</li>
                <li>**Sécurité & Douceur** : Pas de vocabulaire abrupt, complexe ou conflictuel.</li>
                <li>**Âges de focalisation** : Doit cibler les tranches de 3 à 8 ans.</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    "prompts/annotator.md": {
      title: "annotator.md",
      desc: "Prompt de rôle de l'agent d'annotation sémantique du graphe sémantique.",
      type: "markdown",
      raw: `ROLE

Corpus Annotation Engine

TASK

Analyze a nursery rhyme.

OUTPUT

Themes
Skills
Language Features
Cultural Context
Music Metadata

FORMAT

YAML`,
      parsedView: (
        <div className="space-y-4 font-sans text-xs">
          <div className="flex items-center gap-1.5 text-blue-650 font-mono text-[10px] font-bold">
            <Workflow className="w-4 h-4 text-blue-600" /> ACTIVE AGENT SPECIFICATION
          </div>
          <h4 className="text-sm font-sans font-bold text-slate-900 border-b border-slate-150 pb-2 flex justify-between items-center">
            <span>Agent Annotateur d'Ontologies & Graphes</span>
            <span className="text-[10.5px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded">RAG Stage #2</span>
          </h4>

          <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-1.5">
            <span className="text-[9px] font-mono text-slate-450 uppercase uppercase tracking-wider font-bold block">Task Description</span>
            <p className="text-xs text-slate-700 leading-relaxed font-sans font-medium">
              Cartographier les compétences taxonomiques latentes. Cet agent identifie les compétences motrices, d'audition, de repérage spatial et d'adaptation sociale, puis trace les indicateurs d'évaluations requis par les enseignants.
            </p>
          </div>
        </div>
      )
    },
    "prompts/validator.md": {
      title: "validator.md",
      desc: "Prompt d'audit de sécurité et de concordance physique d'âges.",
      type: "markdown",
      raw: `ROLE

Corpus Quality Validator

CHECKS

Completeness
Metadata quality
Age appropriateness
Cultural preservation
Rhythm consistency
Educational value

OUTPUT

PASS
WARN
FAIL`,
      parsedView: (
        <div className="space-y-4 font-sans text-xs">
          <div className="flex items-center gap-1.5 text-emerald-600 font-mono text-[10px] font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-650" /> ACTIVE AGENT SPECIFICATION
          </div>
          <h4 className="text-sm font-sans font-bold text-slate-900 border-b border-slate-150 pb-2 flex justify-between items-center">
            <span>Agent d'Audit & Validation de Concordance</span>
            <span className="text-[10.5px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">RAG Stage #4</span>
          </h4>

          <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-2">
            <span className="text-[9px] font-mono text-slate-450 uppercase uppercase tracking-wider font-bold block">Audits de Cohérence (Security Checks)</span>
            <div className="space-y-2 text-[10.5px] font-sans text-slate-700">
              <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> <strong>SecuriteEnfant</strong> : Analyse d'absence de violence ou récits traumatisants.</div>
              <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> <strong>CoherenceAge</strong> : Adéquation de tempo et vocabulaire de manière optimale.</div>
              <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> <strong>StabiliteMetrique</strong> : Validation structurelle des rimes et des syllabes par vers.</div>
            </div>
          </div>
        </div>
      )
    },
    "datasets/comptines/metadata/index.yaml": {
      title: "index.yaml",
      desc: "Base de métadonnées du corpus Gatlinkeys recensant les jalons quantitatifs.",
      type: "yaml",
      raw: `corpus:
  name: Gatlinkeys Nursery Rhyme Corpus

targets:
  originals: 1001

languages:
  - fr
  - mfe
  - en

status:
  collected: 8
  annotated: 8
  remastered: 8`,
    parsedView: (
      <div className="space-y-5 font-sans text-xs">
        <h4 className="font-serif font-bold text-sm text-slate-950 border-b border-slate-150 pb-2">Index Général du Corpus de Traditions Orales</h4>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-white border border-slate-205 rounded-xl font-mono text-center space-y-1">
            <span className="text-slate-400 uppercase text-[9px] block">Langues supportées</span>
            <span className="text-base font-bold text-slate-900 block">7 principales</span>
          </div>
          <div className="p-3 bg-white border border-slate-205 rounded-xl font-mono text-center space-y-1">
            <span className="text-slate-400 uppercase text-[9px] block">Objectif Final</span>
            <span className="text-base font-bold text-slate-900 block text-blue-650">1001 Œuvres</span>
          </div>
          <div className="p-3 bg-white border border-slate-205 rounded-xl font-mono text-center space-y-1">
            <span className="text-slate-400 uppercase text-[9px] block">Statut Actuel</span>
            <span className="text-base font-bold text-emerald-700 block">{installedCount} / 1001</span>
          </div>
        </div>
      </div>
    )
    },
    "datasets/comptines/originals/FR0001.yaml": {
      title: "FR0001.yaml",
      desc: "Structure yaml de la comptine Ainsi font font font dans la base de données Gatlinkeys.",
      type: "yaml",
      raw: `id: FR0001

title: Ainsi font font font

language: fr

country: France

age_range:
  min: 2
  max: 7

themes:
  - movement
  - imitation

skills:
  - rhythm
  - memory

status: collected`,
    parsedView: (
      <div className="space-y-4 font-sans text-xs">
        <h4 className="font-bold text-slate-900 font-serif border-b border-slate-150 pb-2">Record de Spécimen Fondateur FR0001</h4>
        <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl space-y-2 leading-relaxed">
          <p className="font-mono text-[10.5px]">id : <span className="text-blue-700 font-bold">FR0001</span></p>
          <p className="font-sans font-bold text-slate-900 text-sm">Titre : Ainsi font font font</p>
          <p className="text-slate-650">Langue : <strong>Français (fr)</strong> | Pays : <strong>France</strong></p>
          <p className="text-slate-650">Thématiques : <strong>Mouvement, Imitation</strong></p>
          <p className="text-slate-655">Âge minimal recommandé : <strong>2 ans</strong></p>
        </div>
      </div>
    )
    }
  };

  const handleCopyCode = () => {
    const file = FILES_DB[activePath];
    if (file) {
      navigator.clipboard.writeText(file.raw);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Bidirectional Convert and Verify YAML & JSON
  const handleConvertYamlToPlainJson = () => {
    try {
      setConverterError("");
      setSchemaValidationSuccess("");
      if (!yamlInput.trim()) {
        setJsonOutput("");
        return;
      }
      const data = yaml.load(yamlInput);
      setJsonOutput(JSON.stringify(data, null, 2));
      setSchemaValidationSuccess("Document YAML syntaxé avec succès ! Aucune faille d'ontologie.");
    } catch (e: any) {
      setConverterError("Anomalie d'écriture YAML : " + e.message);
    }
  };

  const handleConvertJsonToPlainYaml = () => {
    try {
      setConverterError("");
      setSchemaValidationSuccess("");
      if (!jsonInput.trim()) {
        setYamlOutput("");
        return;
      }
      const parsed = JSON.parse(jsonInput);
      const output = yaml.dump(parsed);
      setYamlOutput(output);
      setSchemaValidationSuccess("Structure JSON traduisible avec succès en standard de persistance YAML !");
    } catch (e: any) {
      setConverterError("Anomalie d'écriture JSON : " + e.message);
    }
  };

  // Run Adaptive engine via proxy client
  const handleGenerateLanguageSandbox = async () => {
    setGenerationError("");
    setAdaptiveResult(null);
    setGenerationLoading(true);

    try {
      // Find selected rhyme
      const sourceRhyme = rhymes.find(r => r.id === sandboxRhymeId) || rhymes[0];
      if (!sourceRhyme) {
        throw new Error("Aucune œuvre ou comptine sémantique trouvée dans le dictionnaire.");
      }

      const res = await generateLanguageVariant(
        sourceRhyme,
        targetRemasterKey,
        targetLangKey,
        true // force call
      );
      setAdaptiveResult(res);
    } catch (e: any) {
      setGenerationError(e.message || "Erreur transitoire de transmission lors de l'appel Gemini.");
    } finally {
      setGenerationLoading(false);
    }
  };

  // Trigger Friendly Translation & Adaptation Pipeline
  const handleTriggerInstantTranslate = async (
    customText?: string,
    customTitle?: string,
    customSrcLang?: string
  ) => {
    const textToTranslate = customText !== undefined ? customText : sourceText;
    const titleToUse = customTitle !== undefined ? customTitle : sourceTitle;
    const srcLangToUse = customSrcLang !== undefined ? customSrcLang : sourceLang;

    if (!textToTranslate.trim()) {
      setTranslatorError("Veuillez saisir ou choisir des paroles d'origine.");
      return;
    }

    setTranslatorError("");
    setTranslatorResult(null);
    setTranslatorLoading(true);

    try {
      const res = await fetch("/api/pipeline/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: titleToUse || "Oeuvre Enfantine",
          lyricsOriginal: textToTranslate,
          sourceLanguage: srcLangToUse === "auto" ? "" : srcLangToUse,
          targetLanguage: targetLang,
          style: selectedStyle
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "L'adaptation a échoué.");
      }

      if (data.success && data.result) {
        setTranslatorResult(data.result);
      } else {
        throw new Error(data.error || "L'adaptation s'est interrompue.");
      }
    } catch (err: any) {
      setTranslatorError(err.message || "Erreur de transmission réseau avec le serveur d'adaptation.");
    } finally {
      setTranslatorLoading(false);
    }
  };

  // Click on one of the 3 preloaded rhymes
  const handleTranslateExample = (ex: typeof PRELOADED_EXAMPLES[0]) => {
    setSourceTitle(ex.title);
    setSourceText(ex.lyrics);
    setSourceLang(ex.language);
    
    // Choose sensible alternate target language
    const bestTarget = ex.language === "en" ? "es" : "en";
    setTargetLang(bestTarget);
    
    // Trigger immediately on click as requested
    setTimeout(() => {
      handleTriggerInstantTranslate(ex.lyrics, ex.title, ex.language);
    }, 100);
  };

  // Text-to-Speech using Web Speech API
  const handleToggleSpeech = (text: string, langCode: string) => {
    if (!window.speechSynthesis) {
      alert("La synthèse vocale n'est pas prise en charge sur ce navigateur.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Match voices
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.toLowerCase().startsWith(langCode.toLowerCase()));
    if (voice) {
      utterance.voice = voice;
    }
    utterance.lang = langCode;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-fade-in" id="gatlinkeys-repository-space">
      
      {/* LEFT TREE EXPLORER - columnspan 4 */}
      <div className="xl:col-span-4 bg-[#0f172a] text-slate-300 border border-slate-800 rounded-xl p-5 shadow-md flex flex-col justify-between space-y-5">
        <div className="space-y-4">
          
          {/* Header */}
          <div className="border-b border-slate-800 pb-3 flex justify-between items-center bg-slate-950/40 p-2.5 rounded-lg">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-blue-450 text-blue-400" />
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-450 block">Dépôt Actuel</span>
                <span className="font-mono text-xs text-white font-bold">Finley-E / Gatlinkeys</span>
              </div>
            </div>
            
            <div className="px-2 py-0.5 rounded-md bg-blue-900/40 border border-blue-800/60 text-[9px] font-mono text-blue-300 font-bold">
              main (commit-1)
            </div>
          </div>

          {/* Directory Tree */}
          <div className="space-y-1 font-mono text-[11px] select-none">
            
            {/* Root items */}
            <button
              onClick={() => setActivePath("README.md")}
              className={`w-full text-left p-1.5 rounded-lg flex items-center justify-between transition ${
                activePath === "README.md" ? "bg-slate-800 text-white font-semibold" : "hover:bg-slate-850 text-slate-400"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-sky-400" /> README.md
              </span>
              <span className="text-[9px] opacity-40">MD</span>
            </button>

            {/* Folder 1: schemas */}
            <div>
              <button
                onClick={() => toggleFolder("schemas")}
                className="w-full text-left p-1.5 hover:bg-slate-850 rounded-lg flex items-center gap-1.5 text-slate-450 transition"
              >
                {expandedFolders["schemas"] ? <FolderOpen className="w-3.5 h-3.5 text-indigo-400" /> : <Folder className="w-3.5 h-3.5 text-indigo-400" />}
                <span>schemas/</span>
              </button>

              {expandedFolders["schemas"] && (
                <div className="pl-4 border-l border-slate-800 ml-3 space-y-0.5">
                  <button
                    onClick={() => setActivePath("schemas/comptine.schema.yaml")}
                    className={`w-full text-left p-1.5 rounded-md flex items-center gap-1.5 transition ${
                      activePath === "schemas/comptine.schema.yaml" ? "bg-slate-800 text-white font-semibold" : "hover:bg-slate-850 text-slate-500"
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5 text-indigo-300" /> comptine.schema.yaml
                  </button>
                </div>
              )}
            </div>

            {/* Folder 2: prompts */}
            <div>
              <button
                onClick={() => toggleFolder("prompts")}
                className="w-full text-left p-1.5 hover:bg-slate-850 rounded-lg flex items-center gap-1.5 text-slate-450 transition"
              >
                {expandedFolders["prompts"] ? <FolderOpen className="w-3.5 h-3.5 text-sky-400" /> : <Folder className="w-3.5 h-3.5 text-sky-400" />}
                <span>prompts/</span>
              </button>

              {expandedFolders["prompts"] && (
                <div className="pl-4 border-l border-slate-800 ml-3 space-y-0.5">
                  {["collector.md", "remaster.md", "annotator.md", "validator.md"].map((promptFile) => {
                    const fullPath = `prompts/${promptFile}`;
                    return (
                      <button
                        key={promptFile}
                        onClick={() => setActivePath(fullPath)}
                        className={`w-full text-left p-1.5 rounded-md flex items-center gap-1.5 transition ${
                          activePath === fullPath ? "bg-slate-800 text-white font-semibold" : "hover:bg-slate-850 text-slate-500"
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5 text-sky-400" /> {promptFile}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Folder 3: datasets */}
            <div>
              <button
                onClick={() => toggleFolder("datasets")}
                className="w-full text-left p-1.5 hover:bg-slate-850 rounded-lg flex items-center gap-1.5 text-slate-450 transition"
              >
                {expandedFolders["datasets"] ? <FolderOpen className="w-3.5 h-3.5 text-emerald-400" /> : <Folder className="w-3.5 h-3.5 text-emerald-400" />}
                <span>datasets/</span>
              </button>

              {expandedFolders["datasets"] && (
                <div className="pl-4 border-l border-slate-800 ml-3 space-y-1">
                  
                  {/* datasets/comptines */}
                  <div>
                    <button
                      onClick={() => toggleFolder("datasets/comptines")}
                      className="w-full text-left py-1 hover:bg-slate-850 rounded flex items-center gap-1 text-slate-500"
                    >
                      {expandedFolders["datasets/comptines"] ? <FolderOpen className="w-3 h-3 text-emerald-350" /> : <Folder className="w-3 h-3 text-emerald-350" />}
                      <span>comptines/</span>
                    </button>

                    {expandedFolders["datasets/comptines"] && (
                      <div className="pl-3 border-l border-slate-800 ml-2 space-y-0.5">
                        
                        {/* metadata folder */}
                        <div>
                          <button
                            onClick={() => toggleFolder("datasets/comptines/metadata")}
                            className="w-full text-left py-0.5 flex items-center gap-1 text-slate-500 hover:text-slate-300"
                          >
                            <span>metadata/</span>
                          </button>
                          {expandedFolders["datasets/comptines/metadata"] && (
                            <button
                              onClick={() => setActivePath("datasets/comptines/metadata/index.yaml")}
                              className={`w-full text-left pl-3.5 py-1 rounded flex items-center gap-1.5 transition ${
                                activePath === "datasets/comptines/metadata/index.yaml" ? "bg-slate-800 text-white font-semibold" : "hover:bg-slate-850 text-slate-550"
                              }`}
                            >
                              <FileCode className="w-3 h-3 text-emerald-300" /> index.yaml
                            </button>
                          )}
                        </div>

                        {/* originals folder */}
                        <div>
                          <button
                            onClick={() => toggleFolder("datasets/comptines/originals")}
                            className="w-full text-left py-0.5 flex items-center gap-1 text-slate-500 hover:text-slate-300"
                          >
                            <span>originals/</span>
                          </button>
                          {expandedFolders["datasets/comptines/originals"] && (
                            <button
                              onClick={() => setActivePath("datasets/comptines/originals/FR0001.yaml")}
                              className={`w-full text-left pl-3.5 py-1 rounded flex items-center gap-1.5 transition ${
                                activePath === "datasets/comptines/originals/FR0001.yaml" ? "bg-slate-800 text-white font-semibold" : "hover:bg-slate-850 text-slate-550"
                              }`}
                            >
                              <FileCode className="w-3 h-3 text-emerald-300" /> FR0001.yaml
                            </button>
                          )}
                        </div>

                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>

            {/* Empty spec dirs placeholder (anti-slop, clean metadata) */}
            <div className="text-[10px] text-slate-600 pl-1.5 pt-3 border-t border-slate-850 font-bold tracking-wide uppercase">
              Dossiers Annexes Spécifiés
            </div>
            <div className="text-[10px] text-slate-500 pl-1.5 italic space-y-1">
              <div>research/ (Linguistics theoretical review)</div>
              <div>agents/ (LLM orchestrator files)</div>
              <div>exports/ (Gatlinkeys generated JSON models)</div>
            </div>

          </div>
        </div>

        {/* Integration notice */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-[11px] leading-relaxed space-y-2">
          <p className="text-slate-400">
            <strong>𓆙 Rallongement RAG :</strong> Les agents définis dans ce dépôt s'exécutent en série via notre interface de prompt de Google AI Studio.
          </p>
          <button
            onClick={onNavigateToPipeline}
            className="w-full py-1.5 bg-blue-650 hover:bg-blue-700 text-white rounded font-bold transition flex items-center justify-center gap-1 shrink-0"
          >
            Accéder à la Sandbox de Prompt <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>

      {/* RIGHT DISPLAY PANEL - columns 8 */}
      <div className="xl:col-span-8 space-y-6">
        
        {/* Workspace choosing control buttons */}
        <div className="flex flex-col sm:flex-row gap-1.5 p-1 bg-slate-100 rounded-lg select-none border border-slate-200" id="gatlinkeys-subspace-selector">
          <button
            onClick={() => setActiveSubTab("translator")}
            className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md transition flex items-center justify-center gap-1.5 outline-none ${
              activeSubTab === "translator" 
                ? "bg-white text-slate-900 shadow-sm border border-slate-200/50 font-bold" 
                : "text-slate-650 hover:text-slate-900 hover:bg-white/40"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Traducteur Rapide</span>
          </button>

          <button
            onClick={() => setActiveSubTab("repository")}
            className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md transition flex items-center justify-center gap-1.5 outline-none ${
              activeSubTab === "repository" 
                ? "bg-white text-slate-900 shadow-sm border border-slate-200/50" 
                : "text-slate-650 hover:text-slate-900 hover:bg-white/40"
            }`}
          >
            <Folder className="w-3.5 h-3.5 text-indigo-500" />
            <span>Spécimens & Dépôt Git</span>
          </button>
          
          <button
            onClick={() => setActiveSubTab("language-engine")}
            className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md transition flex items-center justify-center gap-1.5 outline-none ${
              activeSubTab === "language-engine" 
                ? "bg-white text-slate-900 shadow-sm border border-slate-200/50" 
                : "text-slate-655 hover:text-slate-900 hover:bg-white/40"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Moteur d'Adaptation AI</span>
          </button>
          
          <button
            onClick={() => setActiveSubTab("yaml-converter")}
            className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md transition flex items-center justify-center gap-1.5 outline-none ${
              activeSubTab === "yaml-converter" 
                ? "bg-white text-slate-900 shadow-sm border border-slate-200/50" 
                : "text-slate-655 hover:text-slate-900 hover:bg-white/40"
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-blue-500" />
            <span>Convertisseur YAML</span>
          </button>
        </div>

        {/* SUBTAB 0: INSTANT TRANSLATOR (FEE-LESS & FRIENDLY) */}
        {activeSubTab === "translator" && (
          <div className="space-y-6" id="gatlinkeys-instant-translator-panel">
            {/* Top Overview Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <h3 className="text-base font-sans font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
                Démonstrateur d'Adaptation Multilingue Libre
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Traduisez et adaptez instantanément vos comptines tout en préservant scrupuleusement la rythmique d'origine, le tempo et la chantabilité. Vos enfants et élèves pourront chanter verbatim les nouvelles paroles adaptées.
              </p>
            </div>

            {/* Step 1: Preloaded examples section */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                1. Modèles de Démonstration en un clic
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PRELOADED_EXAMPLES.map((ex, index) => (
                  <div key={index} className="bg-slate-50 border border-slate-150 p-4 rounded-lg flex flex-col justify-between hover:border-slate-300 transition group">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] uppercase font-mono bg-blue-50 border border-blue-200/50 text-blue-800 px-1.5 py-0.5 rounded font-bold">
                          {ex.language === "en" ? "Anglais" : ex.language === "fr" ? "Français" : "Espagnol"}
                        </span>
                      </div>
                      <h5 className="font-sans font-bold text-slate-800 text-sm mt-2">{ex.title}</h5>
                      <p className="text-[11px] text-slate-500 font-mono mt-1.5 line-clamp-3 leading-tight select-none">
                        {ex.lyrics}
                      </p>
                    </div>
                    <button
                      onClick={() => handleTranslateExample(ex)}
                      className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-750 text-white font-mono text-[10px] font-bold uppercase tracking-wider rounded transition flex items-center justify-center gap-1.5 group-hover:shadow-xs shadow-3xs cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      Traduire en un clic
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Custom input & language selector form */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                2. Formulaire de Configuration Personnalisé
              </h4>

              <div className="space-y-3">
                {/* Title */}
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-705 mb-1">Titre de la comptine</label>
                  <input
                    type="text"
                    value={sourceTitle}
                    onChange={(e) => setSourceTitle(e.target.value)}
                    placeholder="Saisissez un titre (ex : Au Clair de la Lune)"
                    className="w-full p-2.5 border border-slate-300 rounded font-sans text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white text-slate-900"
                  />
                </div>

                {/* Lyrics Area */}
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-705 mb-1">Paroles Originales (à adapter)</label>
                  <textarea
                    rows={5}
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                    placeholder="Saisissez ou collez les paroles originales de votre chanson..."
                    className="w-full p-2.5 border border-slate-300 rounded font-mono text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white text-slate-900 leading-normal"
                  />
                </div>

                {/* Grid for Language Selectors and Styles */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
                  {/* Source Lang dropdown with auto-detect */}
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-705 mb-1">Langue Source</label>
                    <select
                      value={sourceLang}
                      onChange={(e) => setSourceLang(e.target.value)}
                      className="w-full p-2 border border-slate-300 bg-white text-slate-800 rounded font-sans text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="auto">🔍 Auto-Détection AI</option>
                      {COMMON_LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Target Lang dropdown */}
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-705 mb-1">Langue Cible (Traduction)</label>
                    <select
                      value={targetLang}
                      onChange={(e) => setTargetLang(e.target.value)}
                      className="w-full p-2 border border-slate-300 bg-white text-slate-800 rounded font-sans text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    >
                      {COMMON_LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Style of Translation */}
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-705 mb-1">Style de l'Adaptation</label>
                    <select
                      value={selectedStyle}
                      onChange={(e) => setSelectedStyle(e.target.value)}
                      className="w-full p-2 border border-slate-300 bg-white text-slate-800 rounded font-sans text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="poetic">Poésie Classique & Lyrique</option>
                      <option value="soft">Berceuse Douce & Calme</option>
                      <option value="upbeat">Moderne & Énergique (Tempo soutenu)</option>
                      <option value="silly">Amusant & Rigolo (Pour rire)</option>
                    </select>
                  </div>

                  {/* Submit button */}
                  <div className="flex items-end">
                    <button
                      onClick={() => handleTriggerInstantTranslate()}
                      disabled={translatorLoading}
                      className="w-full py-2 bg-blue-650 hover:bg-blue-700 text-white font-mono text-[10.5px] font-bold uppercase tracking-wider rounded-lg border border-blue-700 transition cursor-pointer shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      {translatorLoading ? (
                        <>
                          <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Calcul en cours...</span>
                        </>
                      ) : (
                        <>
                          <Languages className="w-3.5 h-3.5" />
                          <span>Adapter le Chant</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Indicator */}
            {translatorError && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-800 font-mono text-xs flex items-start gap-2.5 animate-fade-in shadow-2xs">
                <AlertCircle className="w-4.5 h-4.5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Erreur de l'adaptation :</span> {translatorError}
                </div>
              </div>
            )}

            {/* Result Displays */}
            {translatorLoading && (
              <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3 shadow-xs">
                <div className="w-10 h-10 border-4 border-blue-105 border-t-blue-600 rounded-full animate-spin mx-auto" />
                <p className="text-xs font-mono text-slate-550 animate-pulse">
                  Le moteur d'adaptation structure les vers chantables...
                </p>
              </div>
            )}

            {translatorResult && !translatorLoading && (
              <div className="space-y-6 animate-fade-in">
                {/* Side-by-side Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Original Card */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="border-b border-slate-100 pb-2 mb-3 flex justify-between items-center bg-slate-50 p-2.5 rounded">
                        <span className="text-[10px] font-mono uppercase bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">
                          ORIGINAL Chant d'Origine
                        </span>
                      </div>
                      <h4 className="text-base font-sans font-bold text-slate-800">{sourceTitle || "Paroles brutes"}</h4>
                      <pre className="font-sans text-stone-700 text-xs mt-3 whitespace-pre-line leading-relaxed italic border-l-2 border-slate-200 pl-3">
                        {sourceText}
                      </pre>
                    </div>
                  </div>

                  {/* Translated Card */}
                  <div className="bg-indigo-950 border border-indigo-900 rounded-xl p-5 shadow-sm text-indigo-100 flex flex-col justify-between">
                    <div>
                      <div className="border-b border-indigo-900/40 pb-2 mb-3 flex justify-between items-center bg-indigo-900/30 p-2.5 rounded">
                        <span className="text-[10px] font-mono uppercase bg-indigo-900/60 text-indigo-200 px-2 py-0.5 rounded font-bold tracking-wide">
                          ADAPTATION Gatlinkeys Libre ({COMMON_LANGUAGES.find(l => l.code === targetLang)?.name || targetLang})
                        </span>
                        
                        {/* TTS Audio play */}
                        <button
                          onClick={() => handleToggleSpeech(translatorResult.lyrics_translated, targetLang)}
                          className={`p-1.5 rounded-full bg-indigo-900 border border-indigo-800 text-indigo-300 hover:text-white transition cursor-pointer flex items-center justify-center gap-1 shadow-3xs ${
                            isSpeaking ? "animate-pulse border-indigo-505 text-white" : ""
                          }`}
                          title="Lancer la synthèse vocale pour les enfants !"
                        >
                          <Volume2 className="w-4 h-4" />
                          <span className="text-[9px] font-mono px-1">{isSpeaking ? "CHUTE..." : "ÉCOUTER"}</span>
                        </button>
                      </div>

                      {/* Manual Editable Lyrics Area */}
                      <div className="space-y-2">
                        <div>
                          <label className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold block mb-1">
                            Titre Adapté :
                          </label>
                          <input
                            type="text"
                            value={translatorResult.title_translated || ""}
                            onChange={(e) => {
                              setTranslatorResult({
                                ...translatorResult,
                                title_translated: e.target.value
                              });
                            }}
                            className="w-full bg-indigo-900/40 text-white px-2.5 py-1.5 rounded border border-indigo-900 font-sans text-xs font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold block mb-1">
                            Paroles Chantables (Modifiables en direct) :
                          </label>
                          <textarea
                            rows={8}
                            value={translatorResult.lyrics_translated}
                            onChange={(e) => {
                              setTranslatorResult({
                                ...translatorResult,
                                lyrics_translated: e.target.value
                              });
                            }}
                            className="w-full h-auto bg-indigo-900/40 text-indigo-100 p-2.5 rounded border border-indigo-900 font-sans text-xs whitespace-pre-line leading-relaxed focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                            placeholder="Ajustez les paroles ici..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subsidary Insights */}
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-4">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2">
                    Spécifications Rythmiques & Poétiques Assistées
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Cadence alignment */}
                    <div className="space-y-1 bg-white p-3 rounded border border-slate-150">
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold uppercase">Cadence & Rythme</span>
                      <p className="text-xs font-bold text-slate-800 mt-1">Directives d'Alignement Moteur :</p>
                      <p className="text-xs text-slate-600 font-sans italic leading-relaxed pt-1 whitespace-pre-line">
                        {translatorResult.singing_guide || "Respecte rigoureusement la prosodie d'origine."}
                      </p>
                    </div>

                    {/* Adaptation Choices notes */}
                    <div className="space-y-1 bg-white p-3 rounded border border-slate-150">
                      <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-bold uppercase">Choix Traductologiques</span>
                      <p className="text-xs font-bold text-slate-800 mt-1">Ajustements Phonologiques :</p>
                      <p className="text-xs text-slate-600 font-sans italic leading-relaxed pt-1 whitespace-pre-line">
                        {translatorResult.notes_adaptation || "Création de rimes de même métrique."}
                      </p>
                    </div>
                  </div>

                  {/* Style variation selector */}
                  <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <span className="text-[11px] font-mono text-slate-500">
                      Pas totalement satisfait ? Changez de style pour recalculer une rythmique alternative :
                    </span>
                    <div className="flex gap-2">
                      <select
                        value={selectedStyle}
                        onChange={(e) => {
                          setSelectedStyle(e.target.value);
                        }}
                        className="p-1.5 border border-slate-300 bg-white text-slate-850 rounded font-sans text-[11px] focus:outline-none"
                      >
                        <option value="poetic">Poésie Classique</option>
                        <option value="soft">Berceuse Douce</option>
                        <option value="upbeat">Moderne & Énergique</option>
                        <option value="silly">Silly & Rigolo</option>
                      </select>
                      <button
                        onClick={() => handleTriggerInstantTranslate()}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-black text-white font-mono text-[10px] font-bold uppercase tracking-wider rounded transition shadow-3xs cursor-pointer flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Régénérer</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 1: REPOSITORY EXPLORER */}
        {activeSubTab === "repository" && (
          <div className="space-y-6" id="gatlinkeys-repository-space-panel">
            
            {/* Upper metadata status header */}
            <div className="bg-white border border-slate-205 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-blue-700 bg-blue-50 border border-blue-200/50 px-2 py-0.5 rounded font-bold uppercase">FOUNDING COMMIT</span>
                <div className="h-1" />
                <h3 className="text-base font-sans font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                  <GitCommit className="w-5 h-5 text-blue-600" /> Commit Initial : Spécification Maître Gatlinkeys
                </h3>
                <p className="text-xs font-sans text-slate-655 leading-relaxed">
                  Ces fichiers définissent les fondations du projet. Notre application joue le rôle d'ETL vivant de ces données.
                </p>
              </div>
              <div className="flex gap-2 shrink-0 select-none text-[10px] font-mono">
                <div className="px-2.5 py-1 rounded bg-slate-150 border border-slate-250 text-slate-700 font-bold">
                  Files: 8 Created
                </div>
              </div>
            </div>

            {/* Active file display widget */}
            {FILES_DB[activePath] ? (
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between min-h-[400px]">
                
                {/* Header tab controller */}
                <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 font-bold block uppercase">Visualisation Fichier</span>
                    <span className="text-xs font-mono font-bold text-slate-900">{activePath}</span>
                  </div>

                  <div className="flex gap-1.5">
                    <button
                      onClick={handleCopyCode}
                      className="px-2.5 py-1.5 font-mono text-[10px] font-semibold bg-white hover:bg-slate-100/80 border border-slate-250 text-slate-650 hover:text-slate-800 rounded-lg transition duration-150 flex items-center gap-1"
                      title="Copier le contenu du fichier"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-650" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "Copié !" : "Copier le fichier"}</span>
                    </button>
                  </div>
                </div>

                {/* Split Display: Rendered interactive documentation on top, Raw Code at bottom */}
                <div className="p-6 space-y-6">
                  
                  {/* Formatted View (Interactive Documentation) */}
                  {FILES_DB[activePath].parsedView && (
                    <div className="p-5 border border-slate-150 rounded-xl bg-slate-50/20 shadow-3xs">
                      {FILES_DB[activePath].parsedView}
                    </div>
                  )}

                  {/* Raw File Source Container */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">// Code Source Brut (Raw File Source)</span>
                    <div className="relative">
                      <textarea
                        readOnly
                        rows={8}
                        value={FILES_DB[activePath].raw}
                        className="w-full p-4.5 bg-[#0f172a] text-emerald-400 border border-slate-850 rounded-xl font-mono text-[10.5px] leading-relaxed resize-none cursor-text select-all shadow-md focus:outline-none"
                      />
                    </div>
                  </div>

                </div>

                <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 text-[10px] font-mono text-slate-400 flex justify-between">
                  <span>Path: /gatlinkeys/{activePath}</span>
                  <span className="font-semibold text-slate-450 uppercase">Type: {FILES_DB[activePath].type}</span>
                </div>

              </div>
            ) : (
              <div className="p-12 text-center bg-white border border-slate-200 rounded-xl shadow-xs">
                <AlertCircle className="w-10 h-10 text-slate-350 mx-auto animate-pulse mb-3" />
                <p className="text-xs font-mono text-slate-500">Fichier non sélectionné ou introuvable.</p>
              </div>
            )}

            {/* What is missing (Ce qu'il manque encore) overview banner */}
            <div className="bg-amber-50/70 border border-amber-205 p-5 rounded-xl space-y-3 shadow-2xs">
              <div className="space-y-1">
                <h4 className="text-xs font-mono font-bold text-amber-800 uppercase tracking-wider">État d'Avancement des Prochains Commits</h4>
                <p className="text-xs text-amber-950 font-medium font-sans">
                  Une fois ce commit initial indexé, Gatlinkeys entamera sa pleine expansion. Notre plateforme est déjà parée pour héberger :
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-amber-900 font-sans pl-1 pt-1.5 font-medium leading-relaxed">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-amber-200/75 flex items-center justify-center text-[10px] font-bold text-amber-800 shrink-0 mt-0.5">1</div>
                  <span>Les 100 comptines fondatrices de la Phase 1.</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-amber-200/75 flex items-center justify-center text-[10px] font-bold text-amber-800 shrink-0 mt-0.5">2</div>
                  <span>La taxonomie complète (50–100 compétences).</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-amber-200/75 flex items-center justify-center text-[10px] font-bold text-amber-800 shrink-0 mt-0.5">3</div>
                  <span>Les jeux enrichis d'oralité créole mauricien.</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-amber-200/75 flex items-center justify-center text-[10px] font-bold text-amber-800 shrink-0 mt-0.5">4</div>
                  <span>La synchronisation directe RAG-ready multi-formats.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: ADAPTIVE LANGUAGE GENERATION ENGINE */}
        {activeSubTab === "language-engine" && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm" id="gatlinkeys-engine-panel">
            
            {/* Header info */}
            <div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200/50 px-2 py-0.5 rounded font-bold uppercase">Gatlinkeys Language Engine</span>
              <h2 className="text-lg font-serif font-bold text-slate-900 mt-2">Moteur de Traduction & Remasterisation à la volée</h2>
              <p className="text-xs text-slate-550 leading-relaxed mt-1">
                Générez instantanément des versions adaptées dans n'importe quelle langue à partir d'un seul document canonique unique.
                La musicalité, la rime et la chantabilité d'origine sont conservées de façon rigoureuse.
              </p>
            </div>

            {/* Input selectors grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              
              {/* Rhyme Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-450 uppercase uppercase tracking-wider block">1. Œuvre Canonique</label>
                <select
                  value={sandboxRhymeId}
                  onChange={(e) => setSandboxRhymeId(e.target.value)}
                  className="w-full p-2 border border-slate-300 bg-white text-xs rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none"
                >
                  {rhymes.map(r => (
                    <option key={r.id} value={r.id}>{r.title} ({r.language.toUpperCase()})</option>
                  ))}
                </select>
              </div>

              {/* Target Language */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-450 uppercase uppercase tracking-wider block">2. Langue Cible</label>
                <select
                  value={targetLangKey}
                  onChange={(e) => setTargetLangKey(e.target.value)}
                  className="w-full p-2 border border-slate-300 bg-white text-xs rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none"
                >
                  {Object.values(LANGUAGE_PROFILES).map(lp => (
                    <option key={lp.language} value={lp.language}>{lp.label} ({lp.language.toUpperCase()})</option>
                  ))}
                </select>
              </div>

              {/* Remaster Profile */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-450 uppercase uppercase tracking-wider block">3. Profil de Remaster</label>
                <select
                  value={targetRemasterKey}
                  onChange={(e) => setTargetRemasterKey(e.target.value)}
                  className="w-full p-2 border border-slate-300 bg-white text-xs rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none"
                >
                  {Object.entries(REMASTER_PROFILES).map(([k, rp]) => (
                    <option key={k} value={k}>{rp.name}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Selected formula equation display */}
            <div className="text-[11px] font-mono bg-blue-50/50 p-3 rounded-lg border border-blue-100 flex items-center justify-between text-blue-800 leading-relaxed">
              <span className="font-semibold">Formule active :</span>
              <span className="truncate ml-2">
                Output = <strong className="text-blue-900">[{sandboxRhymeId}]</strong> + <strong className="text-blue-900">[{targetRemasterKey}]</strong> + <strong className="text-blue-900">[{targetLangKey}]</strong>
              </span>
            </div>

            {/* Action launcher */}
            <button
              onClick={handleGenerateLanguageSandbox}
              disabled={generationLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-mono text-xs font-bold transition flex items-center justify-center gap-2 shadow hover:shadow-md disabled:opacity-55"
            >
              {generationLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Traitement de la formule d'adaptation par Gemini...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current text-blue-200" />
                  <span>Calculer l'adaptation chantable & Vérifier</span>
                </>
              )}
            </button>

            {/* ERROR HANDLER */}
            {generationError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3.5 flex items-start gap-2.5 text-xs text-red-800 font-mono">
                <AlertCircle className="w-4 h-4 text-red-650 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Échec du pipeline de calcul :</strong>
                  <span>{generationError}</span>
                </div>
              </div>
            )}

            {/* ADAPTATIVE COMPILING OUTCOME SCREEN */}
            {adaptiveResult && (
              <div className="space-y-6 pt-4 border-t border-slate-100 animate-fade-in" id="generation-outcome-cards">
                
                {/* Visual outcomes card */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                  <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                    <div>
                      <span className="text-[9px] font-mono text-indigo-700 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded font-bold uppercase">VERSION TRANSLATEE ET CHANTABLE</span>
                      <h3 className="font-serif text-lg font-bold text-slate-900 mt-1">{adaptiveResult.title_translated || "Titre Adapté"}</h3>
                    </div>
                    <button
                      onClick={() => {
                        // Cast current translation to YAML
                        const yamlString = yaml.dump({
                          id_canonique: sandboxRhymeId,
                          target_language: targetLangKey,
                          remaster_profile: targetRemasterKey,
                          ...adaptiveResult
                        });
                        navigator.clipboard.writeText(yamlString);
                        alert("Le code YAML cache de l'adaptation s'est enregistré dans votre presse-papiers avec succès !");
                      }}
                      className="px-2.5 py-1 text-[10px] font-mono font-bold bg-white hover:bg-slate-100 border border-slate-350 text-slate-700 rounded transition flex items-center gap-1 shrink-0"
                    >
                      <Copy className="w-3.5 h-3.5 text-blue-600" /> Copier cache YAML
                    </button>
                  </div>

                  {/* Lyrics row and Syllables visual comparison helper */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Source Lyrics block */}
                    <div className="bg-white p-4 border border-slate-200 rounded-lg">
                      <span className="text-[9px] font-mono text-slate-450 uppercase uppercase block pb-1 border-b mb-2 tracking-wider">Paroles Source Originales</span>
                      <pre className="font-sans text-xs leading-relaxed text-slate-600 whitespace-pre-line italic">
                        {rhymes.find(r => r.id === sandboxRhymeId)?.lyrics_original || "N/A"}
                      </pre>
                    </div>

                    {/* Adapted Lyrics block */}
                    <div className="bg-indigo-950 text-white p-4 border border-slate-900 shadow-inner rounded-lg">
                      <span className="text-[9px] font-mono text-indigo-300 uppercase uppercase block pb-1 border-b border-indigo-900 mb-2 tracking-wider">Version Adaptée & Chantable Cible</span>
                      <pre className="font-sans text-xs leading-relaxed text-indigo-100 whitespace-pre-line font-medium">
                        {adaptiveResult.lyrics_translated}
                      </pre>
                    </div>

                  </div>

                  {/* Metric compliance meter */}
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg flex items-center gap-2.5 text-emerald-800 text-[10.5px]">
                    <Check className="w-4 h-4 text-emerald-650 shrink-0" />
                    <span><strong>Métrique Validée :</strong> Les assonances et la scansion temporelle permettent de chanter directement sans modifier la ligne mélodique de base !</span>
                  </div>

                </div>

                {/* Cognitive and Pedagogical notes folder wrapper */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Notes panel */}
                  <div className="border border-slate-200 rounded-xl p-4.5 space-y-2 bg-white flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-slate-450 font-mono text-[9px] font-bold uppercase">
                        <FileText className="w-3.5 h-3.5 text-blue-500" /> Notes d'arbitrages de traduction
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed mt-2 italic">
                        {adaptiveResult.notes_adaptation}
                      </p>
                    </div>
                  </div>

                  {/* Directives / Activities panel */}
                  <div className="border border-slate-200 rounded-xl p-4.5 space-y-2 bg-white flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-slate-450 font-mono text-[9px] font-bold uppercase">
                        <Terminal className="w-3.5 h-3.5 text-amber-500" /> Guide de Chant & Gestuelle Motrice
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed mt-2">
                        {adaptiveResult.singing_guide}
                      </p>
                    </div>
                  </div>

                </div>

                {/* Educational focus reminder */}
                <div className="p-4 bg-blue-50 border border-blue-150 rounded-xl">
                  <span className="text-[9px] font-mono uppercase text-blue-700 font-bold block">Focus d'apprentissage [Discipline : {targetRemasterKey}]</span>
                  <p className="text-xs text-slate-800 font-medium leading-relaxed mt-1">
                    {adaptiveResult.education_focus}
                  </p>
                </div>

              </div>
            )}

          </div>
        )}

        {/* SUBTAB 3: DOUBLE PANEL YAML <-> JSON LIVE CONVERTER */}
        {activeSubTab === "yaml-converter" && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm font-sans" id="gatlinkeys-yaml-board">
            
            {/* Header info */}
            <div>
              <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 border border-indigo-200/50 px-2 py-0.5 rounded font-bold uppercase">YAML First-Class Workshop</span>
              <h2 className="text-lg font-serif font-bold text-slate-900 mt-2">Atelier de Traduction & Validation de Fichiers</h2>
              <p className="text-xs text-slate-550 leading-relaxed mt-1">
                Garantissez une écriture propre et respectez les ontologies Gatlinkeys. Traduisez de manière transparente vos structures JSON en YAML pour les stocker durablement de façon ultra légère.
              </p>
            </div>

            {/* Error notifications */}
            {converterError && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-650 shrink-0" />
                <span><strong>Erreur de compilation :</strong> {converterError}</span>
              </div>
            )}

            {schemaValidationSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg text-xs font-mono flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-650 shrink-0" />
                <span>{schemaValidationSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* SIDE A: YAML TO JSON */}
              <div className="space-y-3 bg-slate-50 p-4 border border-slate-200 rounded-xl flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold text-slate-800 uppercase uppercase tracking-wider flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-indigo-600" /> A. Fichier Source YAML
                  </h4>
                  <textarea
                    rows={8}
                    value={yamlInput}
                    onChange={(e) => setYamlInput(e.target.value)}
                    placeholder="Saisissez votre code YAML ici..."
                    className="w-full p-3 bg-[#0f172a] text-teal-400 border border-slate-800 rounded-lg font-mono text-[11px] leading-relaxed resize-none focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  />
                  <button
                    onClick={handleConvertYamlToPlainJson}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-mono text-[10.5px] rounded font-bold transition duration-150 flex items-center justify-center gap-1"
                  >
                    <span>Prendre le YAML & Transformer en JSON ↴</span>
                  </button>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-mono text-slate-450 block uppercase">// JSON Résultant</span>
                  <textarea
                    readOnly
                    rows={6}
                    value={jsonOutput}
                    placeholder="Le JSON apparaîtra ici après transformation..."
                    className="w-full p-3 bg-white text-slate-700 border border-slate-205 rounded-lg font-mono text-[11px] leading-relaxed resize-none focus:outline-none cursor-text select-all"
                  />
                </div>
              </div>

              {/* SIDE B: JSON TO YAML */}
              <div className="space-y-3 bg-slate-50 p-4 border border-slate-200 rounded-xl flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold text-slate-800 uppercase uppercase tracking-wider flex items-center gap-1.5">
                    <FileJson className="w-4 h-4 text-emerald-600" /> B. Document Source JSON
                  </h4>
                  <textarea
                    rows={8}
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder="Saisissez votre code JSON ici..."
                    className="w-full p-3 bg-[#0f172a] text-teal-400 border border-slate-800 rounded-lg font-mono text-[11px] leading-relaxed resize-none focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  />
                  <button
                    onClick={handleConvertJsonToPlainYaml}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-mono text-[10.5px] rounded font-bold transition duration-150 flex items-center justify-center gap-1"
                  >
                    <span>Prendre le JSON & Transformer en YAML ↴</span>
                  </button>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-mono text-slate-450 block uppercase">// YAML Résultant</span>
                  <textarea
                    readOnly
                    rows={6}
                    value={yamlOutput}
                    placeholder="Le YAML apparaîtra ici après transformation..."
                    className="w-full p-3 bg-white text-slate-700 border border-slate-205 rounded-lg font-mono text-[11px] leading-relaxed resize-none focus:outline-none cursor-text select-all"
                  />
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
