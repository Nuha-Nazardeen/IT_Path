import { SectionHeading } from '../common/SectionHeading';

interface Step {
  num: number;
  title: string;
  description: string;
}

export function HowItWorksSection() {
  const steps: Step[] = [
    {
      num: 1,
      title: 'Import Academic Syllabi',
      description: 'Connect your courses and assignments. ITPath maps your university workload so you never miss a deadline.'
    },
    {
      num: 2,
      title: 'Choose Career Pathway',
      description: 'Select your dream role (e.g. Backend, Frontend, DevOps). Receive a step-by-step roadmap of required industry skills.'
    },
    {
      num: 3,
      title: 'Build Verified Evidence',
      description: 'Convert assignments into portfolio projects. Validate your technical skills with proof that recruiters value.'
    }
  ];

  return (
    <section className="how-it-works-section" id="how-it-works">
      <SectionHeading 
        subtitle="The Process"
        title="Three Steps to Industry Ready"
        description="ITPath acts as the bridge connecting your academic milestones directly with career requirements."
      />

      <div className="steps-grid">
        {steps.map((step) => (
          <div key={step.num} className="step-card">
            <div className="step-num">{step.num}</div>
            <h3 className="step-title">{step.title}</h3>
            <p className="step-text">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
