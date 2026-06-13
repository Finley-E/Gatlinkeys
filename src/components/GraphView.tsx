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
      <div className="bg-stone-50 border border-stone-200 rounded-lg p-5 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="space-y-1">
          <h3 className="text-lg font-serif font-semibold text-stone-900 tracking-tight flex items-center gap-2">
            <Workflow className="w-5 h-5 text-amber-600" /> Graphe de Relations Sémantiques (Knowledge Graph)
          </h3>
          <p className="text-xs font-sans text-stone-600 leading-relaxed max-w-2xl">
            Ce graphe structurel modélise l'ontologie d'apprentissage de l'héritage oral. Les agents IA et pipelines RAG l'utilisent pour poser des questions ciblées, guider les assistants éducatifs, et évaluer les compétences.
          </p>
        </div>
        <div className="px-3 py-1.5 rounded bg-amber-50 border border-amber-200 text-[10px] font-mono text-amber-900 shrink-0">
          Ontologie v1.2 : RAG-Ready
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Cascade visual tree container */}
        <div className="xl:col-span-8 bg-white border border-stone-200 p-6 rounded-lg shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-stone-100 pb-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-400">
              Visualisation Orientée Flux
            </h4>
            
            {/* Quick selectors for alternate pathways */}
            {rhyme.knowledge_graph && rhyme.knowledge_graph.length > 1 && (
              <div className="flex gap-1.5">
                {rhyme.knowledge_graph.map((link, idx) => (
                  <button
                    key={link.id}
                    onClick={() => setSelectedLinkId(link.id)}
                    className={`px-2.5 py-1 text-[10px] font-mono font-medium rounded transition border ${
                      selectedLinkId === link.id
                        ? "bg-stone-900 text-white border-stone-900"
                        : "bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200"
                    }`}
                  >
                    Axe Pédagogique #{idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          {activeLink ? (
            <div className="flex flex-col gap-6 relative">
              {/* Node 1: Root Rhyme */}
              <div className="flex flex-col items-center">
                <div className="relative group flex flex-col items-center">
                  <div className="px-6 py-3 bg-stone-900 border border-stone-950 text-stone-100 font-serif text-center rounded-lg shadow-md max-w-xs transition transform hover:scale-102">
                    <span className="text-[9px] font-mono tracking-widest text-amber-400 block uppercase mb-1">
                      Comptine de Départ
                    </span>
                    <p className="font-bold">{rhyme.title}</p>
                    <span className="text-[10px] font-mono text-stone-400 mt-1 block">
                      Code: {rhyme.id} ({rhyme.language})
                    </span>
                  </div>
                </div>
              </div>

              {/* Connector line */}
              <div className="h-6 w-0.5 bg-stone-300 mx-auto relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-stone-500 rounded-full"></div>
              </div>

              {/* Node 2: Competence / Skill */}
              <div className="flex flex-col items-center">
                <div className="px-6 py-2.5 bg-amber-50 border border-amber-200 text-amber-950 font-serif text-center rounded-lg shadow-sm max-w-xs transition transform hover:scale-102">
                  <span className="text-[9px] font-mono tracking-widest text-[#945e2c] block uppercase mb-0.5">
                    1. Compétence Clé (Skill)
                  </span>
                  <p className="font-bold">{activeLink.skill}</p>
                </div>
              </div>

              {/* Connector line */}
              <div className="h-6 w-0.5 bg-stone-300 mx-auto relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-stone-500 rounded-full"></div>
              </div>

              {/* Node 3: Scientific/Pedagogical Concept */}
              <div className="flex flex-col items-center">
                <div className="px-6 py-2.5 bg-stone-100 border border-stone-300 text-stone-900 font-mono text-xs text-center rounded-lg shadow-sm max-w-sm transition transform hover:scale-102">
                  <span className="text-[9px] font-mono tracking-widest text-stone-500 block uppercase mb-0.5">
                    2. Concept Cognitif (Concept)
                  </span>
                  <p className="font-bold text-stone-850 leading-relaxed">{activeLink.concept}</p>
                </div>
              </div>

              {/* Connector line */}
              <div className="h-6 w-0.5 bg-amber-300/80 mx-auto relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
              </div>

              {/* Node 4: Proposed Activity */}
              <div className="flex flex-col items-center">
                <div className="px-6 py-3 bg-emerald-50 border border-emerald-200 text-emerald-950 font-sans text-xs text-center rounded-lg shadow-sm max-w-md transition transform hover:scale-101">
                  <span className="text-[9px] font-mono tracking-widest text-emerald-700 block uppercase mb-0.5 font-bold">
                    3. Activité Concrète (Activity)
                  </span>
                  <p className="text-stone-800 italic">"{activeLink.activity}"</p>
                </div>
              </div>

              {/* Connector line */}
              <div className="h-6 w-0.5 bg-emerald-300 mx-auto relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
              </div>

              {/* Node 5: Success Evaluation criteria */}
              <div className="flex flex-col items-center">
                <div className="px-6 py-2.5 bg-blue-50 border border-blue-200 text-blue-950 font-sans text-xs text-center rounded-lg shadow-sm max-w-sm transition transform hover:scale-102">
                  <span className="text-[9px] font-mono tracking-widest text-blue-700 block uppercase mb-0.5 font-bold">
                    4. Critère d'Évaluation (Evaluation)
                  </span>
                  <p className="text-stone-700 font-medium">{activeLink.evaluation}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-stone-400 font-mono text-xs">
              Aucun lien sémantique généré pour cette comptine. Utilisez le pipeline IA pour l'annoter.
            </div>
          )}
        </div>

        {/* Cognitive Context & AI Application Deck */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-stone-50 border border-stone-200 p-5 rounded-lg space-y-5">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-600" /> Guide pour les Agents IA
            </h4>
            
            <div className="space-y-4">
              <div className="p-3 bg-white border border-stone-150 rounded space-y-1">
                <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-medium">Pour LLM & RAG</span>
                <p className="text-xs font-sans text-stone-700 leading-relaxed">
                  L'ancrage sémantique permet au RAG d'injecter des contextes de jeu extrêmement précis dans le prompt system de l'assistant parent-enfant pour des séances de logopédie personnalisées.
                </p>
              </div>

              <div className="p-3 bg-white border border-stone-150 rounded space-y-1">
                <span className="text-[10px] font-mono uppercase bg-blue-100 text-blue-900 px-1.5 py-0.5 rounded font-medium">Pour Pipelines ETL</span>
                <p className="text-xs font-sans text-stone-700 leading-relaxed">
                  Ce graphe permet de cartographier la progression de l'enfant dans un tableau de bord analytique en stockant les logs d'activités selon les identifiants d'axes (<code className="font-bold text-stone-900">{activeLink?.id}</code>).
                </p>
              </div>

              <div className="p-3 bg-white border border-stone-150 rounded space-y-1">
                <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded font-medium">Génération d'Activités</span>
                <p className="text-xs font-sans text-stone-700 leading-relaxed">
                  L'agent IA peut générer des plans d'entraînement hebdomadaires en sélectionnant des activités selon des compétences cognitives précises à renforcer chez l'enfant.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-lg">
            <h5 className="text-xs font-mono font-bold text-amber-900 mb-1">Taxonomie Cognitive v1</h5>
            <p className="text-[11px] font-mono text-amber-800 leading-relaxed">
              La comptine intègre les tags d'évaluation suivants : {rhyme.cognitive_tags.join(", ")}. Ces tags aident l'ETL à filtrer les corpus d'entraînements de modèles spécialisés.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
