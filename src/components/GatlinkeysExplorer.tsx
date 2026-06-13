import React, { useState } from "react";
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
  AlertCircle
} from "lucide-react";

interface GatlinkeysExplorerProps {
  onNavigateToPipeline: () => void;
  installedCount: number;
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

export default function GatlinkeysExplorer({ onNavigateToPipeline, installedCount }: GatlinkeysExplorerProps) {
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

    </div>
  );
}
