import React, { useState } from "react";
import { NurseryRhyme, AIVariants } from "../types";
import { 
  Brain, 
  Sparkles, 
  Lightbulb, 
  Calculator, 
  Languages, 
  Award, 
  TrendingUp, 
  HeartPulse, 
  Heart, 
  Leaf, 
  Copy, 
  Check,
  ClipboardCheck,
  FolderLock
} from "lucide-react";

interface VariantsViewProps {
  rhyme: NurseryRhyme;
}

export default function VariantsView({ rhyme }: VariantsViewProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const pillars = [
    {
      id: "cognitive",
      label: "Cognitive (Mémorisation & Focus)",
      icon: Brain,
      color: "bg-purple-50 text-purple-900 border-purple-200",
      iconColor: "text-purple-600 bg-purple-100",
      content: rhyme.ai_variants?.cognitive || "Générer cette variante dans le Studio de Prompt."
    },
    {
      id: "creativity",
      label: "Creativity (Arts & Théâtre)",
      icon: Sparkles,
      color: "bg-pink-50 text-pink-900 border-pink-200",
      iconColor: "text-pink-600 bg-pink-100",
      content: rhyme.ai_variants?.creativity || "Générer cette variante dans le Studio de Prompt."
    },
    {
      id: "science",
      label: "Science (Inquiry & Nature)",
      icon: Lightbulb,
      color: "bg-blue-50 text-blue-900 border-blue-200",
      iconColor: "text-blue-600 bg-blue-100",
      content: rhyme.ai_variants?.science || "Générer cette variante dans le Studio de Prompt."
    },
    {
      id: "mathematics",
      label: "Mathematics (Régularité & Énumération)",
      icon: Calculator,
      color: "bg-emerald-50 text-emerald-900 border-emerald-200",
      iconColor: "text-emerald-600 bg-emerald-100",
      content: rhyme.ai_variants?.mathematics || "Générer cette variante dans le Studio de Prompt."
    },
    {
      id: "language",
      label: "Language (Multilinguisme & Fluidité)",
      icon: Languages,
      color: "bg-indigo-50 text-indigo-900 border-indigo-200",
      iconColor: "text-indigo-600 bg-indigo-100",
      content: rhyme.ai_variants?.language || "Générer cette variante dans le Studio de Prompt."
    },
    {
      id: "leadership",
      label: "Leadership (Responsabilisation de groupe)",
      icon: Award,
      color: "bg-amber-50 text-amber-900 border-amber-200",
      iconColor: "text-amber-600 bg-amber-100",
      content: rhyme.ai_variants?.leadership || "Générer cette variante dans le Studio de Prompt."
    },
    {
      id: "entrepreneurship",
      label: "Entrepreneurship (Autonomie & Projets)",
      icon: TrendingUp,
      color: "bg-teal-50 text-teal-900 border-teal-200",
      iconColor: "text-teal-600 bg-teal-100",
      content: rhyme.ai_variants?.entrepreneurship || "Générer cette variante dans le Studio de Prompt."
    },
    {
      id: "health",
      label: "Health (Dépense motrice & Respiration)",
      icon: HeartPulse,
      color: "bg-rose-50 text-rose-900 border-rose-200",
      iconColor: "text-rose-600 bg-rose-100",
      content: rhyme.ai_variants?.health || "Générer cette variante dans le Studio de Prompt."
    },
    {
      id: "emotional_intelligence",
      label: "Emotional Intelligence (Empathie & Affets)",
      icon: Heart,
      color: "bg-red-50 text-red-900 border-red-200",
      iconColor: "text-red-600 bg-red-100",
      content: rhyme.ai_variants?.emotional_intelligence || "Générer cette variante dans le Studio de Prompt."
    },
    {
      id: "environmental_awareness",
      label: "Environmental (Biodiversité & Nature)",
      icon: Leaf,
      color: "bg-green-50 text-green-900 border-green-200",
      iconColor: "text-green-600 bg-green-100",
      content: rhyme.ai_variants?.environmental_awareness || "Générer cette variante dans le Studio de Prompt."
    }
  ];

  const handleCopy = (id: string, text: string) => {
    const formattedPrompt = `[COGNITIVE CORPUS PROMPT - ${id.toUpperCase()}]
Comptine: ${rhyme.title}
Langue d'origine: ${rhyme.language}
Sujet d'activité: ${text}
Veuillez formuler un script d'animation parent-enfant inspiré de cette description.`;
    
    navigator.clipboard.writeText(formattedPrompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6" id="variants-view-container">
      {/* Overview stats info */}
      <div className="bg-amber-50/40 border border-amber-100 rounded-lg p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-serif font-semibold text-stone-900 tracking-tight flex items-center gap-1.5">
            <Sparkles className="w-5 h-5 text-amber-600" /> Les 10 Variantes Éducatives IA (Remasteriseur)
          </h3>
          <p className="text-xs font-sans text-stone-600 leading-relaxed max-w-2xl">
            L'IA a remasterisé cette œuvre traditionnelle orale en 10 variations d'activités complémentaires. Chaque pilier cible une facette distinctive de la croissance motrice, logique et empathique de l'enfant.
          </p>
        </div>
        <div className="font-mono text-[10px] text-stone-500 bg-stone-100 px-3 py-1.5 rounded border border-stone-200 shrink-0">
          Clonage Pédagogique : Actif
        </div>
      </div>

      {/* Grid listing the 10 pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pillars.map((pillar) => {
          const IconComponent = pillar.icon;
          return (
            <div 
              key={pillar.id} 
              className={`p-5 rounded-lg border flex flex-col justify-between transition-all hover:shadow-sm ${pillar.color}`}
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${pillar.iconColor}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="font-serif font-medium text-sm text-stone-950">
                      {pillar.label}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopy(pillar.id, pillar.content)}
                    className="p-1 px-2 rounded bg-white hover:bg-stone-50 border border-stone-200 text-stone-500 hover:text-stone-700 transition flex items-center gap-1 text-[10px] font-mono shrink-0"
                    title="Copier le prompt de cette variante"
                  >
                    {copiedId === pillar.id ? (
                      <>
                        <ClipboardCheck className="w-3 h-3 text-emerald-600" /> Copié
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Prompt
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs font-sans text-stone-700 leading-relaxed pl-1">
                  {pillar.content}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-stone-200/40 text-[10px] font-mono text-stone-400 flex justify-between items-center">
                <span>Réf: RAG_ID_{rhyme.id}_{pillar.id.toUpperCase()}</span>
                <span>Statut: Intégré</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
