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
  AlertCircle
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
      <div className="bg-amber-50/60 border border-amber-100 rounded-lg p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-xs font-mono font-medium rounded bg-amber-100/80 text-amber-900 border border-amber-200">
              {rhyme.id}
            </span>
            <span className="px-2 py-0.5 text-xs font-mono font-medium rounded bg-stone-100 text-stone-700 border border-stone-200">
              {getLanguageLabel(rhyme.language)}
            </span>
            <span className="text-xs font-mono text-stone-500">
              {rhyme.origin.country} {rhyme.origin.region ? `(${rhyme.origin.region})` : ""}
            </span>
          </div>

          <h2 className="text-3xl font-serif font-semibold text-stone-900 tracking-tight">
            {rhyme.title}
          </h2>
          <p className="text-sm font-mono text-stone-600 mt-1">
            {getTypeLabel(rhyme.type)} • Âge conseillé: {rhyme.age_range.min} à {rhyme.age_range.max} ans
          </p>
        </div>

        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <button
                id="edit-rhyme-btn"
                onClick={startEdit}
                className="px-3.5 py-1.5 text-xs font-mono font-medium bg-stone-900 hover:bg-stone-800 text-white rounded transition flex items-center gap-1.5 shadow-sm"
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
                className="px-3.5 py-1.5 text-xs font-mono font-medium border border-red-200 hover:bg-red-50 text-red-600 rounded transition"
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
                className="px-3.5 py-1.5 text-xs font-mono font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded transition flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" /> Enregistrer
              </button>
              <button
                id="cancel-rhyme-btn"
                onClick={() => setIsEditing(false)}
                className="px-3.5 py-1.5 text-xs font-mono font-medium bg-stone-100 hover:bg-stone-200 text-stone-700 rounded border border-stone-200 transition"
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
        <div className="lg:col-span-8 bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 bg-stone-50 border-b border-stone-200 flex justify-between items-center">
            <h3 className="text-sm font-serif font-medium text-stone-800 tracking-tight flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-600" /> Paroles de l'Œuvre Originale
            </h3>
            {isEditing && <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">Modification active</span>}
          </div>

          <div className="p-6 md:p-8 flex-1 flex flex-col md:flex-row gap-6 md:gap-8 bg-[url('https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=150&auto=format&fit=crop')] bg-repeat bg-opacity-5">
            {isEditing ? (
              <div className="w-full space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-stone-600 mb-1 font-bold">Titre :</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded focus:ring-1 focus:ring-amber-500 text-stone-900"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-stone-600 mb-1 font-bold">Type :</label>
                    <select
                      value={editType}
                      onChange={(e) => setEditType(e.target.value as any)}
                      className="w-full p-2 border border-stone-300 rounded focus:ring-1 focus:ring-amber-500 text-stone-900 bg-white"
                    >
                      <option value="nursery_rhyme">Comptine</option>
                      <option value="lullaby">Berceuse</option>
                      <option value="counting_rhyme">Chant de calcul</option>
                      <option value="clapping_game">Jeu de mains</option>
                      <option value="game_song">Jeu de geste</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-stone-600 mb-1 font-bold">Âge Min :</label>
                    <input
                      type="number"
                      value={editMinAge}
                      onChange={(e) => setEditMinAge(Number(e.target.value))}
                      className="w-full p-2 border border-stone-300 rounded focus:ring-1 focus:ring-amber-500 text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 mb-1 font-bold">Âge Max :</label>
                    <input
                      type="number"
                      value={editMaxAge}
                      onChange={(e) => setEditMaxAge(Number(e.target.value))}
                      className="w-full p-2 border border-stone-300 rounded focus:ring-1 focus:ring-amber-500 text-stone-900"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-600 mb-1 font-bold">Paroles Originales :</label>
                    <textarea
                      rows={10}
                      value={editLyrics}
                      onChange={(e) => setEditLyrics(e.target.value)}
                      className="w-full p-2 border border-stone-300 rounded focus:ring-1 focus:ring-amber-500 font-mono text-xs text-stone-900 leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 mb-1 font-bold">Traduction / Notes (fr) :</label>
                    <textarea
                      rows={10}
                      value={editTranslation}
                      onChange={(e) => setEditTranslation(e.target.value)}
                      className="w-full p-2 border border-stone-300 rounded focus:ring-1 focus:ring-amber-500 font-mono text-xs text-stone-900 leading-relaxed"
                      placeholder="Traduction optionnelle en français pour l'utilisateur..."
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Original lyrics */}
                <div className="flex-1">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-stone-400 block mb-2">Original ({getLanguageLabel(rhyme.language)})</span>
                  <div className="whitespace-pre-line text-stone-800 font-serif text-lg leading-relaxed italic bg-amber-50/20 p-4 border-l-2 border-amber-300/60 rounded-r-md">
                    {rhyme.lyrics_original}
                  </div>
                </div>

                {/* French translate side by side */}
                {rhyme.translation_fr && rhyme.language !== "fr" && (
                  <div className="flex-1 border-t md:border-t-0 md:border-l border-stone-200 pt-6 md:pt-0 md:pl-6">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-stone-400 block mb-2">Traduction d'Étude (fr)</span>
                    <div className="whitespace-pre-line text-stone-600 font-sans text-sm leading-relaxed p-4 bg-stone-50/50 rounded border border-stone-100">
                      {rhyme.translation_fr}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="px-5 py-3 bg-stone-50 border-t border-stone-100 flex flex-wrap gap-2">
            <span className="text-xs font-mono text-stone-400 self-center">Domaines d'apprentissage essentiels :</span>
            {rhyme.skills.map((skill) => (
              <span key={skill} className="px-2 py-0.5 text-xs font-mono bg-stone-200 text-stone-700 rounded capitalize">
                {skill.replace("_", " ")}
              </span>
            ))}
          </div>
        </div>

        {/* Audio profile and tempo ticker on the right */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-stone-900 text-stone-100 p-5 rounded-lg border border-stone-800 shadow-lg relative overflow-hidden flex flex-col justify-between h-48">
            <div className="absolute right-[-15px] top-[-15px] opacity-10">
              <Music className="w-40 h-40" />
            </div>

            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#d9a05b] font-semibold">Profil Acoustique de Suno</span>
                <h4 className="text-xl font-serif font-medium mt-1 text-white">Analyse des Ondes</h4>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#d0833b]/20 flex items-center justify-center text-[#d9a05b]">
                <Volume2 className="w-5 h-5 animate-pulse" />
              </div>
            </div>

            {/* Custom animated simulated tempo waves */}
            <div className="flex items-end gap-1 px-2 py-3" style={{ height: "45px" }}>
              <div className="w-1 bg-[#d0833b] rounded" style={{ height: "30%", animate: "pulse" }}></div>
              <div className="w-1 bg-[#e0aa62] rounded" style={{ height: "60%" }}></div>
              <div className="w-1 bg-[#d0833b] rounded" style={{ height: "95%" }}></div>
              <div className="w-1 bg-stone-700 rounded" style={{ height: "15%" }}></div>
              <div className="w-1 bg-[#d0833b] rounded" style={{ height: "50%" }}></div>
              <div className="w-1 bg-[#e0aa62] rounded" style={{ height: "80%" }}></div>
              <div className="w-1 bg-[#d0833b] rounded" style={{ height: "40%" }}></div>
              <div className="w-1 bg-stone-700 rounded" style={{ height: "20%" }}></div>
              <div className="w-1 bg-[#d0833b] rounded" style={{ height: "70%" }}></div>
              <div className="w-1 bg-[#e0aa62] rounded" style={{ height: "60%" }}></div>
              <div className="w-1 bg-[#d0833b] rounded" style={{ height: "100%" }}></div>
              <div className="w-1 bg-[#e0aa62] rounded" style={{ height: "45%" }}></div>
              <div className="w-1 bg-stone-700 rounded" style={{ height: "10%" }}></div>
              <div className="w-1 bg-[#d0833b] rounded" style={{ height: "80%" }}></div>
              <div className="w-1 bg-[#e0aa62] rounded" style={{ height: "90%" }}></div>
              <div className="w-1 bg-stone-700 rounded" style={{ height: "30%" }}></div>
              <div className="w-1 bg-[#d0833b] rounded" style={{ height: "55%" }}></div>
              <div className="w-1 bg-[#e0aa62] rounded" style={{ height: "70%" }}></div>
              <div className="w-1 bg-[#d0833b] rounded" style={{ height: "25%" }}></div>
              <div className="w-1 bg-stone-700 rounded" style={{ height: "15%" }}></div>
              <div className="w-1 bg-[#d0833b] rounded" style={{ height: "40%" }}></div>
              <div className="w-1 bg-[#e0aa62] rounded" style={{ height: "85%" }}></div>
              <div className="w-1 bg-[#d0833b] rounded" style={{ height: "60%" }}></div>
              <div className="w-1 bg-stone-700 rounded" style={{ height: "20%" }}></div>
            </div>

            <div className="flex justify-between items-center border-t border-stone-800 pt-3">
              <span className="font-mono text-xs text-stone-400">Tempo de Battement :</span>
              <span className="font-mono text-sm text-[#e0aa62] font-semibold">{rhyme.music.tempo} BPM ({rhyme.music.mood})</span>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-sm space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100 pb-2">Cognitive Core Taxonomy</h4>
            <div className="flex flex-wrap gap-1.5">
              {rhyme.cognitive_tags.map(tag => (
                <span key={tag} className="px-2 py-1 text-xs font-mono font-medium rounded-full bg-amber-50 text-amber-900 border border-amber-100">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Structured multi-dimensional sub-tables */}
      <h3 className="text-base font-serif font-medium text-stone-900 tracking-tight mt-10 pt-4 border-t border-stone-200">
        Trois Axes Fondamentaux d'Analyse Métrique (Suno & RAG Compliant)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Musical characteristics */}
        <div className="bg-stone-50/50 border border-stone-200 p-5 rounded-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-stone-800 font-serif font-medium border-b border-stone-200 pb-2.5 mb-2.5">
              <div className="w-7 h-7 rounded bg-amber-100 text-amber-800 flex items-center justify-center">
                <Music className="w-4 h-4" />
              </div>
              <h4>Métadonnées Musicales (Suno)</h4>
            </div>

            <table className="w-full text-xs font-mono text-stone-600 space-y-2">
              <tbody>
                <tr className="border-b border-stone-150/50 py-1.5 flex justify-between">
                  <td className="text-stone-400">Tempo :</td>
                  <td className="text-stone-950 font-bold">{rhyme.music.tempo} BPM</td>
                </tr>
                <tr className="border-b border-stone-150/50 py-1.5 flex justify-between">
                  <td className="text-stone-400">Signature rythmique :</td>
                  <td className="text-stone-950 font-bold">{rhyme.music.meter}</td>
                </tr>
                <tr className="border-b border-stone-150/50 py-1.5 flex justify-between">
                  <td className="text-stone-400">Atmosphère / Mood :</td>
                  <td className="text-stone-950 font-bold">{rhyme.music.mood}</td>
                </tr>
                <tr className="border-b border-stone-150/50 py-1.5 flex justify-between">
                  <td className="text-stone-400">Cadence rythmique :</td>
                  <td className="text-stone-950 font-bold text-right truncate max-w-[150px]" title={rhyme.music.cadence}>{rhyme.music.cadence}</td>
                </tr>
                <tr className="border-b border-stone-150/50 py-1.5 flex justify-between">
                  <td className="text-stone-400">Appel-Réponse (A-R) :</td>
                  <td className="text-stone-950 font-bold">{rhyme.music.call_response ? "Oui" : "Non"}</td>
                </tr>
                <tr className="border-b border-stone-150/50 py-1.5 flex justify-between">
                  <td className="text-stone-400">Degré d'allitérations répétitives :</td>
                  <td className="text-stone-950 font-bold">{rhyme.music.repetition_level}</td>
                </tr>
                <tr className="py-1.5 flex justify-between">
                  <td className="text-stone-400">Complexité Mélodique :</td>
                  <td className="text-stone-950 font-bold">{rhyme.music.melody_complexity}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Linguistic specifications */}
        <div className="bg-stone-50/50 border border-stone-200 p-5 rounded-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-stone-800 font-serif font-medium border-b border-stone-200 pb-2.5 mb-2.5">
              <div className="w-7 h-7 rounded bg-amber-100 text-amber-800 flex items-center justify-center">
                <Languages className="w-4 h-4" />
              </div>
              <h4>Métadonnées Linguistiques</h4>
            </div>

            <table className="w-full text-xs font-mono text-stone-600">
              <tbody>
                <tr className="border-b border-stone-150/50 py-1.5 flex justify-between">
                  <td className="text-stone-400">Niveau vocabulaire :</td>
                  <td className="text-stone-950 font-bold">{rhyme.linguistics.vocabulary_level}</td>
                </tr>
                <tr className="border-b border-stone-150/50 py-1.5 flex justify-between">
                  <td className="text-stone-400">Patrons phonétiques :</td>
                  <td className="text-stone-950 font-bold text-right truncate max-w-[150px]" title={rhyme.linguistics.phonetic_patterns}>{rhyme.linguistics.phonetic_patterns}</td>
                </tr>
                <tr className="border-b border-stone-150/50 py-1.5 flex justify-between">
                  <td className="text-stone-400">Compte syllabique moyen :</td>
                  <td className="text-stone-950 font-bold">{rhyme.linguistics.syllable_count} syllabes</td>
                </tr>
                <tr className="border-b border-stone-150/50 py-1.5 flex justify-between">
                  <td className="text-stone-400">Schéma des rimes :</td>
                  <td className="text-stone-950 font-bold">{rhyme.linguistics.rhyme_scheme}</td>
                </tr>
                <tr className="py-1.5 flex justify-between">
                  <td className="text-stone-400">Présence d'allitérations :</td>
                  <td className="text-stone-950 font-bold">{rhyme.linguistics.alliteration ? "Active" : "Inhibée"}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-stone-100 p-2.5 rounded text-[10px] font-mono leading-tight text-stone-500 mt-4">
            Ces métadonnées permettent à un RAG d'ajuster dynamiquement l'évaluation de la fluidité d'un enfant d'après sa vitesse de récitation.
          </div>
        </div>

        {/* Culture / Heritage preservation status */}
        <div className="bg-stone-50/50 border border-stone-200 p-5 rounded-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-stone-800 font-serif font-medium border-b border-stone-200 pb-2.5 mb-2.5">
              <div className="w-7 h-7 rounded bg-amber-100 text-amber-800 flex items-center justify-center">
                <History className="w-4 h-4" />
              </div>
              <h4>Patrimoine Culturel Oral</h4>
            </div>

            <table className="w-full text-xs font-mono text-stone-600">
              <tbody>
                <tr className="border-b border-stone-150/50 py-1.5 flex justify-between">
                  <td className="text-stone-400">Période historique :</td>
                  <td className="text-stone-950 font-bold">{rhyme.heritage.historical_period}</td>
                </tr>
                <tr className="border-b border-stone-150/50 py-1.5 flex justify-between">
                  <td className="text-stone-400">Régions géographiques :</td>
                  <td className="text-stone-950 font-bold text-right truncate max-w-[150px]">{rhyme.heritage.region}</td>
                </tr>
                <tr className="border-b border-stone-150/50 py-1.5 flex justify-between">
                  <td className="text-stone-400">Pure tradition orale :</td>
                  <td className="text-stone-950 font-bold">{rhyme.heritage.oral_tradition ? "Oui" : "Transcrit"}</td>
                </tr>
                <tr className="border-b border-stone-150/50 py-1.5 flex justify-between">
                  <td className="text-stone-400">Références biblio :</td>
                  <td className="text-stone-950 font-bold text-right truncate max-w-[120px]" title={rhyme.heritage.references}>{rhyme.heritage.references || "Absente"}</td>
                </tr>
                <tr className="py-1.5 flex justify-between">
                  <td className="text-stone-400">Statut de préservation :</td>
                  <td className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                    rhyme.heritage.preservation_status === "Active" ? "bg-emerald-50 text-emerald-850" : 
                    rhyme.heritage.preservation_status === "Endangered" ? "bg-red-50 text-red-850" :
                    "bg-amber-50 text-amber-850"
                  }`}>
                    {rhyme.heritage.preservation_status}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-stone-100 p-2.5 rounded text-[10px] font-mono leading-tight text-stone-500 mt-4">
            Le statut "Active" témoigne d'un chant réadapté à l'école maternelle, tandis que d'autres statuts requièrent des documentations urgentes.
          </div>
        </div>
      </div>
    </div>
  );
}
