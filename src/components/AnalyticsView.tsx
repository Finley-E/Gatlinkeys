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
        const x = ((r.music.tempo - 60) / 80) * 80 + 10; // Normalized x coords
        const y = r.music.melody_complexity === "Simple" ? 25 : r.music.melody_complexity === "Moderate" ? 50 : 80;
        return { id: r.id, title: r.title, x, y, type: r.type, lang: r.language };
      });
    } else if (clusterDimension === "cognitive") {
      // Clustered by min age requirement (X) and cognitive tag thickness (Y)
      return rhymes.map(r => {
        const x = ((r.age_range.min) / 5) * 80 + 10;
        const y = (r.cognitive_tags.length / 8) * 80 + 10;
        return { id: r.id, title: r.title, x, y, type: r.type, lang: r.language };
      });
    } else {
      // Clustered by syllable count (X) and historic era depth (Y)
      return rhymes.map(r => {
        const x = ((r.linguistics.syllable_count) / 12) * 80 + 10;
        const y = r.heritage.historical_period.includes("18") ? 30 : r.heritage.historical_period.includes("19") ? 55 : 85;
        return { id: r.id, title: r.title, x, y, type: r.type, lang: r.language };
      });
    }
  };

  const dots = getEmbeddings();

  return (
    <div className="space-y-6" id="analytics-space">
      {/* Intro visualizer info */}
      <div className="bg-stone-50 border border-stone-200 p-5 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-serif font-semibold text-stone-900 tracking-tight flex items-center gap-2">
            <BarChart className="w-5 h-5 text-amber-600" /> Métriques de Vectorisation & Espace Sémantique
          </h3>
          <p className="text-xs font-sans text-stone-600 leading-relaxed max-w-2xl">
            Cette section analyse la distribution intrinsèque du corpus de {total} comptines. Elle simule également la vectorisation d'ancrage (Embeddings) indispensable pour l'optimisation des réponses de nos RAGs et IA.
          </p>
        </div>
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="px-3 py-1 bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 rounded text-xs font-mono transition flex items-center gap-1 shrink-0 shadow-sm"
        >
          <Info className="w-3.5 h-3.5 text-stone-500" /> {showExplanation ? "Masquer théorie" : "Explication théorique"}
        </button>
      </div>

      {showExplanation && (
        <div className="p-4 bg-amber-50 border border-amber-200/60 rounded-lg text-xs leading-relaxed text-stone-850 space-y-2 font-sans">
          <p className="font-bold text-amber-950">💡 Comment un RAG utilise-t-il ce corpus de comptines ?</p>
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
          <div className="bg-white border border-stone-200 p-5 rounded-lg shadow-sm space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1">
              <Languages className="w-4 h-4 text-amber-600" /> Dispersion par Langue d'Origine
            </h4>

            <div className="space-y-2.5 pt-1">
              {langBreakdown.map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-stone-800 font-medium">{item.label}</span>
                    <span className="text-stone-500">{item.count} ({item.percentage}%)</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200/40">
                    <div 
                      className="bg-amber-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Type Breakdown Card */}
          <div className="bg-white border border-stone-200 p-5 rounded-lg shadow-sm space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1">
              <Layers className="w-4 h-4 text-emerald-600" /> Typologie Folklorique Traditionnelle
            </h4>

            <div className="space-y-2.5 pt-1">
              {typeBreakdown.map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-stone-800 font-medium">{item.label}</span>
                    <span className="text-stone-500">{item.count} ({item.percentage}%)</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200/40">
                    <div 
                      className="bg-stone-900 h-full rounded-full transition-all duration-300"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2D Vector space sandbox visualizer */}
        <div className="lg:col-span-7 bg-white border border-stone-200 p-5 rounded-lg shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-stone-100 pb-3 mb-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1">
                <Compass className="w-4 h-4 text-amber-600 animate-spin-slow" /> Représentation d'Embeddings 2D Simulée
              </h4>

              {/* Selector */}
              <div className="flex bg-stone-100 p-0.5 rounded border border-stone-200 gap-0.5 self-start">
                <button
                  onClick={() => setClusterDimension("acoustic")}
                  className={`px-2 py-0.5 text-[9px] font-mono rounded transition ${
                    clusterDimension === "acoustic" ? "bg-stone-950 text-white font-bold" : "text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  Acoustique (BPM/Complx)
                </button>
                <button
                  onClick={() => setClusterDimension("cognitive")}
                  className={`px-2 py-0.5 text-[9px] font-mono rounded transition ${
                    clusterDimension === "cognitive" ? "bg-stone-950 text-white font-bold" : "text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  Cognitif (Âge/Tags)
                </button>
                <button
                  onClick={() => setClusterDimension("linguistic")}
                  className={`px-2 py-0.5 text-[9px] font-mono rounded transition ${
                    clusterDimension === "linguistic" ? "bg-stone-950 text-white font-bold" : "text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  Linguistique (Syllabes/Ere)
                </button>
              </div>
            </div>

            {/* Simulated 2D Cartography Plotter using absolute coordinates */}
            <div className="relative w-full h-64 bg-zinc-950 border border-zinc-900 rounded-lg overflow-hidden flex items-center justify-center shadow-inner">
              
              {/* grid lines */}
              <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 pointer-events-none opacity-5">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="border-t border-white border-l" />
                ))}
              </div>

              {/* Tilted vector axis pointers */}
              <div className="absolute bottom-2 left-2 text-[9px] font-mono text-stone-500">
                Axe-X: {clusterDimension === "acoustic" ? "Tempo de Récit (BPM)" : clusterDimension === "cognitive" ? "Âge Seuil minimal" : "Longueur syllabique"}
              </div>
              <div className="absolute top-2 left-2 text-[9px] font-mono text-stone-500 origin-bottom-left rotate-90 transform translate-x-5">
                Axe-Y: {clusterDimension === "acoustic" ? "Complexité" : clusterDimension === "cognitive" ? "Épaisseur taxonomique" : "Profondeur historique"}
              </div>

              {/* Render dynamic coordinate dots */}
              {dots.map((dot, idx) => {
                let dotColor = "bg-amber-500 hover:ring-amber-400";
                if (dot.type === "lullaby") dotColor = "bg-blue-500 hover:ring-blue-400";
                if (dot.type === "clapping_game") dotColor = "bg-purple-500 hover:ring-purple-400";
                if (dot.type === "game_song") dotColor = "bg-emerald-500 hover:ring-emerald-400";

                return (
                  <div
                    key={dot.id}
                    className="absolute group z-10 cursor-alias"
                    style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
                  >
                    {/* Dot circle */}
                    <div className={`w-3.5 h-3.5 rounded-full ${dotColor} border-2 border-zinc-950 hover:scale-130 transition-all hover:ring-4`} />
                    
                    {/* Tooltip on Hover */}
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none whitespace-nowrap bg-zinc-900 border border-zinc-850 px-2 py-1 rounded text-[10px] font-mono text-stone-150 z-20 shadow-md">
                      <span className="font-bold text-white">{dot.title}</span> ({dot.id})
                      <div className="text-[8px] text-stone-400 capitalize">Type: {dot.type?.replace("_", " ")}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex justify-between items-center text-[10px] font-mono text-stone-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> Berceuses
              <span className="w-2 h-2 rounded-full bg-purple-500 ml-2" /> Jeux de mains
              <span className="w-2 h-2 rounded-full bg-amber-500 ml-2" /> Comptines standard
            </span>
            <span>Clustering: KNN-Simulé</span>
          </div>
        </div>
      </div>
    </div>
  );
}
