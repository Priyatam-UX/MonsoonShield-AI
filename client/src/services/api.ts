import { WeatherInfo, CommunityReport, HelpCenter } from '../types';
import { riskPromptTemplate, plannerPromptTemplate, travelPromptTemplate, recoveryPromptTemplate, fakeNewsPromptTemplate } from '../prompts/templates';

const API_BASE = 'http://localhost:5000/api';

// Realistic mock reports to initialize maps immediately
const mockReports: CommunityReport[] = [
  {
    id: 'rep-1',
    category: 'Flood',
    description: 'Knee-deep flooding under Gachibowli flyover. Sedans cannot pass.',
    imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=400&q=80',
    latitude: 17.4475,
    longitude: 78.3730,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    reporterName: 'Rahul K.',
    isValidated: true
  },
  {
    id: 'rep-2',
    category: 'Tree fall',
    description: 'Large banyan tree fell and blocked double roads near Jubilee Hills Road No. 36.',
    imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80',
    latitude: 17.4320,
    longitude: 78.4080,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    reporterName: 'Sanjana R.',
    isValidated: true
  },
  {
    id: 'rep-3',
    category: 'Power outage',
    description: 'Power cut since 4 hours in Madhapur near Image Gardens.',
    latitude: 17.4435,
    longitude: 78.3900,
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    reporterName: 'Anil Kumar',
    isValidated: true
  }
];

const mockHelpCenters: HelpCenter[] = [
  {
    id: 'h-1',
    name: 'Apollo Hospitals - Jubilee Hills',
    type: 'Hospital',
    latitude: 17.4265,
    longitude: 78.4110,
    address: 'Road No. 72, Film Nagar, Hyderabad',
    distance: '1.2 km',
    phone: '+91 40 2360 7777',
    availableSlots: 24
  },
  {
    id: 'h-2',
    name: 'Gachibowli Police Station',
    type: 'Police',
    latitude: 17.4402,
    longitude: 78.3750,
    address: 'Outer Ring Rd, Gachibowli, Hyderabad',
    distance: '0.8 km',
    phone: '+91 40 2785 2400'
  },
  {
    id: 'h-3',
    name: 'GHMC Shelter House - Madhapur',
    type: 'Shelter',
    latitude: 17.4520,
    longitude: 78.3840,
    address: 'Near Madhapur Metro Station, Hyderabad',
    distance: '2.1 km',
    phone: '1800-425-0011',
    availableSlots: 150
  },
  {
    id: 'h-4',
    name: 'Miyapur Metro Charging Point',
    type: 'Charging Station',
    latitude: 17.4960,
    longitude: 78.3480,
    address: 'Miyapur Metro Stn Ground Floor',
    distance: '6.4 km',
    phone: 'N/A',
    availableSlots: 12
  },
  {
    id: 'h-5',
    name: 'Red Cross Food Camp',
    type: 'Food Camp',
    latitude: 17.4460,
    longitude: 78.3680,
    address: 'Shilparamam Exhibition Ground, Madhapur',
    distance: '1.5 km',
    phone: '+91 94408 22000',
    availableSlots: 350
  }
];

// Helper to interact with the backend server or fall back to mock
async function callGemini(prompt: string, fallbackResponse: any) {
  try {
    const response = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    if (response.ok) {
      const data = await response.json();
      return JSON.parse(data.text);
    }
  } catch (error) {
    console.warn('Backend server not responding, using premium local simulation fallback.');
  }
  // Fallback to local simulated AI generator
  return new Promise(resolve => setTimeout(() => resolve(fallbackResponse), 1200));
}

export const apiService = {
  // 1. Fetch Current Weather
  async fetchWeather(lat: number, lon: number): Promise<WeatherInfo> {
    try {
      const res = await fetch(`${API_BASE}/weather?lat=${lat}&lon=${lon}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Failed to fetch weather from backend. Using mock weather.');
    }
    // High-quality monsoon mock weather
    return {
      temp: 26.5,
      condition: 'Heavy Thunderstorms',
      humidity: 89,
      windSpeed: 24,
      rainProb: 95,
      location: 'Hyderabad, TS',
      alerts: [
        'RED ALERT: Extremely heavy rainfall (up to 150mm) forecasted for the next 6 hours.',
        'FLOOD ALERT: High danger of waterlogging in low-lying sectors of Madhapur & Gachibowli.'
      ]
    };
  },

  // 2. Risk Meter
  async analyzeRisk(weather: WeatherInfo, profile: any) {
    const fallback = {
      riskScore: 78,
      riskExplanation: `High risk detected. You reside in an apartment, but your daily travel route (${profile.dailyRoute}) crosses major waterlogging hotspots like Gachibowli. Additionally, you drive an SUV which provides some safety, but you have emergency contacts configured who are elder citizens. Heavy rain (${weather.rainProb}%) indicates possible delays.`,
      recommendations: [
        'Postpone travel along the Secunderabad to Gachibowli corridor if possible.',
        'Keep powerbanks charged as power outages are reported nearby.',
        'Check in with your emergency contact (Father) and ensure they have medicine stocks.'
      ]
    };
    return callGemini(riskPromptTemplate(weather, profile), fallback);
  },

  // 3. Preparedness Planner
  async generatePrepPlan(weather: WeatherInfo, profile: any) {
    const fallback = {
      riskScore: 82,
      riskExplanation: 'Severe thunderstorms combined with localized flooding will impact roads and grid infrastructure. Immediate defensive action is recommended.',
      morningChecklist: [
        'Secure external doors and window shutters.',
        'Charge laptops, phones, and auxiliary emergency lights.',
        'Check fuel level in your SUV vehicle.'
      ],
      afternoonChecklist: [
        'Avoid ground-level parking if water accumulation starts.',
        'Keep pet food (Dog) and leash at an accessible height.',
        'Call home to verify family members safety statuses.'
      ],
      eveningChecklist: [
        'Unplug sensitive electronic devices to prevent surge damage.',
        'Boil and filter 5 liters of drinking water.',
        'Establish check-in calls with family every 2 hours.'
      ],
      emergencyKit: [
        'Heavy-duty LED flashlight with extra batteries',
        'First Aid kit including antiseptic wipes and band-aids',
        'Waterproof dry-bag for documents and powerbanks',
        'Manual whistle for drawing search focus'
      ],
      foodRecommendations: [
        'Dry snacks: biscuits, almonds, energy bars',
        'Canned pulses or instant noodles requiring minimal cooking',
        'Powdered milk or ready-to-consume meals'
      ],
      medicineSuggestions: [
        'Paracetamol (for fever), ORS packets (for hydration)',
        'Antihistamines for allergies and inhalers',
        'Prescribed chronic medication for next 10 days'
      ],
      travelSuggestions: [
        'Do not cross underpasses (especially Gachibowli underpass).',
        'If caught in flooding, seek vertical altitude immediately.'
      ],
      powerBackupSuggestions: [
        'Fully charge 20000mAh backup batteries.',
        'Minimize inverter load to running fans and emergency bulbs only.'
      ]
    };
    return callGemini(plannerPromptTemplate(weather, profile), fallback);
  },

  // 4. Travel Advisor
  async analyzeTravel(source: string, destination: string, mode: string, travelTime: string, weather: WeatherInfo) {
    const fallback = {
      weatherRisk: 'High',
      floodProbability: 65,
      trafficDelay: 35,
      alternativeRoute: 'Use the Outer Ring Road (ORR) elevated pathway. Avoid the Hitec City underpass completely.',
      estimatedArrival: '1 hour 15 mins (normally 40 mins)',
      aiRecommendation: `Severe waterlogging of 2-3 feet is reported near ${source}. If you must travel by ${mode}, use elevated bypass corridors. Check tire traction and refrain from crossing areas where water level is above mid-wheel height.`
    };
    return callGemini(travelPromptTemplate(source, destination, mode, travelTime, weather), fallback);
  },

  // 5. Image Analyzer
  async analyzeImage(imageBase64: string) {
    // Send to backend for vision api or use realistic response
    try {
      const response = await fetch(`${API_BASE}/ai/vision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageBase64 }),
      });
      if (response.ok) return await response.json();
    } catch (e) {
      console.warn('Backend Vision API offline, executing local visual simulator.');
    }

    return new Promise(resolve => setTimeout(() => {
      resolve({
        floodLevel: 'Medium',
        treeFall: true,
        roadDamage: 'Minor',
        waterlogging: true,
        electricWireHazards: false,
        buildingDamage: 'None',
        riskLevel: 'High',
        confidenceScore: 92,
        suggestedAction: 'A fallen tree is blocking the path. Flooding depth is roughly 1 foot. Do not drive a standard vehicle through this route. GHMC helpline has been updated.'
      });
    }, 1500));
  },

  // 6. WhatsApp Fake News Detector
  async detectFakeNews(message: string) {
    const fallback = {
      status: message.toLowerCase().includes('ghmc') && message.toLowerCase().includes('holiday') 
        ? 'Likely Fake' 
        : 'Likely Genuine',
      reasoning: 'The text uses alarmist vocabulary ("EMERGENCY BAN", "ENTIRE CITY CLOSED") and lacks official notification IDs or links to gov.in handles. Meteorological records do not show a declared state-wide grid shutdown.',
      safetyRecommendation: 'Do not forward this message. Cross-verify alert timelines directly on the official NDMA (ndma.gov.in) or Twitter handle of GHMC Commissioner (@CommissionrGHMC).'
    };
    return callGemini(fakeNewsPromptTemplate(message), fallback);
  },

  // 7. Recovery Planner
  async generateRecoveryPlan(details: string) {
    const fallback = {
      cleaningOrder: [
        'Drain remaining water safely using sump pumps if available.',
        'Remove mud and wet debris before it solidifies.',
        'Sanitize floors with bleach/disinfectants to eliminate bacterial loads.'
      ],
      insuranceGuidance: [
        'Take high-resolution video/photographs of all structural and property damages before cleaning.',
        'Make a detailed inventory of destroyed electronics, vehicle levels, and carpets.',
        'Contact insurance adjuster within 48 hours and save medical receipts if injured.'
      ],
      medicalPrecautions: [
        'Wear heavy-duty rubber gloves and boots to prevent leptospirosis (rat fever).',
        'Wash open wounds immediately with clean water and apply antiseptic.',
        'Consult doctors if you experience sudden fever or gastrointestinal distress.'
      ],
      waterSafety: [
        'Do not drink tap water. Boil water for at least 20 minutes before ingestion.',
        'Use chlorine tablets if boiling is impossible.'
      ],
      foodSafety: [
        'Discard any food that has come into contact with floodwater, including canned items with dents.',
        'Verify refrigerator items if power was disconnected for over 4 hours.'
      ],
      repairChecklist: [
        'Inspect electrical breaker board. Ensure it is fully dry before turning on main power.',
        'Check walls for structural cracks and mold growths.',
        'Check vehicle tailpipe and engine oil for water contamination before starting.'
      ]
    };
    return callGemini(recoveryPromptTemplate(details), fallback);
  },

  // 8. Community Reports Sync
  async getCommunityReports(): Promise<CommunityReport[]> {
    const saved = localStorage.getItem('community_reports');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('community_reports', JSON.stringify(mockReports));
    return mockReports;
  },

  async submitCommunityReport(report: Omit<CommunityReport, 'id' | 'timestamp' | 'isValidated'>): Promise<CommunityReport> {
    const reports = await this.getCommunityReports();
    
    // AI Duplication Validation simulation
    const duplicate = reports.find(r => 
      r.category === report.category && 
      Math.abs(r.latitude - report.latitude) < 0.002 &&
      Math.abs(r.longitude - report.longitude) < 0.002
    );

    const newReport: CommunityReport = {
      ...report,
      id: `rep-${Date.now()}`,
      timestamp: new Date().toISOString(),
      isValidated: duplicate ? false : true // Flagged for review if duplicate
    };

    const updated = [newReport, ...reports];
    localStorage.setItem('community_reports', JSON.stringify(updated));
    return newReport;
  },

  // 9. Nearby Help Centers
  async getNearbyHelp(lat: number, lon: number): Promise<HelpCenter[]> {
    // Return help locations calculated around user coordinates
    return mockHelpCenters.map(center => {
      const dLat = center.latitude - lat;
      const dLon = center.longitude - lon;
      const distanceKm = Math.sqrt(dLat * dLat + dLon * dLon) * 111; // Simple conversion
      return {
        ...center,
        distance: `${distanceKm.toFixed(1)} km`
      };
    });
  },

  // 10. Floating Chat with Gemini
  async chatWithGemini(history: { role: 'user' | 'model'; parts: string }[], message: string, lang: string = 'en') {
    try {
      const response = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history }),
      });
      if (response.ok) {
        const data = await response.json();
        return data.text;
      }
    } catch (e) {
      console.warn('Backend chat offline. Executing conversational fallback.');
    }

    // High fidelity conversational replies matching language preferences
    const messageLower = message.toLowerCase();
    let reply = '';
    
    if (messageLower.includes('travel') || messageLower.includes('drive')) {
      reply = 'I strongly recommend staying off waterlogged roads. Even SUVs can stall if water exceeds 1 foot. If you must leave, stay on high-altitude corridors and never cross flooded underpasses.';
    } else if (messageLower.includes('prepare') || messageLower.includes('pack')) {
      reply = 'For monsoons, prepare a dry emergency kit containing: 1. A working flashlight + extra batteries, 2. Dry non-perishable snacks, 3. Critical medicines and first-aid supplies, 4. Fully charged powerbanks. Store everything in plastic dry bags.';
    } else if (messageLower.includes('telugu') || lang === 'te') {
      reply = 'సురక్షితంగా ఉండండి! భారీ వర్షాల సమయంలో బయటకు వెళ్లడం నివారించండి. అత్యవసర సామాగ్రిని సిద్ధంగా ఉంచుకోండి.';
    } else if (messageLower.includes('hindi') || lang === 'hi') {
      reply = 'सुरक्षित रहें! भारी बारिश के दौरान बाहर निकलने से बचें और अपने पास टॉर्च, खाना और दवाइयां तैयार रखें।';
    } else {
      reply = 'I am MonsoonShield AI, here to assist with emergency planning. You can ask me about safe travel paths, flood recovery schedules, or WhatsApp rumor checks.';
    }

    return new Promise<string>(resolve => setTimeout(() => resolve(reply), 800));
  }
};
