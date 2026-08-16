import { useState, useEffect } from 'react';
import heroBg from '../../assets/images/2.jpg';

interface HeroSectionProps {
  onStartJourney?: () => void;
  onSeeHowItWorks?: () => void;
}

export function HeroSection({ onStartJourney, onSeeHowItWorks }: HeroSectionProps) {
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
          Build Your IT Path With Confidence
        </h1>
        <p className="hero-description">
          Plan your academic journey, develop industry-ready skills, and discover the right career path for your future in technology.
        </p>
        <div className="hero-actions">
          <button className="hero-pill-primary" onClick={handleHeroAction}>
            Explore Your Path {arrowRight}
          </button>
          <button className="hero-pill-secondary" onClick={onSeeHowItWorks}>
            Get Started
          </button>
        </div>
        
        <div className="hero-search-container" style={{ marginBottom: '24px' }}>
          <input 
            type="text" 
            className="hero-search-input" 
            placeholder="Search courses, skills or careers..." 
          />
          <span className="hero-search-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
        </div>

        <div className="trust-subtext">
          <span>🛡️</span> {user ? `Logged in as ${user.fullName}` : `Designed for the real challenges of IT students.`}
        </div>
      </div>
    </section>
  );
}

