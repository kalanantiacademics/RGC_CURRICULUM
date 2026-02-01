"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LevelTabsProps {
  levels: { id: string, label: string }[];
  selectedLevel: string | null;
  onSelect: (level: string) => void;
}

export function LevelTabs({ levels, selectedLevel, onSelect }: LevelTabsProps) {
  if (levels.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {levels.map((level) => (
        <button
          key={level.id}
          onClick={() => onSelect(level.id)}
          className={cn(
            "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0",
             selectedLevel === level.id
              ? "text-white"
              : "text-slate-400 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10"
          )}
        >
          {selectedLevel === level.id && (
            <motion.div
              layoutId="activeLevel"
              className="absolute inset-0 bg-gradient-to-r from-brand-yellow to-brand-orange rounded-full -z-10 shadow-lg shadow-brand-orange/20"
              initial={false}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          {level.label}
        </button>
      ))}
    </div>
  );
}
