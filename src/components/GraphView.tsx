import React, { useState } from "react";
import { NurseryRhyme, KnowledgeGraphLink } from "../types";
import { 
  GitCommit, 
  HelpCircle, 
  Activity, 
  UserCheck, 
  Layers, 
  Compass, 
  TrendingUp, 
  Info, 
  Workflow
} from "lucide-react";

interface GraphViewProps {
  rhyme: NurseryRhyme;
}

export default function GraphView({ rhyme }: GraphViewProps) {
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(
    rhyme.knowledge_graph && rhyme.knowledge_graph.length > 0 ? rhyme.knowledge_graph[0].id : null
  );

  // Sync selected link if rhyme changes
  React.useEffect(() => {
    if (rhyme.knowledge_graph && rhyme.knowledge_graph.length > 0) {
      setSelectedLinkId(rhyme.knowledge_graph[0].id);
    } else {
      setSelectedLinkId(null);
    }
  }, [rhyme]);

  const activeLink = rhyme.knowledge_graph?.find(link => link.id === selectedLinkId) || rhyme.knowledge_graph?.[0];

  return (
    <div className="space-y-6" id="graph-view-container">
      {/* Intro explain banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center shadow-xs">
        <div className="space-y-1">
          <h3 className="text-base font-sans font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Workflow className="w-5 h-5 text-blue-650" /> Graphe de Relations Sémantiques (Knowledge Graph)
          </h3>
          <p className="text-xs font-sans text-slate-600 leading-relaxed max-w-2xl">
            Ce graphe structurel modélise l'ontologie d'apprentissage de l'héritage oral. Les agents IA et pipelines RAG l'utilisent pour poser des questions ciblées, guider les assistants éducatifs, et évaluer les compétences.
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200/55 text-[10px] font-mono font-bold text-blue-700 shrink-0">
          Ontologie v1.2 : RAG-Ready
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Cascade visual tree container */}
        <div className="xl:col-span-8 bg-white border border-slate-200 p-6 rounded-xl shadow-xs space-y-6">
          <div className="flex justify-between items-center border-b border-slate-150 pb-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Visualisation Orientée Flux
            </h4>
            
            {/* Quick selectors for alternate pathways */}
            {rhyme.knowledge_graph && rhyme.knowledge_graph.length > 1 && (
              <div className="flex gap-1.5">
                {rhyme.knowledge_graph.map((link, idx) => (
                  <button
                    key={link.id}
                    onClick={() => setSelectedLinkId(link.id)}
                    className={`px-3 py-1 text-[10px] font-mono font-semibold rounded-lg transition duration-150 border ${
                      selectedLinkId === link.id
                        ? "bg-[#1e293b] text-white border-[#1e293b] shadow-sm"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-250"
                    }`}
                  >
                    Axe Pédagogique #{idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          {activeLink ? (
            <div className="flex flex-col gap-5 relative">
              {/* Node 1: Root Rhyme */}
              <div className="flex flex-col items-center">
                <div className="relative group flex flex-col items-center">
                  <div className="px-6 py-3.5 bg-[#0f172a] border border-slate-850 text-slate-55 rounded-xl shadow-md max-w-xs transition transform hover:scale-102">
                    <span className="text-[9px] font-mono tracking-widest text-sky-400 block uppercase mb-1 font-bold">
                      Comptine de Départ
                    </span>
                    <p className="font-serif text-base font-bold text-white">{rhyme.title}</p>
                    <span className="text-[10px] font-mono text-slate-400 mt-1 block font-medium">
                      Code: {rhyme.id} ({rhyme.language.toUpperCase()})
                    </span>
                  </div>
                </div>
              </div>

              {/* Connector line */}
              <div className="h-6 w-0.5 bg-slate-350 mx-auto relative animate-pulse">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
              </div>

              {/* Node 2: Competence / Skill */}
              <div className="flex flex-col items-center">
                <div className="px-6 py-3 bg-indigo-50 border border-indigo-200 text-indigo-950 text-center rounded-xl shadow-xs max-w-xs transition transform hover:scale-102">
                  <span className="text-[9px] font-mono tracking-widest text-[#4f46e5] block uppercase mb-1 font-bold">
                    1. Compétence Clé (Skill)
                  </span>
                  <p className="font-sans font-semibold text-sm leading-snug">{activeLink.skill}</p>
                </div>
              </div>

              {/* Connector line */}
              <div className="h-6 w-0.5 bg-slate-350 mx-auto relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
              </div>

              {/* Node 3: Scientific/Pedagogical Concept */}
              <div className="flex flex-col items-center">
                <div className="px-6 py-3 bg-slate-50 border border-slate-250 text-slate-800 font-sans text-xs text-center rounded-xl shadow-xs max-w-sm transition transform hover:scale-102">
                  <span className="text-[9px] font-mono tracking-widest text-slate-500 block uppercase mb-1 font-semibold">
                    2. Concept Cognitif (Concept)
                  </span>
                  <p className="font-mono text-slate-800 leading-relaxed text-xs">{activeLink.concept}</p>
                </div>
              </div>

              {/* Connector line */}
              <div className="h-6 w-0.5 bg-indigo-250 mx-auto relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-indigo-550 rounded-full"></div>
              </div>

              {/* Node 4: Proposed Activity */}
              <div className="flex flex-col items-center">
                <div className="px-6 py-3.5 bg-emerald-50 border border-emerald-200/70 text-emerald-950 font-sans text-xs text-center rounded-xl shadow-xs max-w-md transition transform hover:scale-101">
                  <span className="text-[9px] font-mono tracking-widest text-emerald-800 block uppercase mb-1 font-bold">
                    3. Activité Concrète (Activity)
                  </span>
                  <p className="text-emerald-900 italic font-medium leading-relaxed">"{activeLink.activity}"</p>
                </div>
              </div>

              {/* Connector line */}
              <div className="h-6 w-0.5 bg-emerald-250/80 mx-auto relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
              </div>

              {/* Node 5: Success Evaluation criteria */}
              <div className="flex flex-col items-center">
                <div className="px-6 py-3 bg-blue-50 border border-blue-200-70 text-blue-950 font-sans text-xs text-center rounded-xl shadow-xs max-w-sm transition transform hover:scale-102">
                  <span className="text-[9px] font-mono tracking-widest text-blue-800 block uppercase mb-1 font-bold">
                    4. Critère d'Évaluation (Evaluation)
                  </span>
                  <p className="text-blue-900 font-medium leading-relaxed">{activeLink.evaluation}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-450 font-mono text-xs">
              Aucun lien sémantique généré pour cette comptine. Utilisez le pipeline IA pour l'annoter.
            </div>
          )}
        </div>

        {/* Cognitive Context & AI Application Deck */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-5 shadow-2xs">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-450 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-600" /> Guide pour les Agents IA
            </h4>
            
            <div className="space-y-4">
              <div className="p-4 bg-white border border-slate-150 rounded-xl space-y-2 shadow-3xs">
                <span className="text-[10px] font-mono uppercase bg-indigo-50 border border-indigo-150/40 text-indigo-700 px-2 py-0.5 rounded-md font-bold">Pour LLM & RAG</span>
                <p className="text-xs font-sans text-slate-650 leading-relaxed">
                  L'ancrage sémantique permet au RAG d'injecter des contextes de jeu extrêmement précis dans le prompt system de l'assistant parent-enfant pour des séances de logopédie personnalisées.
                </p>
              </div>

              <div className="p-4 bg-white border border-slate-150 rounded-xl space-y-2 shadow-3xs">
                <span className="text-[10px] font-mono uppercase bg-blue-50 border border-blue-150/40 text-blue-700 px-2 py-0.5 rounded-md font-bold">Pour Pipelines ETL</span>
                <p className="text-xs font-sans text-slate-650 leading-relaxed">
                  Ce graphe permet de cartographier la progression de l'enfant dans un tableau de bord analytique en stockant les logs d'activités selon les identifiants d'axes (<code className="font-bold text-slate-900">{activeLink?.id || "N/A"}</code>).
                </p>
              </div>

              <div className="p-4 bg-white border border-slate-150 rounded-xl space-y-2 shadow-3xs">
                <span className="text-[10px] font-mono uppercase bg-emerald-50 border border-emerald-150/40 text-emerald-700 px-2 py-0.5 rounded-md font-bold">Génération d'Activités</span>
                <p className="text-xs font-sans text-slate-650 leading-relaxed">
                  L'agent IA peut générer des plans d'entraînement hebdomadaires en sélectionnant des activités selon des compétences cognitives précises à renforcer chez l'enfant.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50/70 border border-blue-100 p-4.5 rounded-xl">
            <h5 className="text-xs font-mono font-bold text-blue-800 mb-1">Taxonomie Cognitive v1</h5>
            <p className="text-[11px] font-mono text-blue-700 leading-relaxed">
              La comptine intègre les tags d'évaluation suivants : {rhyme.cognitive_tags.join(", ")}. Ces tags aident l'ETL à filtrer les corpus d'entraînements de modèles spécialisés.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
