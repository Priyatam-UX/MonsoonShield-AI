import React from 'react';
import { useForm } from 'react-hook-form';
import { useApp, Language } from '../context/AppContext';
import { User, ShieldAlert, Home, Navigation, Sparkles } from 'lucide-react';

interface ProfileFormValues {
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  medicalConditions: string;
  familyMembers: string;
  emergencyContacts: string;
  homeType: string;
  vehicle: string;
  pets: string;
  preferredLanguage: Language;
  dailyRoute: string;
  homeLocation: string;
  officeLocation: string;
}

export const UserProfile: React.FC = () => {
  const { profile, updateProfile } = useApp();
  const { register, handleSubmit } = useForm<ProfileFormValues>({
    defaultValues: profile
  });

  const onSubmit = (data: ProfileFormValues) => {
    updateProfile(data);
    alert('Safety profile updated successfully! AI planners will recalibrate based on these parameters.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 font-sans">
      <div className="flex items-center space-x-3 mb-2">
        <User className="h-7 w-7 text-primary" />
        <h2 className="text-2xl font-extrabold text-secondary dark:text-white">Safety Profile Settings</h2>
      </div>
      <p className="text-sm text-secondary-light dark:text-secondary-dark/70">
        Input details regarding your medical conditions, emergency contacts, daily path checkpoints, and housing type. MonsoonShield AI uses this information to formulate emergency preparedness and travel plans.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Section 1: Demographics & Medical */}
        <div className="m3-card-elevated space-y-4">
          <h3 className="text-md font-bold text-secondary dark:text-white flex items-center gap-2 border-b border-secondary/10 dark:border-white/5 pb-2">
            <ShieldAlert className="h-5 w-5 text-primary" />
            Personal & Health Records
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="profile-name" className="block text-xs font-semibold text-secondary-light dark:text-secondary-dark mb-1">Full Name</label>
              <input
                id="profile-name"
                type="text"
                {...register('name', { required: true })}
                className="w-full bg-secondary/5 dark:bg-background-dark/30 border border-secondary/15 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-secondary dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="profile-age" className="block text-xs font-semibold text-secondary-light dark:text-secondary-dark mb-1">Age</label>
              <input
                id="profile-age"
                type="number"
                {...register('age', { required: true, min: 1, max: 120 })}
                className="w-full bg-secondary/5 dark:bg-background-dark/30 border border-secondary/15 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-secondary dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-secondary-light dark:text-secondary-dark mb-1">Blood Group</label>
              <select
                {...register('bloodGroup')}
                className="w-full bg-secondary/5 dark:bg-background-dark/30 border border-secondary/15 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-secondary dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-secondary-light dark:text-secondary-dark mb-1">Medical Conditions / Allergies</label>
              <textarea
                rows={2}
                {...register('medicalConditions')}
                placeholder="e.g. Asthma (requires inhaler), Penicillin allergy"
                className="w-full bg-secondary/5 dark:bg-background-dark/30 border border-secondary/15 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-secondary dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-secondary-light dark:text-secondary-dark mb-1">Emergency Contact Numbers</label>
              <textarea
                rows={2}
                {...register('emergencyContacts', { required: true })}
                placeholder="e.g. Father: +91 98765 43210, Doctor: +91 99999 88888"
                className="w-full bg-secondary/5 dark:bg-background-dark/30 border border-secondary/15 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-secondary dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Section 2: House & Resources */}
        <div className="m3-card-elevated space-y-4">
          <h3 className="text-md font-bold text-secondary dark:text-white flex items-center gap-2 border-b border-secondary/10 dark:border-white/5 pb-2">
            <Home className="h-5 w-5 text-primary" />
            Home Structural & Logistics Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-secondary-light dark:text-secondary-dark mb-1">Home Type / Construction</label>
              <input
                type="text"
                {...register('homeType')}
                placeholder="e.g. Ground Floor Villa, 3rd Floor Apt"
                className="w-full bg-secondary/5 dark:bg-background-dark/30 border border-secondary/15 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-secondary dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-secondary-light dark:text-secondary-dark mb-1">Vehicle Details</label>
              <input
                type="text"
                {...register('vehicle')}
                placeholder="e.g. Hatchback (FWD), SUV (4WD)"
                className="w-full bg-secondary/5 dark:bg-background-dark/30 border border-secondary/15 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-secondary dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-secondary-light dark:text-secondary-dark mb-1">Pets In Household</label>
              <input
                type="text"
                {...register('pets')}
                placeholder="e.g. None, 1 Cat, 2 Dogs"
                className="w-full bg-secondary/5 dark:bg-background-dark/30 border border-secondary/15 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-secondary dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-secondary-light dark:text-secondary-dark mb-1">Family Members Count / Details</label>
              <input
                type="text"
                {...register('familyMembers')}
                placeholder="e.g. Spouse, 2 Children, 1 Elder"
                className="w-full bg-secondary/5 dark:bg-background-dark/30 border border-secondary/15 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-secondary dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-secondary-light dark:text-secondary-dark mb-1">Preferred Translation Language</label>
              <select
                {...register('preferredLanguage')}
                className="w-full bg-secondary/5 dark:bg-background-dark/30 border border-secondary/15 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-secondary dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="en">English (default)</option>
                <option value="te">Telugu (తెలుగు)</option>
                <option value="hi">Hindi (हिन्दी)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Navigation Routes */}
        <div className="m3-card-elevated space-y-4">
          <h3 className="text-md font-bold text-secondary dark:text-white flex items-center gap-2 border-b border-secondary/10 dark:border-white/5 pb-2">
            <Navigation className="h-5 w-5 text-primary" />
            Geography & Routing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-secondary-light dark:text-secondary-dark mb-1">Daily Transit Route Corridor</label>
              <input
                type="text"
                {...register('dailyRoute')}
                placeholder="e.g. Jubilee Hills to Madhapur"
                className="w-full bg-secondary/5 dark:bg-background-dark/30 border border-secondary/15 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-secondary dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-secondary-light dark:text-secondary-dark mb-1">Gender Identification</label>
              <input
                type="text"
                {...register('gender')}
                placeholder="e.g. Male, Female"
                className="w-full bg-secondary/5 dark:bg-background-dark/30 border border-secondary/15 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-secondary dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-secondary-light dark:text-secondary-dark mb-1">Home GPS Location (Lat, Lon)</label>
              <input
                type="text"
                {...register('homeLocation')}
                placeholder="e.g. 17.4399, 78.4983"
                className="w-full bg-secondary/5 dark:bg-background-dark/30 border border-secondary/15 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-secondary dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-secondary-light dark:text-secondary-dark mb-1">Office GPS Location (Lat, Lon)</label>
              <input
                type="text"
                {...register('officeLocation')}
                placeholder="e.g. 17.4483, 78.3741"
                className="w-full bg-secondary/5 dark:bg-background-dark/30 border border-secondary/15 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-secondary dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-full bg-primary hover:bg-primary-light text-white font-semibold flex items-center space-x-2 shadow-m3-2 transition-all"
          >
            <Sparkles className="h-5 w-5 animate-pulse" />
            <span>Save & Recalibrate AI Models</span>
          </button>
        </div>
      </form>
    </div>
  );
};
