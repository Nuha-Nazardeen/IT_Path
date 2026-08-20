import { useState, useEffect } from 'react';
import heroBg from '../../assets/images/2.jpg';

interface HeroSectionProps {
  onStartJourney?: () => void;
}

export function HeroSection({ onStartJourney }: HeroSectionProps) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const session = localStorage.getItem('itpath_logged_in_user');
    if (session) {
      try {
        const parsedSession = JSON.parse(session);
        if (parsedSession.email === 'admin@gmail.com') {
          setUser({ fullName: 'Admin User', email: 'admin@gmail.com', isAdmin: true });
          return;
        }
      } catch (e) {}

      const stored = localStorage.getItem('itpath_registered_user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          setUser({ fullName: 'Student', academic: { degree: 'IT Programme' }, career: 'Software Engineering' });
        }
      } else {
        setUser({ fullName: 'Student', academic: { degree: 'IT Programme' }, career: 'Software Engineering' });
      }
    }
  }, []);

  const arrowRight = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  );

  const handleHeroAction = () => {
    if (user) {
      if (user.isAdmin) {
        window.history.pushState({}, '', '/admin-dashboard');
        window.dispatchEvent(new PopStateEvent('popstate'));
      } else {
        window.history.pushState({}, '', '/dashboard');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    } else if (onStartJourney) {
      onStartJourney();
    }
  };

  return (
    <section className="hero-section" style={{ backgroundImage: `url(${heroBg})` }}>
      <div className="hero-overlay" />
      <div className="hero-content">
        <span className="badge">Built for IT Undergraduates</span>
        <h1 className="hero-title">
          Build Your Tech Career With Confidence
        </h1>
        <p className="hero-description">
          Plan your academic journey, develop industry-ready skills, and discover the right career path for your future in technology.
        </p>
        <div className="hero-actions">
          <button 
            className="hero-pill-primary" 
            onClick={() => {
              const el = document.getElementById('career-paths');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Explore Career Paths {arrowRight}
          </button>
          <button className="hero-pill-secondary" onClick={handleHeroAction}>
            Start My Journey
          </button>
        </div>
        
        <div style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600, marginBottom: '24px', fontStyle: 'italic', opacity: 0.8 }}>
          Built for the journey from university to industry.
        </div>

        <div className="trust-subtext">
          <span>🛡️</span> {user ? `Logged in as ${user.fullName}` : `Designed for the real challenges of IT students.`}
        </div>
      </div>
    </section>
  );
}

