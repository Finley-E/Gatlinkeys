import React, { useState } from "react";
import { NurseryRhyme } from "../types";
import { 
  Music, 
  Languages, 
  BookOpen, 
  Feather, 
  History, 
  Activity, 
  FileText, 
  Calendar, 
  Globe, 
  Edit3, 
  Check, 
  X, 
  Volume2, 
  Award,
  AlertCircle,
  Sparkles
} from "lucide-react";

interface BiblioViewProps {
  rhyme: NurseryRhyme;
  onUpdate: (updated: NurseryRhyme) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function BiblioView({ rhyme, onUpdate, onDelete }: BiblioViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(rhyme.title);
  const [editLyrics, setEditLyrics] = useState(rhyme.lyrics_original);
  const [editTranslation, setEditTranslation] = useState(rhyme.translation_fr || "");
  const [editType, setEditType] = useState(rhyme.type);
  const [editMinAge, setEditMinAge] = useState(rhyme.age_range.min);
  const [editMaxAge, setEditMaxAge] = useState(rhyme.age_range.max);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // On-the-fly Translation & Multilingual Adaptation States
  const [targetLang, setTargetLang] = useState("English");
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationResult, setTranslationResult] = useState<{
    title_translated: string;
    lyrics_translated: string;
    notes_adaptation: string;
    singing_guide: string;
  } | null>(null);
  const [transError, setTransError] = useState("");

  // Reset translator when the active rhyme changes
  React.useEffect(() => {
    setTranslationResult(null);
    setTransError("");
  }, [rhyme.id]);

  const handleTranslateOnTheFly = async () => {
    setIsTranslating(true);
    setTransError("");
    try {
      const res = await fetch("/api/pipeline/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: rhyme.title,
          lyricsOriginal: rhyme.lyrics_original,
          sourceLanguage: rhyme.language,
          targetLanguage: targetLang
        })
      });
      const data = await res.json();
      if (data.success && data.result) {
        setTranslationResult(data.result);
      } else {
        throw new Error(data.error || "La traduction a échoué.");
      }
    } catch (err: any) {
      setTransError(err.message || "Erreur lors de la communication avec le serveur.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage("");
    try {
      const updatedRhyme: NurseryRhyme = {
        ...rhyme,
        title: editTitle,
        lyrics_original: editLyrics,
        translation_fr: editTranslation,
        type: editType as any,
        age_range: {
          min: Number(editMinAge),
          max: Number(editMaxAge)
        }
      };
      await onUpdate(updatedRhyme);
      setIsEditing(false);
    } catch (e: any) {
      setErrorMessage(e.message || "Erreur lors de la mise à jour");
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = () => {
    setEditTitle(rhyme.title);
    setEditLyrics(rhyme.lyrics_original);
    setEditTranslation(rhyme.translation_fr || "");
    setEditType(rhyme.type);
    setEditMinAge(rhyme.age_range.min);
    setEditMaxAge(rhyme.age_range.max);
    setIsEditing(true);
  };

  const getLanguageLabel = (lang: string) => {
    switch (lang) {
      case "fr": return "Français";
      case "en": return "Anglais";
      case "mfe": return "Créole mauricien";
      case "ja": return "Japonais";
      case "zh": return "Chinois (Mandarin)";
      case "hi": return "Hindi";
      case "af": return "Akan (Afrique de l'Ouest)";
      default: return lang.toUpperCase();
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "nursery_rhyme": return "Comptine traditionnelle";
      case "lullaby": return "Berceuse (Lullaby)";
      case "counting_rhyme": return "Chanson de calcul / Énumération";
      case "clapping_game": return "Jeu de mains / Clapping game";
      case "game_song": return "Jeu de cour / Chanson à gestes";
      default: return type;
    }
  };

  return (
    <div className="space-y-6" id="biblio-view-container">
      {/* Rhyme Header / Quick info */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-blue-50 text-blue-700 border border-blue-200/50">
              {rhyme.id}
            </span>
            <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-slate-100 text-slate-700 border border-slate-200">
              {getLanguageLabel(rhyme.language)}
            </span>
            <span className="text-xs font-mono text-slate-500">
              {rhyme.origin.country} {rhyme.origin.region ? `(${rhyme.origin.region})` : ""}
            </span>
          </div>

          <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
            {rhyme.title}
          </h2>
          <p className="text-sm font-mono text-slate-600 mt-1.5">
            {getTypeLabel(rhyme.type)} • Âge conseillé: {rhyme.age_range.min} à {rhyme.age_range.max} ans
          </p>
        </div>

        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <button
                id="edit-rhyme-btn"
                onClick={startEdit}
                className="px-4 py-2 text-xs font-mono font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-150 flex items-center gap-1.5 shadow-sm"
              >
                <Edit3 className="w-3.5 h-3.5" /> Modifier la fiche
              </button>
              <button
                id="delete-rhyme-btn"
                onClick={() => {
                  if (confirm("Êtes-vous certain de vouloir supprimer cette comptine du corpus ?")) {
                    onDelete(rhyme.id);
                  }
                }}
                className="px-4 py-2 text-xs font-mono font-medium border border-slate-200 hover:bg-red-50 text-red-650 hover:text-red-700 hover:border-red-200 rounded-lg transition duration-150 shadow-2xs"
              >
                Supprimer
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="save-rhyme-btn"
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 text-xs font-mono font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition duration-150 flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" /> Enregistrer
              </button>
              <button
                id="cancel-rhyme-btn"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-xs font-mono font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 transition duration-150"
              >
                Annuler
              </button>
            </div>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Lyric sheet block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 bg-slate-50/60 border-b border-slate-150 flex justify-between items-center">
            <h3 className="text-sm font-sans font-semibold text-slate-800 tracking-tight flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" /> Paroles de l'Œuvre Originale
            </h3>
            {isEditing && <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 font-bold">Modification active</span>}
          </div>

          <div className="p-6 md:p-8 flex-1 flex flex-col md:flex-row gap-6 md:gap-8">
            {isEditing ? (
              <div className="w-full space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-slate-600 mb-1 font-bold">Titre :</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full p-2 border border-slate-350 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-slate-900 bg-white"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-slate-600 mb-1 font-bold">Type :</label>
                    <select
                      value={editType}
                      onChange={(e) => setEditType(e.target.value as any)}
                      className="w-full p-2 border border-slate-350 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-slate-900 bg-white"
                    >
                      <option value="nursery_rhyme">Comptine</option>
                      <option value="lullaby">Berceuse</option>
                      <option value="counting_rhyme">Chant de calcul</option>
                      <option value="clapping_game">Jeu de mains</option>
                      <option value="game_song">Jeu de geste</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-bold">Âge Min :</label>
                    <input
                      type="number"
                      value={editMinAge}
                      onChange={(e) => setEditMinAge(Number(e.target.value))}
                      className="w-full p-2 border border-slate-350 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-bold">Âge Max :</label>
                    <input
                      type="number"
                      value={editMaxAge}
                      onChange={(e) => setEditMaxAge(Number(e.target.value))}
                      className="w-full p-2 border border-slate-350 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-slate-900"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 mb-1 font-bold">Paroles Originales :</label>
                    <textarea
                      rows={10}
                      value={editLyrics}
                      onChange={(e) => setEditLyrics(e.target.value)}
                      className="w-full p-2 border border-slate-350 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none font-mono text-xs text-slate-900 leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-bold">Traduction / Notes (fr) :</label>
                    <textarea
                      rows={10}
                      value={editTranslation}
                      onChange={(e) => setEditTranslation(e.target.value)}
                      className="w-full p-2 border border-slate-350 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none font-mono text-xs text-slate-900 leading-relaxed"
                      placeholder="Traduction optionnelle en français pour l'utilisateur..."
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Original lyrics */}
                <div className="flex-1">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400 block mb-2 font-semibold">Original ({getLanguageLabel(rhyme.language)})</span>
                  <div className="whitespace-pre-line text-slate-800 font-serif text-lg leading-relaxed italic bg-slate-50 p-5 border-l-4 border-blue-500 rounded-r-lg">
                    {rhyme.lyrics_original}
                  </div>
                </div>

                {/* French translate side by side */}
                {rhyme.translation_fr && rhyme.language !== "fr" && (
                  <div className="flex-1 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-6">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400 block mb-2 font-semibold">Traduction d'Étude (fr)</span>
                    <div className="whitespace-pre-line text-slate-600 font-sans text-sm leading-relaxed p-5 bg-slate-50/50 rounded-lg border border-slate-100">
                      {rhyme.translation_fr}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="px-5 py-3.5 bg-slate-50/60 border-t border-slate-150 flex flex-wrap gap-2 items-center">
            <span className="text-xs font-mono text-slate-400 self-center">Domaines d'apprentissage :</span>
            {rhyme.skills.map((skill) => (
              <span key={skill} className="px-2.5 py-0.5 text-xs font-mono bg-blue-55 text-blue-700 bg-blue-50 rounded-md border border-blue-100/50 capitalize font-medium">
                {skill.replace("_", " ")}
              </span>
            ))}
          </div>
        </div>

        {/* Audio profile and tempo ticker on the right */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0f172a] text-slate-100 p-5 rounded-xl border border-slate-800 shadow-md relative overflow-hidden flex flex-col justify-between h-48">
            <div className="absolute right-[-15px] top-[-15px] opacity-10">
              <Music className="w-40 h-40" />
            </div>

            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-sky-400 font-bold">Profil Acoustique de Suno</span>
                <h4 className="text-xl font-serif font-medium mt-1 text-white">Analyse des Ondes</h4>
              </div>
              <div className="w-9 h-9 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-450">
                <Volume2 className="w-5 h-5 animate-pulse" />
              </div>
            </div>

            {/* Custom animated simulated tempo waves */}
            <div className="flex items-end gap-1 px-2 py-3" style={{ height: "45px" }}>
              <div className="w-1 bg-sky-500 rounded" style={{ height: "30%", animate: "pulse" }}></div>
              <div className="w-1 bg-indigo-400 rounded" style={{ height: "60%" }}></div>
              <div className="w-1 bg-sky-550 bg-sky-500 rounded" style={{ height: "95%" }}></div>
              <div className="w-1 bg-slate-700 rounded" style={{ height: "15%" }}></div>
              <div className="w-1 bg-sky-500 rounded" style={{ height: "50%" }}></div>
              <div className="w-1 bg-indigo-400 rounded" style={{ height: "80%" }}></div>
              <div className="w-1 bg-sky-500 rounded" style={{ height: "40%" }}></div>
              <div className="w-1 bg-slate-700 rounded" style={{ height: "20%" }}></div>
              <div className="w-1 bg-sky-500 rounded" style={{ height: "70%" }}></div>
              <div className="w-1 bg-indigo-400 rounded" style={{ height: "60%" }}></div>
              <div className="w-1 bg-sky-500 rounded" style={{ height: "100%" }}></div>
              <div className="w-1 bg-indigo-400 rounded" style={{ height: "45%" }}></div>
              <div className="w-1 bg-slate-700 rounded" style={{ height: "10%" }}></div>
              <div className="w-1 bg-sky-500 rounded" style={{ height: "80%" }}></div>
              <div className="w-1 bg-indigo-400 rounded" style={{ height: "90%" }}></div>
              <div className="w-1 bg-slate-700 rounded" style={{ height: "30%" }}></div>
              <div className="w-1 bg-sky-500 rounded" style={{ height: "55%" }}></div>
              <div className="w-1 bg-indigo-400 rounded" style={{ height: "70%" }}></div>
              <div className="w-1 bg-sky-500 rounded" style={{ height: "25%" }}></div>
              <div className="w-1 bg-stone-700 rounded" style={{ height: "15%" }}></div>
              <div className="w-1 bg-[#d0833b] rounded" style={{ height: "40%" }}></div>
              <div className="w-1 bg-[#e0aa62] rounded" style={{ height: "85%" }}></div>
              <div className="w-1 bg-[#d0833b] rounded" style={{ height: "60%" }}></div>
              <div className="w-1 bg-stone-700 rounded" style={{ height: "20%" }}></div>
            </div>

            <div className="flex justify-between items-center border-t border-slate-800 pt-3">
              <span className="font-mono text-xs text-slate-400">Tempo de Battement :</span>
              <span className="font-mono text-sm text-sky-400 font-semibold">{rhyme.music.tempo} BPM ({rhyme.music.mood})</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">Cognitive Core Taxonomy</h4>
            <div className="flex flex-wrap gap-1.5">
              {rhyme.cognitive_tags.map(tag => (
                <span key={tag} className="px-2 py-1 text-xs font-mono font-medium rounded-full bg-blue-50/70 text-blue-700 border border-blue-100/50">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Translation and On-the-Fly Multilingual Adaptation tool */}
      <div className="bg-white border border-indigo-150 rounded-xl shadow-xs overflow-hidden" id="live-translation-panel">
        <div className="px-5 py-4 bg-indigo-50/55 border-b border-indigo-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-sm font-sans font-bold text-indigo-900 tracking-tight flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-600 animate-pulse" /> Adaptateur & Traducteur Multilingue Express (IA)
            </h3>
            <p className="text-[11px] text-indigo-650 leading-relaxed font-sans mt-0.5">
              Transposez instantanément et de façon chantable cette comptine dans la langue d'apprentissage cible.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <span className="text-xs font-mono text-indigo-800 font-semibold select-none">Langue cible :</span>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="p-1 px-2 border border-slate-200 rounded bg-white text-slate-800 text-xs font-mono focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="English">Anglais (English)</option>
              <option value="French">Français (French)</option>
              <option value="Spanish">Espagnol (Español)</option>
              <option value="German">Allemand (Deutsch)</option>
              <option value="Japanese">Japonais (日本語)</option>
              <option value="Chinese">Chinois (中文)</option>
              <option value="Hindi">Hindi (हिन्दी)</option>
              <option value="Italian">Italien (Italiano)</option>
              <option value="Mauritian Creole">Créole (Creole)</option>
            </select>
            <button
              onClick={handleTranslateOnTheFly}
              disabled={isTranslating}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-[11px] font-bold tracking-wide rounded-lg transition-all disabled:opacity-50 flex items-center gap-1 cursor-pointer shadow-sm"
            >
              <Sparkles className={`w-3 h-3 ${isTranslating ? "animate-spin" : ""}`} />
              {isTranslating ? "Transposition..." : "Traduire !"}
            </button>
          </div>
        </div>

        <div className="p-5 md:p-6 bg-slate-50/25">
          {isTranslating ? (
            <div className="py-12 text-center space-y-3.5">
              <div className="relative w-10 h-10 mx-auto">
                <div className="absolute inset-0 border-4 border-indigo-200 border-t-indigo-650 rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-4 border-transparent border-b-sky-500 rounded-full animate-spin reverse"></div>
              </div>
              <p className="text-xs font-mono text-indigo-700 font-bold animate-pulse">
                Rapprochement phonémique et transposition du chant en cours...
              </p>
            </div>
          ) : transError ? (
            <div className="p-4 bg-rose-50 border border-rose-150 rounded-lg text-rose-700 text-xs flex items-center gap-2 font-mono">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{transError}</span>
            </div>
          ) : translationResult ? (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 border-b border-indigo-100 pb-2.5">
                <span className="text-[9px] font-mono font-bold uppercase bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded leading-none">
                  Nouveau Format Chantable
                </span>
                <span className="font-mono text-slate-400">→</span>
                <h4 className="text-sm font-sans font-bold text-indigo-950">
                  {translationResult.title_translated}
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Lyrics translated */}
                <div className="md:col-span-7 bg-white border border-slate-150 rounded-xl p-5 shadow-2xs">
                  <span className="text-[10px] font-mono tracking-widest text-slate-450 uppercase block mb-3 font-semibold">Paroles en Langue Cible</span>
                  <div className="whitespace-pre-line text-slate-800 font-serif text-lg leading-relaxed italic border-l-4 border-indigo-500 pl-4 py-2">
                    {translationResult.lyrics_translated}
                  </div>
                </div>

                {/* Pedagogy and Singing Guide */}
                <div className="md:col-span-5 space-y-4">
                  <div className="bg-indigo-50/40 border border-indigo-100 rounded-xl p-4 space-y-2.5">
                    <h5 className="text-[10px] font-mono uppercase text-indigo-800 font-bold tracking-wider flex items-center gap-1.5">
                      <Feather className="w-3.5 h-3.5 text-indigo-600" /> Esprit de la Transposition
                    </h5>
                    <p className="text-xs text-indigo-950 font-sans leading-relaxed">
                      {translationResult.notes_adaptation}
                    </p>
                  </div>

                  <div className="bg-emerald-50/45 border border-emerald-100 rounded-xl p-4 space-y-2.5">
                    <h5 className="text-[10px] font-mono uppercase text-emerald-800 font-bold tracking-wider flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-emerald-600" /> Guide de Chant Rythmique
                    </h5>
                    <p className="text-xs text-emerald-950 font-sans leading-relaxed">
                      {translationResult.singing_guide}
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={async () => {
                        try {
                          setIsSaving(true);
                          const formattedLabel = `Adaptation Rythmique [${targetLang}]`;
                          const updated: NurseryRhyme = {
                            ...rhyme,
                            translation_fr: rhyme.translation_fr 
                              ? `${rhyme.translation_fr}\n\n=== ${formattedLabel} ===\nTitre : ${translationResult.title_translated}\n${translationResult.lyrics_translated}\n\nNote d'adaptation : ${translationResult.notes_adaptation}`
                              : `=== ${formattedLabel} ===\nTitre : ${translationResult.title_translated}\n${translationResult.lyrics_translated}\n\nNote d'adaptation : ${translationResult.notes_adaptation}`
                          };
                          await onUpdate(updated);
                          alert("L'adaptation multilingue a été ajoutée et enregistrée avec succès dans la mémoire d'étude de la fiche !");
                        } catch (err: any) {
                          alert("Erreur lors de l'enregistrement : " + err.message);
                        } finally {
                          setIsSaving(false);
                        }
                      }}
                      className="w-full text-center py-2 bg-slate-900 hover:bg-black text-white font-mono text-[10px] font-bold uppercase tracking-wider rounded-lg border border-slate-950 transition cursor-pointer shadow-sm"
                    >
                      Enregistrer dans la fiche d'étude
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs italic font-mono select-none">
              Aucune adaptation générée en temps réel pour le moment. Choisissez votre langue d'apprentissage cible ci-dessus et cliquez sur "Traduire !".
            </div>
          )}
        </div>
      </div>

      {/* Structured multi-dimensional sub-tables */}
      <h3 className="text-base font-sans font-semibold text-slate-900 tracking-tight mt-10 pt-4 border-t border-slate-200">
        Trois Axes Fondamentaux d'Analyse Métrique (Suno & RAG Compliant)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Musical characteristics */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs hover:shadow-md transition duration-150 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-800 font-sans font-semibold border-b border-slate-100 pb-2.5 mb-2.5">
              <div className="w-7 h-7 rounded bg-blue-50 text-blue-600 border border-blue-100/40 flex items-center justify-center">
                <Music className="w-4 h-4" />
              </div>
              <h4>Métadonnées Musicales (Suno)</h4>
            </div>

            <table className="w-full text-xs font-mono text-slate-600 space-y-2">
              <tbody>
                <tr className="border-b border-slate-100 py-2 flex justify-between">
                  <td className="text-slate-400">Tempo :</td>
                  <td className="text-slate-800 font-semibold">{rhyme.music.tempo} BPM</td>
                </tr>
                <tr className="border-b border-slate-100 py-2 flex justify-between">
                  <td className="text-slate-400">Signature rythmique :</td>
                  <td className="text-slate-800 font-semibold">{rhyme.music.meter}</td>
                </tr>
                <tr className="border-b border-slate-100 py-2 flex justify-between">
                  <td className="text-slate-400">Atmosphère / Mood :</td>
                  <td className="text-slate-800 font-semibold">{rhyme.music.mood}</td>
                </tr>
                <tr className="border-b border-slate-100 py-2 flex justify-between">
                  <td className="text-slate-400">Cadence rythmique :</td>
                  <td className="text-slate-800 font-semibold text-right truncate max-w-[150px]" title={rhyme.music.cadence}>{rhyme.music.cadence}</td>
                </tr>
                <tr className="border-b border-slate-100 py-2 flex justify-between">
                  <td className="text-slate-400">Appel-Réponse (A-R) :</td>
                  <td className="text-slate-800 font-semibold">{rhyme.music.call_response ? "Oui" : "Non"}</td>
                </tr>
                <tr className="border-b border-slate-100 py-2 flex justify-between">
                  <td className="text-slate-400">Degré d'allitérations répétitives :</td>
                  <td className="text-slate-800 font-semibold">{rhyme.music.repetition_level}</td>
                </tr>
                <tr className="py-2 flex justify-between">
                  <td className="text-slate-400">Complexité Mélodique :</td>
                  <td className="text-slate-800 font-semibold">{rhyme.music.melody_complexity}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Linguistic specifications */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs hover:shadow-md transition duration-150 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-800 font-sans font-semibold border-b border-slate-100 pb-2.5 mb-2.5">
              <div className="w-7 h-7 rounded bg-blue-50 text-blue-650 border border-blue-100/40 flex items-center justify-center">
                <Languages className="w-4 h-4" />
              </div>
              <h4>Métadonnées Linguistiques</h4>
            </div>

            <table className="w-full text-xs font-mono text-slate-600">
              <tbody>
                <tr className="border-b border-slate-100 py-2 flex justify-between">
                  <td className="text-slate-400">Niveau vocabulaire :</td>
                  <td className="text-slate-800 font-semibold">{rhyme.linguistics.vocabulary_level}</td>
                </tr>
                <tr className="border-b border-slate-100 py-2 flex justify-between">
                  <td className="text-slate-400">Patrons phonétiques :</td>
                  <td className="text-slate-800 font-semibold text-right truncate max-w-[150px]" title={rhyme.linguistics.phonetic_patterns}>{rhyme.linguistics.phonetic_patterns}</td>
                </tr>
                <tr className="border-b border-slate-100 py-2 flex justify-between">
                  <td className="text-slate-400">Compte syllabique moyen :</td>
                  <td className="text-slate-800 font-semibold">{rhyme.linguistics.syllable_count} syllabes</td>
                </tr>
                <tr className="border-b border-slate-100 py-2 flex justify-between">
                  <td className="text-slate-400">Schéma des rimes :</td>
                  <td className="text-slate-800 font-semibold">{rhyme.linguistics.rhyme_scheme}</td>
                </tr>
                <tr className="py-2 flex justify-between">
                  <td className="text-slate-400">Présence d'allitérations :</td>
                  <td className="text-slate-800 font-semibold">{rhyme.linguistics.alliteration ? "Active" : "Inhibée"}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-slate-50 border border-slate-100 p-2.5 rounded text-[10px] font-mono leading-tight text-slate-500 mt-4">
            Ces métadonnées permettent à un RAG d'ajuster dynamiquement l'évaluation de la fluidité d'un enfant d'après sa vitesse de récitation.
          </div>
        </div>

        {/* Culture / Heritage preservation status */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs hover:shadow-md transition duration-150 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-800 font-sans font-semibold border-b border-slate-100 pb-2.5 mb-2.5">
              <div className="w-7 h-7 rounded bg-blue-50 text-blue-650 border border-blue-100/40 flex items-center justify-center">
                <History className="w-4 h-4" />
              </div>
              <h4>Patrimoine Culturel Oral</h4>
            </div>

            <table className="w-full text-xs font-mono text-slate-650">
              <tbody>
                <tr className="border-b border-slate-100 py-2 flex justify-between">
                  <td className="text-slate-400">Période historique :</td>
                  <td className="text-slate-800 font-semibold">{rhyme.heritage.historical_period}</td>
                </tr>
                <tr className="border-b border-slate-100 py-2 flex justify-between">
                  <td className="text-slate-400">Régions géographiques :</td>
                  <td className="text-slate-800 font-semibold text-right truncate max-w-[150px]">{rhyme.heritage.region}</td>
                </tr>
                <tr className="border-b border-slate-100 py-2 flex justify-between">
                  <td className="text-slate-400">Pure tradition orale :</td>
                  <td className="text-slate-800 font-semibold">{rhyme.heritage.oral_tradition ? "Oui" : "Transcrit"}</td>
                </tr>
                <tr className="border-b border-slate-100 py-2 flex justify-between">
                  <td className="text-slate-400">Références biblio :</td>
                  <td className="text-slate-800 font-semibold text-right truncate max-w-[120px]" title={rhyme.heritage.references}>{rhyme.heritage.references || "Absente"}</td>
                </tr>
                <tr className="py-2 flex justify-between">
                  <td className="text-slate-400">Statut de préservation :</td>
                  <td className={`font-bold px-1.5 py-0.5 rounded text-[10px] border ${
                    rhyme.heritage.preservation_status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200/50" : 
                    rhyme.heritage.preservation_status === "Endangered" ? "bg-red-50 text-red-700 border-red-200/50" :
                    "bg-amber-50 text-amber-700 border-amber-200/50"
                  }`}>
                    {rhyme.heritage.preservation_status}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-slate-50 border border-slate-100 p-2.5 rounded text-[10px] font-mono leading-tight text-slate-500 mt-4">
            Le statut "Active" témoigne d'un chant réadapté à l'école maternelle, tandis que d'autres statuts requièrent des documentations urgentes.
          </div>
        </div>
      </div>
    </div>
  );
}
