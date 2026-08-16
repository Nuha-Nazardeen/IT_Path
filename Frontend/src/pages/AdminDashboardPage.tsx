import { useState } from 'react';

interface AdminDashboardPageProps {
  onNavigate: (path: string) => void;
}

// Reusable SVG Icons for Admin Dashboard
const AdminIcons = {
  Overview: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" />
      <rect x="14" y="3" width="7" height="5" />
      <rect x="14" y="12" width="7" height="9" />
      <rect x="3" y="16" width="7" height="5" />
    </svg>
  ),
  Users: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Academic: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  ),
  Paths: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  Skills: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
    </svg>
  ),
  Resources: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  Projects: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  Reports: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
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
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Bell: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
};

import { useAuth } from '../hooks/useAuth';

export function AdminDashboardPage({ onNavigate }: AdminDashboardPageProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'academic' | 'paths' | 'skills' | 'resources' | 'projects' | 'reports' | 'settings'>('overview');
  const { logout } = useAuth();
  
  // Search & filter states
  const [studentSearch, setStudentSearch] = useState('');
  const [uniFilter, setUniFilter] = useState('');
  const [degreeFilter, setDegreeFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Selected entities for detail panels / modals
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [confirmDeactivateTarget, setConfirmDeactivateTarget] = useState<any>(null);
  const [selectedCareerPath, setSelectedCareerPath] = useState<any>(null);
  const [academicSubTab, setAcademicSubTab] = useState<'universities' | 'faculties' | 'degrees'>('universities');

  const handleLogout = async () => {
    await logout();
    onNavigate('/');
  };

  // Mock Students Data
  const [students, setStudents] = useState([
    {
      id: 'S001',
      name: 'Nuha Nazardeen',
      email: 'nuha.n@example.com',
      university: 'Uva Wellassa University',
      degree: 'CST',
      year: '3rd Year',
      careerGoal: 'Software Engineer',
      completion: 82,
      status: 'Active',
      skills: ['Python', 'SQL', 'OOP', 'Git'],
      projects: ['Smart Agriculture System']
    },
    {
      id: 'S002',
      name: 'Kasun Silva',
      email: 'kasun.s@example.com',
      university: 'UCSC',
      degree: 'CS',
      year: '4th Year',
      careerGoal: 'Data Scientist',
      completion: 95,
      status: 'Active',
      skills: ['Python', 'R', 'SQL', 'Pandas'],
      projects: ['Student Performance Analytics']
    },
    {
      id: 'S003',
      name: 'Amila Perera',
      email: 'amila.p@example.com',
      university: 'University of Moratuwa',
      degree: 'IT',
      year: '2nd Year',
      careerGoal: 'Cloud Architect',
      completion: 45,
      status: 'Inactive',
      skills: ['Java', 'Linux', 'AWS Basics'],
      projects: []
    }
  ]);

  // Mock Universities Data
  const universities = [
    { name: 'Uva Wellassa University', location: 'Badulla', status: 'Active', studentCount: 248 },
    { name: 'University of Colombo', location: 'Colombo', status: 'Active', studentCount: 1204 },
    { name: 'Sri Lanka Institute of Information Technology', location: 'Malabe', status: 'Inactive', studentCount: 850 }
  ];

  // Mock Career Paths Data
  const careerPaths = [
    { name: 'Software Engineer', students: 428, skills: 18, status: 'Active' },
    { name: 'QA Engineer', students: 244, skills: 12, status: 'Active' },
    { name: 'Data Analyst', students: 160, skills: 14, status: 'Active' },
    { name: 'Cybersecurity', students: 102, skills: 15, status: 'Active' },
    { name: 'DevOps', students: 82, skills: 16, status: 'Active' },
    { name: 'Business Analyst', students: 60, skills: 10, status: 'Active' }
  ];

  // Mock Skills Data
  const skills = [
    { name: 'SQL', category: 'Database', paths: 'Software Engineer, Data Analyst', difficulty: 'Intermediate', status: 'Active' },
    { name: 'Python', category: 'Programming', paths: 'Software Engineer, Data Scientist', difficulty: 'Beginner', status: 'Active' },
    { name: 'React', category: 'Frontend', paths: 'Software Engineer', difficulty: 'Intermediate', status: 'Active' },
    { name: 'Docker', category: 'DevOps', paths: 'DevOps Engineer', difficulty: 'Advanced', status: 'Active' }
  ];

  // Mock Project Templates
  const projectTemplates = [
    { title: 'Full Stack Student Management System', career: 'Software Engineer', skills: 'React, Node.js, SQL, REST API', difficulty: 'Intermediate', status: 'Active' },
    { title: 'API Automated Testing Suite', career: 'QA Engineer', skills: 'Postman, Javascript, Newman', difficulty: 'Intermediate', status: 'Active' },
    { title: 'E-Commerce Database Schema Design', career: 'Data Analyst', skills: 'SQL, PostgreSQL, ER Diagrams', difficulty: 'Beginner', status: 'Active' }
  ];

  // Mock Resources Data
  const resources = [
    { title: 'React Fundamentals', career: 'Software Engineer', skill: 'React', level: 'Beginner', type: 'Course', url: 'https://react.dev' },
    { title: 'SQL Zoo Interactive Queries', career: 'Data Analyst', skill: 'SQL', level: 'Beginner', type: 'Tutorial', url: 'https://sqlzoo.net' },
    { title: 'Docker Deep Dive', career: 'DevOps', skill: 'Docker', level: 'Advanced', type: 'Course', url: 'https://docker.com' }
  ];

  const handleDeactivateStudent = (id: string) => {
    setStudents(students.map(s => s.id === id ? { ...s, status: 'Inactive' } : s));
    setConfirmDeactivateTarget(null);
    if (selectedStudent && selectedStudent.id === id) {
      setSelectedStudent({ ...selectedStudent, status: 'Inactive' });
    }
  };

  // 1. Overview Tab Render
  const renderOverview = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '8px' }}>Platform Overview</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Manage students, career pathways and learning content across ITPath.</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        {[
          { label: 'TOTAL STUDENTS', count: '1,248', desc: '↑ +12% from last month' },
          { label: 'ACTIVE STUDENTS', count: '842', desc: '↑ +5% from last month' },
          { label: 'CAREER PROFILES', count: '912', desc: '↑ +18% from last month' },
          { label: 'PROJECTS ADDED', count: '2,341', desc: '↑ +24% from last month' }
        ].map((kpi, idx) => (
          <div key={idx} style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-cream)',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>{kpi.label}</span>
              <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--brand-primary)', margin: '12px 0 6px 0' }}>{kpi.count}</h2>
            </div>
            <span style={{ fontSize: '12px', color: '#2E6F5E', fontWeight: 600 }}>{kpi.desc}</span>
          </div>
        ))}
      </div>

      {/* Analytics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)', gap: '24px' }}>
        {/* Registrations Chart Mockup */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-cream)',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800 }}>New Student Registrations</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>This Week</span>
          </div>
          {/* Simple Visual Line Representation */}
          <div style={{ position: 'relative', height: '180px', display: 'flex', alignItems: 'flex-end', borderBottom: '1px solid var(--border-cream)' }}>
            <svg viewBox="0 0 100 30" width="100%" height="100%" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0, left: 0 }}>
              <path d="M 0,25 Q 15,10 30,18 T 60,8 T 90,14 T 100,5" fill="none" stroke="var(--brand-primary)" strokeWidth="1.5" />
              <path d="M 0,25 Q 15,10 30,18 T 60,8 T 90,14 T 100,5 L 100,30 L 0,30 Z" fill="rgba(66, 75, 84, 0.05)" />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0 8px 8px 8px', fontSize: '11px', color: 'var(--text-secondary)', zIndex: 1 }}>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        {/* Career Goals distribution */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-cream)',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '20px' }}>Student Career Goals</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { path: 'Software Engineer', pct: 42, color: 'var(--brand-primary)' },
              { path: 'QA Engineer', pct: 24, color: 'var(--accent-pink)' },
              { path: 'Data Analyst', pct: 16, color: 'var(--accent-dusty)' },
              { path: 'Cybersecurity', pct: 10, color: 'var(--accent-cream)' },
              { path: 'Other', pct: 8, color: 'var(--accent-beige)' }
            ].map(item => (
              <div key={item.path}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  <span>{item.path}</span>
                  <span>{item.pct}%</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'rgba(66, 75, 84, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.pct}%`, height: '100%', backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-cream)',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>Recent Activity</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { user: 'Nuha Nazardeen', action: 'Registered', time: '2 minutes ago', avatar: 'NN' },
            { user: 'Amal Perera', action: 'Updated career path', time: '10 minutes ago', avatar: 'AP' },
            { user: 'Sarah Fernando', action: 'Added project', time: '25 minutes ago', avatar: 'SF' }
          ].map((act, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--accent-beige)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px' }}>
                  {act.avatar}
                </div>
                <div>
                  <h5 style={{ fontSize: '14px', fontWeight: 700 }}>{act.user}</h5>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{act.action}</p>
                </div>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{act.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // 2. Users / Student Management View
  const renderUsers = () => {
    // Basic search and filtering logic
    const filteredStudents = students.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.email.toLowerCase().includes(studentSearch.toLowerCase());
      const matchUni = uniFilter ? s.university.includes(uniFilter) : true;
      const matchDegree = degreeFilter ? s.degree.includes(degreeFilter) : true;
      const matchYear = yearFilter ? s.year.includes(yearFilter) : true;
      const matchStatus = statusFilter ? s.status === statusFilter : true;
      return matchSearch && matchUni && matchDegree && matchYear && matchStatus;
    });

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-primary)' }}>Students</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>View and manage registered ITPath students.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ backgroundColor: 'white', border: '1px solid var(--border-cream)', color: 'var(--brand-primary)', padding: '10px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
              Export Students
            </button>
            <button style={{ backgroundColor: 'var(--brand-primary)', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
              + Add Student
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-cream)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <AdminIcons.Search />
            </span>
            <input
              type="text"
              placeholder="Search student name or ID..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 36px',
                border: '1px solid var(--border-cream)',
                borderRadius: '8px',
                outline: 'none',
                fontSize: '13px'
              }}
            />
          </div>

          <select value={uniFilter} onChange={(e) => setUniFilter(e.target.value)} style={{ padding: '10px', border: '1px solid var(--border-cream)', borderRadius: '8px', fontSize: '13px', outline: 'none' }}>
            <option value="">University</option>
            <option value="Uva Wellassa">Uva Wellassa University</option>
            <option value="UCSC">UCSC</option>
            <option value="Moratuwa">Moratuwa</option>
          </select>

          <select value={degreeFilter} onChange={(e) => setDegreeFilter(e.target.value)} style={{ padding: '10px', border: '1px solid var(--border-cream)', borderRadius: '8px', fontSize: '13px', outline: 'none' }}>
            <option value="">Degree</option>
            <option value="CST">CST</option>
            <option value="CS">CS</option>
            <option value="IT">IT</option>
          </select>

          <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} style={{ padding: '10px', border: '1px solid var(--border-cream)', borderRadius: '8px', fontSize: '13px', outline: 'none' }}>
            <option value="">Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '10px', border: '1px solid var(--border-cream)', borderRadius: '8px', fontSize: '13px', outline: 'none' }}>
            <option value="">Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Main Students Table */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--border-cream)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-cream)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '16px' }}>Student</th>
                <th style={{ padding: '16px' }}>University</th>
                <th style={{ padding: '16px' }}>Degree</th>
                <th style={{ padding: '16px' }}>Year</th>
                <th style={{ padding: '16px' }}>Career Goal</th>
                <th style={{ padding: '16px' }}>Profile Completion</th>
                <th style={{ padding: '16px' }}>Status</th>
                <th style={{ padding: '16px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No students match your search.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.id} style={{ borderBottom: '1px solid var(--border-cream)' }}>
                    <td style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--accent-dusty)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>{student.name}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{student.email}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>{student.university}</td>
                    <td style={{ padding: '16px' }}>{student.degree}</td>
                    <td style={{ padding: '16px' }}>{student.year}</td>
                    <td style={{ padding: '16px' }}>{student.careerGoal}</td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{student.completion}%</span>
                        <div style={{ width: '40px', height: '4px', backgroundColor: 'rgba(66, 75, 84, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ width: `${student.completion}%`, height: '100%', backgroundColor: 'var(--brand-primary)' }} />
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: student.status === 'Active' ? '#E2ECE9' : '#F3EFEF',
                        color: student.status === 'Active' ? '#2E6F5E' : '#B38D97',
                        padding: '4px 8px',
                        borderRadius: '6px'
                      }}>
                        {student.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => setSelectedStudent(student)} style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', fontWeight: 700, cursor: 'pointer' }}>View</button>
                        <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer' }}>Edit</button>
                        {student.status === 'Active' && (
                          <button onClick={() => setConfirmDeactivateTarget(student)} style={{ background: 'none', border: 'none', color: '#D93838', fontWeight: 600, cursor: 'pointer' }}>Deactivate</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* View Details Modal Panel */}
        {selectedStudent && (
          <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: '400px',
            backgroundColor: '#FFFFFF',
            boxShadow: '-4px 0 24px rgba(0,0,0,0.1)',
            zIndex: 1000,
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Student Details</h3>
              <button onClick={() => setSelectedStudent(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>&times;</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '14px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>PERSONAL INFORMATION</span>
                <p style={{ fontWeight: 700, fontSize: '16px' }}>{selectedStudent.name}</p>
                <p style={{ color: 'var(--text-secondary)' }}>{selectedStudent.email}</p>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>ACADEMIC PROFILE</span>
                <p><strong>University:</strong> {selectedStudent.university}</p>
                <p><strong>Degree:</strong> {selectedStudent.degree}</p>
                <p><strong>Academic Year:</strong> {selectedStudent.year}</p>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>CAREER PROFILE</span>
                <p><strong>Goal:</strong> {selectedStudent.careerGoal}</p>
                <p><strong>Roadmap Completion:</strong> {selectedStudent.completion}%</p>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>SKILLS ACTIVATED</span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {selectedStudent.skills.map((s: string) => (
                    <span key={s} style={{ fontSize: '11px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-cream)', padding: '4px 8px', borderRadius: '4px' }}>{s}</span>
                  ))}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>PORTFOLIO PROJECTS</span>
                {selectedStudent.projects.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>No projects added yet.</p>
                ) : (
                  selectedStudent.projects.map((p: string) => (
                    <p key={p} style={{ fontWeight: 600 }}>📁 {p}</p>
                  ))
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border-cream)' }}>
              <button style={{ flex: 1, backgroundColor: 'white', border: '1px solid var(--border-cream)', padding: '12px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Edit Student</button>
              {selectedStudent.status === 'Active' && (
                <button onClick={() => setConfirmDeactivateTarget(selectedStudent)} style={{ flex: 1, backgroundColor: '#D93838', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Deactivate</button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // 3. Academic Data Tab View
  const renderAcademic = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-primary)' }}>Academic Data</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Manage higher education institutions and their academic structures.</p>
        </div>
        <button style={{ backgroundColor: 'var(--brand-primary)', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
          + Add University
        </button>
      </div>

      {/* Tabs Menu inside Academic Data */}
      <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid var(--border-cream)', paddingBottom: '12px' }}>
        {[
          { id: 'universities', label: 'UNIVERSITIES' },
          { id: 'faculties', label: 'FACULTIES' },
          { id: 'degrees', label: 'DEGREE PROGRAMMES' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setAcademicSubTab(tab.id as any)}
            style={{
              background: 'none',
              border: 'none',
              fontWeight: 700,
              fontSize: '13px',
              color: academicSubTab === tab.id ? 'var(--brand-primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              position: 'relative',
              paddingBottom: '8px'
            }}
          >
            {tab.label}
            {academicSubTab === tab.id && (
              <span style={{ position: 'absolute', bottom: '-13px', left: 0, right: 0, height: '2px', backgroundColor: 'var(--brand-primary)' }} />
            )}
          </button>
        ))}
      </div>

      {/* Universities list */}
      {academicSubTab === 'universities' && (
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--border-cream)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-cream)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '16px' }}>University Name</th>
                <th style={{ padding: '16px' }}>Location</th>
                <th style={{ padding: '16px' }}>Status</th>
                <th style={{ padding: '16px' }}>Students</th>
                <th style={{ padding: '16px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {universities.map((uni, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-cream)' }}>
                  <td style={{ padding: '16px', fontWeight: 700 }}>🏫 {uni.name}</td>
                  <td style={{ padding: '16px' }}>{uni.location}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: uni.status === 'Active' ? '#E2ECE9' : '#F3EFEF',
                      color: uni.status === 'Active' ? '#2E6F5E' : '#B38D97',
                      padding: '4px 8px',
                      borderRadius: '6px'
                    }}>
                      {uni.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>{uni.studentCount} students</td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', fontWeight: 700, cursor: 'pointer' }}>Edit</button>
                      <button style={{ background: 'none', border: 'none', color: '#D93838', fontWeight: 600, cursor: 'pointer' }}>Deactivate</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {academicSubTab === 'faculties' && (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'white', borderRadius: '12px', border: '1px dashed var(--border-cream)' }}>
          No faculties added yet. Click + Add University to configure faculties.
        </div>
      )}

      {academicSubTab === 'degrees' && (
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--border-cream)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-cream)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '16px' }}>Degree</th>
                <th style={{ padding: '16px' }}>University</th>
                <th style={{ padding: '16px' }}>Faculty</th>
                <th style={{ padding: '16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-cream)' }}>
                <td style={{ padding: '16px', fontWeight: 700 }}>BSc Computer Science and Technology</td>
                <td style={{ padding: '16px' }}>Uva Wellassa University</td>
                <td style={{ padding: '16px' }}>Faculty of Science and Technology</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#E2ECE9', color: '#2E6F5E', padding: '4px 8px', borderRadius: '6px' }}>Active</span>
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-cream)' }}>
                <td style={{ padding: '16px', fontWeight: 700 }}>BSc Software Engineering</td>
                <td style={{ padding: '16px' }}>University of Kelaniya</td>
                <td style={{ padding: '16px' }}>Faculty of Computing and Technology</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#E2ECE9', color: '#2E6F5E', padding: '4px 8px', borderRadius: '6px' }}>Active</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // 4. Career Paths Tab View
  const renderCareerPaths = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '8px' }}>Career Paths</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Maintain the career pathways available to ITPath students.</p>
      </div>

      {selectedCareerPath ? (
        // Career Roadmap Management detail view
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', backgroundColor: 'white', padding: '32px', borderRadius: '12px', border: '1px solid var(--border-cream)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <button onClick={() => setSelectedCareerPath(null)} style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', fontWeight: 700, fontSize: '13px', cursor: 'pointer', marginBottom: '8px', display: 'block' }}>← Back to Pathways</button>
              <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Manage Roadmap: {selectedCareerPath.name}</h2>
            </div>
            <button style={{ backgroundColor: 'var(--brand-primary)', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>+ Add Skill</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '16px' }}>
            {[
              { stage: 'FOUNDATION', skills: ['Programming', 'OOP', 'Git'] },
              { stage: 'CORE SKILLS', skills: ['SQL', 'Data Structures', 'Algorithms'] },
              { stage: 'DEVELOPMENT', skills: ['React', 'REST APIs', 'Backend'] },
              { stage: 'PROFESSIONAL READINESS', skills: ['CV Writing', 'GitHub Profile', 'LinkedIn Optimization', 'Interview Preparation'] }
            ].map((p, idx) => (
              <div key={idx} style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '8px',
                padding: '20px',
                border: '1px solid var(--border-cream)'
              }}>
                <h4 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '1px', marginBottom: '12px' }}>{p.stage}</h4>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {p.skills.map(skill => (
                    <div key={skill} style={{
                      backgroundColor: 'white',
                      border: '1px solid var(--border-cream)',
                      borderRadius: '8px',
                      padding: '10px 16px',
                      fontSize: '13px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <span>{skill}</span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button style={{ background: 'none', border: 'none', fontSize: '11px', cursor: 'pointer', color: 'var(--text-secondary)' }}>Edit</button>
                        <button style={{ background: 'none', border: 'none', fontSize: '11px', cursor: 'pointer', color: '#D93838' }}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // List of Career Path cards
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {careerPaths.map(path => (
            <div key={path.name} style={{
              backgroundColor: 'white',
              border: '1px solid var(--border-cream)',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '180px'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-primary)' }}>{path.name}</h3>
                  <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#E2ECE9', color: '#2E6F5E', padding: '3px 8px', borderRadius: '6px' }}>{path.status}</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>👥 {path.students} students</p>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>🔧 {path.skills} skills roadmap</p>
              </div>
              <button
                onClick={() => setSelectedCareerPath(path)}
                style={{
                  width: '100%',
                  backgroundColor: 'white',
                  border: '1px solid var(--brand-primary)',
                  color: 'var(--brand-primary)',
                  padding: '10px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                Manage Roadmap
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // 5. Skills Management View
  const renderSkills = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-primary)' }}>Skills</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Maintain global skills mapped to ITPath career roadmaps.</p>
        </div>
        <button style={{ backgroundColor: 'var(--brand-primary)', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
          + Add Skill
        </button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--border-cream)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-cream)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '16px' }}>Skill</th>
              <th style={{ padding: '16px' }}>Category</th>
              <th style={{ padding: '16px' }}>Career Paths</th>
              <th style={{ padding: '16px' }}>Difficulty</th>
              <th style={{ padding: '16px' }}>Status</th>
              <th style={{ padding: '16px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill, index) => (
              <tr key={index} style={{ borderBottom: '1px solid var(--border-cream)' }}>
                <td style={{ padding: '16px', fontWeight: 700 }}>⚙ {skill.name}</td>
                <td style={{ padding: '16px' }}>{skill.category}</td>
                <td style={{ padding: '16px' }}>{skill.paths}</td>
                <td style={{ padding: '16px' }}>{skill.difficulty}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#E2ECE9', color: '#2E6F5E', padding: '4px 8px', borderRadius: '6px' }}>{skill.status}</span>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', fontWeight: 700, cursor: 'pointer' }}>Edit</button>
                    <button style={{ background: 'none', border: 'none', color: '#D93838', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 6. Learning Resources View
  const renderResources = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-primary)' }}>Learning Resources</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Maintain education resources connected to career skills.</p>
        </div>
        <button style={{ backgroundColor: 'var(--brand-primary)', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
          + Add Resource
        </button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--border-cream)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-cream)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '16px' }}>Resource Title</th>
              <th style={{ padding: '16px' }}>Career Goal</th>
              <th style={{ padding: '16px' }}>Connected Skill</th>
              <th style={{ padding: '16px' }}>Difficulty</th>
              <th style={{ padding: '16px' }}>Type</th>
              <th style={{ padding: '16px' }}>URL / Link</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((res, index) => (
              <tr key={index} style={{ borderBottom: '1px solid var(--border-cream)' }}>
                <td style={{ padding: '16px', fontWeight: 700 }}>📖 {res.title}</td>
                <td style={{ padding: '16px' }}>{res.career}</td>
                <td style={{ padding: '16px' }}>{res.skill}</td>
                <td style={{ padding: '16px' }}>{res.level}</td>
                <td style={{ padding: '16px' }}>{res.type}</td>
                <td style={{ padding: '16px' }}><a href={res.url} target="_blank" rel="noreferrer" style={{ color: 'var(--brand-primary)', textDecoration: 'underline' }}>{res.url}</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 7. Project Templates View
  const renderProjects = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-primary)' }}>Project Templates</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Manage recommended project ideas/templates for student practice.</p>
        </div>
        <button style={{ backgroundColor: 'var(--brand-primary)', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
          + Add Template
        </button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--border-cream)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-cream)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '16px' }}>Project Template</th>
              <th style={{ padding: '16px' }}>Target Career</th>
              <th style={{ padding: '16px' }}>Skills Utilized</th>
              <th style={{ padding: '16px' }}>Difficulty</th>
              <th style={{ padding: '16px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {projectTemplates.map((proj, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--border-cream)' }}>
                <td style={{ padding: '16px', fontWeight: 700 }}>💻 {proj.title}</td>
                <td style={{ padding: '16px' }}>{proj.career}</td>
                <td style={{ padding: '16px' }}>{proj.skills}</td>
                <td style={{ padding: '16px' }}>{proj.difficulty}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#E2ECE9', color: '#2E6F5E', padding: '4px 8px', borderRadius: '6px' }}>{proj.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 8. Reports View
  const renderReports = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '8px' }}>Platform Reports</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Analyze platform usage metrics and activity reports.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={{ backgroundColor: 'white', padding: '24px', border: '1px solid var(--border-cream)', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>Registrations By Institution</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>UWU: 248 | Colombo: 1204 | SLIIT: 850</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '24px', border: '1px solid var(--border-cream)', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>Popular Roadmaps</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Software Engineering: 42% | QA: 24% | Data Analyst: 16%</p>
        </div>
      </div>
    </div>
  );

  // 9. Settings View
  const renderSettings = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '8px' }}>Settings</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Manage administrative system settings.</p>
      </div>

      <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', border: '1px solid var(--border-cream)', maxWidth: '600px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px' }}>Admin Profile</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Name</label>
            <input type="text" defaultValue="ITPath Administrator" disabled style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-cream)', backgroundColor: 'var(--bg-secondary)' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Email</label>
            <input type="email" defaultValue="admin@itpath.lk" disabled style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-cream)', backgroundColor: 'var(--bg-secondary)' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Role</label>
            <input type="text" defaultValue="Administrator" disabled style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-cream)', backgroundColor: 'var(--bg-secondary)' }} />
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <button style={{ backgroundColor: 'var(--brand-primary)', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>Edit Profile</button>
            <button style={{ backgroundColor: 'white', border: '1px solid var(--border-cream)', padding: '10px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>Change Password</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FAF6F0' }}>
      
      {/* Dark Sidebar specifically for Admin console */}
      <aside style={{
        width: '260px',
        backgroundColor: '#424B54',
        padding: '32px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        height: '100vh',
        color: '#FFFFFF'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Logo */}
          <div style={{ paddingLeft: '8px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.5px' }}>ITPath Admin</h2>
            <span style={{ fontSize: '11px', color: 'var(--accent-dusty)', fontWeight: 700, letterSpacing: '1px' }}>ADMIN CONSOLE</span>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              { id: 'overview', label: 'Overview', icon: <AdminIcons.Overview /> },
              { id: 'users', label: 'Users', icon: <AdminIcons.Users /> },
              { id: 'academic', label: 'Academic Data', icon: <AdminIcons.Academic /> },
              { id: 'paths', label: 'Career Paths', icon: <AdminIcons.Paths /> },
              { id: 'skills', label: 'Skills', icon: <AdminIcons.Skills /> },
              { id: 'resources', label: 'Resources', icon: <AdminIcons.Resources /> },
              { id: 'projects', label: 'Projects', icon: <AdminIcons.Projects /> },
              { id: 'reports', label: 'Reports', icon: <AdminIcons.Reports /> }
            ].map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setSelectedCareerPath(null);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '12px 14px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                    color: '#FFFFFF',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '13px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User info & Action links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button
              onClick={() => setActiveTab('settings')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '8px 14px',
                border: 'none',
                background: 'none',
                color: '#FFFFFF',
                fontWeight: 500,
                fontSize: '13px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <AdminIcons.Settings /> Settings
            </button>
            <button 
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '8px 14px',
                border: 'none',
                background: 'none',
                color: '#D5ACA9',
                fontWeight: 500,
                fontSize: '13px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <AdminIcons.Logout /> Logout
            </button>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)' }} />

          {/* Admin Avatar and details */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '4px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--accent-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px' }}>
              AU
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '13px', fontWeight: 700 }}>Admin User</span>
              <span style={{ fontSize: '10px', color: 'var(--accent-beige)' }}>admin@itpath.lk</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content body */}
      <main style={{ flex: 1, backgroundColor: '#FAF6F0', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header bar */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 40px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--border-cream)',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--brand-primary)' }}>ITPath Administrator</h4>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>System Console</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <AdminIcons.Bell />
            </button>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-dusty)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '12px',
              color: 'var(--brand-primary)'
            }}>
              A
            </div>
          </div>
        </header>

        {/* Content area */}
        <section style={{ padding: '40px', flex: 1 }}>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'academic' && renderAcademic()}
          {activeTab === 'paths' && renderCareerPaths()}
          {activeTab === 'skills' && renderSkills()}
          {activeTab === 'resources' && renderResources()}
          {activeTab === 'projects' && renderProjects()}
          {activeTab === 'reports' && renderReports()}
          {activeTab === 'settings' && renderSettings()}
        </section>

      </main>

      {/* Confirmation Dialog / Modal */}
      {confirmDeactivateTarget && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '400px',
            width: '100%',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '12px' }}>Deactivate Student Account?</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '24px' }}>
              Deactivating this student account will restrict them from accessing the ITPath platform. Are you sure you want to deactivate <strong>{confirmDeactivateTarget.name}</strong>?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setConfirmDeactivateTarget(null)} style={{ backgroundColor: 'white', border: '1px solid var(--border-cream)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>Cancel</button>
              <button onClick={() => handleDeactivateStudent(confirmDeactivateTarget.id)} style={{ backgroundColor: '#D93838', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>Deactivate</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminDashboardPage;
