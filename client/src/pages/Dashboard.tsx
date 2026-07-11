import React, { useEffect, useState } from 'react';
import { CloudRain, Compass, ShieldAlert, AlertCircle, RefreshCw, Zap, Navigation, Users, MapPin, FileCheck, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import { WeatherInfo } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const mockChartData = [
  { time: '12 PM', probability: 45 },
  { time: '2 PM', probability: 60 },
  { time: '4 PM', probability: 95 },
  { time: '6 PM', probability: 90 },
  { time: '8 PM', probability: 80 },
  { time: '10 PM', probability: 55 },
];

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { profile, isOffline } = useApp();
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [riskData, setRiskData] = useState<{ riskScore: number; riskExplanation: string; recommendations: string[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    setRefreshing(true);
    try {
      const weatherData = await apiService.fetchWeather(17.4399, 78.4983);
      setWeather(weatherData);

      const rData = await apiService.analyzeRisk(weatherData, profile);
      setRiskData(rData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [profile]);

  if (loading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center space-y-4">
        <RefreshCw className="h-10 w-10 animate-spin text-primary" />
        <span className="text-secondary-light text-sm">Analyzing regional hazard indexes...</span>
      </div>
    );
  }

  // Get color based on risk score
  const getRiskColor = (score: number) => {
    if (score < 40) return 'text-success border-success';
    if (score < 75) return 'text-warning border-warning';
    return 'text-danger border-danger';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner Alert */}
      {weather && weather.alerts.length > 0 && (
        <div className="bg-danger/10 border-l-4 border-danger p-4 rounded-r-2xl flex items-start space-x-3 text-danger-dark dark:text-danger-light text-sm shadow-sm">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold">Active Alerts:</span>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              {weather.alerts.map((alt, i) => (
                <li key={i}>{alt}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weather Card */}
        <div className="m3-card-elevated flex flex-col justify-between h-full min-h-[300px]">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-secondary dark:text-white flex items-center gap-2">
                <CloudRain className="text-primary h-5 w-5" />
                Live Weather
              </h3>
              {isOffline && (
                <span className="px-2 py-0.5 text-2xs font-semibold rounded bg-secondary/15 text-secondary">Offline Cache</span>
              )}
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-5xl font-extrabold text-secondary dark:text-white">{weather?.temp}°C</span>
              <span className="text-sm font-medium text-secondary-light dark:text-secondary-dark/60">{weather?.condition}</span>
            </div>
          </div>

          {/* Sparkline chart of rainfall probability */}
          <div className="h-28 w-full my-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart accessibilityLayer data={mockChartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(175, 80%, 30%)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(175, 80%, 30%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={9} />
                <YAxis stroke="#94a3b8" fontSize={9} />
                <Tooltip />
                <Area type="monotone" dataKey="probability" stroke="hsl(175, 80%, 30%)" fillOpacity={1} fill="url(#colorRain)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 border-t border-secondary/10 dark:border-white/5 pt-4 text-center">
            <div>
              <p className="text-2xs text-secondary-light uppercase">Humidity</p>
              <p className="font-bold text-sm text-secondary dark:text-white">{weather?.humidity}%</p>
            </div>
            <div>
              <p className="text-2xs text-secondary-light uppercase">Wind</p>
              <p className="font-bold text-sm text-secondary dark:text-white">{weather?.windSpeed} km/h</p>
            </div>
            <div>
              <p className="text-2xs text-secondary-light uppercase">Rain Prob</p>
              <p className="font-bold text-sm text-secondary dark:text-white">{weather?.rainProb}%</p>
            </div>
          </div>
        </div>

        {/* Risk Score Meter */}
        <div className="m3-card-elevated flex flex-col justify-between items-center text-center h-full min-h-[300px]">
          <div className="w-full flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-secondary dark:text-white flex items-center gap-2">
              <ShieldAlert className="text-primary h-5 w-5" />
              AI Risk Index
            </h3>
            <button onClick={loadDashboardData} disabled={refreshing} className="p-1.5 hover:bg-secondary/10 dark:hover:bg-white/10 rounded-full transition-colors">
              <RefreshCw className={`h-4 w-4 text-secondary-light ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Circular progress meter */}
          <div className="relative flex items-center justify-center my-4">
            <svg className="w-36 h-36 transform -rotate-90" role="img" aria-label={`AI Risk Score circular meter showing ${riskData?.riskScore || 0} out of 100`}>
              <title>AI Risk Meter</title>
              <desc>{`Risk Score: ${riskData?.riskScore || 0} - ${riskData?.riskExplanation || ''}`}</desc>
              <circle cx="72" cy="72" r="62" stroke="currentColor" strokeWidth="8" className="text-secondary/10 dark:text-white/5" fill="transparent" />
              <circle
                cx="72"
                cy="72"
                r="62"
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 62}
                strokeDashoffset={2 * Math.PI * 62 * (1 - (riskData?.riskScore || 0) / 100)}
                className={`transition-all duration-1000 ${getRiskColor(riskData?.riskScore || 0)}`}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-extrabold text-secondary dark:text-white">{riskData?.riskScore}</span>
              <span className="text-2xs font-semibold tracking-wider text-secondary-light uppercase">Score</span>
            </div>
          </div>

          <p className="text-xs text-secondary-light dark:text-secondary-dark/80 px-2 line-clamp-3">
            {riskData?.riskExplanation}
          </p>
        </div>

        {/* Quick Actions Panel */}
        <div className="m3-card-elevated flex flex-col justify-between h-full min-h-[300px]">
          <h3 className="text-lg font-bold text-secondary dark:text-white flex items-center gap-2 mb-4">
            <Compass className="text-primary h-5 w-5" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3 flex-1">
            <button
              onClick={() => onNavigate('sos')}
              className="flex flex-col justify-center items-center p-3 rounded-2xl bg-danger/10 border border-danger/20 hover:bg-danger/25 text-danger transition-all gap-1.5 shadow-sm"
            >
              <AlertCircle className="h-6 w-6" />
              <span className="text-xs font-bold">Emergency SOS</span>
            </button>

            <button
              onClick={() => onNavigate('travel')}
              className="flex flex-col justify-center items-center p-3 rounded-2xl bg-primary/10 border border-primary/20 hover:bg-primary/25 text-primary-dark dark:text-primary-light transition-all gap-1.5 shadow-sm"
            >
              <Navigation className="h-6 w-6" />
              <span className="text-xs font-bold">Travel Advisor</span>
            </button>

            <button
              onClick={() => onNavigate('reports')}
              className="flex flex-col justify-center items-center p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/25 text-amber-600 dark:text-amber-400 transition-all gap-1.5 shadow-sm"
            >
              <MapPin className="h-6 w-6" />
              <span className="text-xs font-bold">Community Alerts</span>
            </button>

            <button
              onClick={() => onNavigate('planner')}
              className="flex flex-col justify-center items-center p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/25 text-indigo-600 dark:text-indigo-400 transition-all gap-1.5 shadow-sm"
            >
              <FileCheck className="h-6 w-6" />
              <span className="text-xs font-bold">Prep Planner</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Recommendations & News ticker bottom deck */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Recommendations */}
        <div className="m3-card-elevated space-y-4">
          <h3 className="text-lg font-bold text-secondary dark:text-white flex items-center gap-2">
            <Zap className="text-primary h-5 w-5" />
            AI Daily Directives
          </h3>
          <ul className="space-y-3">
            {riskData?.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start space-x-3 text-sm text-secondary-light dark:text-secondary-dark/80">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                  {i + 1}
                </span>
                <span className="flex-1">{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Community & Safety Info Widget */}
        <div className="m3-card-elevated flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-secondary dark:text-white flex items-center gap-2 mb-3">
              <Users className="text-primary h-5 w-5" />
              Family Safe Checks
            </h3>
            <p className="text-sm text-secondary-light dark:text-secondary-dark/70 mb-4">
              Monitor active locations and coordinate statuses for registered family circles.
            </p>
          </div>
          <div className="flex items-center justify-between border border-secondary/15 dark:border-white/5 rounded-2xl p-4 bg-secondary/5 dark:bg-background-dark/30">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-success/20 text-success flex items-center justify-center font-bold">
                PK
              </div>
              <div>
                <p className="text-xs font-bold text-secondary dark:text-white">Priyatam Kumar (You)</p>
                <p className="text-2xs text-secondary-light">Safe • Gachibowli Office</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('family')}
              className="px-3 py-1.5 rounded-full bg-primary text-white text-xs font-semibold hover:bg-primary-light transition-all shadow-sm"
            >
              Verify Safety
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
