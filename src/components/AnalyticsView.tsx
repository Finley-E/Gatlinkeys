import React, { useState } from "react";
import { NurseryRhyme } from "../types";
import { 
  BarChart, 
  Layers, 
  MapPin, 
  TrendingUp, 
  HelpCircle, 
  Sparkles, 
  Info, 
  Workflow, 
  Music, 
  Languages, 
  Compass
} from "lucide-react";

interface AnalyticsViewProps {
  rhymes: NurseryRhyme[];
}

export default function AnalyticsView({ rhymes }: AnalyticsViewProps) {
  const [clusterDimension, setClusterDimension] = useState<"acoustic" | "cognitive" | "linguistic">("acoustic");
  const [showExplanation, setShowExplanation] = useState(false);

  // Compute breakdown metrics
  const total = rhymes.length;
  
  const langCounts = rhymes.reduce((acc: any, curr) => {
    acc[curr.language] = (acc[curr.language] || 0) + 1;
    return acc;
  }, {});

  const typeCounts = rhymes.reduce((acc: any, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {});

  // 1. Language distributions
  const langBreakdown = Object.entries(langCounts).map(([lang, count]: any) => {
    const label = lang === "fr" ? "Français" : 
                  lang === "en" ? "Anglais" : 
                  lang === "mfe" ? "Créole" : 
                  lang === "ja" ? "Japonais" : 
                  lang === "zh" ? "Chinois" :
                  lang === "hi" ? "Hindi" : "Autres";
    return { label, count, percentage: Math.round((count / total) * 100) };
  }).sort((a,b) => b.count - a.count);

  // 2. Type distributions
  const typeBreakdown = Object.entries(typeCounts).map(([type, count]: any) => {
    const label = type === "nursery_rhyme" ? "Comptine" : 
                  type === "lullaby" ? "Berceuse" : 
                  type === "counting_rhyme" ? "Chant calcul" : 
                  type === "clapping_game" ? "Jeu de mains" : "Jeu de geste";
    return { label, count, percentage: Math.round((count / total) * 100) };
  }).sort((a,b) => b.count - a.count);

  // 3. Simulated 2D Vector Embedded Coordinates based on selection
  const getEmbeddings = () => {
    if (clusterDimension === "acoustic") {
      // Clustered by tempo (X) and melody complexity (Y)
      return rhymes.map(r => {
        const x = ((r.music.tempo - 60) / 80) * 85 + 5; // Normalized x coords
        const y = r.music.melody_complexity === "Simple" ? 25 : r.music.melody_complexity === "Moderate" ? 50 : 75;
        return { id: r.id, title: r.title, x, y, type: r.type, lang: r.language };
      });
    } else if (clusterDimension === "cognitive") {
      // Clustered by min age requirement (X) and cognitive tag thickness (Y)
      return rhymes.map(r => {
        const x = ((r.age_range.min) / 5) * 85 + 5;
        const y = (r.cognitive_tags.length / 8) * 85 + 5;
        return { id: r.id, title: r.title, x, y, type: r.type, lang: r.language };
      });
    } else {
      // Clustered by syllable count (X) and historic era depth (Y)
      return rhymes.map(r => {
        const x = ((r.linguistics.syllable_count) / 12) * 85 + 5;
        const y = r.heritage.historical_period.includes("18") ? 30 : r.heritage.historical_period.includes("19") ? 55 : 75;
        return { id: r.id, title: r.title, x, y, type: r.type, lang: r.language };
      });
    }
  };

  const dots = getEmbeddings();

  return (
    <div className="space-y-6 animate-fade-in" id="analytics-space">
      {/* Intro visualizer info */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xs">
        <div className="space-y-1">
          <h3 className="text-base font-sans font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart className="w-5 h-5 text-blue-650" /> Métriques de Vectorisation & Espace Sémantique
          </h3>
          <p className="text-xs font-sans text-slate-650 leading-relaxed max-w-2xl">
            Cette section analyse la distribution intrinsèque du corpus de {total} comptines. Elle simule également la vectorisation d'ancrage (Embeddings) indispensable pour l'optimisation des réponses de nos RAGs et IA.
          </p>
        </div>
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-250 text-slate-700 rounded-lg text-xs font-sans font-medium transition flex items-center gap-1.5 shrink-0 shadow-sm"
        >
          <Info className="w-3.5 h-3.5 text-slate-500" /> {showExplanation ? "Masquer théorie" : "Explication théorique"}
        </button>
      </div>

      {showExplanation && (
        <div className="p-4.5 bg-blue-50/70 border border-blue-200/50 rounded-xl text-xs leading-relaxed text-blue-950 space-y-2 font-sans shadow-2xs">
          <p className="font-bold text-blue-900 text-sm">💡 Comment un RAG utilise-t-il ce corpus de comptines ?</p>
          <p>
            1. **Indexation Vectorielle** : Un modèle d'embeddings (comme `gemini-embedding-2-preview`) convertit chaque document autonome (paroles + musical + linguistique) en un vecteur à haute dimension.
          </p>
          <p>
            2. **Analyse Cosinus de Proximité** : Quand l'utilisateur demande une "chanson calme en créole pour un bébé", le RAG convertit la requête en vecteur et calcule les distances avec les comptines du corpus (ex: Dodo mimi RE0001 ressortira en tête grâce à l'alignement des tags de lullaby, tempo=65, créole).
          </p>
        </div>
      )}

      {/* Main Stats breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Metric bars column */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Language Breakdown Card */}
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-3.5">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-450 flex items-center gap-1">
              <Languages className="w-4 h-4 text-blue-650" /> Dispersion par Langue d'Origine
            </h4>

            <div className="space-y-3.5 pt-1">
              {langBreakdown.map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-800 font-medium">{item.label}</span>
                    <span className="text-slate-500 font-semibold">{item.count} ({item.percentage}%)</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/40">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Type Breakdown Card */}
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-3.5">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-450 flex items-center gap-1">
              <Layers className="w-4 h-4 text-indigo-600" /> Typologie Folklorique Traditionnelle
            </h4>

            <div className="space-y-3.5 pt-1">
              {typeBreakdown.map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-800 font-medium">{item.label}</span>
                    <span className="text-slate-500 font-semibold">{item.count} ({item.percentage}%)</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/40">
                    <div 
                      className="bg-slate-800 h-full rounded-full transition-all duration-300"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2D Vector space sandbox visualizer */}
        <div className="lg:col-span-7 bg-white border border-slate-200 p-5 rounded-xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-150 pb-3 mb-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-450 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-blue-600 animate-spin-slow" /> Représentation d'Embeddings 2D Simulée
              </h4>

              {/* Selector */}
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 gap-0.5 self-start">
                <button
                  onClick={() => setClusterDimension("acoustic")}
                  className={`px-2 py-1 text-[9px] font-mono rounded-md transition duration-155 ${
                    clusterDimension === "acoustic" ? "bg-[#0f172a] text-white font-bold" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Acoustique
                </button>
                <button
                  onClick={() => setClusterDimension("cognitive")}
                  className={`px-2 py-1 text-[9px] font-mono rounded-md transition duration-155 ${
                    clusterDimension === "cognitive" ? "bg-[#0f172a] text-white font-bold" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Cognitif
                </button>
                <button
                  onClick={() => setClusterDimension("linguistic")}
                  className={`px-2 py-1 text-[9px] font-mono rounded-md transition duration-155 ${
                    clusterDimension === "linguistic" ? "bg-[#0f172a] text-white font-bold" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Linguistique
                </button>
              </div>
            </div>

            {/* Simulated 2D Cartography Plotter using absolute coordinates */}
            <div className="relative w-full h-64 bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center shadow-inner">
              
              {/* grid lines */}
              <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 pointer-events-none opacity-[0.03]">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="border-t border-white border-l" />
                ))}
              </div>

              {/* Tilted vector axis pointers */}
              <div className="absolute bottom-2.5 left-2.5 text-[9px] font-mono text-slate-400 opacity-80 font-medium">
                Axe-X: {clusterDimension === "acoustic" ? "Tempo de Récit (BPM)" : clusterDimension === "cognitive" ? "Âge Seuil minimal" : "Longueur syllabique"}
              </div>
              <div className="absolute top-2.5 left-2.5 text-[9px] font-mono text-slate-400 opacity-80 font-medium origin-bottom-left rotate-90 transform translate-x-5">
                Axe-Y: {clusterDimension === "acoustic" ? "Complexité" : clusterDimension === "cognitive" ? "Épaisseur taxonomique" : "Profondeur historique"}
              </div>

              {/* Render dynamic coordinate dots */}
              {dots.map((dot, idx) => {
                let dotColor = "bg-blue-500 hover:ring-blue-400";
                if (dot.type === "lullaby") dotColor = "bg-sky-400 hover:ring-sky-300";
                if (dot.type === "clapping_game") dotColor = "bg-indigo-500 hover:ring-indigo-400";
                if (dot.type === "game_song") dotColor = "bg-emerald-500 hover:ring-emerald-400";

                return (
                  <div
                    key={dot.id}
                    className="absolute group z-10 cursor-alias"
                    style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
                  >
                    {/* Dot circle */}
                    <div className={`w-3.5 h-3.5 rounded-full ${dotColor} border-2 border-[#030712] hover:scale-130 transition-all duration-150 hover:ring-4`} />
                    
                    {/* Tooltip on Hover */}
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none whitespace-nowrap bg-slate-900 border border-slate-850 px-2.5 py-1.5 rounded-lg text-[10px] font-mono text-slate-100 z-20 shadow-md">
                      <span className="font-bold text-white">{dot.title}</span> ({dot.id})
                      <div className="text-[8px] text-slate-400 capitalize mt-0.5 font-medium">Type: {dot.type?.replace("_", " ")}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1 font-medium">
              <span className="w-2 h-2 rounded-full bg-sky-400" /> Berceuses
              <span className="w-2 h-2 rounded-full bg-indigo-500 ml-2" /> Jeux de mains
              <span className="w-2 h-2 rounded-full bg-blue-500 ml-2" /> Comptines standard
            </span>
            <span className="font-semibold text-slate-450 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-150">Clustering: KNN-Simulé</span>
          </div>
        </div>
      </div>
    </div>
  );
}
