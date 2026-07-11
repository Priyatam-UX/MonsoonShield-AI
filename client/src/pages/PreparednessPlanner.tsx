import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import { FileCheck, Sparkles, AlertCircle, CheckSquare, Square, Battery, ShieldAlert, Heart, Calendar } from 'lucide-react';

interface PrepPlan {
  riskScore: number;
  riskExplanation: string;
  morningChecklist: string[];
  afternoonChecklist: string[];
  eveningChecklist: string[];
  emergencyKit: string[];
  foodRecommendations: string[];
  medicineSuggestions: string[];
  travelSuggestions: string[];
  powerBackupSuggestions: string[];
}

export const PreparednessPlanner: React.FC = () => {
  const { profile } = useApp();
  const [plan, setPlan] = useState<PrepPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const generatePlan = async () => {
    setLoading(true);
    try {
      const weatherData = await apiService.fetchWeather(17.4399, 78.4983);
      const prepPlan = await apiService.generatePrepPlan(weatherData, profile);
      setPlan(prepPlan);
      
      // Load saved checks from local storage if available
      const savedChecks = localStorage.getItem('prep_checks');
      if (savedChecks) {
        setCheckedItems(JSON.parse(savedChecks));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generatePlan();
  }, [profile]);

  const toggleCheck = (item: string) => {
    setCheckedItems(prev => {
      const updated = { ...prev, [item]: !prev[item] };
      localStorage.setItem('prep_checks', JSON.stringify(updated));
      return updated;
    });
  };

  if (loading) {
    return (
      <div className="flex h-[75vh] flex-col items-center justify-center space-y-4">
        <Sparkles className="h-10 w-10 animate-spin text-primary" />
        <span className="text-secondary-light text-sm font-semibold">Consulting Gemini to map out custom safety plans...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <FileCheck className="h-7 w-7 text-primary" />
          <h2 className="text-2xl font-extrabold text-secondary dark:text-white">AI Safety Planner</h2>
        </div>
        <button
          onClick={generatePlan}
          className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-light text-white text-sm font-semibold flex items-center space-x-2 shadow-sm transition-all"
        >
          <Sparkles className="h-4 w-4" />
          <span>Regenerate AI Plan</span>
        </button>
      </div>

      {plan && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main timeline checklist */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Timeline: Morning */}
            <div className="m3-card-elevated space-y-4">
              <h3 className="text-md font-bold text-secondary dark:text-white flex items-center gap-2 border-b border-secondary/10 dark:border-white/5 pb-2">
                <Calendar className="h-5 w-5 text-primary" />
                Morning Action Plan
              </h3>
              <div className="space-y-3">
                {plan.morningChecklist.map((item, idx) => {
                  const key = `morning-${idx}`;
                  const checked = !!checkedItems[key];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleCheck(key)}
                      className="flex items-start space-x-3 p-3 rounded-2xl bg-secondary/5 dark:bg-white/5 cursor-pointer hover:bg-secondary/10 dark:hover:bg-white/10 transition-all"
                    >
                      {checked ? (
                        <CheckSquare className="h-5 w-5 text-primary flex-shrink-0" />
                      ) : (
                        <Square className="h-5 w-5 text-secondary-light flex-shrink-0" />
                      )}
                      <span className={`text-sm leading-relaxed ${checked ? 'line-through text-secondary-light/60' : 'text-secondary dark:text-secondary-dark'}`}>
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timeline: Afternoon */}
            <div className="m3-card-elevated space-y-4">
              <h3 className="text-md font-bold text-secondary dark:text-white flex items-center gap-2 border-b border-secondary/10 dark:border-white/5 pb-2">
                <Calendar className="h-5 w-5 text-amber-500" />
                Afternoon Action Plan
              </h3>
              <div className="space-y-3">
                {plan.afternoonChecklist.map((item, idx) => {
                  const key = `afternoon-${idx}`;
                  const checked = !!checkedItems[key];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleCheck(key)}
                      className="flex items-start space-x-3 p-3 rounded-2xl bg-secondary/5 dark:bg-white/5 cursor-pointer hover:bg-secondary/10 dark:hover:bg-white/10 transition-all"
                    >
                      {checked ? (
                        <CheckSquare className="h-5 w-5 text-primary flex-shrink-0" />
                      ) : (
                        <Square className="h-5 w-5 text-secondary-light flex-shrink-0" />
                      )}
                      <span className={`text-sm leading-relaxed ${checked ? 'line-through text-secondary-light/60' : 'text-secondary dark:text-secondary-dark'}`}>
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timeline: Evening */}
            <div className="m3-card-elevated space-y-4">
              <h3 className="text-md font-bold text-secondary dark:text-white flex items-center gap-2 border-b border-secondary/10 dark:border-white/5 pb-2">
                <Calendar className="h-5 w-5 text-danger" />
                Night Action Plan
              </h3>
              <div className="space-y-3">
                {plan.eveningChecklist.map((item, idx) => {
                  const key = `evening-${idx}`;
                  const checked = !!checkedItems[key];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleCheck(key)}
                      className="flex items-start space-x-3 p-3 rounded-2xl bg-secondary/5 dark:bg-white/5 cursor-pointer hover:bg-secondary/10 dark:hover:bg-white/10 transition-all"
                    >
                      {checked ? (
                        <CheckSquare className="h-5 w-5 text-primary flex-shrink-0" />
                      ) : (
                        <Square className="h-5 w-5 text-secondary-light flex-shrink-0" />
                      )}
                      <span className={`text-sm leading-relaxed ${checked ? 'line-through text-secondary-light/60' : 'text-secondary dark:text-secondary-dark'}`}>
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Side decks: kit list and backup options */}
          <div className="space-y-6">
            
            {/* Risk Index card */}
            <div className="m3-card-elevated bg-primary/5 border border-primary/20 space-y-3">
              <h4 className="text-sm font-extrabold uppercase text-primary tracking-wider flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4" />
                Plan Risk Index
              </h4>
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-extrabold text-secondary dark:text-white">{plan.riskScore}</span>
                <span className="text-xs text-secondary-light">/ 100 Risk</span>
              </div>
              <p className="text-xs text-secondary-light dark:text-secondary-dark/70 leading-relaxed border-t border-secondary/15 dark:border-white/5 pt-2">
                {plan.riskExplanation}
              </p>
            </div>

            {/* Emergency Kit */}
            <div className="m3-card-elevated space-y-3">
              <h4 className="text-sm font-bold text-secondary dark:text-white flex items-center gap-1.5 border-b border-secondary/10 dark:border-white/5 pb-2">
                <ShieldAlert className="h-4 w-4 text-primary" />
                Emergency Kit Checklist
              </h4>
              <ul className="space-y-2">
                {plan.emergencyKit.map((item, idx) => (
                  <li key={idx} className="flex items-center space-x-2 text-xs text-secondary-light dark:text-secondary-dark/85">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Food Recommendations */}
            <div className="m3-card-elevated space-y-3">
              <h4 className="text-sm font-bold text-secondary dark:text-white flex items-center gap-1.5 border-b border-secondary/10 dark:border-white/5 pb-2">
                <Heart className="h-4 w-4 text-primary" />
                Food & Water Safety
              </h4>
              <ul className="space-y-2">
                {plan.foodRecommendations.map((item, idx) => (
                  <li key={idx} className="flex items-center space-x-2 text-xs text-secondary-light dark:text-secondary-dark/85">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Medicine suggestions */}
            <div className="m3-card-elevated space-y-3">
              <h4 className="text-sm font-bold text-secondary dark:text-white flex items-center gap-1.5 border-b border-secondary/10 dark:border-white/5 pb-2">
                <Heart className="h-4 w-4 text-danger" />
                Medicine Suggestions
              </h4>
              <ul className="space-y-2">
                {plan.medicineSuggestions.map((item, idx) => (
                  <li key={idx} className="flex items-center space-x-2 text-xs text-secondary-light dark:text-secondary-dark/85">
                    <div className="h-1.5 w-1.5 rounded-full bg-danger" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Power backups */}
            <div className="m3-card-elevated space-y-3">
              <h4 className="text-sm font-bold text-secondary dark:text-white flex items-center gap-1.5 border-b border-secondary/10 dark:border-white/5 pb-2">
                <Battery className="h-4 w-4 text-primary animate-pulse" />
                Power Backup Suggestions
              </h4>
              <ul className="space-y-2">
                {plan.powerBackupSuggestions.map((item, idx) => (
                  <li key={idx} className="flex items-center space-x-2 text-xs text-secondary-light dark:text-secondary-dark/85">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
