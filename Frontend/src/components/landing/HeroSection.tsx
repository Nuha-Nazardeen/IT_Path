import { useState, useEffect } from 'react';
import { DashboardPreview } from './DashboardPreview';
import { Button } from '../common/Button';

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
    <section className="hero-section">
      <div className="hero-content">
        <span className="badge">Built for IT Undergraduates</span>
        <h1 className="hero-title">
          Your IT Degree Is Only One Part of the Journey.
        </h1>
        <p className="hero-description">
          Balance university, build industry-ready skills, and turn your academic work into career evidence — all in one place.
        </p>
        <div className="hero-actions">
          <Button variant="primary" onClick={handleHeroAction}>
            {user ? `Go to My Dashboard` : `Build My IT Journey`} {arrowRight}
          </Button>
          <Button variant="secondary" onClick={onSeeHowItWorks}>
            See How It Works
          </Button>
        </div>
        <div className="trust-subtext">
          <span>🛡️</span> {user ? `Logged in as ${user.fullName} (${user.academic.studentId})` : `Designed for the real challenges of IT students.`}
        </div>
      </div>
      <DashboardPreview />
    </section>
  );
}

