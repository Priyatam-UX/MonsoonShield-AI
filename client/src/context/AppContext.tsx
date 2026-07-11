import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'te' | 'hi';
export type Theme = 'light' | 'dark';

export interface UserProfileData {
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

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  user: { name: string; email: string } | null;
  loginWithGoogle: () => void;
  logout: () => void;
  isOffline: boolean;
  profile: UserProfileData;
  updateProfile: (data: Partial<UserProfileData>) => void;
}

const defaultProfile: UserProfileData = {
  name: 'Priyatam Kumar',
  age: 28,
  gender: 'Male',
  bloodGroup: 'O+',
  medicalConditions: 'None',
  familyMembers: 'Spouse, 1 Child',
  emergencyContacts: 'Father: +91 98765 43210',
  homeType: 'Apartment (3rd Floor)',
  vehicle: 'SUV (4WD)',
  pets: '1 Dog (Golden Retriever)',
  preferredLanguage: 'en',
  dailyRoute: 'Secunderabad to Gachibowli',
  homeLocation: '17.4399, 78.4983', // Secunderabad
  officeLocation: '17.4483, 78.3741', // Gachibowli
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('language') as Language) || 'en';
  });

  const [user, setUser] = useState<{ name: string; email: string } | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [profile, setProfile] = useState<UserProfileData>(() => {
    const saved = localStorage.getItem('profile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    updateProfile({ preferredLanguage: lang });
  };

  const loginWithGoogle = () => {
    const mockUser = { name: 'Priyatam Kumar', email: 'priyatam@example.com' };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = (data: Partial<UserProfileData>) => {
    setProfile(prev => {
      const updated = { ...prev, ...data };
      localStorage.setItem('profile', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        language,
        setLanguage,
        user,
        loginWithGoogle,
        logout,
        isOffline,
        profile,
        updateProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
