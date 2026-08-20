import { useState, useEffect } from 'react';
import { Button } from '../common/Button';

interface FinalCTASectionProps {
  onStartJourney?: () => void;
}

export function FinalCTASection({ onStartJourney }: FinalCTASectionProps) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const session = localStorage.getItem('itpath_logged_in_user');
    if (session) {
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

