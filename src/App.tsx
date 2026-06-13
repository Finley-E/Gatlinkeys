import React, { useState, useEffect } from "react";
import { NurseryRhyme } from "./types";
import { SEEDED_RHYMES } from "./data/rhymes";
import BiblioView from "./components/BiblioView";
import GraphView from "./components/GraphView";
import VariantsView from "./components/VariantsView";
import PipelineView from "./components/PipelineView";
import AnalyticsView from "./components/AnalyticsView";

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
  AlertCircle
} from "lucide-react";

export default function App() {
  // Active tabs: "biblio" | "graph" | "variants" | "prompts" | "analytics"
  const [activeTab, setActiveTab] = useState<"biblio" | "graph" | "variants" | "prompts" | "analytics">("biblio");
  
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
    <div className="min-h-screen bg-stone-100 flex flex-col text-stone-900 font-sans" id="atelier-app-root">
      
      {/* Top Professional Header Bar */}
      <header className="bg-stone-900 border-b border-stone-800 text-stone-100 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-20 shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#d0833b] flex items-center justify-center text-stone-950 font-serif font-bold text-xl shadow">
            𓆙
          </div>
          <div>
            <h1 className="text-lg font-serif font-bold tracking-tight text-white flex items-center gap-2">
              L'Atelier National de l'Héritage Oral
            </h1>
            <p className="text-[11px] font-mono text-stone-400">
              Base de Connaissances Multilingue & Prompt Studio d'Apprentissage IA
            </p>
          </div>
        </div>

        {/* Global actions and indicators */}
        <div className="flex items-center gap-3">
          <div className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 ${
            backendActive ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
            <span>{backendActive ? "Pipeline en ligne (M-P 1.2)" : "Mode Client Seul Actif"}</span>
          </div>

          <button
            id="reset-collection-btn"
            onClick={handleResetCollection}
            className="px-2.5 py-1 text-[10px] font-mono font-medium text-stone-300 hover:text-white hover:bg-stone-800 border border-stone-700 hover:border-stone-600 rounded transition flex items-center gap-1"
            title="Réinitialiser le corpus aux 8 spécimens de base"
          >
            <RotateCcw className="w-3 h-3" /> Restaurer le corpus
          </button>
        </div>
      </header>

      {errorNotice && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2 text-xs font-mono text-amber-800 flex items-center justify-between">
          <span className="flex items-center gap-1.5"><AlertCircle className="w-4 h-4 text-amber-600 shrink-0" /> {errorNotice}</span>
          <button onClick={() => setErrorNotice("")} className="text-amber-900 font-bold hover:underline">Fermer</button>
        </div>
      )}

      {/* Main Body Layout Split: Left collection selection / Right workspace area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* LEFT COMPANION SIDEBAR */}
        <aside className="w-full md:w-80 bg-white border-r border-stone-200 flex flex-col shrink-0 md:h-full overflow-hidden" id="corpus-sidebar">
          
          {/* Query settings and filters panel */}
          <div className="p-4 border-b border-stone-100 bg-stone-50/55 space-y-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 block">Recherche & Archivage</span>
            
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher titre, paroles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-stone-300 rounded font-sans text-xs focus:ring-1 focus:ring-amber-500 text-stone-900 bg-white"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
            </div>

            {/* Quick dropdown selectors panel */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <select
                value={langFilter}
                onChange={(e) => setLangFilter(e.target.value)}
                className="p-1 border border-stone-300 bg-white text-stone-800 rounded focus:ring-1 focus:ring-amber-500"
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
                className="p-1 border border-stone-300 bg-white text-stone-800 rounded focus:ring-1 focus:ring-amber-500"
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
          <div className="flex-1 overflow-y-auto divide-y divide-stone-100" id="rhyme-cards-sidebar">
            {loading ? (
              <div className="p-10 text-center font-mono text-xs text-stone-400 animate-pulse">
                Chargement de la bibliothèque...
              </div>
            ) : filteredRhymes.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-stone-400 italic">
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
                    className={`w-full p-3.5 text-left transition flex items-start gap-2.5 outline-none ${
                      isSelected ? "bg-amber-50 border-l-4 border-amber-600" : "hover:bg-stone-50"
                    }`}
                  >
                    {/* Circle language indicator */}
                    <div className="w-7 h-7 rounded-full bg-stone-100 border border-stone-200/60 font-mono text-[9px] font-bold flex items-center justify-center shrink-0 text-stone-600">
                      {langLabels[rhymeItem.language] || rhymeItem.language.toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline gap-1">
                        <h4 className={`text-xs font-bold truncate ${isSelected ? "text-amber-950 font-serif" : "text-stone-850"}`}>
                          {rhymeItem.title}
                        </h4>
                        <span className="text-[9px] font-mono text-stone-400 shrink-0">{rhymeItem.id}</span>
                      </div>
                      
                      <p className="text-[10px] font-mono text-stone-505 truncate mt-0.5">
                        {rhymeItem.origin.country} {rhymeItem.origin.region ? `(${rhymeItem.origin.region})` : ""}
                      </p>
                      
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-stone-100 text-stone-500 border border-stone-200/40">
                          {rhymeItem.music.tempo} BPM
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-stone-100 text-stone-500 border border-stone-200/40 capitalize">
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
          <div className="p-3 border-t border-stone-100 bg-stone-50">
            <button
              id="sidebar-create-pipeline-btn"
              onClick={() => setActiveTab("prompts")}
              className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded font-mono text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-amber-500" /> Insérer nouvelle via IA
            </button>
          </div>
        </aside>

        {/* RIGHT WORKSPACE CONSOLE AREA */}
        <main className="flex-1 bg-stone-100 flex flex-col overflow-hidden h-full">
          
          {/* Active Workspace tabs controller bar */}
          <div className="bg-white border-b border-stone-200 px-6 py-2 flex flex-wrap gap-1.5 shrink-0 select-none items-center overflow-x-auto justify-start">
            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest mr-2">Espaces :</span>
            
            <button
              id="tab-biblio-btn"
              disabled={!selectedRhyme}
              onClick={() => setActiveTab("biblio")}
              className={`px-3 py-1.5 rounded-md font-sans text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === "biblio" 
                  ? "bg-amber-50 text-amber-900 border border-amber-200" 
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> Bibliothèque d'Étude
            </button>

            <button
              id="tab-graph-btn"
              disabled={!selectedRhyme}
              onClick={() => setActiveTab("graph")}
              className={`px-3 py-1.5 rounded-md font-sans text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === "graph" 
                  ? "bg-amber-50 text-amber-900 border border-amber-200" 
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              <Workflow className="w-3.5 h-3.5" /> Graphe Sémantique
            </button>

            <button
              id="tab-variants-btn"
              disabled={!selectedRhyme}
              onClick={() => setActiveTab("variants")}
              className={`px-3 py-1.5 rounded-md font-sans text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === "variants" 
                  ? "bg-amber-50 text-amber-900 border border-amber-200" 
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Remake Pédagogique (AI 10 Pillars)
            </button>

            <button
              id="tab-prompts-btn"
              onClick={() => setActiveTab("prompts")}
              className={`px-3 py-1.5 rounded-md font-sans text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === "prompts" 
                  ? "bg-stone-900 text-stone-100 border border-stone-800" 
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" /> Pipeline Studio Sandbox
            </button>

            <button
              id="tab-analytics-btn"
              onClick={() => setActiveTab("analytics")}
              className={`px-3 py-1.5 rounded-md font-sans text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === "analytics" 
                  ? "bg-amber-50 text-amber-900 border border-amber-200" 
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              <BarChart className="w-3.5 h-3.5" /> Tableau Analytique
            </button>
          </div>

          {/* Active Sheet content render */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="max-w-4xl mx-auto bg-stone-100">
              
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
            </div>
          </div>
        </main>
      </div>

      {/* Humble credit footer line (anti-slop guidelines: humble, clean, minimal) */}
      <footer className="bg-stone-900 text-stone-400 text-[10px] font-mono px-6 py-2.5 border-t border-stone-850 flex justify-between z-20 shrink-0">
        <span>© Conservatoire Historique de la Transmission Orale</span>
        <span>Compatible Vertex AI / LlamaIndex / Gemini-3.5</span>
      </footer>
    </div>
  );
}
