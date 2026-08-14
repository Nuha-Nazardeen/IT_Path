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
      description: 'See exactly where you stand against industry requirements in real-time.'
    },
    {
      icon: '📅',
      iconClass: 'icon-calendar',
      title: 'Smart Academic Sync',
      description: 'Sync deadlines and assignments directly to plan your study and upskilling.'
    } as any, // fallback support
    {
      icon: '🛡️',
      title: 'Portfolio Compiler',
      description: 'Automatically package school coding projects into clean GitHub-ready evidence.'
    }
  ];

  return (
    <section className="features-section" id="features">
      <SectionHeading 
        subtitle="Core Platform"
        title="Everything You Need in One Hub"
        description="Specifically engineered for undergraduate IT students balancing heavy workloads."
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
