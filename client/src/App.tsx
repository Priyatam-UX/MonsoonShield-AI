import React, { useState } from 'react';
import { useApp, Language } from './context/AppContext';
import { FloatingChat } from './components/FloatingChat';

// Page Imports
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { UserProfile } from './pages/UserProfile';
import { PreparednessPlanner } from './pages/PreparednessPlanner';
import { TravelAdvisor } from './pages/TravelAdvisor';
import { ImageAnalyzer } from './pages/ImageAnalyzer';
import { CommunityReports } from './pages/CommunityReports';
import { EmergencySos } from './pages/EmergencySos';
import { FamilySafety } from './pages/FamilySafety';
import { NearbyHelp } from './pages/NearbyHelp';
import { ChatAssistant } from './pages/ChatAssistant';
import { RecoveryPlanner } from './pages/RecoveryPlanner';
import { FakeNewsDetector } from './pages/FakeNewsDetector';

// Icon imports
import {
  Shield, Menu, X, Sun, Moon, Globe, WifiOff, LayoutDashboard, User, FileCheck,
  Navigation, Camera, MapPin, AlertCircle, Users, HelpCircle, MessageSquare, ShieldCheck, HelpCircle as HelpIcon
} from 'lucide-react';

export default function App() {
  const { theme, toggleTheme, language, setLanguage, user, loginWithGoogle, logout, isOffline } = useApp();
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Enter the main app dashboard
  const handleEnterApp = () => {
    if (!user) {
      loginWithGoogle();
    }
    setCurrentPage('dashboard');
  };

  // Switch content pages
  const renderActivePage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard onNavigate={setCurrentPage} />;
      case 'profile': return <UserProfile />;
      case 'planner': return <PreparednessPlanner />;
      case 'travel': return <TravelAdvisor />;
      case 'image': return <ImageAnalyzer />;
      case 'reports': return <CommunityReports />;
      case 'sos': return <EmergencySos />;
      case 'family': return <FamilySafety />;
      case 'help': return <NearbyHelp />;
      case 'chat': return <ChatAssistant />;
      case 'recovery': return <RecoveryPlanner />;
      case 'fakenews': return <FakeNewsDetector />;
      default: return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4.5 w-4.5" /> },
    { id: 'profile', label: 'Safety Profile', icon: <User className="h-4.5 w-4.5" /> },
    { id: 'planner', label: 'AI Prep Planner', icon: <FileCheck className="h-4.5 w-4.5" /> },
    { id: 'travel', label: 'Travel Advisor', icon: <Navigation className="h-4.5 w-4.5" /> },
    { id: 'image', label: 'Image Analyzer', icon: <Camera className="h-4.5 w-4.5" /> },
    { id: 'reports', label: 'Community Map', icon: <MapPin className="h-4.5 w-4.5" /> },
    { id: 'sos', label: 'Emergency SOS', icon: <AlertCircle className="h-4.5 w-4.5 text-danger" /> },
    { id: 'family', label: 'Family Safety', icon: <Users className="h-4.5 w-4.5" /> },
    { id: 'help', label: 'Nearby Relief', icon: <HelpCircle className="h-4.5 w-4.5" /> },
    { id: 'chat', label: 'AI Chat Hub', icon: <MessageSquare className="h-4.5 w-4.5" /> },
    { id: 'recovery', label: 'Recovery Checklist', icon: <ShieldCheck className="h-4.5 w-4.5" /> },
    { id: 'fakenews', label: 'Fake News Screen', icon: <Shield className="h-4.5 w-4.5" /> },
  ];

  if (currentPage === 'landing') {
    return (
      <LandingPage
        onEnterApp={handleEnterApp}
        loginWithGoogle={handleEnterApp}
        user={user}
      />
    );
  }

  return (
    <div className={`min-h-screen bg-background-light dark:bg-background-dark text-secondary dark:text-secondary-dark flex flex-col font-sans transition-colors duration-300`}>
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-secondary/15 dark:border-white/5 px-4 py-3 flex items-center justify-between" role="banner">
        
        {/* Logo and Menu Trigger */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-full hover:bg-secondary/10 dark:hover:bg-white/10 text-secondary dark:text-white lg:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={sidebarOpen}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentPage('landing')}>
            <div className="h-8 w-8 rounded-lg bg-primary text-white flex items-center justify-center shadow">
              <Shield className="h-5 w-5" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-sm tracking-tight hidden sm:block">MonsoonShield AI</span>
              <span className="text-4xs text-secondary-light/80 dark:text-secondary-dark/60 font-extrabold uppercase hidden sm:block">By Priyatam</span>
            </div>
          </div>
        </div>

        {/* Action Widgets deck */}
        <div className="flex items-center space-x-3">
          
          {/* Offline alert banner */}
          {isOffline && (
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-danger/10 border border-danger/25 text-danger text-2xs font-bold animate-pulse">
              <WifiOff className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Offline Mode Active</span>
            </div>
          )}

          {/* Language Selector */}
          <div className="relative group">
            <button className="p-2 rounded-full hover:bg-secondary/10 dark:hover:bg-white/10 text-secondary-light flex items-center space-x-1">
              <Globe className="h-4 w-4" />
              <span className="text-2xs font-bold uppercase">{language}</span>
            </button>
            <div className="absolute right-0 top-full mt-1.5 w-28 bg-white dark:bg-surface-dark border border-secondary/15 dark:border-white/5 rounded-xl shadow-m3-2 py-1 hidden group-hover:block z-50">
              <button onClick={() => setLanguage('en')} className="w-full text-left px-3 py-1.5 text-xs hover:bg-secondary/10 dark:hover:bg-white/10 text-secondary dark:text-white">English</button>
              <button onClick={() => setLanguage('te')} className="w-full text-left px-3 py-1.5 text-xs hover:bg-secondary/10 dark:hover:bg-white/10 text-secondary dark:text-white">తెలుగు</button>
              <button onClick={() => setLanguage('hi')} className="w-full text-left px-3 py-1.5 text-xs hover:bg-secondary/10 dark:hover:bg-white/10 text-secondary dark:text-white">हिन्दी</button>
            </div>
          </div>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-secondary/10 dark:hover:bg-white/10 text-secondary-light"
          >
            {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>

          {/* Logout / User check */}
          <button
            onClick={() => { logout(); setCurrentPage('landing'); }}
            className="px-3 py-1.5 rounded-full bg-secondary/10 dark:bg-white/5 border border-secondary/15 dark:border-white/10 text-secondary-light text-2xs font-semibold hover:bg-secondary/15 transition-all"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Panel grid */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Sidebar Nav (Desktop static, mobile responsive overlay) */}
        <aside
          role="navigation"
          aria-label="Main sidebar navigation"
          className={`fixed inset-y-0 left-0 transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 w-64 bg-white dark:bg-surface-dark border-r border-secondary/15 dark:border-white/5 flex flex-col justify-between flex-shrink-0 pt-16 lg:pt-0 h-full`}
        >
          <div className="p-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setCurrentPage(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all ${
                  currentPage === item.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-secondary-light hover:bg-secondary/5 dark:hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          <div className="p-4 border-t border-secondary/15 dark:border-white/5 text-center text-3xs text-secondary-light/60">
            MonsoonShield AI v1.0.0 <br /> Created by Priyatam
          </div>
        </aside>

        {/* Mobile sidebar overlay backing */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          />
        )}

        {/* Content Section */}
        <main role="main" className="flex-1 overflow-y-auto p-4 md:p-6 bg-secondary/5 dark:bg-background-dark/35 z-10">
          {renderActivePage()}
        </main>
      </div>

      {/* Floating AI Chat Assistant */}
      <FloatingChat />
    </div>
  );
}
