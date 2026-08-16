import { useState, useEffect, useRef } from 'react';

// Import career images
import backendDevImg from '../../assets/images/Backend Devolper.jpg';
import cyberSecurityImg from '../../assets/images/Cyber Security.jpg';
import dataScienceImg from '../../assets/images/Data Science.jpg';
import devopsImg from '../../assets/images/DevOps.jpg';
import machineLearningImg from '../../assets/images/Machine Learning.jpg';
import projectManagerImg from '../../assets/images/Project Manager.jpg';
import qaTesterImg from '../../assets/images/QA_Software Tester.jpg';
import softwareEngineerImg from '../../assets/images/Software Engineer.jpg';
import uiuxDesignerImg from '../../assets/images/UI_UX Designer.jpg';

interface Career {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  pdf: string;
}

export function HowItWorksSection() {
  const [activeCareerId, setActiveCareerId] = useState<string>('software-engineer');
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const careers: Career[] = [
    {
      id: 'software-engineer',
      title: 'Software Engineer',
      subtitle: 'Build & Develop Systems',
      image: softwareEngineerImg,
      pdf: '/roadmap/full-stack.pdf'
    },
    {
      id: 'backend-developer',
      title: 'Backend Developer',
      subtitle: 'APIs, Databases & Logic',
      image: backendDevImg,
      pdf: '/roadmap/backend.pdf'
    },
    {
      id: 'uiux-designer',
      title: 'UI/UX Designer',
      subtitle: 'Design User Experiences',
      image: uiuxDesignerImg,
      pdf: '/roadmap/ux-design.pdf'
    },
    {
      id: 'devops',
      title: 'DevOps Engineer',
      subtitle: 'CI/CD & Cloud Infrastructure',
      image: devopsImg,
      pdf: '/roadmap/devops.pdf'
    },
    {
      id: 'cybersecurity',
      title: 'Cyber Security',
      subtitle: 'Protect & Secure Systems',
      image: cyberSecurityImg,
      pdf: '/roadmap/cyber-security.pdf'
    },
    {
      id: 'machine-learning',
      title: 'Machine Learning',
      subtitle: 'Build Intelligent Models',
      image: machineLearningImg,
      pdf: '/roadmap/machine-learning.pdf'
    },
    {
      id: 'data-science',
      title: 'Data Science',
      subtitle: 'Analyze & Find Insights',
      image: dataScienceImg,
      pdf: '/roadmap/ai-data-scientist.pdf'
    },
    {
      id: 'product-manager',
      title: 'Product Manager',
      subtitle: 'Manage & Deliver Products',
      image: projectManagerImg,
      pdf: '/roadmap/product-manager.pdf'
    },
    {
      id: 'qa-tester',
      title: 'QA / Software Tester',
      subtitle: 'Test & Ensure Quality',
      image: qaTesterImg,
      pdf: '/roadmap/qa (1).pdf'
    }
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const extendedCareers = [...careers, ...careers, ...careers];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isWrapping = false;

    const handleScroll = () => {
      if (isWrapping) return;
      const singleSetWidth = container.scrollWidth / 3;
      if (singleSetWidth <= 0) return;

      // Infinite wrapping check
      if (container.scrollLeft < singleSetWidth) {
        isWrapping = true;
        container.scrollLeft += singleSetWidth;
        requestAnimationFrame(() => {
          isWrapping = false;
        });
      } else if (container.scrollLeft >= 2 * singleSetWidth) {
        isWrapping = true;
        container.scrollLeft -= singleSetWidth;
        requestAnimationFrame(() => {
          isWrapping = false;
        });
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY * 1.2;
      }
    };

    const centerScroll = () => {
      const singleSetWidth = container.scrollWidth / 3;
      if (singleSetWidth > 0) {
        container.scrollLeft = singleSetWidth;
        return true;
      }
      return false;
    };

    let centerInterval: any;
    if (!centerScroll()) {
      centerInterval = setInterval(() => {
        if (centerScroll()) {
          clearInterval(centerInterval);
        }
      }, 50);
    }

    container.addEventListener('scroll', handleScroll, { passive: true });
    container.addEventListener('wheel', handleWheel, { passive: false });

    const handleResize = () => {
      const singleSetWidth = container.scrollWidth / 3;
      if (singleSetWidth > 0) {
        container.scrollLeft = singleSetWidth;
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (centerInterval) clearInterval(centerInterval);
      container.removeEventListener('scroll', handleScroll);
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
    };
  }, [careers.length]);

  const handleSelectCareer = (careerId: string) => {
    setActiveCareerId(careerId);
    console.log(`Selected career roadmap for: ${careerId}`);
  };

  return (
    <div className="career-select-wrapper" ref={sectionRef}>
      <div className="career-select-sticky">
        <section className="career-select-section" id="how-it-works">
          <div className="career-select-header">
            <span className="career-select-eyebrow">CHOOSE YOUR PATH</span>
            <h2 className="career-select-title">What’s Your Career Goal?</h2>
            <p className="career-select-description">
              Explore career paths, discover the skills you need, and follow a roadmap designed to take you from university to industry.
            </p>
          </div>

          <div className="career-track-container" ref={containerRef}>
            <div className="career-track" ref={trackRef}>
              {extendedCareers.map((career, index) => {
                const isActive = activeCareerId === career.id;
                const cardNumber = `0${(index % careers.length) + 1} / 0${careers.length}`;
                
                return (
                  <div 
                    key={`${career.id}-${index}`} 
                    className={`career-card-wrapper ${isActive ? 'active' : ''}`}
                    onClick={() => handleSelectCareer(career.id)}
                  >
                    {/* Floating Roadmap Tooltip */}
                    <div 
                      className="roadmap-tooltip"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(career.pdf, '_blank');
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <span>→ See Roadmap</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </div>

                    {/* Card Main Body */}
                    <div className="career-card">
                      <div 
                        className="career-card-image" 
                        style={{ backgroundImage: `url(${career.image})` }} 
                      />
                      <div className="career-card-overlay" />
                      
                      <div className="career-card-info">
                        <span className="career-card-number">{cardNumber}</span>
                        <h3 className="career-card-title">{career.title}</h3>
                        <p className="career-card-subtitle">{career.subtitle}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
export default HowItWorksSection;
