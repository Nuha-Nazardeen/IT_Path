import { useState } from 'react';
import { Button } from '../common/Button';

interface FinalCTASectionProps {
  onStartJourney?: () => void;
}

interface StoredLandingUser {
  fullName: string;
  academic: { degree: string };
  career: string;
}

function getStoredLandingUser(): StoredLandingUser | null {
  const session = localStorage.getItem('itpath_logged_in_user');
  if (!session) return null;

  const stored = localStorage.getItem('itpath_registered_user');
  if (stored) {
    try {
      return JSON.parse(stored) as StoredLandingUser;
    } catch {
      return { fullName: 'Student', academic: { degree: 'IT Programme' }, career: 'Software Engineering' };
    }
  }
  return { fullName: 'Student', academic: { degree: 'IT Programme' }, career: 'Software Engineering' };
}

export function FinalCTASection({ onStartJourney }: FinalCTASectionProps) {
  const [user] = useState<StoredLandingUser | null>(() => getStoredLandingUser());

  const handleCTAAction = () => {
    if (user) {
      alert(`Redirecting to personalized Dashboard for: ${user.fullName}\nTarget Career: ${user.career}\nDegree: ${user.academic.degree}`);
    } else if (onStartJourney) {
      onStartJourney();
    }
  };

  return (
    <section className="cta-section">
      <div className="cta-container">
        <h2 className="cta-title">
          {user ? `Your Customized Techora is Ready` : `Ready to Take Control of Your IT Career?`}
        </h2>
        <p className="cta-description">
          {user 
            ? `Welcome aboard! You have successfully personalized your academic and career roadmap. Jump into your student dashboard to get started.` 
            : `Stop guessing what skills you need. Build your roadmap, track your progress, and prepare for your IT career with confidence.`
          }
        </p>
        <div className="cta-buttons">
          <Button variant="cta-primary" onClick={handleCTAAction}>
            {user ? `Go to My Dashboard` : `Start My Journey`}
          </Button>
          <Button 
            variant="cta-secondary" 
            onClick={() => {
              const el = document.getElementById('how-it-works');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}

