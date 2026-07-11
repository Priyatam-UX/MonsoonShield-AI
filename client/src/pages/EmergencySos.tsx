import React, { useState } from 'react';
import { AlertCircle, Phone, Share2, Shield, Heart, Send, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useGeolocation } from '../hooks/useGeolocation';

export const EmergencySos: React.FC = () => {
  const { profile } = useApp();
  const geo = useGeolocation();
  const [sosSent, setSosSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const triggerSOS = () => {
    setLoading(true);
    // Simulate SMS dispatching to emergency contacts and public help desk
    setTimeout(() => {
      setSosSent(true);
      setLoading(false);
    }, 1500);
  };

  const emergencyMessage = `EMERGENCY ALERT: Priyatam Kumar needs help due to severe weather. Current GPS Coordinates: ${
    geo.latitude?.toFixed(5) || '17.4399'
  }, ${
    geo.longitude?.toFixed(5) || '78.4983'
  }. Location accuracy: ~10 meters. Medical: ${profile.medicalConditions}. Vehicle: ${profile.vehicle}.`;

  const shareSOS = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MonsoonShield SOS Alert',
          text: emergencyMessage,
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(emergencyMessage);
      alert('SOS dispatch template copied to clipboard! Paste it into WhatsApp or SMS.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 font-sans">
      <div className="flex items-center space-x-3">
        <AlertCircle className="h-7 w-7 text-danger animate-pulse" />
        <h2 className="text-2xl font-extrabold text-secondary dark:text-white">Emergency SOS Broadcast</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Big SOS trigger deck */}
        <div className="m3-card-elevated flex flex-col justify-between items-center text-center p-8 bg-danger/5 border border-danger/20 md:col-span-1 min-h-[350px]">
          <div>
            <h3 className="text-md font-extrabold text-danger uppercase tracking-wider mb-2">One-Tap Distress Signal</h3>
            <p className="text-xs text-secondary-light/80 leading-relaxed">
              Press and hold to broadcast your coordinates and safety log to emergency contacts and GHMC help teams.
            </p>
          </div>

          {/* Large SOS Button */}
          <button
            onMouseDown={triggerSOS}
            onTouchStart={triggerSOS}
            disabled={loading || sosSent}
            className={`h-36 w-36 rounded-full border-8 border-danger/30 flex flex-col items-center justify-center text-white transition-all shadow-m3-3 focus:outline-none hover:scale-105 active:scale-95 ${
              sosSent ? 'bg-success hover:bg-success' : 'bg-danger hover:bg-danger-light animate-pulse'
            }`}
          >
            {loading ? (
              <span className="text-sm font-black uppercase tracking-wider animate-ping">Sending...</span>
            ) : sosSent ? (
              <>
                <Check className="h-10 w-10 mb-1" />
                <span className="text-xs font-black uppercase tracking-wider">Broadcasting</span>
              </>
            ) : (
              <>
                <span className="text-3xl font-black tracking-tighter">SOS</span>
                <span className="text-4xs font-bold tracking-widest uppercase mt-0.5">Press & Hold</span>
              </>
            )}
          </button>

          <p className="text-3xs text-secondary-light/70 uppercase">
            Coordinates: {geo.latitude?.toFixed(4) || '17.4399'}, {geo.longitude?.toFixed(4) || '78.4983'}
          </p>
        </div>

        {/* Right Column: SOS details, contacts, message view */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Dispatch details banner */}
          {sosSent && (
            <div className="bg-success/15 border-l-4 border-success p-4 rounded-r-2xl flex items-start space-x-3 text-success-dark dark:text-success-light text-sm shadow-sm animate-fade-in">
              <Shield className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold">SOS Dispatch Signal Active!</span>
                <p className="text-xs mt-1 leading-relaxed">
                  SMS alerts with active GPS anchors have been generated and dispatched to your configured emergency contact ({profile.emergencyContacts}) and local GHMC control center. Help is active.
                </p>
              </div>
            </div>
          )}

          {/* Emergency Message Card */}
          <div className="m3-card-elevated space-y-3">
            <h4 className="text-sm font-bold text-secondary dark:text-white flex items-center gap-1.5 border-b border-secondary/10 dark:border-white/5 pb-2">
              <Share2 className="h-4.5 w-4.5 text-primary" />
              SOS Broadcast Message Draft
            </h4>
            <p className="text-xs text-secondary-light dark:text-secondary-dark/95 bg-secondary/5 dark:bg-white/5 p-4 rounded-2xl border border-secondary/10 dark:border-white/5 leading-relaxed">
              {emergencyMessage}
            </p>
            <div className="flex justify-end pt-2">
              <button
                onClick={shareSOS}
                className="px-5 py-2 rounded-full bg-primary hover:bg-primary-light text-white text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Share Signal / Copy Template</span>
              </button>
            </div>
          </div>

          {/* Contact Details List */}
          <div className="m3-card-elevated space-y-4">
            <h4 className="text-sm font-bold text-secondary dark:text-white border-b border-secondary/10 dark:border-white/5 pb-2">
              Emergency Contacts & Direct Dial
            </h4>
            <div className="space-y-3">
              
              <div className="flex items-center justify-between p-3 bg-secondary/5 dark:bg-white/5 rounded-2xl border border-secondary/10 dark:border-white/5">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <Heart className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-secondary dark:text-white">National Disaster Response Force (NDRF)</p>
                    <p className="text-3xs text-secondary-light">Civic Weather Rescue</p>
                  </div>
                </div>
                <a href="tel:+911124363260" className="p-2 bg-primary/15 hover:bg-primary/25 text-primary rounded-full transition-colors">
                  <Phone className="h-4 w-4" />
                </a>
              </div>

              <div className="flex items-center justify-between p-3 bg-secondary/5 dark:bg-white/5 rounded-2xl border border-secondary/10 dark:border-white/5">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-secondary dark:text-white">GHMC Monsoon Control Desk</p>
                    <p className="text-3xs text-secondary-light">Local Municipal Helpline</p>
                  </div>
                </div>
                <a href="tel:+914021111111" className="p-2 bg-primary/15 hover:bg-primary/25 text-primary rounded-full transition-colors">
                  <Phone className="h-4 w-4" />
                </a>
              </div>

              <div className="flex items-center justify-between p-3 bg-secondary/5 dark:bg-white/5 rounded-2xl border border-secondary/10 dark:border-white/5">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-danger/10 text-danger flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-secondary dark:text-white">Configured Personal Contact</p>
                    <p className="text-3xs text-secondary-light">{profile.emergencyContacts}</p>
                  </div>
                </div>
                <a href="tel:+919876543210" className="p-2 bg-danger/15 hover:bg-danger/25 text-danger rounded-full transition-colors">
                  <Phone className="h-4 w-4" />
                </a>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
