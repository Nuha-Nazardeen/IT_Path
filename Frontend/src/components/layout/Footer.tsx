import { Logo } from '../common/Logo';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-info">
          <Logo />
          <p className="footer-tagline">
            Built for the journey from university to industry.
          </p>
        </div>

        <div className="footer-column">
          <h4 className="footer-title">Platform</h4>
          <ul className="footer-links">
            <li><a href="#how-it-works" className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); }}>How It Works</a></li>
            <li><a href="#career-paths" className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('career-paths')?.scrollIntoView({ behavior: 'smooth' }); }}>Career Paths</a></li>
            <li><a href="#features" className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }}>Features</a></li>
            <li><a href="/register" className="footer-link">Start My Journey</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-title">Resources</h4>
          <ul className="footer-links">
            <li><a href="#" className="footer-link" onClick={(e) => e.preventDefault()}>Career Roadmaps</a></li>
            <li><a href="#" className="footer-link" onClick={(e) => e.preventDefault()}>IT Career Guides</a></li>
            <li><a href="#" className="footer-link" onClick={(e) => e.preventDefault()}>Student Resources</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-title">Account</h4>
          <ul className="footer-links">
            <li><a href="/login" className="footer-link">Log In</a></li>
            <li><a href="/register" className="footer-link">Create Account</a></li>
          </ul>
        </div>


      </div>

      <div className="footer-bottom">
        <p className="copyright">
          © 2026 Techora. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
