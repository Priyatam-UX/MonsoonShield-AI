import React, { useEffect, useState } from 'react';
import { Shield, CloudRain, ShieldCheck, MapPin, Radio, MessageCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onEnterApp: () => void;
  loginWithGoogle: () => void;
  user: any;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, loginWithGoogle, user }) => {
  const [drops, setDrops] = useState<{ left: string; delay: string; duration: string }[]>([]);

  useEffect(() => {
    // Generate random rain drops for the background
    const items = Array.from({ length: 40 }).map(() => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      duration: `${1 + Math.random() * 1.5}s`
    }));
    setDrops(items);
  }, []);

  return (
    <div className="relative min-h-screen bg-background-light dark:bg-background-dark overflow-hidden font-sans flex flex-col justify-between">
      {/* Dynamic Rain backdrop */}
      <div className="rain-container">
        {drops.map((drop, i) => (
          <div
            key={i}
            className="rain-drop"
            style={{
              left: drop.left,
              animationDelay: drop.delay,
              animationDuration: drop.duration,
            }}
          />
        ))}
      </div>

      {/* Decorative gradient glowing spheres */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between border-b border-secondary/10 dark:border-white/5">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-m3-1">
            <Shield className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-secondary dark:text-white leading-tight">
              MonsoonShield <span className="text-primary-dark dark:text-primary-light">AI</span>
            </span>
            <span className="text-3xs text-secondary-light/80 dark:text-secondary-dark/60 font-extrabold tracking-wider uppercase">
              By Priyatam
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <button
              onClick={onEnterApp}
              className="px-5 py-2 rounded-full bg-primary text-white hover:bg-primary-light transition-all flex items-center space-x-2 text-sm font-semibold shadow-m3-1"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="px-5 py-2 rounded-full bg-white dark:bg-surface-dark border border-secondary/20 dark:border-white/10 text-secondary dark:text-white hover:bg-secondary/5 transition-all text-sm font-semibold shadow-m3-1"
            >
              Sign In with Google
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-6 flex flex-col justify-center py-12 md:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          {/* Tagline Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 text-primary dark:text-primary-light text-xs font-semibold uppercase tracking-wider">
            <CloudRain className="h-4 w-4 animate-bounce" />
            <span>AI-Powered Citizen Assistance Platform</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-secondary dark:text-white max-w-4xl mx-auto leading-tight">
            Monsoon Preparedness, <br />
            <span className="bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
              Elevated by Artificial Intelligence
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-secondary-light dark:text-secondary-dark/80 max-w-2xl mx-auto">
            Stay safe during severe storms. Predict neighborhood risks, route through detours, analyze flood hazards, verify WhatsApp news, and alert your loved ones—all with a premium Material 3 experience.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onEnterApp}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary text-white hover:bg-primary-light transition-all flex items-center justify-center space-x-2 font-semibold text-base shadow-m3-2 hover:scale-[1.02]"
            >
              <span>Protect Your Family Now</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={loginWithGoogle}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white dark:bg-surface-dark border border-secondary/20 dark:border-white/10 text-secondary dark:text-white hover:bg-secondary/5 transition-all font-semibold text-base shadow-m3-1"
            >
              Join the Network
            </button>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <section className="mt-20 md:mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            whileHover={{ y: -8 }}
            className="glass-panel rounded-3xl p-6 text-left border border-secondary/10 dark:border-white/5 transition-all"
          >
            <div className="h-12 w-12 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary mb-5">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-secondary dark:text-white mb-2">AI Preparedness Planner</h3>
            <p className="text-sm text-secondary-light dark:text-secondary-dark/70 leading-relaxed">
              Input family specifics, health issues, home metrics, and get an automated day planner integrated with power & medicine back-ups.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -8 }}
            className="glass-panel rounded-3xl p-6 text-left border border-secondary/10 dark:border-white/5 transition-all"
          >
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-500 mb-5">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-secondary dark:text-white mb-2">Live Route Advisor</h3>
            <p className="text-sm text-secondary-light dark:text-secondary-dark/70 leading-relaxed">
              Calculate travel safety risks, detect underpass floods, check traffic delays, and discover real-time detours using Google Maps.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -8 }}
            className="glass-panel rounded-3xl p-6 text-left border border-secondary/10 dark:border-white/5 transition-all"
          >
            <div className="h-12 w-12 rounded-2xl bg-danger/10 dark:bg-danger/20 flex items-center justify-center text-danger mb-5">
              <Radio className="h-6 w-6 animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-secondary dark:text-white mb-2">Instant Emergency SOS</h3>
            <p className="text-sm text-secondary-light dark:text-secondary-dark/70 leading-relaxed">
              Broadcast GPS positions, locate nearest hospitals, secure safe shelters, and broadcast SMS alerts with a single tap.
            </p>
          </motion.div>
        </section>

        {/* How it Works / Testimonials */}
        <section className="mt-20 md:mt-32 py-8 text-left max-w-4xl mx-auto space-y-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-secondary dark:text-white text-center">
            Designed for Hackathon & Civic Good
          </h2>
          <div className="relative border-l border-primary/20 pl-6 ml-4 space-y-8">
            <div className="relative">
              <div className="absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-primary" />
              <h4 className="font-bold text-secondary dark:text-white">1. Configure Profile</h4>
              <p className="text-sm text-secondary-light dark:text-secondary-dark/70">Specify locations, route details, and elderly contacts.</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-primary" />
              <h4 className="font-bold text-secondary dark:text-white">2. Receive Live Feeds</h4>
              <p className="text-sm text-secondary-light dark:text-secondary-dark/70">AI maps out risk calculations and alert banners based on weather metrics.</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-amber-500" />
              <h4 className="font-bold text-secondary dark:text-white">3. Act and Stay Connected</h4>
              <p className="text-sm text-secondary-light dark:text-secondary-dark/70">Share validation markers on maps and maintain safety checks with family dashboard.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-secondary/10 dark:border-white/5 py-6 bg-white/40 dark:bg-background-dark/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-secondary-light dark:text-secondary-dark/50 gap-4">
          <p>© 2026 MonsoonShield AI - Created by Priyatam. Built for the Google Build with AI Hackathon.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:underline">Offline Mode</a>
            <a href="#" className="hover:underline">Privacy Guard</a>
            <a href="#" className="hover:underline">Github Codebase</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
