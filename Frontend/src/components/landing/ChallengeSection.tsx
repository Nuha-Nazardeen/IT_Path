import { SectionHeading } from '../common/SectionHeading';

interface ChallengeItem {
  icon: string;
  iconClass: string;
  title: string;
  description: string;
}

export function ChallengeSection() {
  const challenges: ChallengeItem[] = [
    {
      icon: '📖',
      iconClass: 'icon-academic',
      title: 'Academic Pressure',
      description: 'Deadlines, group projects, and exams consume the majority of your mental bandwidth, leaving little time for extra-curricular upskilling.'
    },
    {
      icon: '🧭',
      iconClass: 'icon-uncertainty',
      title: 'Career Uncertainty',
      description: "The tech landscape is vast. Without a structured roadmap, it's difficult to know which specific technologies and concepts matter for your desired role."
    },
    {
      icon: '💼',
      iconClass: 'icon-gap',
      title: 'The Experience Gap',
      description: 'Entry-level roles require experience. Translating academic assignments into demonstrable industry evidence is a massive hurdle.'
    }
  ];

  return (
    <section className="challenge-section" id="challenges">
      <SectionHeading 
        title="Balancing University and Career Preparation Isn't Easy."
        description="The modern IT student faces a tripartite challenge: maintaining grades, deciphering ambiguous career requirements, and building a portfolio before graduation."
      />

      <div className="challenge-grid">
        {challenges.map((item, idx) => (
          <div key={idx} className="challenge-card">
            <div className={`challenge-card-icon ${item.iconClass}`}>
              {item.icon}
            </div>
            <h3 className="challenge-card-title">{item.title}</h3>
            <p className="challenge-card-text">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
