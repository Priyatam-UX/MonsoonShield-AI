import React, { useState } from 'react';
import { Users, ShieldCheck, MapPin, Phone, HelpCircle, UserCheck, HeartHandshake } from 'lucide-react';
import { FamilyMember, FamilyStatus } from '../types';

export const FamilySafety: React.FC = () => {
  const [members, setMembers] = useState<FamilyMember[]>([
    {
      id: 'fam-1',
      name: 'Rohan Kumar (Brother)',
      status: 'Travelling',
      latitude: 17.4320,
      longitude: 78.4080,
      lastUpdated: new Date(Date.now() - 600000).toISOString(),
      contact: '+91 98765 11111'
    },
    {
      id: 'fam-2',
      name: 'Suhasini Kumar (Mother)',
      status: 'Safe',
      latitude: 17.4399,
      longitude: 78.4983,
      lastUpdated: new Date(Date.now() - 3600000).toISOString(),
      contact: '+91 98765 22222'
    },
    {
      id: 'fam-3',
      name: 'Dr. Rajesh Kumar (Father)',
      status: 'Needs Help',
      latitude: 17.4475,
      longitude: 78.3730,
      lastUpdated: new Date(Date.now() - 300000).toISOString(),
      contact: '+91 98765 33333'
    }
  ]);

  const getStatusColor = (status: FamilyStatus) => {
    switch (status) {
      case 'Safe': return 'bg-success/15 text-success border-success/20';
      case 'Travelling': return 'bg-warning/15 text-warning border-warning/20';
      case 'Needs Help': return 'bg-danger/15 text-danger border-danger/20 animate-pulse';
      default: return 'bg-secondary/15 text-secondary border-secondary/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 font-sans">
      <div className="flex items-center space-x-3">
        <Users className="h-7 w-7 text-primary" />
        <h2 className="text-2xl font-extrabold text-secondary dark:text-white">Family Safety Circles</h2>
      </div>
      <p className="text-sm text-secondary-light dark:text-secondary-dark/70">
        Monitor coordinate positions and safety flags of family circle members. Direct dial coordinates or launch SOS requests for members flagging for support.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: list of members */}
        <div className="space-y-4 lg:col-span-1">
          {members.map(member => (
            <div
              key={member.id}
              className="m3-card-elevated space-y-3 hover:scale-[1.01] transition-transform"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                    {member.name.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-secondary dark:text-white">{member.name}</h4>
                    <p className="text-3xs text-secondary-light">
                      Updated {new Date(member.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full border text-xs font-bold ${getStatusColor(member.status)}`}>
                  {member.status}
                </span>
              </div>

              <div className="text-xs text-secondary-light dark:text-secondary-dark/70 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span>GPS Location: {member.latitude.toFixed(4)}, {member.longitude.toFixed(4)}</span>
              </div>

              <div className="flex justify-between items-center border-t border-secondary/10 dark:border-white/5 pt-3">
                <a
                  href={`tel:${member.contact}`}
                  className="px-3 py-1.5 rounded-full bg-secondary/10 dark:bg-white/5 text-secondary dark:text-white hover:bg-secondary/15 text-3xs font-bold flex items-center gap-1"
                >
                  <Phone className="h-3 w-3" />
                  <span>Call Member</span>
                </a>
                
                {member.status === 'Needs Help' && (
                  <button className="px-3 py-1.5 rounded-full bg-danger text-white hover:bg-danger-light text-3xs font-bold flex items-center gap-1 shadow-sm">
                    <HeartHandshake className="h-3 w-3" />
                    <span>Send Assistance</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right: Map tracking */}
        <div className="lg:col-span-2">
          <div className="m3-card-elevated flex flex-col justify-between h-full min-h-[400px]">
            <h3 className="text-md font-bold text-secondary dark:text-white mb-4">Safety Circle Location Grid</h3>
            
            <div className="relative flex-1 bg-secondary/10 dark:bg-background-dark/80 rounded-3xl overflow-hidden border border-secondary/15 dark:border-white/5 min-h-[300px]">
              {/* grid pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

              <svg className="absolute inset-0 h-full w-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 0 100 Q 150 150 400 200 T 800 300" fill="none" stroke="currentColor" strokeWidth="6" />
                <path d="M 100 0 L 200 400" fill="none" stroke="currentColor" strokeWidth="4" />
              </svg>

              {/* Members plotted on coordinates */}
              {members.map(member => {
                // simple mapping calculation
                const x = ((member.longitude - 78.34) / (78.50 - 78.34)) * 100;
                const y = (1 - (member.latitude - 17.40) / (17.50 - 17.40)) * 100;

                const getPinColor = (status: FamilyStatus) => {
                  if (status === 'Safe') return 'text-success bg-success/20';
                  if (status === 'Travelling') return 'text-warning bg-warning/20';
                  return 'text-danger bg-danger/20 animate-bounce';
                };

                return (
                  <div
                    key={member.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-10"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <div className={`p-1 rounded-full border border-current ${getPinColor(member.status)}`}>
                      <MapPin className="h-5 w-5" />
                    </div>
                    <span className="bg-black/80 text-white text-4xs px-1.5 py-0.5 rounded whitespace-nowrap mt-1 shadow">
                      {member.name.split(' ')[0]} ({member.status})
                    </span>
                  </div>
                );
              })}

              {/* My location */}
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                style={{ left: '60%', top: '55%' }}
              >
                <div className="h-4 w-4 bg-primary rounded-full border-2 border-white flex items-center justify-center shadow">
                  <div className="h-2 w-2 bg-white rounded-full" />
                </div>
                <span className="bg-primary/90 text-white text-4xs px-1.5 py-0.5 rounded whitespace-nowrap mt-1 shadow font-bold">
                  You
                </span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
