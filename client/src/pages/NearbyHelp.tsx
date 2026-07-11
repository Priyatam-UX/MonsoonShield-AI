import React, { useState, useEffect } from 'react';
import { HelpCircle, MapPin, Phone, Hospital, Shield, BatteryCharging, RefreshCw, Layers } from 'lucide-react';
import { apiService } from '../services/api';
import { HelpCenter } from '../types';
import { useGeolocation } from '../hooks/useGeolocation';

export const NearbyHelp: React.FC = () => {
  const geo = useGeolocation();
  const [centers, setCenters] = useState<HelpCenter[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [selectedCenter, setSelectedCenter] = useState<HelpCenter | null>(null);

  const loadHelp = async () => {
    setLoading(true);
    try {
      const lat = geo.latitude || 17.4399;
      const lon = geo.longitude || 78.4983;
      const data = await apiService.getNearbyHelp(lat, lon);
      setCenters(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHelp();
  }, [geo.latitude]);

  const filteredCenters = filter === 'All' 
    ? centers 
    : centers.filter(c => c.type === filter);

  const getIcon = (type: string) => {
    switch (type) {
      case 'Hospital': return <Hospital className="h-4 w-4" />;
      case 'Police': return <Shield className="h-4 w-4" />;
      case 'Charging Station': return <BatteryCharging className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getPinColor = (type: string) => {
    switch (type) {
      case 'Hospital': return 'text-danger bg-danger/15';
      case 'Police': return 'text-primary bg-primary/15';
      case 'Shelter': return 'text-success bg-success/15';
      case 'Charging Station': return 'text-amber-500 bg-amber-500/15';
      default: return 'text-indigo-600 bg-indigo-600/15';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 font-sans">
      <div className="flex items-center space-x-3">
        <HelpCircle className="h-7 w-7 text-primary" />
        <h2 className="text-2xl font-extrabold text-secondary dark:text-white">Emergency Help Map</h2>
      </div>
      <p className="text-sm text-secondary-light dark:text-secondary-dark/70">
        Locate nearest civic relief infrastructures. Filter police quarters, hospitals, charging banks, food camps, and emergency shelters.
      </p>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-secondary/15 dark:border-white/5 pb-4">
        {['All', 'Hospital', 'Police', 'Shelter', 'Charging Station', 'Food Camp'].map((type) => (
          <button
            key={type}
            onClick={() => { setFilter(type); setSelectedCenter(null); }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${filter === type ? 'bg-primary border-primary text-white shadow-sm' : 'bg-white dark:bg-surface-dark border-secondary/20 dark:border-white/10 text-secondary dark:text-white hover:bg-secondary/5'}`}
          >
            {type}s
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Centers List */}
        <div className="space-y-4 lg:col-span-1 max-h-[500px] overflow-y-auto pr-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <span className="text-xs text-secondary-light">Mapping emergency cells...</span>
            </div>
          ) : filteredCenters.length > 0 ? (
            filteredCenters.map(center => (
              <div
                key={center.id}
                onClick={() => setSelectedCenter(center)}
                className={`m3-card-elevated p-4 cursor-pointer border transition-all hover:scale-[1.01] ${selectedCenter?.id === center.id ? 'border-primary ring-1 ring-primary' : 'border-transparent'}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2.5">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${getPinColor(center.type)}`}>
                      {getIcon(center.type)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-secondary dark:text-white">{center.name}</h4>
                      <p className="text-3xs text-secondary-light">{center.type} • {center.distance}</p>
                    </div>
                  </div>
                </div>

                {center.availableSlots !== undefined && (
                  <p className="text-3xs text-success font-bold mt-2">
                    Slots: {center.availableSlots} capacities left
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-xs text-secondary-light">
              No centers found matching filter.
            </div>
          )}
        </div>

        {/* Right Side: Map Frame */}
        <div className="lg:col-span-2">
          <div className="m3-card-elevated flex flex-col justify-between h-full min-h-[450px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-md font-bold text-secondary dark:text-white flex items-center gap-1.5">
                <Layers className="h-4.5 w-4.5 text-primary" />
                Relief Coverage map
              </h3>
              <span className="text-3xs text-secondary-light">Showing {filteredCenters.length} safety cells</span>
            </div>

            {/* Simulated map panel */}
            <div className="relative flex-1 bg-secondary/10 dark:bg-background-dark/80 rounded-3xl overflow-hidden border border-secondary/15 dark:border-white/5 min-h-[300px]">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

              <svg className="absolute inset-0 h-full w-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 0 100 Q 150 150 400 200 T 800 300" fill="none" stroke="currentColor" strokeWidth="6" />
                <path d="M 100 0 L 200 400" fill="none" stroke="currentColor" strokeWidth="4" />
              </svg>

              {/* Pins mapping */}
              {filteredCenters.map(center => {
                const x = ((center.longitude - 78.34) / (78.50 - 78.34)) * 100;
                const y = (1 - (center.latitude - 17.40) / (17.50 - 17.40)) * 100;

                return (
                  <button
                    key={center.id}
                    onClick={() => setSelectedCenter(center)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group z-10 flex items-center justify-center p-1 rounded-full border border-current hover:scale-115 transition-all"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <div className={`p-1 rounded-full ${getPinColor(center.type)}`}>
                      {getIcon(center.type)}
                    </div>
                  </button>
                );
              })}

              {/* Center Detail Panel Overlay */}
              {selectedCenter && (
                <div className="absolute bottom-4 left-4 right-4 bg-white dark:bg-surface-dark border border-secondary/15 dark:border-white/5 p-4 rounded-2xl shadow-m3-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 animate-fade-in">
                  <div>
                    <span className="text-3xs font-extrabold uppercase text-primary tracking-wider">{selectedCenter.type} Details</span>
                    <h4 className="text-xs font-extrabold text-secondary dark:text-white mt-0.5">{selectedCenter.name}</h4>
                    <p className="text-3xs text-secondary-light mt-0.5">{selectedCenter.address}</p>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0 w-full sm:w-auto">
                    <a
                      href={`tel:${selectedCenter.phone}`}
                      className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-full bg-primary hover:bg-primary-light text-white text-3xs font-bold flex items-center justify-center gap-1 shadow-sm"
                    >
                      <Phone className="h-3 w-3" />
                      <span>Call Node</span>
                    </a>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
