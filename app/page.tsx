"use client";

import { useEffect, useState, useMemo } from "react";
import { CurriculumCard } from "@/components/CurriculumCard";
import { ProgramSidebar } from "@/components/ProgramSidebar";
import { LevelTabs } from "@/components/LevelTabs";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { fetchCurriculum, CurriculumItem } from "@/lib/api";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SessionDetailModal } from "@/components/SessionDetailModal";
import { AuthOverlay } from "@/components/AuthOverlay";
import { Search, ChevronRight } from "lucide-react";

export default function Home() {
  const [data, setData] = useState<CurriculumItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>("Trial Class");
  
  // Modal State
  const [selectedSession, setSelectedSession] = useState<CurriculumItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teacherName, setTeacherName] = useState<string | null>(null);

  // Auto-logout after 1 hour (3600000 ms)
  useEffect(() => {
    if (teacherName) {
      const timer = setTimeout(() => {
        setTeacherName(null);
        alert("Session expired. Please log in again.");
      }, 3600000); // 1 Hour

      return () => clearTimeout(timer);
    }
  }, [teacherName]);

  // Asset URLs
  const ASSETS = {
    rocket: "https://cdn-web-2.ruangguru.com/landing-pages/assets/6efdf045-19f7-4d90-8a14-cf797238f73d.png",
    bg: "https://cdn-web-2.ruangguru.com/landing-pages/assets/5bd0bb1f-e1fc-4b00-a259-3cb7e75c1ef7.png",
    char1: "https://cdn-web-2.ruangguru.com/landing-pages/assets/555e14a0-4087-4d33-9c20-4d822bef5dac.png",
    char2: "https://cdn-web-2.ruangguru.com/landing-pages/assets/ffe50479-bbb6-4e7d-85f6-a7df578f7423.png",
  };

  useEffect(() => {
    async function loadData() {
      try {
        const result = await fetchCurriculum();
        setData(result);
      } catch (err) {
        setError("Failed to load curriculum data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Sort Order & Age Metadata
  const PROGRAM_METADATA: Record<string, { age: string; order: number }> = {
    "scratchjr": { age: "5-6 Tahun", order: 1 },
    "scratch": { age: "7-12 Tahun", order: 2 },
    "minecraft": { age: "7-9 Tahun", order: 3 },
    "roblox studio": { age: "10-15 Tahun", order: 4 },
    "roblox": { age: "10-15 Tahun", order: 4 },
    "diy robotik": { age: "7-12 Tahun", order: 5 },
    "diy robotic": { age: "7-12 Tahun", order: 5 },
    "micro:bit robotic": { age: "7-15 Tahun", order: 6 },
    "microbit robotic": { age: "7-15 Tahun", order: 6 },
    "microbit": { age: "7-15 Tahun", order: 6 },
    "micro:bit": { age: "7-15 Tahun", order: 6 },
    "yahboom": { age: "7-15 Tahun", order: 6 },
    "app inventor": { age: "13-15 Tahun", order: 7 },
    "python": { age: "15-18 Tahun", order: 8 },
  };

  const getCleanName = (pid: string) => pid.replace(/B2C_|B2B_|B2S_/g, "").replace(/_/g, " ");

  // Extract unique Programs
  const programs = useMemo(() => {
    // Filter out items without program_id just in case
    const uniquePrograms = Array.from(new Set(data.map(item => item.program_id))).filter(Boolean);
    
    return uniquePrograms.sort((a, b) => {
        const nameA = getCleanName(a).toLowerCase();
        const nameB = getCleanName(b).toLowerCase();
        
        const metaA = Object.entries(PROGRAM_METADATA).find(([key]) => nameA.includes(key))?.[1] || { order: 99 };
        const metaB = Object.entries(PROGRAM_METADATA).find(([key]) => nameB.includes(key))?.[1] || { order: 99 };
        
        return metaA.order - metaB.order;
    });
  }, [data]);

  // Extract Levels for selected Program
  const levels = useMemo(() => {
     if (!selectedProgram) return [];
     const programItems = data.filter(item => item.program_id === selectedProgram);
     
     // Group by level_id to get theme and uniqueness
     const levelMap = new Map<string, string>(); // level_id -> planet_theme
     
     programItems.forEach(item => {
         if(!levelMap.has(item.level_id)) {
             levelMap.set(item.level_id, item.planet_theme);
         }
     });

     const uniqueLevelIds = Array.from(levelMap.keys());
     
     // Custom sort
     const sortedIds = uniqueLevelIds.sort((a, b) => {
        if (a === "Trial Class") return -1;
        if (b === "Trial Class") return 1;
        return String(a).localeCompare(String(b), undefined, { numeric: true });
     });
     
     return sortedIds.map(id => {
         const theme = levelMap.get(id);
         let label = id;
         if (id !== "Trial Class" && theme) {
             label = `${id} - ${theme}`;
         }
         return { id, label };
     });
  }, [data, selectedProgram]);

  // Group content by Unit for display
  const groupedContent = useMemo(() => {
    if (!selectedProgram || !selectedLevel) return [];
    
    // First, filter and sort the flat list
    const sortedItems = data
      .filter(item => item.program_id === selectedProgram && item.level_id === selectedLevel)
      .sort((a, b) => Number(a.session_order) - Number(b.session_order));

    // Then group by unit_name
    const groups: { unit: string; items: CurriculumItem[] }[] = [];
    
    sortedItems.forEach(item => {
        const unitName = item.unit_name || "General";
        const lastGroup = groups[groups.length - 1];
        
        if (lastGroup && lastGroup.unit === unitName) {
            lastGroup.items.push(item);
        } else {
            groups.push({ unit: unitName, items: [item] });
        }
    });
    
    return groups;
  }, [data, selectedProgram, selectedLevel]);

  // Reset level when program changes
  const handleProgramSelect = (program: string) => {
    setSelectedProgram(program);
    setSelectedLevel("Trial Class"); 
  };

  const handleCardClick = (item: CurriculumItem) => {
      setSelectedSession(item);
      setIsModalOpen(true);
  };

  const welcomeMotionProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
      };

  const programCardMotionProps = (delay: number) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay },
          whileHover: { scale: 1.02, y: -5 },
        };

  const levelTransitionProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
        transition: { duration: 0.2 },
      };

  const sessionCardMotionProps = shouldReduceMotion
    ? {}
    : {
        whileHover: { scale: 1.02 },
        transition: { type: "spring", stiffness: 300, damping: 20 },
      };

  return (
    <div className="min-h-screen w-screen bg-[#020617] text-white font-sans selection:bg-brand-yellow/30 overflow-hidden relative">
        
        {/* Render Modal */}
        <SessionDetailModal 
            session={selectedSession} 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
        />
        
        {/* Auth Overlay */}
        {!teacherName && (
            <AuthOverlay onLogin={(name) => setTeacherName(name)} />
        )}
        
      <div className="w-full flex flex-col md:flex-row h-screen relative z-10">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-[#0F172A] border-b md:border-b-0 md:border-r border-white/10 p-4 md:p-6 overflow-y-auto z-20 shrink-0 flex flex-col">
            {/* Desktop Brand Header */}
            <div className="mb-8 hidden md:block pl-2">
                 <img 
                    src="https://uob-1328237036.cos.ap-singapore.myqcloud.com//file-uploader/images/94907efd-30d9-49af-8e62-aa4aee51ad33.png" 
                    alt="RG Coding" 
                    loading="lazy"
                    decoding="async"
                    className="h-16 object-contain mb-4 drop-shadow-md brightness-110" // Increased brightness
                />
            </div>

            <div className="flex-1">
                {loading ? (
                    <div className="animate-pulse space-y-4">
                        {[1,2,3].map(i => <div key={i} className="h-10 bg-white/5 rounded-xl"/>)}
                    </div>
                ) : (
                    <ProgramSidebar 
                        programs={programs} 
                        selectedProgram={selectedProgram}
                        onSelect={handleProgramSelect}
                    />
                )}
            </div>

            {/* Sidebar Decor Asset */}
            <div className="relative mt-4 hidden md:flex justify-center pointer-events-none">
                 <img 
                    src="https://cdn-web-2.ruangguru.com/landing-pages/assets/41512315-979e-43c3-b6b8-5ba139b687f8.png" 
                    alt="Decor"
                    loading="lazy"
                    decoding="async"
                    className="w-48 opacity-80 drop-shadow-lg"
                 />
            </div>
            
            {selectedProgram && (
                <button
                    onClick={() => setSelectedProgram(null)}
                    className="mt-4 text-xs font-bold text-slate-400 hover:text-white uppercase tracking-widest flex items-center gap-2 transition-colors z-10"
                >
                    ← Back to Home
                </button>
            )}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-full bg-[#020617]/90 md:rounded-l-3xl border-l border-white/10 shadow-2xl overflow-hidden relative">
            
            {/* Dashboard Header */}
            <header className="px-8 py-6 border-b border-white/10 bg-[#020617]/95 z-20 flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                    {selectedProgram ? (
                        <>
                            <Breadcrumbs program={selectedProgram} level={selectedLevel} />
                            <h1 className="text-3xl font-bold text-white mt-2 drop-shadow-lg">
                                {selectedProgram?.replace(/B2C_|B2B_|B2S_/g, "").replace(/_/g, " ")}
                            </h1>
                        </>
                    ) : (
                         <h1 className="text-2xl font-bold text-white mt-2 drop-shadow-lg opacity-80">
                            Dashboard
                        </h1>
                    )}
                </div>

                {/* Right: Kalananti Logo & Tools */}
                <div className="flex items-center gap-6 self-end md:self-auto">
                        <div className="relative hidden md:block">
                            <input 
                            type="text" 
                            placeholder="Search..." 
                            className="bg-white/5 border border-white/20 rounded-full py-2 px-4 pl-10 text-sm text-white focus:outline-none focus:border-brand-yellow/50 w-64 transition-all placeholder:text-slate-400"
                            />
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        </div>
                        <div className="h-8 w-px bg-white/10 mx-2 hidden md:block"></div>
                        <img 
                            src="https://cdn-web-2.ruangguru.com/landing-pages/assets/545c0426-169c-406f-8775-93afcacef50a.png" 
                            alt="Kalananti" 
                            loading="lazy"
                            decoding="async"
                            className="h-12 md:h-14 object-contain drop-shadow-md"
                        />
                </div>
            </header>
            
            {/* Conditional Sub-Header (Tabs) */}
            {selectedProgram && (
                 <div className="px-8 pb-4 bg-[#020617]/95 z-20 border-b border-white/10">
                    <LevelTabs 
                        levels={levels} 
                        selectedLevel={selectedLevel} 
                        onSelect={setSelectedLevel} 
                    />
                 </div>
            )}

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto relative scroll-smooth bg-gradient-to-br from-[#020617] to-[#0B1E3B]">
                
                {/* 1. HOME VIEW (No Program Selected) */}
                {!selectedProgram && (
                    <div className="min-h-full flex flex-col items-center justify-start p-8 md:p-16 relative overflow-hidden">
                        {/* Background Decor */}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute inset-0 bg-[url('https://cdn-web-2.ruangguru.com/landing-pages/assets/5bd0bb1f-e1fc-4b00-a259-3cb7e75c1ef7.png')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
                        </div>

                         {/* Floating Rocket - "Jalan jalan" animation */}
                         {shouldReduceMotion ? (
                            <img
                                src={ASSETS.rocket}
                                alt="Rocket"
                                loading="lazy"
                                decoding="async"
                                className="absolute top-20 right-20 w-48 md:w-80 z-0 opacity-80 drop-shadow-[0_0_30px_rgba(253,128,36,0.5)]"
                            />
                         ) : (
                            <motion.img
                                src={ASSETS.rocket}
                                alt="Rocket"
                                loading="lazy"
                                decoding="async"
                                className="absolute top-20 right-20 w-48 md:w-80 z-0 opacity-80 drop-shadow-[0_0_30px_rgba(253,128,36,0.5)] will-change-transform"
                                animate={{
                                    y: [-30, 30, -30],
                                    x: [-20, 20, -20],
                                    rotate: [0, 10, -5, 0],
                                }}
                                transition={{
                                    duration: 8,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />
                         )}

                        {/* Character Decor */}
                         {shouldReduceMotion ? (
                            <img
                                src={ASSETS.char1}
                                alt="Character"
                                loading="lazy"
                                decoding="async"
                                className="absolute bottom-10 left-10 w-128 md:w-128 z-0 opacity-100"
                            />
                         ) : (
                            <motion.img
                                src={ASSETS.char1}
                                alt="Character"
                                loading="lazy"
                                decoding="async"
                                className="absolute bottom-10 left-10 w-128 md:w-128 z-0 opacity-100"
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1 }}
                            />
                         )}

                        <div className="relative z-10 w-full max-w-5xl">
                             {/* Welcome Text */}
                             <motion.div 
                                {...welcomeMotionProps}
                                className="mb-12"
                             >
                                <div className="inline-block px-4 py-1 rounded-full bg-brand-yellow/20 border border-brand-yellow/50 text-brand-yellow font-bold text-sm tracking-wider uppercase mb-4 backdrop-blur-sm">
                                    Curriculum Portal
                                </div>
                                <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
                                    Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow to-brand-orange">{teacherName ? teacherName.split(" ")[0] : "Teacher"}!</span>
                                </h2>
                                <p className="text-blue-200/80 text-lg max-w-2xl">
                                    Select a program from the sidebar or the menu below to start your learning journey.
                                </p>
                             </motion.div>

                             {/* Program Grid (Menu) */}
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {programs.map((program, idx) => (
                                    <motion.button
                                        key={program}
                                        onClick={() => handleProgramSelect(program)}
                                        {...programCardMotionProps(0.1 + (idx * 0.1))}
                                        className="group relative flex flex-col p-6 rounded-3xl bg-white/10 border border-white/10 backdrop-blur-md hover:bg-white/20 hover:border-brand-yellow/50 transition-all text-left overflow-hidden h-48 justify-between"
                                    >
                                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <div className="w-24 h-24 rounded-full bg-brand-yellow blur-3xl" />
                                        </div>
                                        
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-green to-teal-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <span className="text-xl font-bold">{program.charAt(0)}</span>
                                        </div>
                                        
                                        <div>
                                            {(() => {
                                                const cleanName = getCleanName(program).toLowerCase();
                                                const meta = Object.entries(PROGRAM_METADATA).find(([key]) => cleanName.includes(key))?.[1];
                                                return meta ? (
                                                    <span className="inline-block px-2 py-0.5 rounded-full bg-brand-yellow/20 border border-brand-yellow/30 text-brand-yellow text-[10px] font-bold uppercase tracking-wide mb-2">
                                                        {meta.age}
                                                    </span>
                                                ) : null;
                                            })()}
                                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-brand-yellow transition-colors">{getCleanName(program)}</h3>
                                            <div className="flex items-center gap-2 text-sm text-slate-400 group-hover:text-white transition-colors">
                                                <span>View Curriculum</span>
                                                <ChevronRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                             </div>
                        </div>
                    </div>
                )}

                {/* 2. DASHBOARD GRID (Program Selected) */}
                {selectedProgram && groupedContent.length > 0 && (
                     <div className="p-8 pb-32">
                        <AnimatePresence mode='wait'>
                            <motion.div 
                                key={selectedLevel}
                                {...levelTransitionProps}
                                className="max-w-7xl mx-auto"
                            >
                                {groupedContent.map((group, groupIndex) => (
                                    <div key={selectedLevel + "-" + group.unit + "-" + groupIndex} className="mb-12">
                                        <div className="flex items-center gap-4 mb-6 sticky top-0 md:relative bg-[#020617]/95 md:bg-transparent py-4 z-10 -mx-8 px-8 md:mx-0 md:px-0 border-b md:border-b-0 border-white/10 shadow-sm md:shadow-none">
                                            <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow to-brand-orange uppercase tracking-widest flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-brand-green" />
                                                {group.unit}
                                            </h3>
                                            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                            {group.items.map((item) => (
                                                <motion.div
                                                    key={item.unique_code || (item.program_id + item.level_id + item.session_order)}
                                                    {...sessionCardMotionProps}
                                                    onClick={() => handleCardClick(item)}
                                                >
                                                    <CurriculumCard 
                                                        title={item.topic_title}
                                                        description={item.learning_objective}
                                                        order={item.session_order}
                                                        planetTheme={item.planet_theme}
                                                    />
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                     </div>
                )}
                
                {selectedProgram && groupedContent.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center h-full text-blue-200/50">
                        <p className="text-lg">No sessions found for {selectedLevel}.</p>
                    </div>
                )}

            </div>
            
        </main>
      </div>
    </div>
  );
}
