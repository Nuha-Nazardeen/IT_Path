import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'motion/react';
import howItWorksImg from '../../assets/images/howitworks.jpg';

interface StepItem {
  number: string;
  title: string;
  description: string;
  bg: string;
  color: string;
}

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  // Setup scroll progress targeting the section track
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // Spring values for smooth scroll animation transitions
  const scrollSpring = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });

  // Update active step index based on scroll position
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.2) setActiveIdx(0);
    else if (latest < 0.4) setActiveIdx(1);
    else if (latest < 0.6) setActiveIdx(2);
    else if (latest < 0.8) setActiveIdx(3);
    else setActiveIdx(4);
  });

  // Steps data
  const steps: StepItem[] = [
    {
      number: '01',
      title: 'CREATE YOUR PROFILE',
      description: 'Build your student profile with your academic background, current skills, experience, and availability.',
      bg: '#8E7560', // Dark beige color
      color: '#FFFFFF'
    },
    {
      number: '02',
      title: 'CHOOSE YOUR CAREER',
      description: 'Explore IT career paths and choose the role you want to prepare for.',
      bg: '#B38D97',
      color: '#FFFFFF'
    },
    {
      number: '03',
      title: 'DISCOVER YOUR SKILL GAPS',
      description: 'Compare your current skills with the knowledge and abilities required for your chosen career.',
      bg: '#D5ACA9',
      color: '#5A2E12'
    },
    {
      number: '04',
      title: 'FOLLOW YOUR ROADMAP',
      description: 'Use a structured career roadmap to understand what skills, technologies, and experience to build next.',
      bg: '#EBCFB2',
      color: '#5A2E12'
    },
    {
      number: '05',
      title: 'TRACK YOUR PROGRESS',
      description: 'Monitor your academic, technical, and career development as you move closer to your goals.',
      bg: '#C5BAAF',
      color: '#5A2E12'
    }
  ];

  // Helper to construct transition frames for step card values
  const getStepValues = (idx: number) => {
    const center = idx / 4;
    const input = [
      Math.max(0, center - 0.25),
      Math.max(0, center - 0.1),
      center,
      Math.min(1, center + 0.1),
      Math.min(1, center + 0.25)
    ];
    const uniqueInput = Array.from(new Set(input)).sort((a, b) => a - b);
    
    const opacityOutput: number[] = uniqueInput.map(val => {
      if (val < center - 0.09) return 0.45; // future step: subdued
      if (Math.abs(val - center) < 0.05) return 1.0; // active step: visually stronger
      return 0.8; // completed step
    });

    const scaleOutput: number[] = uniqueInput.map(val => {
      if (val < center - 0.09) return 0.96; // future
      if (Math.abs(val - center) < 0.05) return 1.04; // active: slightly scaled up
      return 1.0; // completed
    });

    const badgeScaleOutput: number[] = uniqueInput.map(val => {
      if (val < center - 0.09) return 1.0;
      if (Math.abs(val - center) < 0.05) return 1.1; // active circle scale
      return 1.0;
    });

    return { uniqueInput, opacityOutput, scaleOutput, badgeScaleOutput };
  };

  // Pre-generate scroll transforms for each step card
  const stepOpacity0 = useSpring(useTransform(scrollYProgress, getStepValues(0).uniqueInput, getStepValues(0).opacityOutput), { stiffness: 100, damping: 20 });
  const stepScale0 = useSpring(useTransform(scrollYProgress, getStepValues(0).uniqueInput, getStepValues(0).scaleOutput), { stiffness: 100, damping: 20 });
  const stepBadgeScale0 = useSpring(useTransform(scrollYProgress, getStepValues(0).uniqueInput, getStepValues(0).badgeScaleOutput), { stiffness: 100, damping: 20 });

  const stepOpacity1 = useSpring(useTransform(scrollYProgress, getStepValues(1).uniqueInput, getStepValues(1).opacityOutput), { stiffness: 100, damping: 20 });
  const stepScale1 = useSpring(useTransform(scrollYProgress, getStepValues(1).uniqueInput, getStepValues(1).scaleOutput), { stiffness: 100, damping: 20 });
  const stepBadgeScale1 = useSpring(useTransform(scrollYProgress, getStepValues(1).uniqueInput, getStepValues(1).badgeScaleOutput), { stiffness: 100, damping: 20 });

  const stepOpacity2 = useSpring(useTransform(scrollYProgress, getStepValues(2).uniqueInput, getStepValues(2).opacityOutput), { stiffness: 100, damping: 20 });
  const stepScale2 = useSpring(useTransform(scrollYProgress, getStepValues(2).uniqueInput, getStepValues(2).scaleOutput), { stiffness: 100, damping: 20 });
  const stepBadgeScale2 = useSpring(useTransform(scrollYProgress, getStepValues(2).uniqueInput, getStepValues(2).badgeScaleOutput), { stiffness: 100, damping: 20 });

  const stepOpacity3 = useSpring(useTransform(scrollYProgress, getStepValues(3).uniqueInput, getStepValues(3).opacityOutput), { stiffness: 100, damping: 20 });
  const stepScale3 = useSpring(useTransform(scrollYProgress, getStepValues(3).uniqueInput, getStepValues(3).scaleOutput), { stiffness: 100, damping: 20 });
  const stepBadgeScale3 = useSpring(useTransform(scrollYProgress, getStepValues(3).uniqueInput, getStepValues(3).badgeScaleOutput), { stiffness: 100, damping: 20 });

  const stepOpacity4 = useSpring(useTransform(scrollYProgress, getStepValues(4).uniqueInput, getStepValues(4).opacityOutput), { stiffness: 100, damping: 20 });
  const stepScale4 = useSpring(useTransform(scrollYProgress, getStepValues(4).uniqueInput, getStepValues(4).scaleOutput), { stiffness: 100, damping: 20 });
  const stepBadgeScale4 = useSpring(useTransform(scrollYProgress, getStepValues(4).uniqueInput, getStepValues(4).badgeScaleOutput), { stiffness: 100, damping: 20 });

  const stepSprings = [
    { opacity: stepOpacity0, scale: stepScale0, badgeScale: stepBadgeScale0 },
    { opacity: stepOpacity1, scale: stepScale1, badgeScale: stepBadgeScale1 },
    { opacity: stepOpacity2, scale: stepScale2, badgeScale: stepBadgeScale2 },
    { opacity: stepOpacity3, scale: stepScale3, badgeScale: stepBadgeScale3 },
    { opacity: stepOpacity4, scale: stepScale4, badgeScale: stepBadgeScale4 },
  ];

  // Scroll animations for Left vertical pill (settles early at scroll progress = 0.2)
  const pillX = useSpring(useTransform(scrollYProgress, [0, 0.2], [-30, 0]), { stiffness: 100, damping: 20 });
  const pillOpacity = useSpring(useTransform(scrollYProgress, [0, 0.15], [0, 1]), { stiffness: 100, damping: 20 });

  // Scroll animations for Right composition stack (settles early at scroll progress = 0.25)
  const rightX = useSpring(useTransform(scrollYProgress, [0, 0.25], [30, 0]), { stiffness: 100, damping: 20 });
  const rightScale = useSpring(useTransform(scrollYProgress, [0, 0.25], [0.96, 1.0]), { stiffness: 100, damping: 20 });
  const rightOpacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0, 1]), { stiffness: 100, damping: 20 });

  // Parallax subtle vertical and scale linked effect for student photo image
  const imgScale = useSpring(useTransform(scrollYProgress, [0, 1], [1.0, 1.04]), { stiffness: 100, damping: 25 });
  const imgY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -8]), { stiffness: 100, damping: 25 });

  return (
    <section className="how-it-works-redesign" id="how-it-works" ref={sectionRef}>
      <style>{`
        .how-it-works-redesign {
          background-color: var(--bg-primary);
          position: relative;
          overflow: visible;
          font-family: var(--font-sans);
        }

        /* Desktop sticky layout configuration */
        @media (min-width: 769px) {
          .how-it-works-redesign {
            height: 180vh; /* Scrollable track for sticky progress */
          }
          
          .sticky-wrapper {
            position: sticky;
            top: 80px;
            height: calc(100vh - 100px);
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 20px 6%;
          }
        }

        @media (max-width: 768px) {
          .how-it-works-redesign {
            padding: 50px 6%;
            height: auto;
          }
          .sticky-wrapper {
            position: relative;
            top: 0;
            height: auto;
          }
        }

        .how-it-works-intro {
          text-align: center;
          margin-bottom: 32px;
        }

        .how-it-works-intro-text {
          font-size: 13px;
          color: var(--accent-pink);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.8px;
          margin-bottom: 6px;
        }

        .how-it-works-intro-heading {
          font-size: 20px;
          color: var(--text-secondary);
          font-weight: 600;
          opacity: 0.85;
        }

        .how-it-works-layout {
          display: flex;
          align-items: stretch;
          justify-content: center;
          gap: 28px;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Left Side: Vertical Title Container */
        .vertical-title-container {
          background-color: #5A2E12; /* Dark chocolate background */
          border-radius: 28px;
          width: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-sm);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 30px 0;
          min-height: 380px;
        }

        .vertical-title {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          text-transform: uppercase;
          font-size: 18px;
          font-weight: 900;
          color: #FFFFFF; /* White text */
          letter-spacing: 5px;
          text-align: center;
          white-space: nowrap;
        }

        /* Center Content: Step Cards List */
        .steps-list {
          width: 620px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          position: relative;
          padding-left: 16px;
        }

        .steps-connector-line {
          position: absolute;
          left: 0px;
          top: 20px;
          bottom: 20px;
          width: 2px;
          background-color: var(--accent-beige);
          z-index: 1;
        }

        .step-row {
          display: flex;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .step-badge {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background-color: #FFFFFF;
          border: 2px solid var(--accent-beige);
          color: #5A2E12;
          font-weight: 800;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-sm);
          position: absolute;
          left: -19px;
          z-index: 3;
          transition: border-color 0.25s ease, background-color 0.25s ease, color 0.25s ease;
        }

        .step-content-card {
          flex: 1;
          margin-left: 10px;
          padding: 12px 20px 12px 30px;
          border-radius: 16px 28px 28px 16px;
          box-shadow: var(--shadow-sm);
          border: 1px solid rgba(255, 255, 255, 0.1);
          min-height: 80px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        /* Step Card Hover Interaction (Translate upward 3px, increase shadow) */
        .step-row:hover .step-content-card {
          transform: translateY(-3px) !important;
          box-shadow: 0 8px 20px rgba(90, 46, 18, 0.08) !important;
        }

        .step-row:hover .step-badge {
          border-color: #5A2E12 !important;
        }

        .step-card-title {
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.8px;
          margin-bottom: 2px;
          text-transform: uppercase;
        }

        .step-card-desc {
          font-size: 12.5px;
          line-height: 1.4;
          opacity: 0.95;
        }

        /* Right Side: Overlapping Card Stack Composition */
        .right-stacked-composition {
          width: 280px;
          position: relative;
          min-height: 380px;
          background: radial-gradient(
            circle at 70% 20%,
            rgba(235, 207, 178, 0.55),
            rgba(213, 172, 169, 0.20) 45%,
            transparent 75%
          );
        }

        .overlapping-back-card {
          position: absolute;
          top: 0;
          right: 0;
          width: 250px;
          height: 360px;
          background-color: #EBCFB2; /* Warm beige / pink */
          border-radius: 24px;
          transform: rotate(3deg);
          box-shadow: var(--shadow-sm);
          z-index: 1;
        }

        .overlapping-front-card {
          position: absolute;
          top: 15px;
          left: 0;
          width: 250px;
          height: 355px;
          border: 2.5px solid #5A2E12; /* Dark chocolate border */
          border-radius: 24px;
          box-shadow: 0 12px 30px rgba(90, 46, 18, 0.12); /* Soft warm shadow */
          z-index: 2;
          overflow: hidden;
        }

        /* Career Journey milestones overlay panel */
        .career-journey-overlay {
          position: absolute;
          bottom: 12px;
          left: 10px;
          right: 10px;
          background: rgba(90, 46, 18, 0.85); /* Techora dark chocolate transparent */
          backdrop-filter: blur(4px);
          padding: 8px 6px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          z-index: 5;
          font-size: 9.5px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .milestone-tag {
          transition: all 0.25s ease;
          white-space: nowrap;
        }

        .milestone-tag.active {
          color: #EBCFB2; /* Warm accent color */
          transform: scale(1.06);
          text-shadow: 0 0 6px rgba(235, 207, 178, 0.5);
        }

        .milestone-arrow {
          color: rgba(255, 255, 255, 0.25);
          margin-left: 2px;
        }

        .visual-spark-icon {
          position: absolute;
          color: #B38D97;
          font-size: 20px;
          z-index: 3;
          pointer-events: none;
        }

        .spark-top-left {
          top: -15px;
          left: -10px;
        }

        .spark-bottom-right {
          bottom: -5px;
          right: 15px;
        }

        /* Respect prefers-reduced-motion: disable transitions and scroll animations */
        @media (prefers-reduced-motion: reduce) {
          .vertical-title-container,
          .step-row,
          .steps-connector-line,
          .right-stacked-composition,
          .step-badge {
            transform: none !important;
            opacity: 1 !important;
            transition: none !important;
          }
        }

        /* Responsive Layouts */
        @media (max-width: 1024px) {
          .steps-list {
            width: auto;
            flex: 1;
          }
          .right-stacked-composition {
            width: 250px;
          }
          .overlapping-back-card {
            width: 220px;
          }
          .overlapping-front-card {
            width: 220px;
          }
        }

        @media (max-width: 768px) {
          .how-it-works-layout {
            flex-direction: column;
            align-items: stretch;
            gap: 20px;
          }
          .vertical-title-container {
            min-height: auto;
            width: 100%;
            padding: 12px 0;
            border-radius: 16px;
          }
          .vertical-title {
            writing-mode: horizontal-tb;
            transform: none;
            font-size: 18px;
            letter-spacing: 2px;
          }
          .steps-list {
            width: 100%;
          }
          .right-stacked-composition {
            width: 100%;
            height: 380px;
            margin: 20px auto 0 auto;
            display: flex;
            justify-content: center;
          }
          .overlapping-back-card {
            position: relative;
            transform: none;
            display: none;
          }
          .overlapping-front-card {
            position: relative;
            top: 0;
            left: 0;
            width: 100%;
            max-width: 320px;
          }
        }
      `}</style>

      {/* Sticky wrapper for pinned feel scrolling on desktop */}
      <div className="sticky-wrapper">
        <div className="how-it-works-intro">
          <div className="how-it-works-intro-text">A clear path from university to your IT career</div>
          <div className="how-it-works-intro-heading">Follow these structured milestones to success</div>
        </div>

        <div className="how-it-works-layout">
          {/* Left Side vertical title (Linked scroll slide-in) */}
          <motion.div 
            className="vertical-title-container"
            style={{
              x: pillX,
              opacity: pillOpacity
            }}
          >
            <h2 className="vertical-title">How It Works</h2>
          </motion.div>

          {/* Center content timeline */}
          <div className="steps-list">
            <motion.div 
              className="steps-connector-line"
              style={{
                scaleY: scrollSpring,
                transformOrigin: 'top'
              }}
            />
            {steps.map((step, idx) => {
              const { opacity, scale, badgeScale } = stepSprings[idx];
              return (
                <motion.div 
                  key={step.number} 
                  className="step-row"
                  style={{
                    opacity,
                    scale
                  }}
                >
                  <motion.div 
                    className="step-badge"
                    style={{
                      scale: badgeScale
                    }}
                  >
                    {step.number}
                  </motion.div>
                  <div 
                    className="step-content-card"
                    style={{
                      backgroundColor: step.bg,
                      color: step.color
                    }}
                  >
                    <h3 className="step-card-title">{step.title}</h3>
                    <p className="step-card-desc">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right side overlapping stack composition */}
          <motion.div 
            className="right-stacked-composition"
            style={{
              x: rightX,
              scale: rightScale,
              opacity: rightOpacity
            }}
          >
            {/* Spark SVG decorations */}
            <span className="visual-spark-icon spark-top-left">✦</span>
            <span className="visual-spark-icon spark-bottom-right">✦</span>
            
            <div className="overlapping-back-card" />
            <div className="overlapping-front-card">
              {/* Parallax image zoom effect */}
              <motion.img 
                src={howItWorksImg} 
                alt="Student Career Journey" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  scale: imgScale,
                  y: imgY
                }}
              />
              
              {/* Synchronized career milestones overlay */}
              <div className="career-journey-overlay">
                {['Uni', 'Skills', 'Roadmap', 'Projects', 'Career'].map((milestone, mIdx) => {
                  const isActive = activeIdx === mIdx;
                  return (
                    <span key={milestone} className={`milestone-tag ${isActive ? 'active' : ''}`}>
                      {milestone}
                      {mIdx < 4 && <span className="milestone-arrow">→</span>}
                    </span>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
