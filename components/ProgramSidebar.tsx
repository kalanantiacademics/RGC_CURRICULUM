"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgramSidebarProps {
  programs: string[];
  selectedProgram: string | null;
  onSelect: (program: string) => void;
}
// Helper to get color theme
const getProgramColor = (program: string) => {
  const p = program.toUpperCase();
  if (p.includes("PYTHON")) return "bg-brand-yellow";
  if (p.includes("SCRATCH")) return "bg-brand-green";
  if (p.includes("ROBLOX")) return "bg-brand-orange";
  if (p.includes("WEB")) return "bg-cyan-500";
  return "bg-brand-blue"; // default
};

const getShadowColor = (program: string) => {
  const p = program.toUpperCase();
  if (p.includes("PYTHON")) return "shadow-brand-yellow/20";
  if (p.includes("SCRATCH")) return "shadow-brand-green/20";
  if (p.includes("ROBLOX")) return "shadow-brand-orange/20";
  if (p.includes("WEB")) return "shadow-cyan-500/20";
  return "shadow-brand-blue/20";
};

export function ProgramSidebar({ programs, selectedProgram, onSelect, metadata }: ProgramSidebarProps & { metadata?: any }) {
  
  // Group programs by category
  const groupedPrograms = programs.reduce((acc, program) => {
    const cleanName = program.replace(/B2C_|B2B_|B2S_/g, "").replace(/_/g, " ").toLowerCase();
    // Find metadata key that matches the program name
    const metaKey = Object.keys(metadata || {}).find(key => cleanName.includes(key));
    const category = metaKey && metadata[metaKey]?.category ? metadata[metaKey].category : "Other";
    
    if (!acc[category]) acc[category] = [];
    acc[category].push(program);
    return acc;
  }, {} as Record<string, string[]>);

  // Define category order
  const CATEGORY_ORDER = ["C<>deplay", "Game-Dev", "App Lab", "Other"];

  // Sort categories based on predefined order
  const updateCategories = Object.keys(groupedPrograms).sort((a, b) => {
     const idxA = CATEGORY_ORDER.indexOf(a);
     const idxB = CATEGORY_ORDER.indexOf(b);
     return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
  });

  return (
    <div className="w-full md:w-64 flex-shrink-0 flex md:flex-col gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scroll-smooth">
      {updateCategories.map(category => {
          const categoryPrograms = groupedPrograms[category];
          if (categoryPrograms.length === 0) return null;
          
          return (
             <div key={category} className="flex-shrink-0">
                {category !== "Other" && (
                    <h3 className="hidden md:block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 px-4">
                        {category}
                    </h3>
                )}
                <div className="flex md:flex-col gap-2">
                    {categoryPrograms.map((program) => (
                        <button
                        key={program}
                        onClick={() => onSelect(program)}
                        className={cn(
                            "relative px-4 py-3 text-left rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap",
                            selectedProgram === program
                            ? cn("text-white shadow-lg", getShadowColor(program))
                            : "text-slate-400 hover:text-white hover:bg-white/10"
                        )}
                        >
                        {selectedProgram === program && (
                            <motion.div
                            layoutId="activeProgram"
                            className={cn("absolute inset-0 rounded-xl", getProgramColor(program))}
                            initial={false}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <span className={cn(
                            "relative z-10", 
                            selectedProgram === program &&  program.toUpperCase().includes("PYTHON") ? "text-black" : "text-white"
                        )}>
                            {program.replace(/B2C_|B2B_|B2S_/g, "").replace(/_/g, " ")}
                        </span>
                        </button>
                    ))}
                </div>
             </div>
          );
      })}
    </div>
  );
}
