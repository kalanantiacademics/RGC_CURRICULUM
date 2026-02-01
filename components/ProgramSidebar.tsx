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

export function ProgramSidebar({ programs, selectedProgram, onSelect }: ProgramSidebarProps) {
  return (
    <div className="w-full md:w-64 flex-shrink-0 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0">
      <h3 className="hidden md:block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4 px-4">
        Programs
      </h3>
      {programs.map((program) => (
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
             selectedProgram === program &&  program.toUpperCase().includes("PYTHON") ? "text-black" : "text-white" // Yellow needs black text
          )}>
             {program.replace(/B2C_|B2B_|B2S_/g, "").replace(/_/g, " ")}
          </span>
        </button>
      ))}
    </div>
  );
}
