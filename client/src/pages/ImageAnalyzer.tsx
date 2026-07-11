import React, { useState } from 'react';
import { Camera, ShieldAlert, Sparkles, Upload, Check, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api';

interface ImageAnalysisResult {
  floodLevel: 'None' | 'Low' | 'Medium' | 'Severe';
  treeFall: boolean;
  roadDamage: 'None' | 'Minor' | 'Severe';
  waterlogging: boolean;
  electricWireHazards: boolean;
  buildingDamage: 'None' | 'Minor' | 'Severe';
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  confidenceScore: number;
  suggestedAction: string;
}

export const ImageAnalyzer: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ImageAnalysisResult | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setResults(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!imagePreview) return;
    setLoading(true);
    try {
      // Split base64 content type prefix out
      const base64Data = imagePreview.split(',')[1];
      const analysis = await apiService.analyzeImage(base64Data);
      setResults(analysis);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'low': return 'bg-success/15 text-success';
      case 'medium': return 'bg-warning/15 text-warning';
      default: return 'bg-danger/15 text-danger';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 font-sans">
      <div className="flex items-center space-x-3">
        <Camera className="h-7 w-7 text-primary" />
        <h2 className="text-2xl font-extrabold text-secondary dark:text-white">AI Image Hazard Analyzer</h2>
      </div>
      <p className="text-sm text-secondary-light dark:text-secondary-dark/70">
        Upload an image of a nearby monsoon disaster scene. Gemini Vision scans the photo to spot standing floods, blocked pathways, tree falls, and high-voltage grid exposures.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left side: Upload card */}
        <div className="m3-card-elevated space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-md font-bold text-secondary dark:text-white border-b border-secondary/10 dark:border-white/5 pb-2">
              Select or Drop Photo
            </h3>
            
            {imagePreview ? (
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-secondary/10 dark:border-white/10 group">
                <img src={imagePreview} alt="monsoon hazard" className="h-full w-full object-cover" />
                <button
                  onClick={() => { setImagePreview(null); setResults(null); }}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                >
                  Change Photo
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-secondary/20 dark:border-white/15 rounded-3xl aspect-video cursor-pointer hover:bg-secondary/5 dark:hover:bg-white/5 transition-all p-6 text-center">
                <Upload className="h-10 w-10 text-secondary-light/75 mb-3" />
                <span className="text-sm font-semibold text-secondary dark:text-white">Click to upload photo</span>
                <span className="text-2xs text-secondary-light/80 mt-1">Supports PNG, JPG, JPEG</span>
                <input type="file" onChange={handleImageChange} accept="image/*" className="hidden" />
              </label>
            )}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!imagePreview || loading}
            className="w-full py-3.5 rounded-full bg-primary hover:bg-primary-light disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center space-x-2 shadow-sm transition-all"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Running Gemini Vision Scan...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Analyze Incident Photo</span>
              </>
            )}
          </button>
        </div>

        {/* Right side: Analysis outcomes */}
        <div>
          {results ? (
            <div className="m3-card-elevated space-y-5">
              <div className="flex justify-between items-center border-b border-secondary/10 dark:border-white/5 pb-3">
                <h3 className="text-md font-bold text-secondary dark:text-white flex items-center gap-2">
                  <ShieldAlert className="text-primary h-5 w-5" />
                  Scan Findings
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRiskBadgeColor(results.riskLevel)}`}>
                  Risk: {results.riskLevel}
                </span>
              </div>

              {/* Hazards list */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                
                <div className="flex items-center space-x-2 p-2.5 bg-secondary/5 dark:bg-white/5 rounded-xl border border-secondary/10 dark:border-white/5">
                  <Check className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-semibold text-secondary-light">Flood Level</p>
                    <p className="font-bold text-secondary dark:text-white">{results.floodLevel}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-2.5 bg-secondary/5 dark:bg-white/5 rounded-xl border border-secondary/10 dark:border-white/5">
                  <Check className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-semibold text-secondary-light">Tree Fall</p>
                    <p className="font-bold text-secondary dark:text-white">{results.treeFall ? 'Fallen / Blocked' : 'None'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-2.5 bg-secondary/5 dark:bg-white/5 rounded-xl border border-secondary/10 dark:border-white/5">
                  <Check className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-semibold text-secondary-light">Road Damage</p>
                    <p className="font-bold text-secondary dark:text-white">{results.roadDamage}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-2.5 bg-secondary/5 dark:bg-white/5 rounded-xl border border-secondary/10 dark:border-white/5">
                  <Check className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-semibold text-secondary-light">Waterlogging</p>
                    <p className="font-bold text-secondary dark:text-white">{results.waterlogging ? 'Active' : 'None'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-2.5 bg-secondary/5 dark:bg-white/5 rounded-xl border border-secondary/10 dark:border-white/5">
                  <Check className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-semibold text-secondary-light">Grid / Wire Danger</p>
                    <p className="font-bold text-secondary dark:text-white">{results.electricWireHazards ? 'Yes (Danger)' : 'None'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-2.5 bg-secondary/5 dark:bg-white/5 rounded-xl border border-secondary/10 dark:border-white/5">
                  <Check className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-semibold text-secondary-light">Building Damage</p>
                    <p className="font-bold text-secondary dark:text-white">{results.buildingDamage}</p>
                  </div>
                </div>

              </div>

              {/* AI action suggest */}
              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 space-y-2">
                <span className="text-2xs font-extrabold uppercase text-primary flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Suggested Protective Action
                </span>
                <p className="text-xs text-secondary-light dark:text-secondary-dark/95 leading-relaxed">
                  {results.suggestedAction}
                </p>
              </div>

              <div className="flex items-center justify-between text-2xs text-secondary-light border-t border-secondary/15 dark:border-white/5 pt-3">
                <span>AI Confidence Rating</span>
                <span className="font-bold text-primary">{results.confidenceScore}%</span>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] border-2 border-dashed border-secondary/20 dark:border-white/10 rounded-3xl flex flex-col justify-center items-center text-center p-8 bg-secondary/5 dark:bg-background-dark/20">
              <Camera className="h-10 w-10 text-secondary-light/65 mb-3 animate-pulse" />
              <p className="font-semibold text-secondary dark:text-white text-sm">Waiting for Photo Input</p>
              <p className="text-xs text-secondary-light/80 max-w-xs mt-1">Upload a street snapshot to identify hazardous environmental features automatically.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Simple Refresh icon replacement helper to avoid package missing
const RefreshCw: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/>
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
    <path d="M16 16h5v5"/>
  </svg>
);
