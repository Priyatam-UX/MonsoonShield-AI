import React, { useState } from 'react';
import { Navigation, Compass, AlertTriangle, ArrowRight, RefreshCw, Car, Bike } from 'lucide-react';
import { apiService } from '../services/api';

interface TravelOutput {
  weatherRisk: string;
  floodProbability: number;
  trafficDelay: number;
  alternativeRoute: string;
  estimatedArrival: string;
  aiRecommendation: string;
}

export const TravelAdvisor: React.FC = () => {
  const [source, setSource] = useState('Secunderabad');
  const [destination, setDestination] = useState('Gachibowli');
  const [mode, setMode] = useState('car');
  const [travelTime, setTravelTime] = useState('12:30 PM');
  const [loading, setLoading] = useState(false);
  const [advisorResult, setAdvisorResult] = useState<TravelOutput | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!source || !destination) return;
    setLoading(true);
    try {
      const weatherData = await apiService.fetchWeather(17.4399, 78.4983);
      const result = await apiService.analyzeTravel(source, destination, mode, travelTime, weatherData);
      setAdvisorResult(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'low': return 'bg-success/10 text-success border-success/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-danger/10 text-danger border-danger/20';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 font-sans">
      <div className="flex items-center space-x-3">
        <Navigation className="h-7 w-7 text-primary" />
        <h2 className="text-2xl font-extrabold text-secondary dark:text-white">AI Travel Route Advisor</h2>
      </div>
      <p className="text-sm text-secondary-light dark:text-secondary-dark/70">
        Analyze severe monsoon weather factors along your travel pathway. Get warning metrics, detour options, and travel recommendations before starting your transit.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left side: Inputs form */}
        <div className="m3-card-elevated md:col-span-1 space-y-4">
          <h3 className="text-md font-bold text-secondary dark:text-white flex items-center gap-2 border-b border-secondary/10 dark:border-white/5 pb-2">
            <Compass className="h-5 w-5 text-primary" />
            Route parameters
          </h3>
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-secondary-light dark:text-secondary-dark mb-1">Source / Start Point</label>
              <input
                type="text"
                value={source}
                onChange={e => setSource(e.target.value)}
                placeholder="e.g. Secunderabad"
                className="w-full bg-secondary/5 dark:bg-background-dark/30 border border-secondary/15 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-secondary dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-secondary-light dark:text-secondary-dark mb-1">Destination / End Point</label>
              <input
                type="text"
                value={destination}
                onChange={e => setDestination(e.target.value)}
                placeholder="e.g. Gachibowli"
                className="w-full bg-secondary/5 dark:bg-background-dark/30 border border-secondary/15 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-secondary dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-secondary-light dark:text-secondary-dark mb-1">Travel Time</label>
              <input
                type="text"
                value={travelTime}
                onChange={e => setTravelTime(e.target.value)}
                className="w-full bg-secondary/5 dark:bg-background-dark/30 border border-secondary/15 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-secondary dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-secondary-light dark:text-secondary-dark mb-1">Transit Mode</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMode('car')}
                  className={`flex flex-col items-center p-2 rounded-xl border text-xs font-medium gap-1.5 transition-all ${mode === 'car' ? 'bg-primary/10 border-primary text-primary' : 'bg-transparent border-secondary/15 text-secondary-light hover:bg-secondary/5'}`}
                >
                  <Car className="h-4 w-4" />
                  <span>SUV/Car</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('bike')}
                  className={`flex flex-col items-center p-2 rounded-xl border text-xs font-medium gap-1.5 transition-all ${mode === 'bike' ? 'bg-primary/10 border-primary text-primary' : 'bg-transparent border-secondary/15 text-secondary-light hover:bg-secondary/5'}`}
                >
                  <Bike className="h-4 w-4" />
                  <span>Two-Wheeler</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('walk')}
                  className={`flex flex-col items-center p-2 rounded-xl border text-xs font-medium gap-1.5 transition-all ${mode === 'walk' ? 'bg-primary/10 border-primary text-primary' : 'bg-transparent border-secondary/15 text-secondary-light hover:bg-secondary/5'}`}
                >
                  <Compass className="h-4 w-4" />
                  <span>Walk/Transit</span>
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-full bg-primary hover:bg-primary-light text-white font-semibold text-sm flex items-center justify-center space-x-2 shadow-sm transition-all"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Analyzing Route Danger...</span>
                </>
              ) : (
                <>
                  <Compass className="h-4 w-4" />
                  <span>Calculate Safety Score</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right side: Outputs view */}
        <div className="md:col-span-2">
          {advisorResult ? (
            <div className="space-y-6">
              {/* Core metrics grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Weather Risk */}
                <div className="m3-card-elevated p-5 flex flex-col justify-between h-32">
                  <span className="text-2xs font-extrabold uppercase text-secondary-light tracking-wider">Weather Risk</span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-secondary dark:text-white">{advisorResult.weatherRisk}</span>
                    <span className={`px-2.5 py-1 rounded-full border text-xs font-bold ${getRiskBadgeColor(advisorResult.weatherRisk)}`}>
                      Alert
                    </span>
                  </div>
                </div>

                {/* Flood probability */}
                <div className="m3-card-elevated p-5 flex flex-col justify-between h-32">
                  <span className="text-2xs font-extrabold uppercase text-secondary-light tracking-wider">Flood Chance</span>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-black text-secondary dark:text-white">{advisorResult.floodProbability}%</span>
                    <span className="text-2xs text-secondary-light">probability</span>
                  </div>
                </div>

                {/* Delay minutes */}
                <div className="m3-card-elevated p-5 flex flex-col justify-between h-32">
                  <span className="text-2xs font-extrabold uppercase text-secondary-light tracking-wider">Estimated Delay</span>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-black text-secondary dark:text-white">+{advisorResult.trafficDelay} mins</span>
                    <span className="text-2xs text-secondary-light">traffic delay</span>
                  </div>
                </div>

              </div>

              {/* Suggestions */}
              <div className="m3-card-elevated space-y-4">
                <h4 className="text-md font-bold text-secondary dark:text-white flex items-center gap-1.5 border-b border-secondary/10 dark:border-white/5 pb-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500 animate-bounce" />
                  AI Recommendation Directive
                </h4>
                <p className="text-sm text-secondary-light dark:text-secondary-dark/95 leading-relaxed bg-secondary/5 dark:bg-white/5 p-4 rounded-2xl border border-secondary/10 dark:border-white/5">
                  {advisorResult.aiRecommendation}
                </p>

                {/* Alternate route suggestion */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-secondary dark:text-white uppercase tracking-wider block">Recommended Detour Pathway</span>
                  <div className="flex items-center space-x-3 p-3.5 bg-primary/5 rounded-2xl border border-primary/10">
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-secondary dark:text-white">Alternative Route Map Overlay</p>
                      <p className="text-xs text-secondary-light dark:text-secondary-dark/80">{advisorResult.alternativeRoute}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between text-2xs text-secondary-light pt-2">
                  <span>Calculated arrival interval: {advisorResult.estimatedArrival}</span>
                  <span className="underline cursor-pointer hover:text-primary">Open in Google Maps Navigation</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] border-2 border-dashed border-secondary/20 dark:border-white/10 rounded-3xl flex flex-col justify-center items-center text-center p-8 bg-secondary/5 dark:bg-background-dark/20">
              <Navigation className="h-10 w-10 text-secondary-light/65 mb-3" />
              <p className="font-semibold text-secondary dark:text-white text-sm">No Active Calculation</p>
              <p className="text-xs text-secondary-light/80 max-w-sm mt-1">Specify your start location and destination coordinates to evaluate live flooding hazards along the corridor.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
