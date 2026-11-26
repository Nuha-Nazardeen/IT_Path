import { useEffect, useState } from 'react';
import { studentApi, getErrorMessage } from '../services/studentApi';
import { Logo } from '../components/common/Logo';
import { useAuth } from '../hooks/useAuth';

interface DashboardPageProps {
  onNavigate: (path: string) => void;
}

type DashboardTab = 'dashboard' | 'academic' | 'roadmap' | 'balance' | 'portfolio' | 'resources';

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const { user: authUser, logout } = useAuth();
  interface DashboardResponse {
    user?: { fullName?: string; academic?: { degree?: string; academicYear?: string; university?: string }; career?: string };
    summary?: { completedModules?: number; modules?: number; completedSkills?: number; skills?: number; completedProjects?: number; projects?: number };
  }
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [dashboardError, setDashboardError] = useState('');

  useEffect(() => {
    let isMounted = true;
    studentApi.dashboard()
      .then((data: DashboardResponse) => {
        if (isMounted) setDashboardData(data);
      })
      .catch((error: unknown) => {
        if (isMounted) setDashboardError(getErrorMessage(error, 'Unable to load dashboard data'));
      });
    return () => { isMounted = false; };
  }, []);

  const profile = dashboardData?.user;
  const summary = dashboardData?.summary;
  const user = {
    name: profile?.fullName || authUser?.fullName || 'Student',
    degree: profile?.academic?.degree || 'BSc Information Technology',
    year: profile?.academic?.academicYear || 'Current academic year',
    university: profile?.academic?.university || 'University',
    careerGoal: profile?.career || 'Software Engineer',
    careerReadiness: summary?.skills ? Math.round(((summary.completedSkills || 0) / summary.skills) * 100) : 0,
    academicExcellence: summary?.modules ? Math.round(((summary.completedModules || 0) / summary.modules) * 100) : 0,
    portfolioStrength: summary?.projects ? Math.round(((summary.completedProjects || 0) / summary.projects) * 100) : 0
  };

  const handleLogout = async () => {
    await logout();
    onNavigate('/');
  };

  // Reusable SVG Icons
  const Icons = {
    Dashboard: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" />
        <rect x="14" y="3" width="7" height="5" />
        <rect x="14" y="12" width="7" height="9" />
        <rect x="3" y="16" width="7" height="5" />
      </svg>
    ),
    Academic: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
      </svg>
    ),
    Roadmap: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3z" />
        <path d="M9 10a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3 3 3 0 0 1 3 3v3a3 3 0 0 1-3 3z" />
        <path d="M9 14a3 3 0 0 0-3 3v3a3 3 0 0 0 3 3 3 3 0 0 0 3-3v-3a3 3 0 0 0-3-3z" />
        <path d="M14 6H9M14 18H9" />
      </svg>
    ),
    Balance: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    Portfolio: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    Resources: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
    Settings: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    Logout: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
      </svg>
    ),
    Target: () => (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
    Bell: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    Search: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    Reload: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
      </svg>
    )
  };

  // Main Dashboard Tab View
  const renderDashboardView = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Welcome Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Good morning, {user.name} <span style={{ animation: 'wave 2s infinite' }}>👋</span>
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            {user.degree} • {user.year} • {user.university}
          </p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#F5ECE1',
          padding: '10px 16px',
          borderRadius: '24px',
          border: '1px solid var(--border-cream)',
          fontSize: '13px',
          fontWeight: 700,
          color: 'var(--brand-primary)'
        }}>
          <Icons.Target /> Target Career: {user.careerGoal}
        </div>
      </div>

      {/* Grid Row 1: Journey Overview & Workload Balance */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '24px', flexWrap: 'wrap' }}>
        {/* Journey Overview Card */}
        <div style={{
          backgroundColor: '#FCFAF7',
          border: '1px solid var(--border-cream)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              📈 Journey Overview
            </h3>
            <button
              onClick={() => setActiveTab('balance')}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
            >
              View Detailed Report
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                <span>Academic Excellence</span>
                <span>{user.academicExcellence}%</span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'rgba(66, 75, 84, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${user.academicExcellence}%`, height: '100%', backgroundColor: 'var(--brand-primary)', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                <span>Career Readiness</span>
                <span>{user.careerReadiness}%</span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'rgba(179, 141, 151, 0.2)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${user.careerReadiness}%`, height: '100%', backgroundColor: 'var(--accent-pink)', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                <span>Portfolio Strength</span>
                <span>{user.portfolioStrength}%</span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'rgba(66, 75, 84, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${user.portfolioStrength}%`, height: '100%', backgroundColor: 'var(--brand-primary)', borderRadius: '4px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Workload Balance Card */}
        <div style={{
          backgroundColor: '#FCFAF7',
          border: '1px solid var(--border-cream)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icons.Reload /> Workload Balance
            </h3>
            <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#E2ECE9', color: '#2E6F5E', padding: '4px 8px', borderRadius: '12px' }}>
              ✓ Balanced
            </span>
          </div>

          {/* Segmented Bar */}
          <div style={{ display: 'flex', height: '12px', borderRadius: '6px', overflow: 'hidden', marginBottom: '24px' }}>
            <div style={{ width: '63.6%', backgroundColor: 'var(--brand-primary)' }} title="Academic: 14h" />
            <div style={{ width: '27.3%', backgroundColor: 'var(--accent-pink)' }} title="Career: 6h" />
            <div style={{ width: '9.1%', backgroundColor: '#4E3A3F' }} title="Portfolio: 2h" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--brand-primary)' }} /> Academic
              </span>
              <span style={{ fontWeight: 700 }}>14h</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-pink)' }} /> Career
              </span>
              <span style={{ fontWeight: 700 }}>6h</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4E3A3F' }} /> Portfolio
              </span>
              <span style={{ fontWeight: 700 }}>2h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Row 2: Today's Focus & Software Engineer Roadmap */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 4fr) minmax(0, 3fr)', gap: '24px', flexWrap: 'wrap' }}>
        {/* Today's Focus Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-cream)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                🎯 Today's Focus
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>3 Tasks remaining</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {/* Task 1 */}
              <div style={{
                border: '1px solid var(--border-cream)',
                borderRadius: '12px',
                padding: '16px',
                backgroundColor: '#FCFAF7',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, backgroundColor: '#FFF0F0', color: '#D93838', padding: '3px 8px', borderRadius: '4px' }}>High Priority</span>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-secondary)' }}>Academic</span>
                </div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '4px' }}>Database CA 02</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Due tomorrow • Est. 2h</p>
              </div>

              {/* Task 2 */}
              <div style={{
                border: '1px solid var(--border-cream)',
                borderRadius: '12px',
                padding: '16px',
                backgroundColor: '#FCFAF7'
              }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-secondary)' }}>Academic</span>
                </div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '4px' }}>Research Literature Review</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Due in 4 days • Est. 1h</p>
              </div>

              {/* Task 3 */}
              <div style={{
                border: '1px solid var(--border-cream)',
                borderRadius: '12px',
                padding: '16px',
                backgroundColor: '#FCFAF7'
              }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, backgroundColor: 'rgba(179, 141, 151, 0.15)', color: 'var(--accent-pink)', padding: '3px 8px', borderRadius: '4px' }}>Career</span>
                </div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '4px' }}>React Hooks Practice</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Self-paced • Est. 45m</p>
              </div>
            </div>
          </div>

          <button style={{
            width: '100%',
            backgroundColor: 'var(--brand-primary)',
            color: 'white',
            border: 'none',
            padding: '14px',
            borderRadius: '8px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            ▶ Start Focus Session
          </button>
        </div>

        {/* Software Engineer Roadmap Card */}
        <div style={{
          backgroundColor: '#FCFAF7',
          border: '1px solid var(--border-cream)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🔀 Software Engineer Roadmap
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', paddingLeft: '24px' }}>
            {/* Timeline Line */}
            <div style={{ position: 'absolute', left: '7px', top: '8px', bottom: '8px', width: '2px', backgroundColor: 'var(--border-cream)' }} />

            {/* Step 1 */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-22px', top: '3px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--brand-primary)', border: '2px solid white' }} />
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)', textDecoration: 'line-through', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ✓ Programming Fundamentals
              </span>
            </div>

            {/* Step 2 */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-22px', top: '3px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--brand-primary)', border: '2px solid white' }} />
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)', textDecoration: 'line-through', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ✓ Object Oriented Programming
              </span>
            </div>

            {/* Step 3 */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-22px', top: '3px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--brand-primary)', border: '2px solid white' }} />
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)', textDecoration: 'line-through', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ✓ Git & Version Control
              </span>
            </div>

            {/* Step 4: Active */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-22px', top: '5px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--accent-pink)', border: '2px solid white' }} />
              <div style={{
                backgroundColor: 'white',
                border: '1px solid var(--border-cream)',
                borderRadius: '12px',
                padding: '12px 16px',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <h5 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '4px' }}>SQL & Relational Databases</h5>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>In Progress • 60% complete</p>
                <div style={{ height: '6px', backgroundColor: 'rgba(66, 75, 84, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '60%', height: '100%', backgroundColor: 'var(--accent-pink)' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Recent Career Evidence */}
      <div style={{
        backgroundColor: 'white',
        border: '1px solid var(--border-cream)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)',
        alignItems: 'stretch'
      }}>
        {/* Left Graphics/Image area */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          minHeight: '220px'
        }}>
          {/* Custom Stylized Laptop SVG */}
          <div style={{ width: '100%', maxWidth: '280px', position: 'relative' }}>
            <svg viewBox="0 0 300 180" width="100%" height="auto" style={{ filter: 'drop-shadow(0px 8px 16px rgba(0,0,0,0.06))' }}>
              {/* Laptop Screen */}
              <rect x="30" y="10" width="240" height="145" rx="8" fill="#2d3748" stroke="#cbd5e0" strokeWidth="3" />
              {/* Screen Inner */}
              <rect x="36" y="16" width="228" height="120" rx="4" fill="#1a202c" />
              {/* Laptop Keyboard Base */}
              <path d="M10,155 L290,155 L280,168 L20,168 Z" fill="#cbd5e0" />
              <rect x="120" y="157" width="60" height="8" rx="2" fill="#718096" />
              {/* Dynamic UI Graph Inside Laptop */}
              <rect x="46" y="26" width="60" height="40" rx="3" fill="#FAF6F0" opacity="0.15" />
              <rect x="114" y="26" width="138" height="40" rx="3" fill="#FAF6F0" opacity="0.15" />
              <line x1="56" y1="84" x2="244" y2="84" stroke="var(--accent-cream)" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
              <line x1="56" y1="96" x2="190" y2="96" stroke="var(--accent-pink)" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
              <line x1="56" y1="108" x2="140" y2="108" stroke="var(--accent-beige)" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
              {/* Circle Graph */}
              <circle cx="218" cy="102" r="14" stroke="#4a5568" strokeWidth="4" fill="none" />
              <circle cx="218" cy="102" r="14" stroke="var(--accent-cream)" strokeWidth="4" strokeDasharray="60 100" fill="none" />
            </svg>
          </div>
        </div>

        {/* Right Info */}
        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>
            ⚙ PROJECT PORTFOLIO
          </span>
          <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '12px' }}>
            Smart Agriculture System
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
            A comprehensive full-stack solution designed to monitor crop health and automate irrigation based on real-time sensor data, demonstrating proficiency in modern web architecture.
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['React', 'Node.js', 'MongoDB'].map(tag => (
                <span key={tag} style={{ fontSize: '11px', fontWeight: 600, backgroundColor: 'var(--bg-secondary)', color: 'var(--brand-primary)', padding: '5px 12px', borderRadius: '12px', border: '1px solid var(--border-cream)' }}>
                  {tag}
                </span>
              ))}
            </div>
            <button
              onClick={() => setActiveTab('portfolio')}
              style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              View Details →
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Academic Tab View
  const renderAcademicView = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '8px' }}>
          Academic Hub
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          {user.university} • {user.degree} • {user.year}
        </p>
      </div>

      {/* Overview stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '20px' }}>
        {[
          { label: 'SUBJECTS', count: 6, emoji: '📖' },
          { label: 'ASSESSMENTS', count: 4, emoji: '📝' },
          { label: 'PROJECTS', count: 2, emoji: '💻' },
          { label: 'EXAMS', count: 3, emoji: '❓' }
        ].map(stat => (
          <div key={stat.label} style={{
            backgroundColor: '#FCFAF7',
            border: '1px solid var(--border-cream)',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <span style={{ fontSize: '24px', display: 'block', marginBottom: '12px' }}>{stat.emoji}</span>
            <span style={{ fontSize: '32px', fontWeight: 800, display: 'block', color: 'var(--brand-primary)', marginBottom: '4px' }}>{stat.count}</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Enrolled Subjects */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Enrolled Subjects</h3>
          <button style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', fontWeight: 700, fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}>
            View Curriculum
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {[
            {
              title: 'Database Management Systems',
              desc: 'Core curriculum emphasizing relational models and optimization.',
              assessment: 'CA 02 on 25 Aug',
              tags: ['SQL', 'Databases']
            },
            {
              title: 'Advanced Programming',
              desc: 'Deep dive into enterprise application architecture and patterns.',
              assessment: 'Lab 04 on 28 Aug',
              tags: ['Java', 'OOP']
            },
            {
              title: 'Intelligent Systems',
              desc: 'Introduction to machine learning algorithms and AI concepts.',
              assessment: 'Midterm on 10 Sep',
              tags: ['Python', 'AI']
            }
          ].map(sub => (
            <div key={sub.title} style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-cream)',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '220px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ height: '4px', backgroundColor: 'var(--brand-primary)', position: 'absolute', top: 0, left: 0, right: 0 }} />
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '8px' }}>{sub.title}</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>{sub.desc}</p>
              </div>

              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#FCFAF7',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: 'var(--brand-primary)',
                  marginBottom: '16px',
                  border: '1px solid var(--border-cream)'
                }}>
                  📅 <span style={{ fontWeight: 600 }}>Next Assessment:</span> {sub.assessment}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {sub.tags.map(t => (
                    <span key={t} style={{ fontSize: '10px', fontWeight: 600, backgroundColor: 'var(--bg-secondary)', color: 'var(--brand-primary)', padding: '4px 10px', borderRadius: '10px', border: '1px solid var(--border-cream)' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Assessments & Active Projects */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '24px', flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>Upcoming Assessments</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-cream)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '24px', backgroundColor: '#FFF0F3', padding: '8px', borderRadius: '8px' }}>📋</span>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700 }}>Database CA 02</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Database Management Systems</p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px', fontSize: '11px' }}>
                    <span style={{ color: '#E28A3B', fontWeight: 600 }}>● In Progress</span>
                    <span style={{ color: 'var(--text-muted)' }}>🕒 Est: 3h</span>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Due</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--brand-primary)' }}>25 Aug</span>
              </div>
            </div>

            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-cream)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '24px', backgroundColor: '#F0F3FF', padding: '8px', borderRadius: '8px' }}>📄</span>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700 }}>Research Literature Review</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Professional Practice</p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px', fontSize: '11px' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>● Not Started</span>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Due</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--brand-primary)' }}>30 Aug</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Projects */}
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>Active Projects</h3>
          <div style={{
            backgroundColor: '#FCFAF7',
            border: '1px solid var(--border-cream)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '260px'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-primary)' }}>Smart Agriculture System</h4>
                <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#E2ECE9', color: '#2E6F5E', padding: '3px 8px', borderRadius: '8px' }}>68%</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                IoT based monitoring platform for sustainable farming.
              </p>

              <div style={{ height: '8px', backgroundColor: 'rgba(66, 75, 84, 0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '20px' }}>
                <div style={{ width: '68%', height: '100%', backgroundColor: 'var(--brand-primary)' }} />
              </div>

              <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
                {['Next.js', 'Node.js', 'MongoDB'].map(t => (
                  <span key={t} style={{ fontSize: '10px', fontWeight: 600, backgroundColor: '#FFFFFF', color: 'var(--brand-primary)', padding: '4px 10px', borderRadius: '10px', border: '1px solid var(--border-cream)' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveTab('portfolio')}
              style={{
                width: '100%',
                backgroundColor: 'var(--brand-primary)',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              🔗 Connect to Career Evidence
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Career Roadmap View
  const renderRoadmapView = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '8px' }}>
            Your Career Roadmap
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Path: {user.careerGoal}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>CAREER READINESS</span>
            <div style={{ position: 'relative', width: '50px', height: '50px' }}>
              <svg width="50" height="50" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#EFEAE2"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--brand-primary)"
                  strokeWidth="3"
                  strokeDasharray={`${user.careerReadiness}, 100`}
                />
              </svg>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800 }}>
                {user.careerReadiness}%
              </div>
            </div>
          </div>
          <button style={{
            backgroundColor: 'white',
            border: '1px solid var(--brand-primary)',
            color: 'var(--brand-primary)',
            padding: '10px 16px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer'
          }}>
            Change Career Goal
          </button>
        </div>
      </div>

      {/* Roadmap Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', position: 'relative', paddingLeft: '32px', marginTop: '20px' }}>
        <div style={{ position: 'absolute', left: '11px', top: '12px', bottom: '12px', width: '2px', backgroundColor: 'var(--border-cream)' }} />

        {/* Phase 1 */}
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '-27px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--brand-primary)', border: '4px solid white' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>1. Foundation</h3>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {['Programming (Java/Python)', 'Object-Oriented Prog.', 'Git & GitHub'].map(skill => (
              <div key={skill} style={{
                backgroundColor: '#FCFAF7',
                border: '1px solid var(--border-cream)',
                borderRadius: '12px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--brand-primary)'
              }}>
                <span style={{ color: '#2E6F5E' }}>✓</span> {skill}
              </div>
            ))}
          </div>
        </div>

        {/* Phase 2 */}
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '-27px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--brand-primary)', border: '4px solid white' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>2. Core Skills</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)', gap: '20px', flexWrap: 'wrap' }}>
            {/* Highlighted SQL block */}
            <div style={{
              backgroundColor: '#FCFAF7',
              border: '1px solid var(--border-cream)',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '20px', fontWeight: 800 }}>SQL</h4>
                <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: 'rgba(66, 75, 84, 0.1)', color: 'var(--brand-primary)', padding: '3px 8px', borderRadius: '6px' }}>70% Progress</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Intermediate Level • Database Architecture
              </p>

              {/* Actions Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                {['LEARN', 'PRACTICE', 'BUILD', 'PROVE'].map(action => (
                  <button key={action} style={{
                    backgroundColor: action === 'BUILD' ? 'var(--brand-primary)' : 'white',
                    color: action === 'BUILD' ? 'white' : 'var(--brand-primary)',
                    border: '1px solid var(--border-cream)',
                    borderRadius: '8px',
                    padding: '12px 6px',
                    fontWeight: 700,
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span>{action === 'LEARN' ? '✔' : action === 'PRACTICE' ? '✔' : action === 'BUILD' ? '🔧' : '⚙'}</span>
                    {action}
                  </button>
                ))}
              </div>
            </div>

            {/* Other core skills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                backgroundColor: 'white',
                border: '1px solid var(--border-cream)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700 }}>Data Structures</h4>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>In Progress</p>
                </div>
                <div style={{ width: '40px', height: '4px', backgroundColor: 'rgba(66, 75, 84, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: '40%', height: '100%', backgroundColor: 'var(--brand-primary)' }} />
                </div>
              </div>

              <div style={{
                backgroundColor: 'white',
                border: '1px solid var(--border-cream)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700 }}>JavaScript</h4>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Not started</p>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>○</span>
              </div>
            </div>
          </div>
        </div>

        {/* Phase 3 */}
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '-27px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#E5E7EB', border: '4px solid white' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '16px' }}>3. Development</h3>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', opacity: 0.6 }}>
            {['React Ecosystem', 'REST APIs', 'Backend Architecture'].map(skill => (
              <div key={skill} style={{
                backgroundColor: 'white',
                border: '1px dashed var(--border-light)',
                borderRadius: '12px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: 'var(--text-muted)'
              }}>
                🔒 {skill}
              </div>
            ))}
          </div>
        </div>

        {/* Phase 4 */}
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '-27px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#E5E7EB', border: '4px solid white' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '16px' }}>4. Professional Edge</h3>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', opacity: 0.6 }}>
            {['CV & Portfolio', 'LinkedIn Optimization', 'Interview Prep'].map(skill => (
              <div key={skill} style={{
                backgroundColor: 'white',
                border: '1px dashed var(--border-light)',
                borderRadius: '12px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: 'var(--text-muted)'
              }}>
                {skill}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Balance & Insights View
  const renderBalanceView = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '8px' }}>
          Your Balance
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          Time allocation and progress overview for the week.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)', gap: '24px', flexWrap: 'wrap' }}>
        {/* Time Allocation Chart */}
        <div style={{
          backgroundColor: '#FCFAF7',
          border: '1px solid var(--border-cream)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ⏱ Time Allocation (24h)
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
            How your daily hours are distributed across key areas.
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '180px', borderBottom: '1px solid var(--border-cream)', paddingBottom: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '80px' }}>
              <div style={{ width: '100%', height: '140px', backgroundColor: 'rgba(179, 141, 151, 0.4)', borderRadius: '4px', position: 'relative' }}>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '110px', backgroundColor: '#B38D97', borderRadius: '4px' }} />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600 }}>Academic</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '80px' }}>
              <div style={{ width: '100%', height: '140px', backgroundColor: 'rgba(66, 75, 84, 0.2)', borderRadius: '4px', position: 'relative' }}>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50px', backgroundColor: 'var(--brand-primary)', borderRadius: '4px' }} />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600 }}>Career</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '80px' }}>
              <div style={{ width: '100%', height: '140px', backgroundColor: 'rgba(179, 141, 151, 0.4)', borderRadius: '4px', position: 'relative' }}>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '20px', backgroundColor: '#B38D97', borderRadius: '4px' }} />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600 }}>Portfolio</span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        {/* Insight / Next Action column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Insight Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-cream)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              💡 INSIGHT
            </h4>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Your academic workload is high this week. Focus on your upcoming assessments and keep career learning light.
            </p>
          </div>

          {/* Next Action Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-cream)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              🚩 NEXT ACTION
            </h4>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Add your latest university project to your portfolio.
            </p>
            <button
              onClick={() => setActiveTab('portfolio')}
              style={{
                width: '100%',
                backgroundColor: 'var(--brand-primary)',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              Update Portfolio
            </button>
          </div>
        </div>
      </div>

      {/* Progress Comparison Card */}
      <div style={{
        backgroundColor: '#FCFAF7',
        border: '1px solid var(--border-cream)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          📈 Progress Comparison
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              <span>Academic Progress</span>
              <span>72%</span>
            </div>
            <div style={{ height: '8px', backgroundColor: 'rgba(66, 75, 84, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '72%', height: '100%', backgroundColor: 'var(--brand-primary)' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              <span>Career Readiness</span>
              <span>54%</span>
            </div>
            <div style={{ height: '8px', backgroundColor: 'rgba(66, 75, 84, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '54%', height: '100%', backgroundColor: 'var(--brand-primary)' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              <span>Portfolio Strength</span>
              <span>35%</span>
            </div>
            <div style={{ height: '8px', backgroundColor: 'rgba(66, 75, 84, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '35%', height: '100%', backgroundColor: 'var(--brand-primary)' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Portfolio View
  const renderPortfolioView = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '8px' }}>
          Your Career Evidence
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          Curate and showcase your technical projects, certifications, and professional presence to build a compelling narrative.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)', gap: '24px', flexWrap: 'wrap' }}>
        {/* Left Side: Projects & Certifications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Projects */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Projects</h3>
              <button style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                + Add Project
              </button>
            </div>

            <div style={{
              backgroundColor: '#FCFAF7',
              border: '1px solid var(--border-cream)',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-primary)' }}>Smart Agriculture System</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>👥 Full Stack Developer</p>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['Next.js', 'Node.js'].map(t => (
                    <span key={t} style={{ fontSize: '10px', fontWeight: 600, backgroundColor: 'rgba(179, 141, 151, 0.15)', color: 'var(--accent-pink)', padding: '4px 10px', borderRadius: '10px' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <blockquote style={{
                borderLeft: '3px solid var(--brand-primary)',
                paddingLeft: '16px',
                fontSize: '14px',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                margin: '16px 0 24px 0'
              }}>
                Demonstrated end-to-end development capabilities by architecting a scalable backend API and an intuitive frontend dashboard for real-time sensor data visualization.
              </blockquote>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{
                  backgroundColor: 'white',
                  border: '1px solid var(--border-cream)',
                  color: 'var(--brand-primary)',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}>
                  &lt;&gt; GitHub Repository
                </button>
                <button style={{
                  backgroundColor: 'var(--brand-primary)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}>
                  🗎 Live Demo
                </button>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Certifications</h3>
              <button style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                + Add Certification
              </button>
            </div>

            <div style={{
              backgroundColor: '#FCFAF7',
              border: '1px solid var(--border-cream)',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <span style={{ fontSize: '32px', backgroundColor: 'white', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-cream)' }}>🎖</span>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 800 }}>ISTQB Foundation Level</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>🏢 ISTQB • 📅 July 2023</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Profile Completion & Professional Profiles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Profile Completion */}
          <div style={{
            backgroundColor: '#FCFAF7',
            border: '1px solid var(--border-cream)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h4 style={{ fontSize: '16px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              🔄 Profile Completion
            </h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>
              <span>Setup progress</span>
              <span>85%</span>
            </div>
            <div style={{ height: '8px', backgroundColor: 'rgba(66, 75, 84, 0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
              <div style={{ width: '85%', height: '100%', backgroundColor: 'var(--brand-primary)' }} />
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Add your CV to reach 100% and increase your visibility to technical recruiters.
            </p>
          </div>

          {/* Professional Profiles */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-cream)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '20px' }}>Professional Profiles</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: 600 }}>
                  <span style={{ fontSize: '18px' }}>&lt;&gt;</span> GitHub
                </span>
                <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#E2ECE9', color: '#2E6F5E', padding: '4px 8px', borderRadius: '12px' }}>✓ Added</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: 600 }}>
                  <span style={{ fontSize: '18px' }}>💼</span> LinkedIn
                </span>
                <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#E2ECE9', color: '#2E6F5E', padding: '4px 8px', borderRadius: '12px' }}>✓ Added</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: 600 }}>
                  <span style={{ fontSize: '18px' }}>📄</span> Curriculum Vitae
                </span>
                <button style={{
                  backgroundColor: 'white',
                  border: '1px dashed #D93838',
                  color: '#D93838',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}>
                  ⚠ Add CV
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FAF6F0' }}>

      {/* Sidebar - Matches RegisterPage style & user details */}
      <aside style={{
        width: '280px',
        backgroundColor: '#FAF6F0',
        borderRight: '1px solid var(--border-cream)',
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        height: '100vh'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {/* Logo */}
          <Logo className="sidebar-logo" />

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {([
              { id: 'dashboard', label: 'Dashboard', icon: <Icons.Dashboard /> },
              { id: 'academic', label: 'Academic', icon: <Icons.Academic /> },
              { id: 'roadmap', label: 'Career Roadmap', icon: <Icons.Roadmap /> },
              { id: 'balance', label: 'Balance & Insights', icon: <Icons.Balance /> },
              { id: 'portfolio', label: 'Portfolio', icon: <Icons.Portfolio /> },
              { id: 'resources', label: 'Resources', icon: <Icons.Resources /> }
            ] as const).map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: isActive ? 'rgba(179, 141, 151, 0.12)' : 'transparent',
                    color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '14px',
                    cursor: 'pointer',
                    position: 'relative',
                    textAlign: 'left',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {/* Pin indicator for active item */}
                  {isActive && (
                    <span style={{
                      position: 'absolute',
                      left: 0,
                      top: '25%',
                      bottom: '25%',
                      width: '4px',
                      backgroundColor: 'var(--accent-pink)',
                      borderRadius: '0 4px 4px 0'
                    }} />
                  )}
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions - Account Details Popover */}
        <div style={{ position: 'relative', width: '100%' }}>
          {showAccountMenu && (
            <div style={{
              position: 'absolute',
              bottom: 'calc(100% + 8px)',
              left: 0,
              right: 0,
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid var(--border-cream)',
              boxShadow: 'var(--shadow-premium)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              zIndex: 100
            }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#8B5CF6',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '14px'
                  }}>
                    NN
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--brand-primary)' }}>Nuha Nazardeen</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Go</span>
                  </div>
                </div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '16px', fontWeight: 700 }}>&gt;</span>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border-cream)', margin: '4px 0' }} />

              {/* Menu Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '10px 12px',
                  border: 'none',
                  background: 'none',
                  color: 'var(--brand-primary)',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  textAlign: 'left'
                }}>
                  <span style={{ fontSize: '16px' }}>✦</span> Upgrade plan
                </button>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '10px 12px',
                  border: 'none',
                  background: 'none',
                  color: 'var(--brand-primary)',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  textAlign: 'left'
                }}>
                  <span style={{ fontSize: '16px' }}>🕒</span> Personalization
                </button>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '10px 12px',
                  border: 'none',
                  background: 'none',
                  color: 'var(--brand-primary)',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  textAlign: 'left'
                }}>
                  <span style={{ fontSize: '16px' }}>👤</span> Profile
                </button>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '10px 12px',
                  border: 'none',
                  background: 'none',
                  color: 'var(--brand-primary)',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  textAlign: 'left'
                }}>
                  <Icons.Settings /> Settings
                </button>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border-cream)', margin: '4px 0' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '10px 12px',
                  border: 'none',
                  background: 'none',
                  color: 'var(--brand-primary)',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  textAlign: 'left'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '16px' }}>⚽</span> Help
                  </span>
                  <span style={{ fontWeight: 700 }}>&gt;</span>
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '10px 12px',
                    border: 'none',
                    background: 'none',
                    color: '#D93838',
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    textAlign: 'left'
                  }}
                >
                  <Icons.Logout /> Log out
                </button>
              </div>
            </div>
          )}

          {/* Trigger Pill */}
          <button
            onClick={() => setShowAccountMenu(!showAccountMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '12px 16px',
              border: 'none',
              borderRadius: '12px',
              backgroundColor: '#EFEAE2',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#8B5CF6',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '12px'
              }}>
                NN
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand-primary)' }}>Nuha Nazardeen</span>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Go</span>
              </div>
            </div>

            {/* Storefront/Marketplace Icon on the right */}
            <span style={{ color: 'var(--text-secondary)', fontSize: '16px', display: 'flex', alignItems: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>

        {/* Top Header */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 48px',
          borderBottom: '1px solid var(--border-cream)',
          position: 'sticky',
          top: 0,
          backgroundColor: '#FFFFFF',
          zIndex: 10
        }}>
          {/* Search bar */}
          <div style={{ position: 'relative', width: '320px' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <Icons.Search />
            </span>
            <input
              type="text"
              placeholder="Search resources, tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px 10px 40px',
                borderRadius: '20px',
                border: '1px solid var(--border-cream)',
                backgroundColor: 'var(--bg-secondary)',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>

          {/* Right Header items */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', position: 'relative' }}>
              <Icons.Bell />
              <span style={{ position: 'absolute', top: '2px', right: '2px', width: '6px', height: '6px', backgroundColor: '#D93838', borderRadius: '50%' }} />
            </button>
            <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <Icons.Settings />
            </button>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-cream)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '14px',
              color: 'var(--brand-primary)',
              border: '1px solid var(--border-cream)'
            }}>
              N
            </div>
          </div>
        </header>

        {/* Content Body */}
        <section style={{ padding: '40px 48px', flex: 1, overflowY: 'auto' }}>
          {dashboardError && (
            <div style={{
              marginBottom: '20px',
              padding: '12px 16px',
              borderRadius: '10px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#991B1B',
              fontSize: '13px',
              fontWeight: 600
            }}>
              {dashboardError}
            </div>
          )}
          {activeTab === 'dashboard' && renderDashboardView()}
          {activeTab === 'academic' && renderAcademicView()}
          {activeTab === 'roadmap' && renderRoadmapView()}
          {activeTab === 'balance' && renderBalanceView()}
          {activeTab === 'portfolio' && renderPortfolioView()}
          {activeTab === 'resources' && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <h3>Resources Section</h3>
              <p>Under Development</p>
            </div>
          )}
        </section>

      </main>

    </div>
  );
}

export default DashboardPage;
