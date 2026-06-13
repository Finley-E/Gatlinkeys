import React, { useState, useEffect } from "react";
import { NurseryRhyme } from "./types";
import { SEEDED_RHYMES } from "./data/rhymes";
import BiblioView from "./components/BiblioView";
import GraphView from "./components/GraphView";
import VariantsView from "./components/VariantsView";
import PipelineView from "./components/PipelineView";
import AnalyticsView from "./components/AnalyticsView";
import GatlinkeysExplorer from "./components/GatlinkeysExplorer";

import { 
  BookOpen, 
  Search, 
  Sparkles, 
  Workflow, 
  BarChart, 
  Layers, 
  RotateCcw, 
  Music, 
  Languages, 
  Plus, 
  Info, 
  Heart,
  Flame,
  Globe,
  AlertCircle,
  GitBranch
} from "lucide-react";

export default function App() {
  // Active tabs: "biblio" | "graph" | "variants" | "prompts" | "analytics" | "gatlinkeys"
  const [activeTab, setActiveTab] = useState<"biblio" | "graph" | "variants" | "prompts" | "analytics" | "gatlinkeys">("gatlinkeys");
  
  // Entire corpus rhymes state
  const [rhymes, setRhymes] = useState<NurseryRhyme[]>([]);
  const [selectedRhymeId, setSelectedRhymeId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [backendActive, setBackendActive] = useState(false);
  const [errorNotice, setErrorNotice] = useState("");

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [langFilter, setLangFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Fetch from Express back-end
  const fetchRhymesList = async () => {
    try {
      setLoading(true);
      setErrorNotice("");
      const res = await fetch("/api/rhymes");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.rhymes && data.rhymes.length > 0) {
          setRhymes(data.rhymes);
          setBackendActive(true);
          // Set selected back if missing
          if (!selectedRhymeId || !data.rhymes.some((r: any) => r.id === selectedRhymeId)) {
            setSelectedRhymeId(data.rhymes[0].id);
          }
        } else {
          // Empty back-end but success, fall back
          setRhymes(SEEDED_RHYMES);
          setSelectedRhymeId(SEEDED_RHYMES[0].id);
        }
      } else {
        // Fall back to client data if express is initializing
        console.warn("Backend not ready or error. Using native fallback dataset.");
        setRhymes(SEEDED_RHYMES);
        setSelectedRhymeId(SEEDED_RHYMES[0].id);
      }
    } catch (e) {
      console.warn("Backend API cold-start. Running client-side standalone memory collection.");
      setRhymes(SEEDED_RHYMES);
      setSelectedRhymeId(SEEDED_RHYMES[0].id);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRhymesList();
  }, []);

  const handleUpdateRhyme = async (updatedRhyme: NurseryRhyme) => {
    // Optimistic UI updates
    setRhymes(prev => prev.map(r => r.id === updatedRhyme.id ? updatedRhyme : r));
    
    // Save to server
    try {
      const res = await fetch("/api/rhymes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedRhyme)
      });
      if (!res.ok) {
        throw new Error("Impossible d'enregistrer sur le serveur, enregistré en local uniquement.");
      }
    } catch (e: any) {
      setErrorNotice(e.message || "Erreur de synchronisation backend");
    }
  };

  const handleDeleteRhyme = async (id: string) => {
    // Filter out locally
    const remaining = rhymes.filter(r => r.id !== id);
    setRhymes(remaining);
    
    // Move selection
    if (selectedRhymeId === id && remaining.length > 0) {
      setSelectedRhymeId(remaining[0].id);
    }

    try {
      await fetch(`/api/rhymes/${id}`, { method: "DELETE" });
    } catch (e: any) {
      console.warn("Erreur suppression serveur, effacé localement uniquement.");
    }
  };

  const handleResetCollection = async () => {
    if (confirm("Voulez-vous restaurer les 8 spécimens de base et écraser toutes vos modifications ?")) {
      try {
        setLoading(true);
        const res = await fetch("/api/rhymes/reset", { method: "POST" });
        if (res.ok) {
          await fetchRhymesList();
        } else {
          setRhymes(SEEDED_RHYMES);
          setSelectedRhymeId(SEEDED_RHYMES[0].id);
        }
      } catch (e) {
        setRhymes(SEEDED_RHYMES);
        setSelectedRhymeId(SEEDED_RHYMES[0].id);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInjectRhymeIntoLibrary = async (assembled: NurseryRhyme) => {
    // Add to state
    setRhymes(prev => {
      const exists = prev.findIndex(r => r.id === assembled.id);
      if (exists > -1) {
        const next = [...prev];
        next[exists] = assembled;
        return next;
      }
      return [...prev, assembled];
    });
    
    // Set active selection to this newborn rhyme!
    setSelectedRhymeId(assembled.id);
    
    // Switch view back to library to let them inspect
    setActiveTab("biblio");

    // Persist to server
    try {
      await fetch("/api/rhymes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assembled)
      });
    } catch (e) {
      console.warn("Pas de persistance backend, préservé en local.");
    }
  };

  // Processing Filter lists
  const filteredRhymes = rhymes.filter(rhyme => {
    const matchesSearch = 
      rhyme.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (rhyme.origin.country && rhyme.origin.country.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (rhyme.lyrics_original && rhyme.lyrics_original.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesLang = langFilter === "all" || rhyme.language === langFilter;
    const matchesType = typeFilter === "all" || rhyme.type === typeFilter;
    
    return matchesSearch && matchesLang && matchesType;
  });

  const selectedRhyme = rhymes.find(r => r.id === selectedRhymeId) || rhymes[0];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col text-slate-900 font-sans" id="atelier-app-root">
      
      {/* Top Professional Header Bar */}
      <header className="bg-[#0f172a] border-b border-slate-800 text-slate-150 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-20 shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg ring-1 ring-white/10 shrink-0">
            𓆙
          </div>
          <div>
            <h1 className="text-lg font-serif font-semibold tracking-tight text-white flex items-center gap-2">
              L'Atelier National de l'Héritage Oral
            </h1>
            <p className="text-[10px] font-mono text-slate-400 tracking-wide">
              Base de Connaissances Multilingue & Prompt Studio d'Apprentissage IA
            </p>
          </div>
        </div>

        {/* Global actions and indicators */}
        <div className="flex items-center gap-3">
          <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium flex items-center gap-1.5 ${
            backendActive ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            <span>{backendActive ? "Pipeline en ligne (M-P 1.2)" : "Mode Client Seul Actif"}</span>
          </div>

          <button
            id="reset-collection-btn"
            onClick={handleResetCollection}
            className="px-3 py-1.5 text-[10px] font-mono font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 rounded-md transition flex items-center gap-1.5 shadow-sm"
            title="Réinitialiser le corpus aux 8 spécimens de base"
          >
            <RotateCcw className="w-3 h-3" /> Restaurer le corpus
          </button>
        </div>
      </header>

      {errorNotice && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-2.5 text-xs font-mono text-red-800 flex items-center justify-between">
          <span className="flex items-center gap-1.5"><AlertCircle className="w-4 h-4 text-red-600 shrink-0" /> {errorNotice}</span>
          <button onClick={() => setErrorNotice("")} className="text-red-900 font-bold hover:underline">Fermer</button>
        </div>
      )}

      {/* Main Body Layout Split: Left collection selection / Right workspace area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* LEFT COMPANION SIDEBAR */}
        <aside className="w-full md:w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 md:h-full overflow-hidden" id="corpus-sidebar">
          
          {/* Query settings and filters panel */}
          <div className="p-4 border-b border-slate-150 bg-slate-50/60 space-y-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block pb-0.5 border-b border-slate-100">Recherche & Filtrage</span>
            
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher titre, paroles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-md font-sans text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-slate-900 bg-white shadow-xs"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            {/* Quick dropdown selectors panel */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <select
                value={langFilter}
                onChange={(e) => setLangFilter(e.target.value)}
                className="p-1.5 border border-slate-300 bg-white text-slate-700 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              >
                <option value="all">Langue (toutes)</option>
                <option value="fr">Français</option>
                <option value="en">Anglais</option>
                <option value="mfe">Créole</option>
                <option value="ja">Japonais</option>
                <option value="zh">Chinois</option>
                <option value="hi">Hindi</option>
                <option value="af">Africain (Akan)</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="p-1.5 border border-slate-300 bg-white text-slate-700 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              >
                <option value="all">Type (tous)</option>
                <option value="nursery_rhyme">Comptine</option>
                <option value="lullaby">Berceuse</option>
                <option value="counting_rhyme">Chant calcul</option>
                <option value="clapping_game">Jeu de mains</option>
                <option value="game_song">Jeu de geste</option>
              </select>
            </div>
          </div>

          {/* Seeded and processed list iterator */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100" id="rhyme-cards-sidebar">
            {loading ? (
              <div className="p-10 text-center font-mono text-xs text-slate-400 animate-pulse">
                Chargement de la bibliothèque...
              </div>
            ) : filteredRhymes.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-slate-400 italic">
                Aucune comptine ne correspond aux critères.
              </div>
            ) : (
              filteredRhymes.map((rhymeItem) => {
                const isSelected = rhymeItem.id === selectedRhymeId;
                const langLabels: Record<string, string> = { fr: "FR", en: "EN", mfe: "MFE", ja: "JA", zh: "ZH", hi: "HI", af: "AK" };
                
                return (
                  <button
                    key={rhymeItem.id}
                    id={`sidebar-item-${rhymeItem.id}`}
                    onClick={() => {
                      setSelectedRhymeId(rhymeItem.id);
                      if (activeTab === "prompts") {
                        // Switch back to biblio to view clicked rhyme
                        setActiveTab("biblio");
                      }
                    }}
                    className={`w-full p-4 text-left transition flex items-start gap-3 outline-none border-b border-slate-100/50 ${
                      isSelected ? "bg-blue-50/50 border-l-4 border-blue-600" : "hover:bg-slate-50/60"
                    }`}
                  >
                    {/* Circle language indicator */}
                    <div className={`w-7 h-7 rounded-full font-mono text-[9px] font-bold flex items-center justify-center shrink-0 border transition ${
                      isSelected 
                        ? "bg-blue-600 text-white border-blue-600" 
                        : "bg-slate-100 text-slate-600 border-slate-200/60"
                    }`}>
                      {langLabels[rhymeItem.language] || rhymeItem.language.toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline gap-1">
                        <h4 className={`text-xs font-semibold truncate ${isSelected ? "text-blue-900 font-serif" : "text-slate-800"}`}>
                          {rhymeItem.title}
                        </h4>
                        <span className="text-[9px] font-mono text-slate-450 shrink-0">{rhymeItem.id}</span>
                      </div>
                      
                      <p className="text-[10px] font-mono text-slate-500 truncate mt-0.5">
                        {rhymeItem.origin.country} {rhymeItem.origin.region ? `(${rhymeItem.origin.region})` : ""}
                      </p>
                      
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100/80 text-slate-500 border border-slate-200/30">
                          {rhymeItem.music.tempo} BPM
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100/80 text-slate-500 border border-slate-200/30 capitalize">
                          {rhymeItem.type.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Fast Playground Trigger button at bottom list */}
          <div className="p-3 border-t border-slate-100 bg-slate-50">
            <button
              id="sidebar-create-pipeline-btn"
              onClick={() => setActiveTab("prompts")}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-mono text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-blue-200" /> Insérer nouvelle via IA
            </button>
          </div>
        </aside>

        {/* RIGHT WORKSPACE CONSOLE AREA */}
        <main className="flex-1 bg-stone-100 flex flex-col overflow-hidden h-full">
          
          {/* Active Workspace tabs controller bar */}
          <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap gap-1.5 shrink-0 select-none items-center overflow-x-auto justify-start shadow-xs">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mr-2">Espaces :</span>
            
            <button
              id="tab-biblio-btn"
              disabled={!selectedRhyme}
              onClick={() => setActiveTab("biblio")}
              className={`px-3 py-1.5 rounded-md font-sans text-xs font-semibold border transition flex items-center gap-1.5 ${
                activeTab === "biblio" 
                  ? "bg-blue-50 text-blue-700 border-blue-200 shadow-2xs cursor-default" 
                  : "text-slate-550 hover:text-slate-800 hover:bg-slate-50 border-transparent"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> Bibliothèque d'Étude
            </button>

            <button
              id="tab-graph-btn"
              disabled={!selectedRhyme}
              onClick={() => setActiveTab("graph")}
              className={`px-3 py-1.5 rounded-md font-sans text-xs font-semibold border transition flex items-center gap-1.5 ${
                activeTab === "graph" 
                  ? "bg-blue-50 text-blue-700 border-blue-200 shadow-2xs cursor-default" 
                  : "text-slate-550 hover:text-slate-800 hover:bg-slate-50 border-transparent"
              }`}
            >
              <Workflow className="w-3.5 h-3.5" /> Graphe Sémantique
            </button>

            <button
              id="tab-variants-btn"
              disabled={!selectedRhyme}
              onClick={() => setActiveTab("variants")}
              className={`px-3 py-1.5 rounded-md font-sans text-xs font-semibold border transition flex items-center gap-1.5 ${
                activeTab === "variants" 
                  ? "bg-blue-50 text-blue-700 border-blue-200 shadow-2xs cursor-default" 
                  : "text-slate-550 hover:text-slate-800 hover:bg-slate-50 border-transparent"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Remake Pédagogique (AI 10 Pillars)
            </button>

            <button
              id="tab-prompts-btn"
              onClick={() => setActiveTab("prompts")}
              className={`px-3 py-1.5 rounded-md font-sans text-xs font-semibold border transition flex items-center gap-1.5 ${
                activeTab === "prompts" 
                  ? "bg-[#0f172a] text-white border-slate-900 shadow-xs cursor-default" 
                  : "text-slate-550 hover:text-slate-800 hover:bg-slate-50 border-transparent"
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-blue-500" /> Pipeline Studio Sandbox
            </button>

            <button
              id="tab-analytics-btn"
              onClick={() => setActiveTab("analytics")}
              className={`px-3 py-1.5 rounded-md font-sans text-xs font-semibold border transition flex items-center gap-1.5 ${
                activeTab === "analytics" 
                  ? "bg-blue-50 text-blue-700 border-blue-200 shadow-2xs cursor-default" 
                  : "text-slate-550 hover:text-slate-800 hover:bg-slate-50 border-transparent"
              }`}
            >
              <BarChart className="w-3.5 h-3.5" /> Tableau Analytique
            </button>

            <button
              id="tab-gatlinkeys-btn"
              onClick={() => setActiveTab("gatlinkeys")}
              className={`px-3 py-1.5 rounded-md font-sans text-xs font-semibold border transition flex items-center gap-1.5 ${
                activeTab === "gatlinkeys" 
                  ? "bg-indigo-50 hover:text-indigo-800 text-indigo-700 border-indigo-200 shadow-2xs cursor-default" 
                  : "text-slate-550 hover:text-slate-800 hover:bg-slate-50 border-transparent"
              }`}
            >
              <GitBranch className="w-3.5 h-3.5 text-blue-600" /> Dépôt Gatlinkeys 𓆙
            </button>
          </div>

          {/* Active Sheet content render */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#f8fafc]">
            <div className="max-w-5xl mx-auto bg-transparent">
              
              {activeTab === "biblio" && selectedRhyme && (
                <BiblioView 
                  rhyme={selectedRhyme} 
                  onUpdate={handleUpdateRhyme}
                  onDelete={handleDeleteRhyme}
                />
              )}

              {activeTab === "graph" && selectedRhyme && (
                <GraphView rhyme={selectedRhyme} />
              )}

              {activeTab === "variants" && selectedRhyme && (
                <VariantsView rhyme={selectedRhyme} />
              )}

              {activeTab === "prompts" && (
                <PipelineView onAddRhymeToLibrary={handleInjectRhymeIntoLibrary} />
              )}

              {activeTab === "analytics" && (
                <AnalyticsView rhymes={rhymes} />
              )}

              {activeTab === "gatlinkeys" && (
                <GatlinkeysExplorer 
                  onNavigateToPipeline={() => setActiveTab("prompts")} 
                  installedCount={rhymes.length} 
                />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Humble credit footer line (anti-slop guidelines: humble, clean, minimal) */}
      <footer className="bg-[#0f172a] text-slate-400 text-[10px] font-mono px-6 py-3 border-t border-slate-800 flex justify-between z-20 shrink-0">
        <span>© Conservatoire Historique de la Transmission Orale</span>
        <span>Compatible Vertex AI / LlamaIndex / Gemini-3.5</span>
      </footer>
    </div>
  );
}
