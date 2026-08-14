import { useState, useEffect } from 'react';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';

export function AppRoutes() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Check if admin is logged in
  const session = localStorage.getItem('itpath_logged_in_user');
  let isAdmin = false;
  if (session) {
    try {
      const parsed = JSON.parse(session);
      if (parsed.email === 'admin@gmail.com') {
        isAdmin = true;
      }
    } catch (e) {}
  }

  // Basic Router Logic
  switch (currentPath) {
    case '/login':
      return <LoginPage onNavigate={navigate} />;
    case '/register':
      return <RegisterPage onNavigate={navigate} />;
    case '/dashboard':
      if (isAdmin) {
        window.history.replaceState({}, '', '/admin-dashboard');
        return <AdminDashboardPage onNavigate={navigate} />;
      }
      return <DashboardPage onNavigate={navigate} />;
    case '/admin-dashboard':
      if (!isAdmin) {
        window.history.replaceState({}, '', '/dashboard');
        return <DashboardPage onNavigate={navigate} />;
      }
      return <AdminDashboardPage onNavigate={navigate} />;
    case '/':
    default:
      return <LandingPage onNavigate={navigate} />;
  }
}
export default AppRoutes;
