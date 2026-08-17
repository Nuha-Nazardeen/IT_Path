import { useAuth } from '../../hooks/useAuth';
import { Logo } from '../common/Logo';

interface NavbarProps {
  onNavigate?: (path: string) => void;
  activePath?: string;
}

export function Navbar({ onNavigate, activePath = '/' }: NavbarProps) {
  const { user, logout } = useAuth();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(path);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      if (onNavigate) {
        onNavigate('/');
      } else {
        window.location.reload();
      }
    } catch (e) {
      console.error('Logout failed:', e);
    }
  };

  return (
    <header className="navbar">
      <Logo onNavigate={onNavigate} />
      <nav>
        <ul className="nav-links">
          <li>
            <a 
              href="#" 
              onClick={(e) => handleNavClick(e, '/')} 
              className={`nav-link ${activePath === '/' ? 'active' : ''}`}
            >
              Home
            </a>
          </li>
          <li>
            <a 
              href="#how-it-works" 
              className="nav-link"
              onClick={() => {
                const el = document.getElementById('how-it-works');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              How It Works
            </a>
          </li>
          <li>
            <a 
              href="#features" 
              className="nav-link"
              onClick={() => {
                const el = document.getElementById('features');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Features
            </a>
          </li>
          <li>
            <a 
              href="#tripartite-challenge" 
              className="nav-link"
              onClick={() => {
                const el = document.getElementById('tripartite-challenge');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Career Paths
            </a>
          </li>
        </ul>
      </nav>
      <div className="nav-actions">
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--brand-primary)' }}>
              👋 Hi, {user.fullName.split(' ')[0]}
            </span>
            <button 
              onClick={() => {
                if (onNavigate) {
                  if (user.role === 'admin') {
                    onNavigate('/admin-dashboard');
                  } else {
                    onNavigate('/dashboard');
                  }
                }
              }}
              className="cta-btn"
            >
              Go to Dashboard
            </button>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); handleLogout(); }} 
              className="login-btn"
              style={{ fontSize: '13px' }}
            >
              Log Out
            </a>
          </div>
        ) : (
          <>
            <a 
              href="/login" 
              onClick={(e) => handleNavClick(e, '/login')} 
              className="login-btn"
            >
              Log In
            </a>
            <button 
              onClick={() => onNavigate && onNavigate('/register')} 
              className="cta-btn"
            >
              Start My Journey
            </button>
          </>
        )}
      </div>
    </header>
  );
}

