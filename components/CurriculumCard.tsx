"use client";

import { motion } from "framer-motion";
interface CurriculumCardProps {
  title: string;
  description: string;
  order: string | number;
  // Optional visual tags could be added here
}

interface CurriculumCardProps {
  title: string;
  description: string;
  order: string | number;
  planetTheme?: string;
}

export function CurriculumCard({ 
  title, 
  description, 
  order,
  planetTheme
}: CurriculumCardProps) {
  return (
    <div 
        className="group relative h-full bg-[#1e293b]/40 border border-white/10 rounded-3xl p-6 overflow-hidden transition-all duration-300 hover:border-brand-yellow/50 hover:shadow-2xl hover:shadow-brand-yellow/10 cursor-pointer backdrop-blur-sm"
    >
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-yellow/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-blue-100 font-mono text-sm group-hover:bg-brand-yellow group-hover:text-black font-bold transition-all duration-300">
                {order}
              </div>
              {planetTheme && (
                  <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-fuchsia-500/10 text-fuchsia-400 rounded-full border border-fuchsia-500/20">
                    {planetTheme}
                  </span>
              )}
          </div>
          <div className="p-2 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity -mr-2 -mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M18 13v6a2 2 0 0 1 -2 2H5a2 2 0 0 1 -2 -2V8a2 2 0 0 1 2 -2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </div>
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-brand-yellow transition-colors line-clamp-2">
          {title}
        </h3>
        
        <p className="text-slate-300 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
          {description || "No description available."}
        </p>

        {/* Footer / Call to Action */}
        <div className="flex items-center text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-brand-yellow transition-colors mt-auto">
            View Details <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
        </div>
      </div>
    </div>
  );
}
