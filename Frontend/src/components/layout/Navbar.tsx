import { useState, useEffect } from 'react';
import { Logo } from '../common/Logo';

interface NavbarProps {
  onNavigate?: (path: string) => void;
  activePath?: string;
}

export function Navbar({ onNavigate, activePath = '/' }: NavbarProps) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const session = localStorage.getItem('itpath_logged_in_user');
    if (session) {
      try {
        const parsedSession = JSON.parse(session);
        if (parsedSession.email === 'admin@gmail.com') {
          setUser({ fullName: 'Admin User', email: 'admin@gmail.com', isAdmin: true });
          return;
        }
      } catch (e) {}

      const stored = localStorage.getItem('itpath_registered_user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          setUser({ fullName: 'Student', academic: { degree: 'IT Programme' }, career: 'Software Engineering' });
        }
      } else {
        setUser({ fullName: 'Student', academic: { degree: 'IT Programme' }, career: 'Software Engineering' });
      }
    }
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(path);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('itpath_logged_in_user');
    setUser(null);
    if (onNavigate) {
      onNavigate('/');
    } else {
      window.location.reload();
    }
  };

  return (
    <header className="navbar">
      <Logo />
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
                  if (user.isAdmin) {
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

