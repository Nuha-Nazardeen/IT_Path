import { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { useAuth } from '../hooks/useAuth';

interface LoginPageProps {
  onNavigate: (path: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    try {
      const user = await login({ email: normalizedEmail, password });
      
      if (user.role === 'admin') {
        alert('Login successful as Administrator');
        onNavigate('/admin-dashboard');
      } else {
        alert(`Login successful for: ${user.fullName}`);
        onNavigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      alert(error.message || 'Failed to connect to backend server. Please verify backend is running.');
    }
  };

  return (
    <div className="app-container">
      <Navbar onNavigate={onNavigate} activePath="/login" />
      
      <main className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <h2 className="auth-title">Welcome Back</h2>
            <p className="auth-subtitle">Continue your IT career journey</p>
          </div>
          
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">University Email</label>
              <input 
                className="form-input"
                id="email"
                type="email" 
                placeholder="name@university.edu" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input 
                className="form-input"
                id="password"
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button className="auth-submit-btn" type="submit">
              Log In
            </button>
          </form>
          
          <div className="auth-footer">
            Don't have an account?{' '}
            <a 
              href="/register" 
              className="auth-link"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/register');
              }}
            >
              Sign Up
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
export default LoginPage;
