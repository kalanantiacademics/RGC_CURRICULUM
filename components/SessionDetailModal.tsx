"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, BookOpen, Presentation, FileText, MonitorPlay, Download, Layers, ShieldCheck, ChevronLeft, Hash, Globe } from "lucide-react";
import { CurriculumItem } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface SessionDetailModalProps {
  session: CurriculumItem | null;
  isOpen: boolean;
  onClose: () => void;
}

type Tab = "info" | "tools" | "assets";

export function SessionDetailModal({ session, isOpen, onClose }: SessionDetailModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("info");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
        setActiveTab("info");
        setPreviewUrl(null);
        // Lock body scroll
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'unset';
    }
    return () => {
        document.body.style.overflow = 'unset';
    }
  }, [isOpen, session]);

  if (!session) return null;

  const handleLinkClick = (url: string | undefined) => {
      if (!url) return;
      let safeUrl = url.trim();
      
      // YouTube Embed Transformation
      // Convert https://www.youtube.com/watch?v=VIDEO_ID to https://www.youtube.com/embed/VIDEO_ID
      const ytMatch = safeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
      if (ytMatch && ytMatch[1]) {
          safeUrl = `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
      }

      // Google Drive / Docs / Slides Preview Transformation
      // Change /view, /edit to /preview for better embedding compatibility
      if (safeUrl.includes("docs.google.com") || safeUrl.includes("drive.google.com")) {
           // Remove /view, /edit and anything after it, replace with /preview
           safeUrl = safeUrl.replace(/\/view.*$/, "/preview").replace(/\/edit.*$/, "/preview");
      }
      
      setPreviewUrl(safeUrl);
  };

  const closePreview = () => setPreviewUrl(null);

  // Helper to safely split links
  const getLinks = (str: string | undefined) => {
      if (!str || str === "—") return [];
      return str.split(';').map(s => s.trim()).filter(Boolean);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="backdrop"
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-8"
          >
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              key="modal-content"
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1B3F6A] border border-white/10 w-full max-w-6xl h-[90vh] rounded-3xl shadow-2xl relative flex flex-col overflow-hidden"
            >
              
              {/* Header */}
              <div className="px-8 py-6 border-b border-white/10 bg-[#153255] flex justify-between items-center gap-6 shrink-0 z-20">
                 {previewUrl ? (
                     <div className="flex items-center gap-4 flex-1">
                         <button onClick={closePreview} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors">
                             <ChevronLeft className="w-5 h-5" /> <span className="text-sm font-bold">Back</span>
                         </button>
                         <h3 className="text-lg font-bold text-white truncate flex-1">Previewing Content</h3>
                     </div>
                 ) : (
                     <div className="flex flex-col gap-2 flex-1">
                        <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wider">
                            <span className="text-brand-yellow bg-brand-yellow/10 px-2 py-1 rounded border border-brand-yellow/20">{session.level_id}</span>
                            <span className="text-blue-300/50">•</span>
                            <span className="text-blue-200/70">Session {session.session_order}</span>
                            {session.unique_code && (
                                <>
                                    <span className="text-blue-300/50">•</span>
                                    <span className="flex items-center gap-1 text-blue-200/70 font-mono bg-white/5 px-2 py-1 rounded select-all"><Hash className="w-3 h-3"/> {session.unique_code}</span>
                                </>
                            )}
                        </div>
                        <div className="flex items-baseline gap-4">
                            <h2 className="text-3xl font-bold text-white leading-tight">{session.topic_title}</h2>
                            {session.planet_theme && (
                                <span className="hidden md:flex items-center gap-1 text-sm font-medium text-fuchsia-400 bg-fuchsia-400/10 px-3 py-1 rounded-full border border-fuchsia-400/20">
                                    <Globe className="w-3 h-3" /> {session.planet_theme}
                                </span>
                            )}
                        </div>
                        {session.unit_name && <p className="text-blue-200/60 text-sm font-medium">{session.unit_name}</p>}
                     </div>
                 )}
                 <button
                  onClick={onClose}
                  className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-blue-200 hover:text-white transition-colors border border-white/10"
                  aria-label="Close Modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Main Body */}
              <div className="flex-1 overflow-hidden relative bg-[#1B3F6A] flex flex-col">
                  {previewUrl ? (
                      <div className="w-full h-full bg-black relative flex flex-col">
                          <div className="flex-1 relative">
                            <iframe 
                                src={previewUrl} 
                                className="w-full h-full border-0" 
                                allowFullScreen 
                                title="Content Preview"
                            />
                            {/* Overlay to catch clicks on iframe background if needed, but we want interaction */}
                          </div>
                          <div className="p-2 bg-zinc-950 text-center">
                              <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-500 hover:text-white flex items-center justify-center gap-2">
                                  <ExternalLink className="w-3 h-3"/> Open in new tab
                              </a>
                          </div>
                      </div>
                  ) : (
                      <div className="flex flex-col h-full">
                          {/* Tabs */}
                          <div className="flex border-b border-white/10 px-8 bg-[#153255]/50 backdrop-blur-sm z-10 sticky top-0">
                             <TabButton id="info" label="Session Info" icon={<BookOpen className="w-4 h-4"/>} active={activeTab === "info"} onClick={() => setActiveTab("info")} />
                             <TabButton id="tools" label="Teacher Tools" icon={<ShieldCheck className="w-4 h-4"/>} active={activeTab === "tools"} onClick={() => setActiveTab("tools")} />
                             <TabButton id="assets" label="Class Assets" icon={<Layers className="w-4 h-4"/>} active={activeTab === "assets"} onClick={() => setActiveTab("assets")} />
                          </div>

                          <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                             {/* Tab 1: Info */}
                             {activeTab === "info" && (
                                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                     <div className="lg:col-span-8 space-y-8">
                                         <Section title="Learning Objectives" icon={<BookOpen className="w-4 h-4"/>}>
                                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                                <p className="text-blue-50 text-lg leading-relaxed">{session.learning_objective || "No specific objectives listed."}</p>
                                            </div>
                                         </Section>
                                         <Section title="Activity Breakdown" icon={<MonitorPlay className="w-4 h-4"/>}>
                                             <div className="prose prose-invert max-w-none">
                                                <BulletedList text={session.activity_breakdown} isNumbered />
                                             </div>
                                         </Section>
                                     </div>
                                     <div className="lg:col-span-4 space-y-6">
                                         {session.mastery_focus && (
                                             <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-teal-500/20">
                                                 <h4 className="text-teal-400 font-bold uppercase tracking-wider text-xs mb-3 flex items-center gap-2">
                                                     <ShieldCheck className="w-4 h-4"/> Mastery Focus
                                                 </h4>
                                                 <BulletedList text={session.mastery_focus} compact />
                                             </div>
                                         )}
                                         {session.planet_theme && (
                                             <div className="p-6 rounded-2xl bg-zinc-800/40 border border-zinc-700/40">
                                                 <h4 className="text-zinc-500 font-bold uppercase tracking-wider text-xs mb-2">Detailed Context</h4>
                                                 <div className="space-y-4">
                                                     <div>
                                                         <div className="text-xs text-zinc-500 mb-1">Theme</div>
                                                         <div className="text-white font-medium">{session.planet_theme}</div>
                                                     </div>
                                                     {session.unit_name && (
                                                         <div>
                                                             <div className="text-xs text-zinc-500 mb-1">Unit</div>
                                                             <div className="text-white font-medium">{session.unit_name}</div>
                                                         </div>
                                                     )}
                                                 </div>
                                             </div>
                                         )}
                                     </div>
                                 </div>
                             )}

                             {/* Tab 2: Teacher Tools */}
                             {activeTab === "tools" && (
                                 <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                     <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-5 flex items-start gap-4">
                                         <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500 shrink-0">
                                             <ShieldCheck className="w-5 h-5" />
                                         </div>
                                         <div>
                                             <h4 className="text-amber-200 font-bold text-sm mb-1">Teacher Only Zone</h4>
                                             <p className="text-amber-200/70 text-xs leading-relaxed">
                                                 These resources are for your preparation and classroom management. 
                                                 <br/>Please do not share direct links with students unless specified.
                                             </p>
                                         </div>
                                     </div>
                                     
                                     {/* Primary Action: Lesson Plan (IFRAME PREVIEW) */}
                                     {session.link_lesson_plan && (
                                        <div>
                                            <h3 className="text-blue-200/50 font-bold uppercase tracking-wider text-xs mb-4">Primary Guide</h3>
                                            <div onClick={() => handleLinkClick(session.link_lesson_plan)}>
                                                <HeroButton 
                                                    label="Lesson Plan" 
                                                    sublabel="Comprehensive Teacher Guide & Walkthrough"
                                                    icon={<FileText className="w-8 h-8" />}
                                                    primary
                                                />
                                            </div>
                                        </div>
                                     )}

                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                         {/* Deck: New Tab */}
                                         <MultiLinkGroup 
                                            label="Slide Deck" 
                                            links={getLinks(session.link_deck)} 
                                            icon={<Presentation className="w-4 h-4"/>} 
                                            customAction={(url) => window.open(url, '_blank')}
                                            variant="secondary" 
                                         />
                                         
                                         <MultiLinkGroup label="Syllabus / Journey Map" links={getLinks(session.link_syllabus)} icon={<Globe className="w-4 h-4"/>} onClick={handleLinkClick} variant="ghost" />
                                         <MultiLinkGroup label="Explainer Videos" links={getLinks(session.explainer_video)} icon={<MonitorPlay className="w-4 h-4"/>} onClick={handleLinkClick} />
                                         <MultiLinkGroup label="Sample Projects" links={getLinks(session.link_sample)} icon={<ExternalLink className="w-4 h-4"/>} onClick={handleLinkClick} />
                                         <MultiLinkGroup label="Rubric Form" links={getLinks(session.link_rubric_form)} icon={<FileText className="w-4 h-4"/>} onClick={handleLinkClick} />
                                     </div>
                                 </div>
                             )}

                             {/* Tab 3: Assets */}
                             {activeTab === "assets" && (
                                 <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                     <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-5 flex items-start gap-4">
                                         <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 shrink-0">
                                             <Layers className="w-5 h-5" />
                                         </div>
                                         <div>
                                             <h4 className="text-blue-200 font-bold text-sm mb-1">Student Assets</h4>
                                             <p className="text-blue-200/70 text-xs leading-relaxed">
                                                 Safe to share with students. Use these files for classroom activities.
                                             </p>
                                         </div>
                                     </div>
                                     
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                         <MultiLinkGroup label="Starter File (Project Base)" links={getLinks(session.link_starter)} icon={<Download className="w-5 h-5 text-indigo-400"/>} onClick={handleLinkClick} highlight />
                                         <MultiLinkGroup label="Intro Video" links={getLinks(session.link_video_intro)} icon={<MonitorPlay className="w-5 h-5 text-pink-400"/>} onClick={handleLinkClick} highlight />
                                         <MultiLinkGroup label="Learning Video" links={getLinks(session.link_video_materi)} icon={<MonitorPlay className="w-5 h-5"/>} onClick={handleLinkClick} />
                                         <MultiLinkGroup label="Virtual Background" links={getLinks(session.link_vbg)} icon={<Presentation className="w-5 h-5"/>} onClick={handleLinkClick} />
                                     </div>
                                 </div>
                             )}
                          </div>
                      </div>
                  )}
              </div>

               {/* Footer */}
               <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950 text-center shrink-0">
                  <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-2 select-none">
                       <ShieldCheck className="w-3 h-3" /> Copyright © Ruangguru Coding - Internal Use Only
                  </p>
               </div>

            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Subcomponents

function TabButton({ id, label, icon, active, onClick }: { id: string, label: string, icon: any, active: boolean, onClick: () => void }) {
    return (
        <button 
           onClick={onClick}
           className={cn(
             "flex items-center gap-2 px-6 py-5 text-sm font-bold border-b-2 transition-all relative outline-none",
             active ? "text-white border-brand-yellow bg-white/5" : "text-blue-200/50 border-transparent hover:text-white hover:bg-white/5"
           )}
        >
            <div className={cn("transition-colors", active ? "text-brand-yellow" : "text-blue-200/50")}>{icon}</div>
            {label}
        </button>
    )
}

function Section({ title, icon, children }: { title: string, icon: any, children: React.ReactNode }) {
    return (
        <div>
            <h3 className="text-blue-200/50 font-bold uppercase tracking-wider text-xs mb-4 flex items-center gap-2 select-none">
               {icon} {title}
            </h3>
            {children}
        </div>
    )
}

function BulletedList({ text, compact = false, isNumbered = false }: { text: string, compact?: boolean, isNumbered?: boolean }) {
    if (!text) return <p className="text-zinc-500 italic text-sm">None listed.</p>;
    
    // Improved parsing for numbered lists like "1. Item one 2. Item two"
    let items: string[] = [];
    
    if (isNumbered) {
        const normalized = text.replace(/\n/g, ' ');
        // Insert break before numbers
        const withBreaks = normalized.replace(/(\d+\.\s+)/g, '\n$1');
        items = withBreaks.split('\n').map(s => s.trim()).filter(Boolean);
    } else {
        items = text.split(/\n|•/).map(line => line.trim()).filter(Boolean);
    }
    
    return (
        <ul className={cn("space-y-2", compact ? "space-y-1" : "")}>
            {items.map((line, i) => (
                <li key={i} className={cn("flex gap-3 text-blue-100 leading-relaxed", compact ? "text-xs" : "text-sm")}>
                    <span className="text-violet-500/50 mt-[0.2em]">{isNumbered ? '' : '•'}</span>
                    <span>{line}</span>
                </li>
            ))}
        </ul>
    )
}

function HeroButton({ label, sublabel, icon, disabled, primary }: { label: string, sublabel?: string, icon: any, disabled?: boolean, primary?: boolean }) {
    return (
        <button 
           disabled={disabled}
           className={cn(
               "w-full flex items-center gap-5 p-6 rounded-2xl transition-all duration-300 group border text-left relative overflow-hidden",
               disabled 
                  ? "bg-zinc-800/20 border-zinc-800 text-zinc-600 cursor-not-allowed hidden"
                  : primary 
                      ? "bg-violet-600 hover:bg-violet-500 border-violet-500 text-white shadow-xl shadow-violet-900/40 hover:scale-[1.01]"
                      : "bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200"
           )}
        >
            {primary && <div className="absolute inset-0 bg-gradient-to-r from-brand-orange to-red-500 opacity-100 -z-10" />}
            <div className={cn("p-3 rounded-xl", primary ? "bg-black/20 text-white" : "bg-white/10 text-blue-200 group-hover:text-white")}>
                {icon}
            </div>
            <div>
                <div className={cn("font-bold", primary ? "text-xl" : "text-lg")}>{label}</div>
                {sublabel && <div className={cn("text-sm mt-1", primary ? "text-white/80" : "text-blue-200/60 group-hover:text-white/80")}>{sublabel}</div>}
            </div>
            {!disabled && <ExternalLink className="ml-auto w-6 h-6 opacity-50 group-hover:opacity-100 transition-opacity" />}
        </button>
    )
}

function MultiLinkGroup({ 
    label, 
    links, 
    icon, 
    onClick, 
    customAction,
    variant = "default", 
    highlight = false 
}: { 
    label: string, 
    links: string[], 
    icon: any, 
    onClick?: (url: string) => void, 
    customAction?: (url: string) => void,
    variant?: "default" | "secondary" | "ghost", 
    highlight?: boolean 
}) {
    if (!links || links.length === 0) return null;

    const handleClick = (url: string) => {
        if (customAction) {
            customAction(url);
        } else if (onClick) {
            onClick(url);
        }
    };

    return (
        <div className={cn(
            "rounded-xl p-5 transition-colors border",
            highlight ? "bg-zinc-800/60 border-zinc-700/80" : "bg-zinc-900/30 border-zinc-800/50 hover:bg-zinc-800/50"
        )}>
            <div className="flex items-center gap-2 mb-4 text-zinc-400">
                {icon}
                <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
            </div>
            <div className="flex flex-wrap gap-2">
                {links.map((url, i) => (
                    <button 
                        key={i}
                        onClick={() => handleClick(url)}
                        className={cn(
                            "flex-1 min-w-[120px] px-4 py-3 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 border",
                            variant === "secondary" 
                                ? "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border-indigo-500/20 hover:border-indigo-500/40"
                                : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border-zinc-700 hover:border-zinc-500"
                        )}
                    >
                        <span>Open {links.length > 1 ? `#${i+1}` : ''}</span>
                        <ExternalLink className="w-3 h-3 opacity-50" />
                    </button>
                ))}
            </div>
        </div>
    )
}
