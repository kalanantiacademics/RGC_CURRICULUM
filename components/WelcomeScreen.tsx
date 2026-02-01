"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface WelcomeScreenProps {
  programs: string[];
  onSelect: (program: string) => void;
}

export function WelcomeScreen({ programs, onSelect }: WelcomeScreenProps) {
  // Asset URLs provided
  const ASSETS = {
    rocket: "https://cdn-web-2.ruangguru.com/landing-pages/assets/6efdf045-19f7-4d90-8a14-cf797238f73d.png",
    bg: "https://cdn-web-2.ruangguru.com/landing-pages/assets/5bd0bb1f-e1fc-4b00-a259-3cb7e75c1ef7.png",
    // Randomly pick a few characters or use specific ones for decor
    char1: "https://cdn-web-2.ruangguru.com/landing-pages/assets/f4f3742f-8665-44a7-a0cd-d1b67ff66891.png",
    char2: "https://cdn-web-2.ruangguru.com/landing-pages/assets/ffe50479-bbb6-4e7d-85f6-a7df578f7423.png",
    char3: "https://cdn-web-2.ruangguru.com/landing-pages/assets/0f3699f5-c396-42b4-9282-e26736556932.png",
  };

  return (
    <div className="min-h-screen bg-brand-blue relative overflow-hidden flex flex-col items-center justify-center p-8">
      {/* Background Layer */}
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://cdn-web-2.ruangguru.com/landing-pages/assets/5bd0bb1f-e1fc-4b00-a259-3cb7e75c1ef7.png')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/80 via-brand-blue/50 to-brand-blue"></div>
      </div>

      {/* Floating Elements */}
      <motion.img
        src={ASSETS.rocket}
        alt="Rocket"
        className="absolute top-10 right-10 w-32 md:w-64 z-10 opacity-90 drop-shadow-[0_0_30px_rgba(253,128,36,0.6)]"
        animate={{
          y: [-20, 20, -20],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.img
         src={ASSETS.char1}
         alt="Character"
         className="absolute bottom-0 left-10 w-40 md:w-80 z-10 opacity-100"
         initial={{ y: 200, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         transition={{ duration: 1, delay: 0.5 }}
      />
      
      <motion.img
        src={ASSETS.char2}
        alt="Character"
        className="absolute bottom-10 right-20 w-24 md:w-48 z-0 opacity-80 blur-[1px]"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 0.8 }}
        transition={{ duration: 1, delay: 0.8 }}
      />


      {/* Main Content */}
      <div className="relative z-20 max-w-5xl w-full flex flex-col items-center text-center">
        
        {/* Header Text */}
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
        >
            <div className="inline-block px-4 py-1 rounded-full bg-brand-yellow/20 border border-brand-yellow/50 text-brand-yellow font-bold text-sm tracking-wider uppercase mb-4 backdrop-blur-sm">
                Curriculum Portal
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight drop-shadow-lg">
                Welcome to <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow to-brand-orange">
                    Ruangguru Coding
                </span>
            </h1>
            <p className="text-brand-blue/20 text-lg md:text-xl font-medium mt-4 max-w-2xl mx-auto text-blue-100/80">
                Explore our world-class curriculum designed to inspire the next generation of creators.
            </p>
        </motion.div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
            {programs.length > 0 ? (
                programs.map((program, idx) => (
                    <motion.button
                        key={program}
                        onClick={() => onSelect(program)}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + (idx * 0.1) }}
                        whileHover={{ scale: 1.03, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative flex items-center p-6 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 hover:border-brand-yellow/50 transition-all text-left overflow-hidden"
                    >
                        {/* Hover Glow */}
                        <div className="absolute inset-0 bg-brand-yellow/0 group-hover:bg-brand-yellow/5 transition-colors duration-500" />
                        
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-green to-teal-500 flex items-center justify-center text-white shadow-lg shrink-0 mr-6 group-hover:scale-110 transition-transform duration-300">
                             <span className="text-2xl font-bold">{program.charAt(0)}</span>
                        </div>
                        
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-brand-yellow transition-colors">{program}</h3>
                            <p className="text-blue-100/60 text-sm">View Levels & Sessions</p>
                        </div>

                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/50 group-hover:bg-brand-orange group-hover:text-white transition-all">
                            <ChevronRight className="w-5 h-5" />
                        </div>
                    </motion.button>
                ))
            ) : (
                <div className="col-span-2 text-white/50 animate-pulse">Loading Programs...</div>
            )}
        </div>

      </div>
      
      {/* Logos Layer (Absolute) - As requested for branding */}
      {/* Note: In page.tsx layout, these might be handled by the header, but strictly for Welcome Screen context: */}
      {/* We will leave the main logos to page.tsx header to ensure consistency across transitions, 
          but adding decorative branding here if needed. User asked for specific placement in dashboard, 
          let's ensure page.tsx handles global Layout headers. 
      */}

      <div className="absolute bottom-8 text-center z-20">
         <p className="text-white/30 text-xs uppercase tracking-widest font-bold">
            Powered by Kalananti & Ruangguru
         </p>
      </div>
    </div>
  );
}
