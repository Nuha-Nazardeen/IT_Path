import { Navbar } from '../components/layout/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { ChallengeSection } from '../components/landing/ChallengeSection';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { CareerPathsSection } from '../components/landing/CareerPathsSection';
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

  return (
    <div className="app-container">
      <Navbar onNavigate={onNavigate} activePath="/" />
      <main style={{ flex: 1 }}>
        <HeroSection 
          onStartJourney={handleStartJourney} 
        />
        <ChallengeSection />
        <HowItWorksSection />
        <div style={{
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #EBCFB2, #D5ACA9, #B38D97, #EBCFB2, transparent)',
          width: '80%',
          margin: '0 auto',
          opacity: 0.6
        }} />
        <CareerPathsSection />
        <FeaturesSection />
        <FinalCTASection 
          onStartJourney={handleStartJourney} 
        />
      </main>
      <Footer />
    </div>
  );
}
export default LandingPage;
