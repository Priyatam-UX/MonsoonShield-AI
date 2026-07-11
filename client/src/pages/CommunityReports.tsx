import React, { useState, useEffect } from 'react';
import { MapPin, ShieldAlert, Sparkles, MessageCircle, Eye, Check, Image, AlertCircle, Send } from 'lucide-react';
import { apiService } from '../services/api';
import { CommunityReport, ReportCategory } from '../types';
import { useGeolocation } from '../hooks/useGeolocation';

export const CommunityReports: React.FC = () => {
  const geo = useGeolocation();
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [category, setCategory] = useState<ReportCategory>('Flood');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [selectedReport, setSelectedReport] = useState<CommunityReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [dupChecking, setDupChecking] = useState(false);
  const [dupResult, setDupResult] = useState<{ isDuplicate: boolean; reason?: string } | null>(null);

  const loadReports = async () => {
    const data = await apiService.getCommunityReports();
    setReports(data);
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    setLoading(true);
    setDupChecking(true);

    const lat = geo.latitude || 17.4475;
    const lon = geo.longitude || 78.3730;

    // Simulate AI Duplication validation before submitting
    // We look for reports of same category within close radius
    setTimeout(async () => {
      const match = reports.find(r => 
        r.category === category && 
        Math.abs(r.latitude - lat) < 0.003 && 
        Math.abs(r.longitude - lon) < 0.003
      );

      if (match) {
        setDupResult({
          isDuplicate: true,
          reason: `AI flagged this as a potential duplicate of a report submitted by ${match.reporterName} recently ("${match.description}"). It will be filed as a secondary confirmation.`
        });
      }

      await apiService.submitCommunityReport({
        category,
        description: description.trim(),
        imageUrl: photoUrl || 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=400&q=80',
        latitude: lat,
        longitude: lon,
        reporterName: 'Priyatam Kumar'
      });

      setDescription('');
      setPhotoUrl('');
      setDupChecking(false);
      setLoading(false);
      loadReports();
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 font-sans">
      <div className="flex items-center space-x-3">
        <MapPin className="h-7 w-7 text-primary" />
        <h2 className="text-2xl font-extrabold text-secondary dark:text-white">Community Alert Maps</h2>
      </div>
      <p className="text-sm text-secondary-light dark:text-secondary-dark/70">
        Report localized flood conditions, blocked grids, or power disruptions. Gemini validates duplicates automatically to filter noise and pinpoints reports on our central interactive safety grid.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Submit reports form */}
        <div className="m3-card-elevated space-y-4 h-fit">
          <h3 className="text-md font-bold text-secondary dark:text-white flex items-center gap-2 border-b border-secondary/10 dark:border-white/5 pb-2">
            <ShieldAlert className="h-5 w-5 text-primary" />
            File Safety Alert
          </h3>
          
          <form onSubmit={handleSubmitReport} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-secondary-light dark:text-secondary-dark mb-1">Hazard Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as ReportCategory)}
                className="w-full bg-secondary/5 dark:bg-background-dark/30 border border-secondary/15 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm text-secondary dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Flood">Flood / Waterlogging</option>
                <option value="Road blockage">Road blockage / Tree fall</option>
                <option value="Power outage">Power outage / Transformer cut</option>
                <option value="Tree fall">Tree fall</option>
                <option value="Landslide">Landslide</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-secondary-light dark:text-secondary-dark mb-1">Details & Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Explain the water depth, lanes blocked, or power hazard details..."
                rows={3}
                className="w-full bg-secondary/5 dark:bg-background-dark/30 border border-secondary/15 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-secondary dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-secondary-light dark:text-secondary-dark mb-1">Attachment URL (Optional)</label>
              <input
                type="text"
                value={photoUrl}
                onChange={e => setPhotoUrl(e.target.value)}
                placeholder="Paste photo link or select file..."
                className="w-full bg-secondary/5 dark:bg-background-dark/30 border border-secondary/15 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-secondary dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="p-3 bg-secondary/5 dark:bg-white/5 rounded-2xl border border-secondary/10 dark:border-white/5 text-2xs text-secondary-light flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-primary animate-pulse flex-shrink-0" />
              <span>
                Coordinates: {geo.latitude?.toFixed(4) || '17.4475'}, {geo.longitude?.toFixed(4) || '78.3730'} (Current Location)
              </span>
            </div>

            {dupResult && (
              <div className="bg-amber-500/10 border-l-4 border-amber-500 p-3 rounded-r-xl text-amber-600 dark:text-amber-400 text-2xs space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  AI Duplication Screen
                </p>
                <p>{dupResult.reason}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !description.trim()}
              className="w-full py-3 px-4 rounded-full bg-primary hover:bg-primary-light disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center space-x-2 shadow-sm transition-all"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>AI Double Checking...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Submit Safety Alert</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right column: Interactive Map Visualization */}
        <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
          <div className="m3-card-elevated flex-1 flex flex-col justify-between min-h-[450px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-md font-bold text-secondary dark:text-white">Active Alert Map Layer</h3>
              <span className="text-2xs text-secondary-light">Click pins to inspect details</span>
            </div>

            {/* Interactive Vector Map Grid */}
            <div className="relative flex-1 bg-secondary/10 dark:bg-background-dark/80 rounded-3xl overflow-hidden border border-secondary/15 dark:border-white/5 flex items-center justify-center min-h-[300px]">
              
              {/* Grid representation */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
              
              {/* Simulated Map Streets */}
              <svg className="absolute inset-0 h-full w-full opacity-35 dark:opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                {/* Gachibowli flyovers */}
                <path d="M 0 100 Q 150 150 400 200 T 800 300" fill="none" stroke="currentColor" strokeWidth="8" />
                <path d="M 100 0 L 200 400" fill="none" stroke="currentColor" strokeWidth="6" />
                {/* Outer Ring Road */}
                <path d="M 300 0 C 450 180 500 220 800 120" fill="none" stroke="currentColor" strokeWidth="12" strokeDasharray="5,5" />
              </svg>

              {/* Safe sectors indicator (Heatmap background overlay) */}
              <div className="absolute top-1/3 left-1/4 w-32 h-32 rounded-full bg-danger/10 blur-xl pointer-events-none" />
              <div className="absolute bottom-1/4 right-1/3 w-36 h-36 rounded-full bg-amber-500/10 blur-xl pointer-events-none" />

              {/* Pins Mapping */}
              {reports.map((rep) => {
                // Map coordinate ranges to SVG percents roughly around Hyderabad defaults
                // Hyderabad lat: ~17.40-17.50, lon: ~78.30-78.50
                const x = ((rep.longitude - 78.34) / (78.50 - 78.34)) * 100;
                const y = (1 - (rep.latitude - 17.40) / (17.50 - 17.40)) * 100;

                const getPinColor = (cat: ReportCategory) => {
                  switch (cat) {
                    case 'Flood': return 'text-danger bg-danger/20';
                    case 'Power outage': return 'text-amber-500 bg-amber-500/20';
                    default: return 'text-indigo-600 bg-indigo-600/20';
                  }
                };

                return (
                  <button
                    key={rep.id}
                    onClick={() => setSelectedReport(rep)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group z-10 flex items-center justify-center p-1 rounded-full border border-current transition-all hover:scale-115"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <MapPin className={`h-5 w-5 ${getPinColor(rep.category).split(' ')[0]}`} />
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-black text-white text-3xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none mb-1 shadow">
                      {rep.category}
                    </span>
                  </button>
                );
              })}

              {/* User Position Pin */}
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 h-4 w-4 bg-primary rounded-full border-2 border-white animate-bounce flex items-center justify-center shadow"
                style={{ left: '60%', top: '55%' }}
              >
                <div className="h-2 w-2 bg-white rounded-full" />
              </div>

            </div>

            {/* Selected Pin details cards */}
            {selectedReport && (
              <div className="mt-4 p-4 rounded-2xl bg-secondary/5 dark:bg-white/5 border border-secondary/15 dark:border-white/5 flex flex-col sm:flex-row gap-4 items-start animate-fade-in shadow-sm">
                {selectedReport.imageUrl && (
                  <img src={selectedReport.imageUrl} alt="alert detail" className="w-full sm:w-28 h-20 object-cover rounded-xl border border-secondary/10 flex-shrink-0" />
                )}
                <div className="flex-1 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-secondary dark:text-white uppercase tracking-wide">
                      {selectedReport.category}Alert
                    </span>
                    <span className="text-3xs text-secondary-light">
                      {new Date(selectedReport.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-secondary-light dark:text-secondary-dark leading-relaxed">{selectedReport.description}</p>
                  <div className="flex justify-between items-center text-3xs text-secondary-light/75 pt-2">
                    <span>Filed by: {selectedReport.reporterName}</span>
                    <span className="text-success font-bold flex items-center gap-0.5">
                      <Check className="h-3.5 w-3.5" /> AI Validated
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

// Simulated Refresh icon replacement helper to avoid package missing
const RefreshCw: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/>
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
    <path d="M16 16h5v5"/>
  </svg>
);
