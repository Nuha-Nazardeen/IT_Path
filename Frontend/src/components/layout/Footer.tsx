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
            <li><a href="#features" className="footer-link">Features</a></li>
            <li><a href="#pricing" className="footer-link">Pricing</a></li>
            <li><a href="#login" className="footer-link">Log In</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-title">Resources</h4>
          <ul className="footer-links">
            <li><a href="#blog" className="footer-link">Blog</a></li>
            <li><a href="#guides" className="footer-link">Career Guides</a></li>
            <li><a href="#partners" className="footer-link">University Partners</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-title">Legal</h4>
          <ul className="footer-links">
            <li><a href="#privacy" className="footer-link">Privacy Policy</a></li>
            <li><a href="#terms" className="footer-link">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copyright">
          © 2024 Techora Academic & Career Development
        </p>
      </div>
    </footer>
  );
}
