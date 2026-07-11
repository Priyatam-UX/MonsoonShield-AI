import React, { useState } from 'react';
import { ShieldCheck, Sparkles, AlertCircle, RefreshCw, Square, CheckSquare, Layers } from 'lucide-react';
import { apiService } from '../services/api';

interface RecoveryPlan {
  cleaningOrder: string[];
  insuranceGuidance: string[];
  medicalPrecautions: string[];
  waterSafety: string[];
  foodSafety: string[];
  repairChecklist: string[];
}

export const RecoveryPlanner: React.FC = () => {
  const [details, setDetails] = useState('Ground floor flooding of 1.5 feet. Mud on carpets. Power sockets submerged but now dry.');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<RecoveryPlan | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;
    setLoading(true);
    try {
      const result = await apiService.generateRecoveryPlan(details);
      setPlan(result);
      setCheckedItems({});
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCheck = (item: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 font-sans">
      <div className="flex items-center space-x-3">
        <ShieldCheck className="h-7 w-7 text-primary" />
        <h2 className="text-2xl font-extrabold text-secondary dark:text-white">AI Post-Monsoon Recovery Planner</h2>
      </div>
      <p className="text-sm text-secondary-light dark:text-secondary-dark/70">
        Generate customized safety blueprints for clearing water damage, reporting claims, vetting structural faults, and restoring utilities after a flood.
      </p>

      {/* Input Form */}
      <div className="m3-card-elevated space-y-4">
        <h3 className="text-md font-bold text-secondary dark:text-white border-b border-secondary/10 dark:border-white/5 pb-2">
          Describe Incident Damage
        </h3>
        <form onSubmit={handleGenerate} className="space-y-4">
          <textarea
            value={details}
            onChange={e => setDetails(e.target.value)}
            placeholder="e.g. Back yard flooded, electrical breaker damp, car engine was submerged..."
            rows={3}
            className="w-full bg-secondary/5 dark:bg-background-dark/30 border border-secondary/15 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-secondary dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-light disabled:opacity-50 text-white font-semibold text-sm flex items-center space-x-2 shadow-sm transition-all"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>AI Compiling Blueprint...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Recovery Plan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Output checklists */}
      {plan && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          
          {/* Cleaning Timeline */}
          <div className="m3-card-elevated space-y-3">
            <h4 className="text-sm font-bold text-secondary dark:text-white flex items-center gap-1.5 border-b border-secondary/10 dark:border-white/5 pb-2">
              <Layers className="h-4.5 w-4.5 text-primary" />
              1. Sanitization Sequence
            </h4>
            <div className="space-y-2">
              {plan.cleaningOrder.map((item, idx) => {
                const key = `clean-${idx}`;
                const checked = !!checkedItems[key];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleCheck(key)}
                    className="flex items-start space-x-2 p-2 rounded-xl bg-secondary/5 dark:bg-white/5 cursor-pointer hover:bg-secondary/10 transition-colors"
                  >
                    {checked ? <CheckSquare className="h-4 w-4 text-primary mt-0.5" /> : <Square className="h-4 w-4 text-secondary-light mt-0.5" />}
                    <span className={`text-xs ${checked ? 'line-through text-secondary-light/60' : 'text-secondary dark:text-secondary-dark'}`}>{item}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Insurance */}
          <div className="m3-card-elevated space-y-3">
            <h4 className="text-sm font-bold text-secondary dark:text-white flex items-center gap-1.5 border-b border-secondary/10 dark:border-white/5 pb-2">
              <Layers className="h-4.5 w-4.5 text-primary" />
              2. Insurance & Claims Guidance
            </h4>
            <div className="space-y-2">
              {plan.insuranceGuidance.map((item, idx) => {
                const key = `insure-${idx}`;
                const checked = !!checkedItems[key];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleCheck(key)}
                    className="flex items-start space-x-2 p-2 rounded-xl bg-secondary/5 dark:bg-white/5 cursor-pointer hover:bg-secondary/10 transition-colors"
                  >
                    {checked ? <CheckSquare className="h-4 w-4 text-primary mt-0.5" /> : <Square className="h-4 w-4 text-secondary-light mt-0.5" />}
                    <span className={`text-xs ${checked ? 'line-through text-secondary-light/60' : 'text-secondary dark:text-secondary-dark'}`}>{item}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Medical precautions */}
          <div className="m3-card-elevated space-y-3">
            <h4 className="text-sm font-bold text-secondary dark:text-white flex items-center gap-1.5 border-b border-secondary/10 dark:border-white/5 pb-2">
              <AlertCircle className="h-4.5 w-4.5 text-danger" />
              3. Safety & Medical Precautions
            </h4>
            <div className="space-y-2">
              {plan.medicalPrecautions.map((item, idx) => {
                const key = `medical-${idx}`;
                const checked = !!checkedItems[key];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleCheck(key)}
                    className="flex items-start space-x-2 p-2 rounded-xl bg-secondary/5 dark:bg-white/5 cursor-pointer hover:bg-secondary/10 transition-colors"
                  >
                    {checked ? <CheckSquare className="h-4 w-4 text-primary mt-0.5" /> : <Square className="h-4 w-4 text-secondary-light mt-0.5" />}
                    <span className={`text-xs ${checked ? 'line-through text-secondary-light/60' : 'text-secondary dark:text-secondary-dark'}`}>{item}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Water/Food security */}
          <div className="m3-card-elevated space-y-3">
            <h4 className="text-sm font-bold text-secondary dark:text-white flex items-center gap-1.5 border-b border-secondary/10 dark:border-white/5 pb-2">
              <AlertCircle className="h-4.5 w-4.5 text-primary" />
              4. Food & Water Vetting
            </h4>
            <div className="space-y-2">
              {[...plan.waterSafety, ...plan.foodSafety].map((item, idx) => {
                const key = `wf-${idx}`;
                const checked = !!checkedItems[key];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleCheck(key)}
                    className="flex items-start space-x-2 p-2 rounded-xl bg-secondary/5 dark:bg-white/5 cursor-pointer hover:bg-secondary/10 transition-colors"
                  >
                    {checked ? <CheckSquare className="h-4 w-4 text-primary mt-0.5" /> : <Square className="h-4 w-4 text-secondary-light mt-0.5" />}
                    <span className={`text-xs ${checked ? 'line-through text-secondary-light/60' : 'text-secondary dark:text-secondary-dark'}`}>{item}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Repairs checklist */}
          <div className="m3-card-elevated space-y-3 md:col-span-2">
            <h4 className="text-sm font-bold text-secondary dark:text-white flex items-center gap-1.5 border-b border-secondary/10 dark:border-white/5 pb-2">
              <Layers className="h-4.5 w-4.5 text-primary" />
              5. Structural & Power Systems Vetting
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {plan.repairChecklist.map((item, idx) => {
                const key = `repair-${idx}`;
                const checked = !!checkedItems[key];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleCheck(key)}
                    className="flex items-start space-x-2 p-2.5 rounded-xl bg-secondary/5 dark:bg-white/5 cursor-pointer hover:bg-secondary/10 transition-colors"
                  >
                    {checked ? <CheckSquare className="h-4 w-4 text-primary mt-0.5" /> : <Square className="h-4 w-4 text-secondary-light mt-0.5" />}
                    <span className={`text-xs ${checked ? 'line-through text-secondary-light/60' : 'text-secondary dark:text-secondary-dark'}`}>{item}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
