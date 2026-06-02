import React, { useState, useEffect, useRef } from 'react';

// Custom Minimal SVG Icons as React Components to ensure zero dependencies
const ShieldAlertIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const ActivityIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const StethoscopeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 4px rgba(0, 242, 254, 0.4))' }}>
    <path d="M4.5 16.5c-1.5 1.26-2.5 3.19-2.5 5.5s1 4 2.5 5" />
    <path d="M12 2v10.5a2.5 2.5 0 0 1-5 0V9" />
    <path d="M18 9V6a3 3 0 0 0-6 0v3" />
    <path d="M18 12v3a4 4 0 0 1-8 0v-3" />
    <circle cx="12" cy="18" r="4" />
    <path d="M12 6h.01" />
  </svg>
);

const UserHeartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const SparkleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364-.707.707M6.343 17.657l-.707.707m0-12.728.707.707m11.314 11.314-.707.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '6px', transition: 'transform 0.2s ease' }} className="arrow-icon">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [heartRate, setHeartRate] = useState(72);
  const [isTyping, setIsTyping] = useState(false);
  
  // AI Symptom Analyzer State
  const [analyzerSymptoms, setAnalyzerSymptoms] = useState('');
  const [analyzerAge, setAnalyzerAge] = useState('');
  const [analyzerGender, setAnalyzerGender] = useState('Female');
  const [analyzerLoading, setAnalyzerLoading] = useState(false);
  const [analyzerResult, setAnalyzerResult] = useState(null);

  // Health Score Calculator State
  const [sleepHours, setSleepHours] = useState('');
  const [waterIntake, setWaterIntake] = useState('');
  const [exerciseMinutes, setExerciseMinutes] = useState('');
  const [calculatedScore, setCalculatedScore] = useState(null);
  const [calculatorLoading, setCalculatorLoading] = useState(false);

  // Medications checklist state
  const [meds, setMeds] = useState([
    { id: 1, name: 'Vitamin D3 (2000 IU)', time: '08:00 AM', taken: true },
    { id: 2, name: 'Omega-3 Fish Oil (1000mg)', time: '01:00 PM', taken: false },
    { id: 3, name: 'Metformin (500mg)', time: '08:00 PM', taken: false }
  ]);

  // Chat message simulator state
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! I am your Smart Healthcare Assistant AI. You can test my triage engine. Select one of the quick scenarios below:',
      isBot: true,
      time: 'Just now'
    }
  ]);

  // Simulated live fluctuating heart rate
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return next >= 68 && next <= 78 ? next : prev;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleMedToggle = (id) => {
    setMeds(prev => prev.map(med => med.id === id ? { ...med, taken: !med.taken } : med));
  };

  const adhearanceScore = Math.round((meds.filter(m => m.taken).length / meds.length) * 100);

  // Pre-configured diagnostic prompt answers
  const quickPrompts = [
    { id: 'discomfort', label: '🚨 Chest Discomfort', q: 'Analyze sudden mild chest discomfort I felt after a light jog.' },
    { id: 'blood', label: '🩸 Interpret Blood Report', q: 'Interpret my high LDL cholesterol and low Vitamin D values.' },
    { id: 'fitness', label: '🥗 Create Longevity Plan', q: 'Create an optimized metabolic health & fitness schedule.' }
  ];

  const handlePromptClick = (questionText, promptId) => {
    if (isTyping) return;
    
    // 1. Add User Question
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: questionText,
      isBot: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // 2. Simulate AI thinking & responding
    setTimeout(() => {
      let botResponse = {};
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      if (promptId === 'discomfort') {
        botResponse = {
          id: Date.now() + 1,
          sender: 'bot',
          isBot: true,
          time: timeStr,
          triage: 'URGENT MEDICAL ASSESSMENT',
          triageLevel: 'urgent',
          summary: 'Symptoms resembling chest discomfort post-exertion require immediate clinical screening to rule out cardiac strain or ischemia.',
          actions: [
            'Do NOT engage in any physical activities; rest in an upright position.',
            'Have someone nearby, or prepare emergency contact channels.',
            'If pain persists, radiates to left arm or jaw, or causes shortness of breath, call emergency services immediately.'
          ],
          specialist: 'Emergency Cardiology Triage Consultant'
        };
      } else if (promptId === 'blood') {
        botResponse = {
          id: Date.now() + 1,
          sender: 'bot',
          isBot: true,
          time: timeStr,
          triage: 'LAB METRIC ANALYSIS',
          triageLevel: 'warning',
          summary: 'Mild metabolic insufficiency detected. High LDL (Borderline risk) paired with low Vitamin D3 can impact long-term lipid metabolism and bone integrity.',
          actions: [
            'Incorporate soluble fibers (oat bran, avocado, lentils) to naturally bind & reduce LDL.',
            'Consider high-grade Vitamin D3 daily supplementation (2,000 IU) and 15 mins sun exposure.',
            'Schedule a follow-up metabolic panel in 60-90 days.'
          ],
          specialist: 'Endocrinology & Preventive Lipids Unit'
        };
      } else {
        botResponse = {
          id: Date.now() + 1,
          sender: 'bot',
          isBot: true,
          time: timeStr,
          triage: 'LONGEVITY BLUEPRINT',
          triageLevel: 'optimal',
          summary: 'Metabolic optimization strategy focusing on zone 2 aerobic pathways, muscle-to-fat mass preservation, and restorative circadian alignment.',
          actions: [
            'Target 1.6g of lean protein per kg of bodyweight, distributed across 3 meals.',
            'Perform progressive overload resistance training 3x weekly (45 mins).',
            'Adopt a strict Zone 2 cardio protocol (150 mins weekly) to boost mitochondrial efficiency.'
          ],
          specialist: 'Longevity & Performance Physiology'
        };
      }

      setChatMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1200);
  };

  // Handler for custom Symptom Analyzer scan
  const handleAnalyzeSymptoms = (e) => {
    e.preventDefault();
    if (!analyzerSymptoms.trim()) {
      alert('Please describe your symptoms first.');
      return;
    }
    
    setAnalyzerLoading(true);
    setAnalyzerResult(null);

    setTimeout(() => {
      const symText = analyzerSymptoms.toLowerCase();
      let matched = [];
      
      // Strict rule mappings
      if (symText.includes('fever')) {
        matched.push({ name: 'Viral Fever', confidence: 82, rec: 'Rest, hydrate, and consider OTC antipyretics like acetaminophen.' });
        matched.push({ name: 'Flu', confidence: 70, rec: 'Isolate if contagiousness is suspected, monitor temperature closely, and rest.' });
      }
      if (symText.includes('cough')) {
        matched.push({ name: 'Common Cold', confidence: 78, rec: 'Consume warm fluids, use throat lozenges, and try steam inhalation.' });
        matched.push({ name: 'Bronchitis', confidence: 60, rec: 'Avoid lung irritants/smoke, use a humidifier, and consult if wheezing occurs.' });
      }
      if (symText.includes('headache')) {
        matched.push({ name: 'Migraine', confidence: 75, rec: 'Rest in a quiet, dark room, avoid screen triggers, and stay hydrated.' });
        matched.push({ name: 'Stress', confidence: 68, rec: 'Practice breathing exercises, stretch neck/shoulders, and take screen breaks.' });
      }

      // Fallback if no matching keyword is inputted
      if (matched.length === 0) {
        matched.push({
          name: 'Undifferentiated Health Assessment',
          confidence: 45,
          rec: 'Ensure rest, stay hydrated, and monitor if symptoms persist beyond 48 hours.'
        });
      }

      // Sort matched conditions descending by confidence
      matched.sort((a, b) => b.confidence - a.confidence);

      // Determine overall triage severity level
      let severity = 'optimal';
      let title = 'LOW RISK CLINICAL PROFILE';
      if (symText.includes('chest pain') || symText.includes('breathing')) {
        severity = 'urgent';
        title = '🚨 IMMEDIATE ATTENTION REQUIRED';
      } else if (matched.some(m => m.confidence >= 70)) {
        severity = 'warning';
        title = '⚠️ CLINICAL OBSERVATION RECOMMENDED';
      }

      // Determine autorouted specialty based on primary condition
      let specialists = 'General Practitioner / Telehealth';
      if (symText.includes('chest pain')) {
        specialists = 'Cardiovascular Emergency Unit';
      } else if (matched[0].name.includes('Fever') || matched[0].name.includes('Flu')) {
        specialists = 'Infectious Disease Clinic';
      } else if (matched[0].name.includes('Cough') || matched[0].name.includes('Bronchitis')) {
        specialists = 'Pulmonary Triage Specialist';
      } else if (matched[0].name.includes('Migraine') || matched[0].name.includes('Stress')) {
        specialists = 'Neurology & Stress Management Unit';
      }

      setAnalyzerResult({
        severity,
        title,
        conditions: matched,
        summary: `Symptom signature analysis completed for a ${analyzerAge || 30}-year-old ${analyzerGender}. The following potential conditions were detected based on your inputs.`,
        specialists
      });
      setAnalyzerLoading(false);
    }, 1200);
  };

  // Handler for custom Health Score calculation
  const handleCalculateScore = (e) => {
    e.preventDefault();
    if (sleepHours === '' || waterIntake === '' || exerciseMinutes === '') {
      alert('Please fill out all health metrics.');
      return;
    }
    
    setCalculatorLoading(true);
    setCalculatedScore(null);

    setTimeout(() => {
      const sleep = parseFloat(sleepHours);
      const water = parseFloat(waterIntake);
      const exercise = parseFloat(exerciseMinutes);

      // 1. Sleep Scoring (Max 35 points)
      let sleepScore = 5;
      if (sleep >= 7 && sleep <= 9) sleepScore = 35;
      else if (sleep === 6 || sleep === 10) sleepScore = 25;
      else if (sleep === 5 || sleep === 11) sleepScore = 15;

      // 2. Water Scoring (Max 30 points)
      let waterScore = 5;
      if (water >= 2.5 && water <= 3.5) waterScore = 30;
      else if ((water >= 1.5 && water < 2.5) || (water > 3.5 && water <= 4.5)) waterScore = 20;
      else if ((water >= 0.5 && water < 1.5) || (water > 4.5 && water <= 5.5)) waterScore = 10;

      // 3. Exercise Scoring (Max 35 points)
      let exerciseScore = 5;
      if (exercise >= 30 && exercise <= 90) exerciseScore = 35;
      else if ((exercise >= 15 && exercise < 30) || (exercise > 90 && exercise <= 120)) exerciseScore = 25;
      else if (exercise >= 5 && exercise < 15) exerciseScore = 15;

      const total = Math.min(100, sleepScore + waterScore + exerciseScore);

      let status = 'optimal';
      let tag = '🛡️ OPTIMAL VITALITY';
      let summary = 'Outstanding baseline metabolic metrics! Your current routine supports excellent cell recovery, detoxification pathways, and cardiovascular health.';
      
      if (total < 70) {
        status = 'urgent';
        tag = '🚨 ATTENTION REQUIRED';
        summary = 'Baseline values indicate metabolic or systemic fatigue risks. Sleep deprivation or low hydration metrics can increase arterial strain and compromise recovery.';
      } else if (total < 90) {
        status = 'warning';
        tag = '⚠️ MODERATE WELLNESS';
        summary = 'Solid health baseline with active opportunities for refinement. Small adjustments in rest schedules or water thresholds can rapidly maximize your physical capacity.';
      }

      let tips = [];
      if (sleep < 7) tips.push('Increase sleep duration to 7.5+ hours to improve brain recovery and muscle synthesis.');
      if (water < 2.5) tips.push('Incorporate 1 extra Liter of water spaced evenly to optimize kidney filtration and metabolic velocity.');
      if (exercise < 30) tips.push('Aim for at least 30 minutes of Zone 2 training (brisk walking, cycling) to build mitochondrial density.');
      if (tips.length === 0) tips.push('Maintain your current high-performing routine. Consider introducing progressive resistance training.');

      setCalculatedScore({
        score: total,
        status,
        tag,
        summary,
        tips
      });
      setCalculatorLoading(false);
    }, 1200);
  };

  return (
    <div className="smart-health-app">
      {/* CSS Injected Dynamically to ensure absolute premium visual design & bypass boilerplate constraints */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        /* Dynamic overrides of root and standard margins */
        #root {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          border: none !important;
          min-height: 100vh !important;
          display: block !important;
          background: #090B11 !important;
        }

        .smart-health-app {
          --primary: #00F2FE;
          --secondary: #4FACFE;
          --accent-purple: #8B5CF6;
          --dark-bg: #090B11;
          --card-bg: rgba(17, 25, 40, 0.65);
          --card-border: rgba(255, 255, 255, 0.08);
          --text-main: #F8FAFC;
          --text-muted: #94A3B8;
          --emerald: #10B981;
          --rose: #EF4444;
          --amber: #F59E0B;
          
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
          color: var(--text-main);
          background: radial-gradient(circle at 10% 20%, rgba(0, 242, 254, 0.05) 0%, rgba(139, 92, 246, 0.04) 50%, rgba(9, 11, 17, 0) 100%), var(--dark-bg);
          min-height: 100vh;
          overflow-x: hidden;
          box-sizing: border-box;
          line-height: 1.5;
        }

        .smart-health-app * {
          box-sizing: border-box;
        }

        /* Ambient glowing background shapes */
        .ambient-glow-1 {
          position: absolute;
          top: -150px;
          right: -100px;
          width: 450px;
          height: 450px;
          background: radial-gradient(circle, rgba(0, 242, 254, 0.12) 0%, rgba(79, 172, 254, 0.02) 70%, transparent 100%);
          z-index: 0;
          pointer-events: none;
        }

        .ambient-glow-2 {
          position: absolute;
          top: 300px;
          left: -150px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, rgba(0, 242, 254, 0.01) 70%, transparent 100%);
          z-index: 0;
          pointer-events: none;
        }

        /* Container helper */
        .container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
          z-index: 1;
        }

        /* --- NAVBAR STYLING --- */
        .navbar {
          background: rgba(9, 11, 17, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--card-border);
          position: sticky;
          top: 0;
          z-index: 1000;
          transition: all 0.3s ease;
        }

        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 80px;
        }

        .nav-logo-group {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          text-decoration: none;
        }

        .nav-logo-text {
          font-size: 21px;
          font-weight: 800;
          letter-spacing: -0.5px;
          background: linear-gradient(135deg, #FFF 40%, var(--primary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 32px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .nav-link {
          color: var(--text-muted);
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          transition: color 0.25s ease;
          position: relative;
        }

        .nav-link:hover {
          color: var(--primary);
        }

        .nav-link.active {
          color: var(--text-main);
        }

        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          border-radius: 2px;
        }

        .nav-cta-group {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        /* Buttons */
        .btn {
          font-size: 14px;
          font-weight: 600;
          padding: 10px 20px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }

        .btn-glass {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--card-border);
          color: var(--text-main);
        }

        .btn-glass:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }

        .btn-gradient {
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          border: none;
          color: #040810;
          box-shadow: 0 4px 20px rgba(0, 242, 254, 0.2);
        }

        .btn-gradient:hover {
          box-shadow: 0 6px 25px rgba(0, 242, 254, 0.4);
          transform: translateY(-2px);
        }

        .btn-gradient:hover .arrow-icon {
          transform: translateX(4px);
        }

        /* Mobile Hamburger Icon */
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 6px;
          border: none;
          background: transparent;
          cursor: pointer;
          padding: 4px;
          z-index: 1001;
        }

        .hamburger span {
          display: block;
          width: 24px;
          height: 2px;
          background-color: var(--text-main);
          transition: all 0.3s ease;
        }

        .hamburger.open span:nth-child(1) {
          transform: translateY(8px) rotate(45deg);
        }

        .hamburger.open span:nth-child(2) {
          opacity: 0;
        }

        .hamburger.open span:nth-child(3) {
          transform: translateY(-8px) rotate(-45deg);
        }

        /* Mobile Drawer Menu */
        .mobile-drawer {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: rgba(9, 11, 17, 0.98);
          backdrop-filter: blur(20px);
          z-index: 999;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 32px;
          opacity: 0;
          pointer-events: none;
          transition: all 0.3s ease;
        }

        .mobile-drawer.open {
          opacity: 1;
          pointer-events: auto;
        }

        .mobile-drawer .nav-link {
          font-size: 22px;
        }

        /* --- HERO SECTION --- */
        .hero-section {
          padding: 80px 0 100px 0;
          position: relative;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 64px;
          align-items: center;
        }

        /* Hero Left Content */
        .hero-badge-container {
          margin-bottom: 24px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          background: rgba(0, 242, 254, 0.08);
          border: 1px solid rgba(0, 242, 254, 0.2);
          color: var(--primary);
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.2px;
          backdrop-filter: blur(10px);
        }

        .hero-title {
          font-size: 58px;
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -2px;
          margin: 0 0 20px 0;
          text-align: left;
        }

        .hero-title span {
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 50%, var(--accent-purple) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-description {
          font-size: 18px;
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 40px;
          max-width: 580px;
          text-align: left;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 48px;
        }

        .hero-actions .btn {
          padding: 16px 28px;
          font-size: 15px;
          border-radius: 14px;
        }

        /* Trust Badge Grid */
        .trust-badges {
          display: flex;
          align-items: center;
          gap: 32px;
          border-top: 1px solid var(--card-border);
          padding-top: 32px;
        }

        .trust-badge-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .trust-badge-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-muted);
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .trust-badge-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--card-border);
          color: var(--primary);
        }

        /* --- HERO RIGHT: PATIENT HUB MOCKUP --- */
        .mockup-container {
          position: relative;
          z-index: 2;
          width: 100%;
          animation: floatAnimation 6s ease-in-out infinite;
        }

        @keyframes floatAnimation {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        .glass-dashboard {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 24px;
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
          overflow: hidden;
          width: 100%;
          display: flex;
          flex-direction: column;
        }

        /* Mockup Top Header */
        .dashboard-header {
          padding: 16px 20px;
          border-bottom: 1px solid var(--card-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.01);
        }

        .dashboard-user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .dashboard-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--accent-purple));
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          color: #090B11;
        }

        .dashboard-user-text h4 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
        }

        .dashboard-user-text p {
          margin: 0;
          font-size: 11px;
          color: var(--emerald);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .online-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--emerald);
          display: inline-block;
          box-shadow: 0 0 8px var(--emerald);
          animation: pulseDot 2s infinite;
        }

        @keyframes pulseDot {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .dashboard-controls {
          display: flex;
          gap: 6px;
        }

        .dot-control {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
        }

        /* Vitals Bar (Real-Time Metrics) */
        .dashboard-vitals {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          padding: 16px 20px;
          background: rgba(0, 0, 0, 0.2);
          border-bottom: 1px solid var(--card-border);
        }

        .vital-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 14px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .vital-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-main);
        }

        .vital-icon.heart {
          background: rgba(239, 68, 68, 0.1);
          color: var(--rose);
          animation: pulseHeart 1.5s infinite alternate;
        }

        @keyframes pulseHeart {
          0% { transform: scale(1); }
          100% { transform: scale(1.08); }
        }

        .vital-icon.compliance {
          background: rgba(16, 185, 129, 0.1);
          color: var(--emerald);
        }

        .vital-detail h5 {
          margin: 0;
          font-size: 11px;
          color: var(--text-muted);
          font-weight: 500;
        }

        .vital-detail h3 {
          margin: 4px 0 0 0;
          font-size: 18px;
          font-weight: 700;
        }

        .vital-detail h3 span {
          font-size: 12px;
          color: var(--text-muted);
          font-weight: 500;
          margin-left: 2px;
        }

        /* Cardiac ECG Animation Wave */
        .ecg-monitor {
          grid-column: span 2;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          padding: 8px 12px;
          border: 1px solid rgba(255, 255, 255, 0.02);
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
          height: 48px;
        }

        .ecg-svg {
          width: 100%;
          height: 36px;
        }

        .ecg-wave-path {
          stroke: var(--primary);
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
          fill: none;
          stroke-dasharray: 600;
          stroke-dashoffset: 0;
          animation: ecgStroke 5s linear infinite;
        }

        @keyframes ecgStroke {
          to {
            stroke-dashoffset: -1200;
          }
        }

        /* --- Chat Interface Area --- */
        .dashboard-chat-area {
          height: 290px;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          scroll-behavior: smooth;
        }

        .dashboard-chat-area::-webkit-scrollbar {
          width: 4px;
        }
        .dashboard-chat-area::-webkit-scrollbar-track {
          background: transparent;
        }
        .dashboard-chat-area::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }

        .chat-bubble {
          max-width: 85%;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .chat-bubble.bot {
          align-self: flex-start;
        }

        .chat-bubble.user {
          align-self: flex-end;
        }

        .chat-bubble-inner {
          padding: 12px 16px;
          border-radius: 16px;
          font-size: 13.5px;
          line-height: 1.45;
          text-align: left;
        }

        .chat-bubble.bot .chat-bubble-inner {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: var(--text-main);
          border-top-left-radius: 4px;
        }

        .chat-bubble.user .chat-bubble-inner {
          background: linear-gradient(135deg, rgba(0, 242, 254, 0.15) 0%, rgba(79, 172, 254, 0.15) 100%);
          border: 1px solid rgba(0, 242, 254, 0.2);
          color: var(--primary);
          border-top-right-radius: 4px;
        }

        .chat-time {
          font-size: 10px;
          color: var(--text-muted);
          align-self: flex-end;
          padding: 0 4px;
        }

        .chat-bubble.bot .chat-time {
          align-self: flex-start;
        }

        /* Structured Clinical Card in Bot response */
        .clinical-report-card {
          margin-top: 8px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 14px;
          text-align: left;
          width: 100%;
        }

        .clinical-header-badge {
          display: inline-flex;
          align-items: center;
          font-size: 10.5px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 6px;
          letter-spacing: 0.5px;
          margin-bottom: 10px;
        }

        .clinical-header-badge.urgent {
          background: rgba(239, 68, 68, 0.15);
          color: var(--rose);
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .clinical-header-badge.warning {
          background: rgba(245, 158, 11, 0.15);
          color: var(--amber);
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .clinical-header-badge.optimal {
          background: rgba(16, 185, 129, 0.15);
          color: var(--emerald);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .clinical-summary {
          font-size: 12.5px;
          color: var(--text-main);
          margin-bottom: 12px;
          font-weight: 500;
        }

        .clinical-bullet-list {
          padding-left: 18px;
          margin: 0 0 14px 0;
          font-size: 12px;
          color: var(--text-muted);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .clinical-bullet-list li {
          line-height: 1.4;
        }

        .clinical-doctor-booking {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 10px;
        }

        .clinical-doctor-info {
          display: flex;
          flex-direction: column;
        }

        .clinical-doctor-label {
          font-size: 10px;
          color: var(--text-muted);
        }

        .clinical-doctor-name {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-main);
        }

        .clinical-book-btn {
          font-size: 11px;
          padding: 6px 12px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--primary);
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .clinical-book-btn:hover {
          background: rgba(0, 242, 254, 0.08);
          border-color: rgba(0, 242, 254, 0.3);
        }

        /* Typing Dots Indicator */
        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 10px 14px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          width: fit-content;
        }

        .typing-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--text-muted);
          animation: bounceDot 1.4s infinite ease-in-out;
        }

        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounceDot {
          0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }

        /* Quick Interactive Prompt Suggestions */
        .dashboard-prompts-bar {
          padding: 12px 20px 20px 20px;
          border-top: 1px solid var(--card-border);
          background: rgba(255, 255, 255, 0.005);
        }

        .prompt-headline {
          font-size: 11px;
          text-transform: uppercase;
          color: var(--text-muted);
          font-weight: 700;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
          text-align: left;
        }

        .prompt-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .prompt-pill {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--card-border);
          border-radius: 10px;
          padding: 8px 12px;
          font-size: 12.5px;
          font-weight: 500;
          color: var(--text-main);
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .prompt-pill:hover:not(.disabled) {
          background: rgba(0, 242, 254, 0.05);
          border-color: rgba(0, 242, 254, 0.25);
          transform: translateY(-1px);
        }

        .prompt-pill.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .prompt-pill-arrow {
          font-size: 11px;
          color: var(--text-muted);
          opacity: 0;
          transform: translateX(-4px);
          transition: all 0.2s ease;
        }

        .prompt-pill:hover .prompt-pill-arrow {
          opacity: 1;
          transform: translateX(0);
          color: var(--primary);
        }

        /* Medication compliance mini checklist styling */
        .med-compliance-container {
          grid-column: span 2;
          background: rgba(0, 0, 0, 0.15);
          border-radius: 14px;
          padding: 12px 14px;
          border: 1px solid rgba(255, 255, 255, 0.03);
        }

        .med-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .med-title-group {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
        }

        .compliance-number {
          font-size: 12px;
          font-weight: 700;
          color: var(--emerald);
        }

        .compliance-bar-outer {
          height: 6px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 12px;
        }

        .compliance-bar-inner {
          height: 100%;
          background: linear-gradient(90deg, var(--emerald) 0%, #34D399 100%);
          border-radius: 3px;
          transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .med-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .med-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 8px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.02);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .med-item:hover {
          background: rgba(255, 255, 255, 0.03);
        }

        .med-checkbox-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .med-checkbox {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          border: 1px solid var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .med-item.taken .med-checkbox {
          background: var(--emerald);
          border-color: var(--emerald);
          color: #090B11;
        }

        .med-info-text {
          font-size: 11.5px;
          text-align: left;
        }

        .med-item.taken .med-name {
          text-decoration: line-through;
          color: var(--text-muted);
        }

        .med-name {
          font-weight: 500;
          display: block;
        }

        .med-time {
          font-size: 9.5px;
          color: var(--text-muted);
        }

        /* --- RESPONSIVE BREAKPOINTS --- */
        @media (max-width: 1024px) {
          .nav-links {
            display: none;
          }
          .hamburger {
            display: flex;
          }
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .hero-title {
            font-size: 44px;
            text-align: center;
          }
          .hero-description {
            text-align: center;
            margin: 0 auto 32px auto;
          }
          .hero-actions {
            justify-content: center;
          }
          .trust-badges {
            justify-content: center;
            flex-wrap: wrap;
            gap: 20px;
          }
        }

        @media (max-width: 640px) {
          .hero-title {
            font-size: 36px;
            letter-spacing: -1px;
          }
          .hero-badge-container {
            text-align: center;
          }
          .hero-badge {
            font-size: 11px;
          }
          .trust-badges {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
            padding-left: 20px;
          }
          .dashboard-vitals {
            grid-template-columns: 1fr;
          }
          .ecg-monitor, .med-compliance-container {
            grid-column: span 1;
          }
        }

        /* --- SYMPTOM ANALYZER & SCORE CALCULATOR COMMON --- */
        .analyzer-section {
          padding: 60px 0 100px 0;
          position: relative;
        }

        .analyzer-title-group {
          text-align: center;
          margin-bottom: 48px;
        }

        .analyzer-section-title {
          font-size: 38px;
          font-weight: 800;
          letter-spacing: -1px;
          margin-bottom: 12px;
          background: linear-gradient(135deg, #FFF 50%, var(--primary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .analyzer-section-subtitle {
          font-size: 16px;
          color: var(--text-muted);
          max-width: 600px;
          margin: 0 auto;
        }

        .analyzer-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 24px;
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          padding: 40px;
          overflow: hidden;
        }

        .analyzer-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 48px;
        }

        .form-group {
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 100%;
        }

        .form-label {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-main);
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .input-field {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--card-border);
          border-radius: 12px;
          padding: 12px 16px;
          color: var(--text-main);
          font-family: inherit;
          font-size: 14px;
          transition: all 0.25s ease;
        }

        .input-field:focus {
          outline: none;
          border-color: var(--primary);
          background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 0 10px rgba(0, 242, 254, 0.1);
        }

        .gender-options {
          display: flex;
          gap: 12px;
          width: 100%;
        }

        .gender-btn {
          flex: 1;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--card-border);
          border-radius: 12px;
          padding: 12px;
          color: var(--text-muted);
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .gender-btn:hover {
          background: rgba(255, 255, 255, 0.06);
          color: var(--text-main);
        }

        .gender-btn.active {
          background: rgba(0, 242, 254, 0.08);
          border-color: var(--primary);
          color: var(--primary);
          box-shadow: 0 0 12px rgba(0, 242, 254, 0.1);
        }

        /* Results pane styling */
        .results-panel {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 18px;
          padding: 30px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 320px;
          position: relative;
        }

        .results-placeholder {
          text-align: center;
          color: var(--text-muted);
        }

        .results-placeholder-icon {
          color: rgba(0, 242, 254, 0.25);
          margin-bottom: 16px;
          display: flex;
          justify-content: center;
          animation: breathePlaceholder 3s ease-in-out infinite alternate;
        }

        @keyframes breathePlaceholder {
          0% { transform: scale(0.95); opacity: 0.6; }
          100% { transform: scale(1.05); opacity: 1; }
        }

        @media (max-width: 1024px) {
          .analyzer-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .analyzer-card {
            padding: 24px;
          }
        }
      `}</style>

      {/* Decorative ambient glows in background */}
      <div className="ambient-glow-1"></div>
      <div className="ambient-glow-2"></div>

      {/* --- NAVBAR --- */}
      <nav className="navbar">
        <div className="container nav-container">
          {/* Logo Group */}
          <a href="#home" className="nav-logo-group">
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <StethoscopeIcon />
            </span>
            <span className="nav-logo-text">SmartAssist<span style={{ color: 'var(--primary)', fontWeight: '400' }}>.AI</span></span>
          </a>

          {/* Center Links (Hidden on Mobile) */}
          <ul className="nav-links">
            <li>
              <a 
                href="#features" 
                className={`nav-link ${activeTab === 'features' ? 'active' : ''}`}
                onClick={() => setActiveTab('features')}
              >
                Features
              </a>
            </li>
            <li>
              <a 
                href="#technology" 
                className={`nav-link ${activeTab === 'technology' ? 'active' : ''}`}
                onClick={() => setActiveTab('technology')}
              >
                AI Technology
              </a>
            </li>
            <li>
              <a 
                href="#clinicians" 
                className={`nav-link ${activeTab === 'clinicians' ? 'active' : ''}`}
                onClick={() => setActiveTab('clinicians')}
              >
                Clinician Network
              </a>
            </li>
            <li>
              <a 
                href="#security" 
                className={`nav-link ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                Security & Trust
              </a>
            </li>
            <li>
              <a 
                href="#pricing" 
                className={`nav-link ${activeTab === 'pricing' ? 'active' : ''}`}
                onClick={() => setActiveTab('pricing')}
              >
                Pricing
              </a>
            </li>
          </ul>

          {/* Action CTAs */}
          <div className="nav-cta-group">
            <button className="btn btn-glass" style={{ display: 'none' }}>Log In</button>
            <button className="btn btn-gradient" onClick={() => handlePromptClick('Analyze general wellness targets for healthy longevity.', 'fitness')}>
              Launch Assistant
              <ArrowRightIcon />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button 
              className={`hamburger ${mobileMenuOpen ? 'open' : ''}`} 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Fullscreen Mobile Drawer */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <a href="#features" className="nav-link" onClick={() => { setActiveTab('features'); setMobileMenuOpen(false); }}>Features</a>
        <a href="#technology" className="nav-link" onClick={() => { setActiveTab('technology'); setMobileMenuOpen(false); }}>AI Technology</a>
        <a href="#clinicians" className="nav-link" onClick={() => { setActiveTab('clinicians'); setMobileMenuOpen(false); }}>Clinician Network</a>
        <a href="#security" className="nav-link" onClick={() => { setActiveTab('security'); setMobileMenuOpen(false); }}>Security & Trust</a>
        <a href="#pricing" className="nav-link" onClick={() => { setActiveTab('pricing'); setMobileMenuOpen(false); }}>Pricing</a>
        <button 
          className="btn btn-gradient" 
          style={{ marginTop: '24px', width: '200px' }}
          onClick={() => { setMobileMenuOpen(false); handlePromptClick('Analyze general wellness targets for healthy longevity.', 'fitness'); }}
        >
          Launch Assistant
        </button>
      </div>

      {/* --- HERO SECTION --- */}
      <main className="hero-section container">
        <div className="hero-grid">
          
          {/* Hero Left Content Column */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div className="hero-badge-container">
              <span className="hero-badge">
                <SparkleIcon />
                Now Live: MedLLM-v3 Advanced Clinical Triage
              </span>
            </div>

            <h1 className="hero-title">
              Your AI-Powered <br />
              <span>Clinical Companion</span>
            </h1>

            <p className="hero-description">
              Experience next-generation symptom triaging, secure clinical record synthesis, and bio-metric compliance tracking. Engineered on secure, HIPAA-compliant protocols validated by leading healthcare practitioners.
            </p>

            <div className="hero-actions">
              <button 
                className="btn btn-gradient"
                onClick={() => handlePromptClick('Analyze sudden mild chest discomfort I felt after a light jog.', 'discomfort')}
              >
                Consult Triage Bot
                <ArrowRightIcon />
              </button>
              <button 
                className="btn btn-glass"
                onClick={() => handlePromptClick('Interpret my high LDL cholesterol and low Vitamin D values.', 'blood')}
              >
                <PlayIcon />
                Analyze Blood Report
              </button>
            </div>

            {/* Trust Badges */}
            <div className="trust-badges">
              <div className="trust-badge-item">
                <div className="trust-badge-icon">
                  <ShieldAlertIcon />
                </div>
                <div className="trust-badge-label">HIPAA Compliant</div>
              </div>
              <div className="trust-badge-item">
                <div className="trust-badge-icon">
                  <ActivityIcon />
                </div>
                <div className="trust-badge-label">FDA Regulated Frameworks</div>
              </div>
              <div className="trust-badge-item">
                <div className="trust-badge-icon">
                  <UserHeartIcon />
                </div>
                <div className="trust-badge-label">99.4% Triaging Accuracy</div>
              </div>
            </div>
          </div>

          {/* Hero Right Interactive Dashboard Column */}
          <div className="mockup-container">
            <div className="glass-dashboard">
              
              {/* Dashboard Header */}
              <div className="dashboard-header">
                <div className="dashboard-user-info">
                  <div className="dashboard-avatar">SH</div>
                  <div className="dashboard-user-text">
                    <h4>Clinical Hub Simulator</h4>
                    <p>
                      <span className="online-dot"></span>
                      AI CORE ACTIVE
                    </p>
                  </div>
                </div>
                <div className="dashboard-controls">
                  <div className="dot-control"></div>
                  <div className="dot-control"></div>
                  <div className="dot-control"></div>
                </div>
              </div>

              {/* Vitals Ticker & Mini Tools */}
              <div className="dashboard-vitals">
                {/* Heart Rate Vitals */}
                <div className="vital-card">
                  <div className="vital-icon heart">
                    <ActivityIcon />
                  </div>
                  <div className="vital-detail">
                    <h5>Simulated Pulse</h5>
                    <h3>{heartRate}<span>BPM</span></h3>
                  </div>
                </div>

                {/* Patient Wellness Compliance */}
                <div className="vital-card">
                  <div className="vital-icon compliance">
                    <UserHeartIcon />
                  </div>
                  <div className="vital-detail">
                    <h5>Adherence Score</h5>
                    <h3>{adhearanceScore}%<span>today</span></h3>
                  </div>
                </div>

                {/* SVG ECG wave pulse animation */}
                <div className="ecg-monitor">
                  <svg className="ecg-svg" viewBox="0 0 400 40" preserveAspectRatio="none">
                    <path 
                      className="ecg-wave-path" 
                      d="M 0 20 L 50 20 L 60 10 L 70 30 L 80 20 L 130 20 L 140 20 L 145 5 L 152 35 L 160 20 L 170 20 L 220 20 L 230 10 L 240 30 L 250 20 L 300 20 L 310 20 L 315 5 L 322 35 L 330 20 L 340 20 L 400 20"
                    />
                  </svg>
                </div>

                {/* Medication Checklist Card */}
                <div className="med-compliance-container">
                  <div className="med-header">
                    <div className="med-title-group">
                      <CalendarIcon />
                      <span>Today's Prescriptions</span>
                    </div>
                    <span className="compliance-number">Adherence Tracker</span>
                  </div>
                  <div className="compliance-bar-outer">
                    <div className="compliance-bar-inner" style={{ width: `${adhearanceScore}%` }}></div>
                  </div>
                  <div className="med-list">
                    {meds.map(med => (
                      <div 
                        key={med.id} 
                        className={`med-item ${med.taken ? 'taken' : ''}`}
                        onClick={() => handleMedToggle(med.id)}
                      >
                        <div className="med-checkbox-group">
                          <div className="med-checkbox">
                            {med.taken && <CheckIcon />}
                          </div>
                          <div className="med-info-text">
                            <span className="med-name">{med.name}</span>
                            <span className="med-time">Scheduled: {med.time}</span>
                          </div>
                        </div>
                        <span style={{ fontSize: '10px', color: med.taken ? 'var(--emerald)' : 'var(--text-muted)', fontWeight: '600' }}>
                          {med.taken ? 'Done' : 'Take'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Chat Conversation Scroll Area */}
              <div className="dashboard-chat-area">
                {chatMessages.map(msg => (
                  <div key={msg.id} className={`chat-bubble ${msg.isBot ? 'bot' : 'user'}`}>
                    <div className="chat-bubble-inner">
                      {msg.text}
                      
                      {/* Detailed clinical card rendering if bot triage data is present */}
                      {msg.isBot && msg.triage && (
                        <div className="clinical-report-card">
                          <div className={`clinical-header-badge ${msg.triageLevel}`}>
                            <SparkleIcon />
                            {msg.triage}
                          </div>
                          <div className="clinical-summary">
                            {msg.summary}
                          </div>
                          <div style={{ fontSize: '11px', fontWeight: '700', marginBottom: '6px', color: '#FFF' }}>
                            RECOMMENDED CLINICAL ACTION PROTOCOL:
                          </div>
                          <ul className="clinical-bullet-list">
                            {msg.actions.map((act, i) => (
                              <li key={i}>{act}</li>
                            ))}
                          </ul>
                          <div className="clinical-doctor-booking">
                            <div className="clinical-doctor-info">
                              <span className="clinical-doctor-label">AUTOROUTING SPECIALIST:</span>
                              <span className="clinical-doctor-name">{msg.specialist}</span>
                            </div>
                            <button className="clinical-book-btn" onClick={() => alert(`Connecting with ${msg.specialist}...`)}>
                              Connect Now
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <span className="chat-time">{msg.time}</span>
                  </div>
                ))}

                {isTyping && (
                  <div className="chat-bubble bot">
                    <div className="typing-indicator">
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Prompt Suggestions Footer */}
              <div className="dashboard-prompts-bar">
                <div className="prompt-headline">Test Clinical Scenarios:</div>
                <div className="prompt-grid">
                  {quickPrompts.map(p => (
                    <button
                      key={p.id}
                      className={`prompt-pill ${isTyping ? 'disabled' : ''}`}
                      onClick={() => handlePromptClick(p.q, p.id)}
                      disabled={isTyping}
                    >
                      <span>{p.label}</span>
                      <span className="prompt-pill-arrow">Send →</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* --- AI SYMPTOM ANALYZER SECTION --- */}
      <section className="analyzer-section container" id="analyzer">
        <div className="analyzer-title-group">
          <span className="hero-badge" style={{ marginBottom: '12px' }}>
            <StethoscopeIcon />
            Clinical Intake Engine
          </span>
          <h2 className="analyzer-section-title">AI Symptom Triage Analyzer</h2>
          <p className="analyzer-section-subtitle">
            Provide demographics and symptom characteristics below to run an automated diagnostic risk triage scan.
          </p>
        </div>

        <div className="analyzer-card">
          <div className="analyzer-grid">
            
            {/* Form Inputs Left Column */}
            <form onSubmit={handleAnalyzeSymptoms} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              
              {/* Symptoms Input */}
              <div className="form-group">
                <label className="form-label" htmlFor="symptoms-input">Describe Your Symptoms</label>
                <textarea
                  id="symptoms-input"
                  className="input-field"
                  rows="4"
                  placeholder="e.g., dry cough, mild fever, or sudden chest discomfort..."
                  value={analyzerSymptoms}
                  onChange={(e) => setAnalyzerSymptoms(e.target.value)}
                  style={{ resize: 'none' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '8px' }}>
                {/* Age Input */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="age-input">Age</label>
                  <input
                    type="number"
                    id="age-input"
                    className="input-field"
                    placeholder="e.g. 35"
                    min="1"
                    max="120"
                    value={analyzerAge}
                    onChange={(e) => setAnalyzerAge(e.target.value)}
                    required
                  />
                </div>

                {/* Gender Select Group */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Biological Gender</label>
                  <div className="gender-options">
                    <button
                      type="button"
                      className={`gender-btn ${analyzerGender === 'Female' ? 'active' : ''}`}
                      onClick={() => setAnalyzerGender('Female')}
                    >
                      Female
                    </button>
                    <button
                      type="button"
                      className={`gender-btn ${analyzerGender === 'Male' ? 'active' : ''}`}
                      onClick={() => setAnalyzerGender('Male')}
                    >
                      Male
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className={`btn btn-gradient ${analyzerLoading ? 'disabled' : ''}`}
                style={{ width: '100%', height: '48px', marginTop: '16px' }}
                disabled={analyzerLoading}
              >
                {analyzerLoading ? 'Analyzing Biomarkers...' : 'Execute Triage Scan'}
                <ArrowRightIcon />
              </button>

            </form>

            {/* Results Panel Right Column */}
            <div className="results-panel">
              {analyzerLoading ? (
                <div className="typing-indicator" style={{ background: 'transparent' }}>
                  <div className="typing-dot" style={{ backgroundColor: 'var(--primary)' }}></div>
                  <div className="typing-dot" style={{ backgroundColor: 'var(--secondary)' }}></div>
                  <div className="typing-dot" style={{ backgroundColor: 'var(--accent-purple)' }}></div>
                </div>
              ) : analyzerResult ? (
                <div style={{ width: '100%' }}>
                  <div className="clinical-report-card" style={{ margin: 0, padding: 0, background: 'transparent', border: 'none' }}>
                    <div className={`clinical-header-badge ${analyzerResult.severity}`} style={{ fontSize: '11px', padding: '6px 10px', marginBottom: '14px' }}>
                      <SparkleIcon />
                      {analyzerResult.title}
                    </div>
                    
                    <p style={{ fontSize: '13.5px', lineHeight: '1.45', color: 'var(--text-muted)', marginBottom: '16px' }}>
                      {analyzerResult.summary}
                    </p>

                    <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.5px', marginBottom: '12px', color: '#FFF' }}>
                      DETECTED CONDITIONS:
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '16px' }}>
                      {analyzerResult.conditions.map((cond, i) => (
                        <div key={i} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <span style={{ fontSize: '13.5px', fontWeight: '600', color: '#FFF' }}>{cond.name}</span>
                            <span style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--primary)' }}>{cond.confidence}% Confidence</span>
                          </div>
                          
                          {/* Confidence Progress Bar */}
                          <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden', marginBottom: '8px' }}>
                            <div style={{ height: '100%', width: `${cond.confidence}%`, background: 'linear-gradient(90deg, var(--primary), var(--secondary))', borderRadius: '2px' }}></div>
                          </div>
                          
                          <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4', textAlign: 'left' }}>
                            <strong style={{ color: '#FFF' }}>Recommendation:</strong> {cond.rec}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="clinical-doctor-booking" style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <div className="clinical-doctor-info">
                        <span className="clinical-doctor-label">AUTOROUTED SPECIALTY:</span>
                        <span className="clinical-doctor-name" style={{ color: 'var(--primary)' }}>{analyzerResult.specialists}</span>
                      </div>
                      <button type="button" className="clinical-book-btn" onClick={() => alert(`Routing consult connection to: ${analyzerResult.specialists}`)}>
                        Secure Consult
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="results-placeholder">
                  <div className="results-placeholder-icon">
                    <StethoscopeIcon />
                  </div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', color: 'var(--text-main)' }}>Awaiting Diagnostics</h4>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', maxWidth: '280px', margin: '0 auto' }}>
                    Complete the symptoms form and execute triage scan to view structured clinical outcomes.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* --- HEALTH SCORE CALCULATOR SECTION --- */}
      <section className="analyzer-section container" id="health-calculator" style={{ paddingTop: 0 }}>
        <div className="analyzer-title-group">
          <span className="hero-badge" style={{ marginBottom: '12px' }}>
            <ActivityIcon />
            Wellness Biomarkers
          </span>
          <h2 className="analyzer-section-title">Health Score Calculator</h2>
          <p className="analyzer-section-subtitle">
            Input your average physiological habits to calculate a diagnostic personal health score.
          </p>
        </div>

        <div className="analyzer-card">
          <div className="analyzer-grid">
            
            {/* Form Inputs Left Column */}
            <form onSubmit={handleCalculateScore} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              
              {/* Sleep Hours Input */}
              <div className="form-group">
                <label className="form-label" htmlFor="sleep-input">Sleep Duration (Hours/Night)</label>
                <input
                  type="number"
                  id="sleep-input"
                  className="input-field"
                  placeholder="e.g. 7.5"
                  step="0.1"
                  min="0"
                  max="24"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(e.target.value)}
                  required
                />
              </div>

              {/* Water Intake Input */}
              <div className="form-group">
                <label className="form-label" htmlFor="water-input">Daily Water Intake (Liters)</label>
                <input
                  type="number"
                  id="water-input"
                  className="input-field"
                  placeholder="e.g. 3.0"
                  step="0.1"
                  min="0"
                  max="20"
                  value={waterIntake}
                  onChange={(e) => setWaterIntake(e.target.value)}
                  required
                />
              </div>

              {/* Exercise Minutes Input */}
              <div className="form-group">
                <label className="form-label" htmlFor="exercise-input">Exercise Duration (Minutes/Day)</label>
                <input
                  type="number"
                  id="exercise-input"
                  className="input-field"
                  placeholder="e.g. 45"
                  min="0"
                  max="1440"
                  value={exerciseMinutes}
                  onChange={(e) => setExerciseMinutes(e.target.value)}
                  required
                />
              </div>

              {/* Calculate Button */}
              <button
                type="submit"
                className={`btn btn-gradient ${calculatorLoading ? 'disabled' : ''}`}
                style={{ width: '100%', height: '48px', marginTop: '16px' }}
                disabled={calculatorLoading}
              >
                {calculatorLoading ? 'Synthesizing Wellness Score...' : 'Calculate Health Score'}
                <ArrowRightIcon />
              </button>

            </form>

            {/* Results Panel Right Column */}
            <div className="results-panel">
              {calculatorLoading ? (
                <div className="typing-indicator" style={{ background: 'transparent' }}>
                  <div className="typing-dot" style={{ backgroundColor: 'var(--primary)' }}></div>
                  <div className="typing-dot" style={{ backgroundColor: 'var(--secondary)' }}></div>
                  <div className="typing-dot" style={{ backgroundColor: 'var(--accent-purple)' }}></div>
                </div>
              ) : calculatedScore ? (
                <div style={{ width: '100%', textAlign: 'center' }}>
                  {/* Glowing Score Display */}
                  <div style={{ position: 'relative', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{
                      position: 'absolute',
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      background: `radial-gradient(circle, var(--primary) 0%, transparent 70%)`,
                      opacity: 0.25,
                      filter: 'blur(10px)'
                    }}></div>
                    <div style={{
                      width: '110px',
                      height: '110px',
                      borderRadius: '50%',
                      border: `4px solid rgba(255, 255, 255, 0.05)`,
                      borderTopColor: calculatedScore.status === 'optimal' ? 'var(--emerald)' : calculatedScore.status === 'warning' ? 'var(--amber)' : 'var(--rose)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      background: 'rgba(0, 0, 0, 0.3)'
                    }}>
                      <span style={{ fontSize: '32px', fontWeight: '800', color: '#FFF', lineHeight: '1' }}>{calculatedScore.score}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>/ 100</span>
                    </div>
                  </div>

                  <div className="clinical-report-card" style={{ margin: 0, padding: 0, background: 'transparent', border: 'none', textAlign: 'left' }}>
                    <div className={`clinical-header-badge ${calculatedScore.status}`} style={{ fontSize: '11px', padding: '6px 10px', marginBottom: '14px', display: 'inline-flex' }}>
                      <SparkleIcon />
                      {calculatedScore.tag}
                    </div>
                    
                    <p style={{ fontSize: '13.5px', lineHeight: '1.45', color: '#FFF', marginBottom: '16px', fontWeight: '500' }}>
                      {calculatedScore.summary}
                    </p>

                    <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.5px', marginBottom: '10px', color: 'var(--text-muted)' }}>
                      RECOMMENDED ADJUSTMENTS:
                    </div>
                    <ul className="clinical-bullet-list" style={{ paddingLeft: '16px', margin: 0, fontSize: '12.5px' }}>
                      {calculatedScore.tips.map((tip, i) => (
                        <li key={i} style={{ marginBottom: '6px' }}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="results-placeholder">
                  <div className="results-placeholder-icon">
                    <ActivityIcon />
                  </div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', color: 'var(--text-main)' }}>Awaiting Parameters</h4>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', maxWidth: '280px', margin: '0 auto' }}>
                    Input your daily recovery, hydration, and movement thresholds to calculate your physical vitality.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
