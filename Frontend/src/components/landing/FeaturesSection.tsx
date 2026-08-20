import { SectionHeading } from '../common/SectionHeading';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

export function FeaturesSection() {
  const features: Feature[] = [
    {
      icon: '🎯',
      title: 'Dynamic Skill Maps',
      description: 'See where you stand against the skills required for your selected career.'
    },
    {
      icon: '📅',
      title: 'Smart Academic Planning',
      description: 'Organize academic commitments and career preparation without losing track of either.'
    },
    {
      icon: '🗺️',
      title: 'Career Roadmaps',
      description: 'Follow structured roadmaps that guide you from your current skills toward your target IT role.'
    },
    {
      icon: '📈',
      title: 'Progress Tracking',
      description: 'Track your development across academic, technical, and career goals.'
    }
  ];

  return (
    <section className="features-section" id="features">
      <SectionHeading 
        subtitle="Core Platform"
        title="Everything You Need to Build Your Career"
        description="Designed for undergraduate IT students balancing academic workloads and career preparation."
      />

      <div className="features-grid">
        <div className="features-list">
          {features.map((feature, idx) => (
            <div key={idx} className="feature-item">
              <div className="feature-icon">{feature.icon}</div>
              <div className="feature-info">
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="feature-image-container">
          <div className="feature-image-placeholder">
            <div className="card-title">Skill Progress Map</div>
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  <span>Backend Engineering</span>
                  <span>74%</span>
                </div>
                <div style={{ height: '8px', background: '#E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '74%', height: '100%', background: '#424B54' }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  <span>System Architecture</span>
                  <span>48%</span>
                </div>
                <div style={{ height: '8px', background: '#E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '48%', height: '100%', background: '#B38D97' }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  <span>Database Design</span>
                  <span>90%</span>
                </div>
                <div style={{ height: '8px', background: '#E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '90%', height: '100%', background: '#D5ACA9' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
