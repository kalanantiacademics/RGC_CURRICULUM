"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import { API_URL } from "@/lib/api";

interface AuthOverlayProps {
  onLogin: (name: string) => void;
}

export function AuthOverlay({ onLogin }: AuthOverlayProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  const overlayMotionProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      };

  const cardMotionProps = shouldReduceMotion
    ? {}
    : {
        initial: { scale: 0.9, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
      };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Use the new action=login endpoint
      const response = await fetch(`${API_URL}?action=login&email=${encodeURIComponent(email)}`);
      const data = await response.json();

      if (data.success && data.name) {
        // Success!
        // No persistence as requested (login required on refresh)
        
        // Small delay for animation
        setTimeout(() => {
            onLogin(data.name);
            setIsVisible(false);
        }, 500);
      } else {
        setError(data.message || "Login failed. Please contact Academic Team.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // If invisible, don't render anything (allows exit animation to finish first)
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          {...overlayMotionProps}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020617]/80 backdrop-blur-xl p-4"
        >
          <motion.div
            {...cardMotionProps}
            className="w-full max-w-md bg-[#0F172A] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
          >
             {/* Background Decoration */}
             <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                <div className="w-32 h-32 rounded-full bg-brand-blue blur-3xl" />
            </div>

            <div className="text-center mb-8 relative z-10">
              <img 
                src="https://cdn-web-2.ruangguru.com/landing-pages/assets/545c0426-169c-406f-8775-93afcacef50a.png" 
                alt="Kalananti" 
                loading="lazy"
                decoding="async"
                className="h-12 mx-auto mb-6 object-contain"
              />
              <h2 className="text-2xl font-bold text-white mb-2">Teacher Login</h2>
              <p className="text-slate-400 text-sm">
                Please enter your registered email to access the curriculum portal.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-300">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@ruangguru.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/50 transition-all"
                  required
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-blue hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Access Portal"
                )}
              </button>
            </form>

             <p className="mt-6 text-center text-xs text-slate-500">
                Having trouble? Contact the <a href="#" className="text-brand-yellow hover:underline">Academic Team</a>.
             </p>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
