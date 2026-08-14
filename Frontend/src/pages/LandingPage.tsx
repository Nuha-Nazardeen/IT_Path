import { Navbar } from '../components/layout/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { ChallengeSection } from '../components/landing/ChallengeSection';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { FinalCTASection } from '../components/landing/FinalCTASection';
import { Footer } from '../components/layout/Footer';

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const handleStartJourney = () => {
    onNavigate('/register');
  };

  const handleSeeHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      <Navbar onNavigate={onNavigate} activePath="/" />
      <main style={{ flex: 1 }}>
        <HeroSection 
          onStartJourney={handleStartJourney} 
          onSeeHowItWorks={handleSeeHowItWorks} 
        />
        <ChallengeSection />
        <HowItWorksSection />
        <FeaturesSection />
        <FinalCTASection 
          onStartJourney={handleStartJourney} 
          onSeeHowItWorks={handleSeeHowItWorks} 
        />
      </main>
      <Footer />
    </div>
  );
}
export default LandingPage;
