import React, { useState } from 'react';
import { ShieldAlert, Compass, Sparkles, MessageSquare, AlertCircle, RefreshCw, AlertTriangle, CheckSquare } from 'lucide-react';
import { apiService } from '../services/api';

interface FactCheckResult {
  status: 'Likely Fake' | 'Likely Genuine' | 'Unverified';
  reasoning: string;
  safetyRecommendation: string;
}

export const FakeNewsDetector: React.FC = () => {
  const [message, setMessage] = useState('ALERT! GHMC declares emergency ban on travelling. Main grids in Jubilee hills shut down for next 48 hours. Spread this to save lives!');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FactCheckResult | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    try {
      const evaluation = await apiService.detectFakeNews(message);
      setResult(evaluation);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Likely Genuine': return 'bg-success/15 text-success border-success/30';
      case 'Likely Fake': return 'bg-danger/15 text-danger border-danger/30';
      default: return 'bg-warning/15 text-warning border-warning/30';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 font-sans">
      <div className="flex items-center space-x-3">
        <ShieldAlert className="h-7 w-7 text-primary animate-pulse" />
        <h2 className="text-2xl font-extrabold text-secondary dark:text-white">WhatsApp Fake News Detector</h2>
      </div>
      <p className="text-sm text-secondary-light dark:text-secondary-dark/70">
        Paste viral forwards, safety alert advisories, or weather broadcast updates to assess their authenticity using Gemini AI reasoning. Keep neighborhood noise separated from actionable facts.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Side: Text Input */}
        <div className="m3-card-elevated md:col-span-1 space-y-4 h-fit">
          <h3 className="text-md font-bold text-secondary dark:text-white border-b border-secondary/10 dark:border-white/5 pb-2">
            Paste Alert Forward
          </h3>
          <form onSubmit={handleVerify} className="space-y-4">
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Paste WhatsApp text warnings here..."
              rows={5}
              className="w-full bg-secondary/5 dark:bg-background-dark/30 border border-secondary/15 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-secondary dark:text-white focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
              required
            />
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="w-full py-3 px-4 rounded-full bg-primary hover:bg-primary-light disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center space-x-2 shadow-sm transition-all"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Checking Authenticity...</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="h-4 w-4" />
                  <span>Verify Forward</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Verification Details */}
        <div className="md:col-span-2">
          {result ? (
            <div className="m3-card-elevated space-y-5 animate-fade-in">
              <div className="flex justify-between items-center border-b border-secondary/10 dark:border-white/5 pb-3">
                <h3 className="text-md font-bold text-secondary dark:text-white">AI Fact-Check Result</h3>
                <span className={`px-3 py-1 rounded-full border text-xs font-bold ${getStatusBadge(result.status)}`}>
                  {result.status}
                </span>
              </div>

              {/* Logical Reasoning */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-secondary dark:text-white uppercase tracking-wide">Analysis & Reasoning</span>
                <p className="text-xs text-secondary-light dark:text-secondary-dark/95 bg-secondary/5 dark:bg-white/5 p-4 rounded-2xl border border-secondary/10 dark:border-white/5 leading-relaxed">
                  {result.reasoning}
                </p>
              </div>

              {/* Safety directives */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-secondary dark:text-white uppercase tracking-wide">AI Recommendation</span>
                <div className="flex items-start space-x-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <AlertTriangle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-secondary-light dark:text-secondary-dark/90 leading-relaxed">
                    {result.safetyRecommendation}
                  </p>
                </div>
              </div>

              <div className="text-3xs text-secondary-light border-t border-secondary/15 dark:border-white/5 pt-3">
                Disclaimer: Fact checking is simulated using generative benchmarks. Double-verify details on local government alerts.
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] border-2 border-dashed border-secondary/20 dark:border-white/10 rounded-3xl flex flex-col justify-center items-center text-center p-8 bg-secondary/5 dark:bg-background-dark/20">
              <MessageSquare className="h-10 w-10 text-secondary-light/65 mb-3" />
              <p className="font-semibold text-secondary dark:text-white text-sm">No Active Verification</p>
              <p className="text-xs text-secondary-light/80 max-w-sm mt-1">Paste warning notices circulating on chat networks to run logical validation checks against official parameters.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
