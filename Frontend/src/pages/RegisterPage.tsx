import { useState, useRef } from 'react';
import { authService } from '../services/authService';

interface RegisterPageProps {
  onNavigate: (path: string) => void;
}

const UNIVERSITIES = [
  'University of Colombo',
  'University of Moratuwa',
  'University of Sri Jayewardenepura',
  'University of Kelaniya',
  'University of Peradeniya',
  'University of Ruhuna',
  'University of Jaffna',
  'Uva Wellassa University',
  'SLIIT',
  'NSBM',
  'IIT',
];

const DEGREES = [
  'BSc Computer Science',
  'BSc Information Technology',
  'BSc Software Engineering',
  'BSc Computer Science and Technology',
  'BSc Information Systems',
  'BSc Data Science',
  'BSc Cyber Security',
];

const CAREER_PREVIEWS: Record<string, string[]> = {
  'Software Engineer': ['Fundamentals', 'Data Structures', 'Backend Systems'],
  'Backend Developer': ['APIs & Express', 'Databases & Mongoose', 'Authentication & Security'],
  'UI/UX Designer': ['User Research', 'Wireframing & Figma', 'Prototyping & Testing'],
  'DevOps Engineer': ['CI/CD Pipelines', 'Docker & Kubernetes', 'Cloud & Infrastructure'],
  'Cyber Security': ['Network Security', 'Penetration Testing', 'Identity Management'],
  'Machine Learning': ['Python & Math', 'Supervised Learning', 'Neural Networks'],
  'Data Science': ['Python & Pandas', 'Statistical Analysis', 'Data Visualization'],
  'Product Manager': ['Agile & Scrum', 'Project Scheduling', 'Stakeholder Mgmt'],
  'QA / Software Tester': ['Manual Testing', 'Automation Testing', 'Performance Testing'],
};

export function RegisterPage({ onNavigate }: RegisterPageProps) {
  // Step manager: 1 (Account), 2 (Academic), 3 (Career), 4 (Skills), 5 (Review), 6 (Success)
  const [step, setStep] = useState(1);
  const step3CarouselRef = useRef<HTMLDivElement>(null);

  const scrollStep3 = (direction: 'left' | 'right') => {
    if (step3CarouselRef.current) {
      const scrollAmount = 300;
      step3CarouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Form Fields State
  const [fullName, setFullName] = useState('');
  const [uniEmail, setUniEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Step 2: Academic Profile
  const [university, setUniversity] = useState('');
  const [otherUniversity, setOtherUniversity] = useState('');
  const [degree, setDegree] = useState('');
  const [otherDegree, setOtherDegree] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [semester, setSemester] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [specialization, setSpecialization] = useState('');

  // Step 3: Career Direction
  const [careerDirection, setCareerDirection] = useState('Software Engineer');

  // Step 4: Starting Point
  const [selectedSkills, setSelectedSkills] = useState<Record<string, 'BEG' | 'INT' | 'ADV'>>({
    'Python': 'INT',
    'React': 'BEG'
  });
  const [weekdayHours, setWeekdayHours] = useState('5 - 10 hours');
  const [weekendHours, setWeekendHours] = useState('5 - 10 hours');
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>(['Finding time while working']);

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!fullName.trim()) newErrors.fullName = 'Full Name is required.';
      if (!uniEmail.trim()) {
        newErrors.uniEmail = 'University Email is required.';
      } else if (!/\S+@\S+\.\S+/.test(uniEmail)) {
        newErrors.uniEmail = 'Invalid email address format.';
      }
      if (!password) {
        newErrors.password = 'Password is required.';
      } else if (password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters.';
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match.';
      }
      if (!agreeTerms) {
        newErrors.agreeTerms = 'You must agree to the Terms of Service.';
      }
    }

    if (currentStep === 2) {
      if (!university) newErrors.university = 'Please select your university.';
      if (!degree) newErrors.degree = 'Please select your degree programme.';
      if (!academicYear) newErrors.academicYear = 'Academic Year is required.';
      if (!semester) newErrors.semester = 'Semester is required.';
      if (!graduationYear) newErrors.graduationYear = 'Graduation Year is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleCreateProfile = async () => {
    const studentProfile = {
      fullName,
      uniEmail,
      password,
      academic: {
        university: university === 'Other' ? otherUniversity : university,
        degree: degree === 'Other' ? otherDegree : degree,
        academicYear,
        semester,
        graduationYear,
        specialization,
      },
      career: careerDirection,
      skills: selectedSkills,
      planning: {
        weekdayHours,
        weekendHours,
        challenges: selectedChallenges,
      }
    };

    try {
      await authService.register(studentProfile);
      setStep(6);
    } catch (error: unknown) {
      console.error('Registration error:', error);
      const message = error instanceof Error ? error.message : 'Failed to connect to backend server. Please verify backend is running.';
      alert(message);
    }
  };

  const handleFinish = () => {
    onNavigate('/login');
  };

  const handleToggleSkill = (skill: string) => {
    if (selectedSkills[skill]) {
      const updated = { ...selectedSkills };
      delete updated[skill];
      setSelectedSkills(updated);
    } else {
      setSelectedSkills(prev => ({ ...prev, [skill]: 'BEG' }));
    }
  };

  const handleSelectSkillLevel = (skill: string, level: 'BEG' | 'INT' | 'ADV') => {
    setSelectedSkills(prev => ({ ...prev, [skill]: level }));
  };

  const handleToggleChallenge = (challenge: string) => {
    if (selectedChallenges.includes(challenge)) {
      setSelectedChallenges(prev => prev.filter(c => c !== challenge));
    } else {
      setSelectedChallenges(prev => [...prev, challenge]);
    }
  };

  const getPasswordStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    return score;
  };

  // Consistent Left Side Panel Render
  const renderLeftPanel = () => {
    const isAcademicActive = step === 1 || step === 2 || step === 6;
    const isCareerActive = step >= 3;

    return (
      <div className="onboarding-left-premium" style={{
        width: '30%',
        minWidth: '320px',
        padding: '48px 32px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRight: '1px solid var(--border-cream)',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto'
      }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '12px' }}>Techora</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '100px' }}>
            Bridging the gap between academic theory and industry reality. Your journey to professional excellence starts here.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{
                background: 'white',
                border: isAcademicActive ? '1px solid var(--brand-primary)' : '1px solid var(--border-cream)',
                borderRadius: '8px',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}>🎓</div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--brand-primary)' }}>University</h4>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Map your academic achievements</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{
                background: 'white',
                border: isCareerActive ? '1px solid var(--brand-primary)' : '1px solid var(--border-cream)',
                borderRadius: '8px',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}>💼</div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--brand-primary)' }}>Career</h4>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Navigate industry requirements</p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '120px', display: 'flex', flexDirection: 'column', gap: '24px', borderTop: '1px solid var(--border-cream)', paddingTop: '24px' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              University life is more than attending lectures and completing assignments. As an IT undergraduate, you also need to build practical skills, work on projects, explore your career path, and prepare for the industry. Balancing all of this alongside assessments, examinations and academic responsibilities can be challenging.
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Techora helps you bring these areas together in one place. Organize your academic journey, develop the skills required for your chosen career, track your progress, and gradually build your path from university to industry.
            </p>
          </div>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} Techora Sri Lanka
        </div>
      </div>
    );
  };

  // Header render for steps 2, 3, 4, 5
  const renderTopProgress = (stepNum: number) => (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: '20px',
      borderBottom: '1px solid var(--border-cream)',
      marginBottom: '32px',
      width: '100%'
    }}>
      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>Step {stepNum} of 4</div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{
              width: '24px',
              height: '4px',
              borderRadius: '2px',
              backgroundColor: i <= stepNum ? 'var(--brand-primary)' : 'var(--border-light)'
            }} />
          ))}
        </div>
        <div className="profile-icon-circle" style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px'
        }}>👤</div>
      </div>
    </div>
  );

  // Step 1 Layout: Account Details
  const renderStep1 = () => (
    <div style={{ maxWidth: '480px', width: '100%', margin: '0 auto' }}>
      {/* Horizontal mini progress */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '40px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
        <span style={{ color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ background: 'var(--brand-primary)', color: 'white', width: '20px', height: '20px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>1</span> Account
        </span>
        <span style={{ color: 'var(--text-muted)' }}>→</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ border: '1px solid var(--text-muted)', color: 'var(--text-muted)', width: '20px', height: '20px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>2</span> Academic
        </span>
        <span style={{ color: 'var(--text-muted)' }}>→</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ border: '1px solid var(--text-muted)', color: 'var(--text-muted)', width: '20px', height: '20px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>3</span> Career
        </span>
        <span style={{ color: 'var(--text-muted)' }}>→</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ border: '1px solid var(--text-muted)', color: 'var(--text-muted)', width: '20px', height: '20px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>4</span> Finish
        </span>
      </div>

      <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '8px' }}>Create Account</h2>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '32px' }}>Start building your professional profile.</p>

      <div className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="form-group">
          <label className="form-label" style={{ fontWeight: 600 }}>Full Name</label>
          <input
            className="form-input"
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
          />
          {errors.fullName && <div className="inline-error">{errors.fullName}</div>}
        </div>

        <div className="form-group">
          <label className="form-label" style={{ fontWeight: 600 }}>Email</label>
          <input
            className="form-input"
            type="email"
            placeholder="yourname@example.com"
            value={uniEmail}
            onChange={e => setUniEmail(e.target.value)}
          />
          {errors.uniEmail && <div className="inline-error">{errors.uniEmail}</div>}
        </div>

        <div className="form-group">
          <label className="form-label" style={{ fontWeight: 600 }}>Password</label>
          <div className="password-input-container">
            <input
              className="form-input"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              👁️
            </button>
          </div>
          {password.length > 0 && (
            <div className="password-strength-container">
              <div className="password-strength-bar-bg" style={{ height: '3px' }}>
                <div className={`password-strength-bar ${
                  getPasswordStrength() === 1 ? 'strength-weak' :
                  getPasswordStrength() === 2 ? 'strength-medium' :
                  getPasswordStrength() === 3 ? 'strength-strong' : ''
                }`} />
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Password must be at least 8 characters.
              </span>
            </div>
          )}
          {errors.password && <div className="inline-error">{errors.password}</div>}
        </div>

        <div className="form-group">
          <label className="form-label" style={{ fontWeight: 600 }}>Confirm Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && <div className="inline-error">{errors.confirmPassword}</div>}
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '12px' }}>
          <input
            type="checkbox"
            id="agree"
            checked={agreeTerms}
            onChange={e => setAgreeTerms(e.target.checked)}
            style={{ width: '16px', height: '16px' }}
          />
          <label htmlFor="agree" style={{ fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            I agree to the <span style={{ textDecoration: 'underline' }}>Terms of Service</span> and <span style={{ textDecoration: 'underline' }}>Privacy Policy</span>.
          </label>
        </div>
        {errors.agreeTerms && <div className="inline-error">{errors.agreeTerms}</div>}

        <button
          className="onboarding-primary-btn"
          onClick={handleNext}
          style={{
            backgroundColor: 'var(--brand-primary)',
            color: 'white',
            border: 'none',
            padding: '14px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            marginTop: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          Continue →
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--text-secondary)' }}>
        Already have an account?{' '}
        <a href="/login" style={{ fontWeight: 700, color: 'var(--brand-primary)', textDecoration: 'none' }} onClick={e => { e.preventDefault(); onNavigate('/login'); }}>
          Log in
        </a>
      </div>
    </div>
  );

  // Step 2 Layout: Academic Details
  const renderStep2 = () => (
    <div style={{ width: '100%', maxWidth: '580px', margin: '0 auto' }}>
      {renderTopProgress(2)}

      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '32px',
        border: '1px solid var(--border-cream)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ marginBottom: '8px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '1px' }}>
          Step 2 of 4 • Academic Profile
        </div>
        <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '8px' }}>Academic Details</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.5 }}>
          Provide your current academic standing to help us tailor opportunities relevant to your journey.
        </p>

        <div className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600 }}>University / Institute</label>
            <select
              className="form-input"
              value={university}
              onChange={e => setUniversity(e.target.value)}
            >
              <option value="">Select your institution...</option>
              {UNIVERSITIES.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
              <option value="Other">Other</option>
            </select>
            {university === 'Other' && (
              <input
                className="form-input"
                style={{ marginTop: '8px' }}
                type="text"
                placeholder="Enter institution name"
                value={otherUniversity}
                onChange={e => setOtherUniversity(e.target.value)}
              />
            )}
            {errors.university && <div className="inline-error">{errors.university}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600 }}>Degree / Programme</label>
            <select
              className="form-input"
              value={degree}
              onChange={e => setDegree(e.target.value)}
            >
              <option value="">Select your programme...</option>
              {DEGREES.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
              <option value="Other">Other</option>
            </select>
            {degree === 'Other' && (
              <input
                className="form-input"
                style={{ marginTop: '8px' }}
                type="text"
                placeholder="Enter degree name"
                value={otherDegree}
                onChange={e => setOtherDegree(e.target.value)}
              />
            )}
            {errors.degree && <div className="inline-error">{errors.degree}</div>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600 }}>Academic Year</label>
              <select
                className="form-input"
                value={academicYear}
                onChange={e => setAcademicYear(e.target.value)}
              >
                <option value="">Select year...</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
              {errors.academicYear && <div className="inline-error">{errors.academicYear}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600 }}>Current Semester</label>
              <select
                className="form-input"
                value={semester}
                onChange={e => setSemester(e.target.value)}
              >
                <option value="">Select semester...</option>
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
              </select>
              {errors.semester && <div className="inline-error">{errors.semester}</div>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600 }}>Expected Graduation Year</label>
            <select
              className="form-input"
              value={graduationYear}
              onChange={e => setGraduationYear(e.target.value)}
            >
              <option value="">Select graduation year...</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028</option>
              <option value="2029">2029</option>
              <option value="2030">2030</option>
            </select>
            {errors.graduationYear && <div className="inline-error">{errors.graduationYear}</div>}
          </div>



          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600 }}>Specialization / Stream (Optional)</label>
            <input
              className="form-input"
              type="text"
              placeholder="E.g. Software Engineering"
              value={specialization}
              onChange={e => setSpecialization(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
            <button
              type="button"
              onClick={handleBack}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--brand-primary)',
                cursor: 'pointer',
                fontWeight: 700
              }}
            >
              Continue →
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 3 Layout: Choose Your Direction
  const renderStep3 = () => {
    const roles = [
      {
        title: 'Software Engineer',
        desc: 'Build robust applications and systems across the full stack.',
        icon: '💻'
      },
      {
        title: 'Backend Developer',
        desc: 'Design server-side logic, databases, and APIs.',
        icon: '⚙️'
      },
      {
        title: 'UI/UX Designer',
        desc: 'Create interfaces and optimize user experiences.',
        icon: '🎨'
      },
      {
        title: 'DevOps Engineer',
        desc: 'Automate deployments, handle CI/CD, and manage cloud infrastructure.',
        icon: '🚀'
      },
      {
        title: 'Cyber Security',
        desc: 'Protect systems, networks, and databases from threats.',
        icon: '🛡️'
      },
      {
        title: 'Machine Learning',
        desc: 'Build predictive models and neural network algorithms.',
        icon: '🧠'
      },
      {
        title: 'Data Science',
        desc: 'Analyze complex data patterns and extract business insights.',
        icon: '📊'
      },
      {
        title: 'Product Manager',
        desc: 'Coordinate development teams and manage software products.',
        icon: '💼'
      },
      {
        title: 'QA / Software Tester',
        desc: 'Test applications to ensure top quality standards.',
        icon: '🐞'
      }
    ];

    return (
      <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto' }}>
        {renderTopProgress(3)}

        <h2 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '8px', textAlign: 'center' }}>Choose Your Direction</h2>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '40px', textAlign: 'center', lineHeight: 1.5 }}>
          Select a career path to preview your personalized learning roadmap. You can always adjust this later.
        </p>

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '40px', padding: '0 40px' }}>
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={() => scrollStep3('left')}
            style={{
              position: 'absolute',
              left: '0px',
              zIndex: 10,
              background: 'white',
              border: '1px solid var(--border-cream)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              color: 'var(--brand-primary)',
              fontWeight: 'bold',
              fontSize: '18px'
            }}
          >
            ←
          </button>

          {/* Scrollable Container */}
          <div
            ref={step3CarouselRef}
            style={{
              display: 'flex',
              gap: '16px',
              overflowX: 'auto',
              scrollBehavior: 'smooth',
              padding: '10px 4px',
              width: '100%',
              scrollbarWidth: 'none', // hide for Firefox
              msOverflowStyle: 'none'  // hide for IE
            }}
            className="step3-carousel"
          >
            {roles.map(r => {
              const isSelected = careerDirection === r.title;
              return (
                <div
                  key={r.title}
                  onClick={() => setCareerDirection(r.title)}
                  style={{
                    flex: '0 0 240px',
                    backgroundColor: isSelected ? '#FCFAF7' : 'white',
                    border: isSelected ? '1px solid var(--brand-primary)' : '1px solid var(--border-cream)',
                    borderRadius: '12px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative',
                    boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '280px'
                  }}
                >
                  {isSelected && (
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      color: 'var(--brand-primary)',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}>✓</div>
                  )}
                  <div>
                    <div style={{
                      backgroundColor: isSelected ? 'var(--accent-cream)' : '#FAF6F0',
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      marginBottom: '14px'
                    }}>{r.icon}</div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '8px' }}>{r.title}</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{r.desc}</p>
                  </div>

                  <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-cream)', paddingTop: '12px' }}>
                    <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Preview Roadmap</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {CAREER_PREVIEWS[r.title]?.map(skill => (
                        <li key={skill} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-primary)', fontWeight: 600 }}>
                          <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--brand-primary)' }}></span>
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={() => scrollStep3('right')}
            style={{
              position: 'absolute',
              right: '0px',
              zIndex: 10,
              background: 'white',
              border: '1px solid var(--border-cream)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              color: 'var(--brand-primary)',
              fontWeight: 'bold',
              fontSize: '18px'
            }}
          >
            →
          </button>
        </div>

        <div style={{ borderTop: '1px solid var(--border-cream)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={handleBack}
            className="onboarding-secondary-btn"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="onboarding-primary-btn"
          >
            Continue
          </button>
        </div>
      </div>
    );
  };

  // Step 4 Layout: Skills & Availability
  const renderStep4 = () => {
    const skillsList = [
      {
        category: 'Programming Languages',
        skills: ['Java', 'Python', 'C#']
      },
      {
        category: 'Web Development',
        skills: ['React', 'Node.js', 'HTML/CSS']
      },
      {
        category: 'Database & Infra',
        skills: ['SQL', 'MongoDB', 'AWS']
      }
    ];

    const challengeOptions = [
      'Lack of clear learning structure',
      'Finding time while working',
      'Understanding complex concepts',
      'Staying motivated long-term'
    ];

    return (
      <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto' }}>
        {renderTopProgress(4)}

        <div style={{ marginBottom: '32px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>Step 4 & 5 • Skills & Availability</span>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--brand-primary)', marginTop: '4px', marginBottom: '8px' }}>Where Are You Starting From?</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Help us understand your current technical foundation and availability so we can tailor your learning path.
          </p>
        </div>

        <div className="skills-split-container">
          {/* Left Column: Technical Skills */}
          <div style={{
            backgroundColor: 'white',
            border: '1px solid var(--border-cream)',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              💻 Technical Skills
            </h3>

            {skillsList.map(cat => (
              <div key={cat.category} style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>{cat.category}</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                  {cat.skills.map(s => {
                    const isSelected = !!selectedSkills[s];
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleToggleSkill(s)}
                        style={{
                          backgroundColor: isSelected ? 'var(--bg-secondary)' : 'white',
                          border: isSelected ? '1px solid var(--accent-pink)' : '1px solid var(--border-light)',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontWeight: 600,
                          fontSize: '12px',
                          cursor: 'pointer',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>

                {cat.skills.map(s => {
                  const level = selectedSkills[s];
                  if (!level) return null;
                  return (
                    <div key={`${s}-prof`} style={{
                      backgroundColor: '#FCFAF7',
                      border: '1px solid var(--border-cream)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '8px'
                    }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--brand-primary)' }}>{s} Proficiency:</span>
                      <div style={{ display: 'flex', border: '1px solid var(--border-light)', borderRadius: '4px', overflow: 'hidden' }}>
                        {(['BEG', 'INT', 'ADV'] as const).map(l => (
                          <button
                            key={l}
                            type="button"
                            onClick={() => handleSelectSkillLevel(s, l)}
                            style={{
                              border: 'none',
                              backgroundColor: level === l ? 'var(--brand-primary)' : 'white',
                              color: level === l ? 'white' : 'var(--text-secondary)',
                              padding: '4px 8px',
                              fontSize: '10px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Right Column: Availability & Challenges */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
              backgroundColor: 'white',
              border: '1px solid var(--border-cream)',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ⏱️ Availability
              </h3>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label" style={{ fontSize: '11px' }}>Weekday Hours (Est.)</label>
                <select
                  className="form-input"
                  value={weekdayHours}
                  onChange={e => setWeekdayHours(e.target.value)}
                >
                  <option value="1 - 3 hours">1 - 3 hours</option>
                  <option value="3 - 5 hours">3 - 5 hours</option>
                  <option value="5 - 10 hours">5 - 10 hours</option>
                  <option value="10+ hours">10+ hours</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '11px' }}>Weekend Hours (Est.)</label>
                <select
                  className="form-input"
                  value={weekendHours}
                  onChange={e => setWeekendHours(e.target.value)}
                >
                  <option value="1 - 3 hours">1 - 3 hours</option>
                  <option value="3 - 5 hours">3 - 5 hours</option>
                  <option value="5 - 10 hours">5 - 10 hours</option>
                  <option value="10+ hours">10+ hours</option>
                </select>
              </div>
            </div>

            <div style={{
              backgroundColor: 'white',
              border: '1px solid var(--border-cream)',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                💡 Main Challenge
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {challengeOptions.map(c => {
                  const isChecked = selectedChallenges.includes(c);
                  return (
                    <div key={c} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="checkbox"
                        id={`challenge-${c}`}
                        checked={isChecked}
                        onChange={() => handleToggleChallenge(c)}
                        style={{ width: '14px', height: '14px' }}
                      />
                      <label htmlFor={`challenge-${c}`} style={{ fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        {c}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-cream)', marginTop: '40px', paddingTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={handleBack}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Back
          </button>
          <button
            onClick={handleCreateProfile}
            style={{
              backgroundColor: 'var(--brand-primary)',
              color: 'white',
              border: 'none',
              padding: '10px 24px',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Complete Profile →
          </button>
        </div>
      </div>
    );
  };

  // Step 5 Layout: Review Profile (Side navigation with summary)
  const renderStep5 = () => {
    const formattedSkills = Object.entries(selectedSkills).map(([skill, lvl]) => `${skill} (${lvl})`);

    return (
      <div style={{ width: '100%', display: 'flex', gap: '32px' }}>
        {/* Left Navigation Sidebar */}
        <div style={{ width: '180px', borderRight: '1px solid var(--border-cream)', paddingRight: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '4px' }}>Registration</h3>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Complete your profile</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Account', icon: '👤', active: false },
              { label: 'Education', icon: '🎓', active: false },
              { label: 'Career', icon: '💼', active: false },
              { label: 'Skills', icon: '📊', active: false },
              { label: 'Review', icon: '⚙️', active: true }
            ].map(item => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  backgroundColor: item.active ? 'var(--brand-primary)' : 'transparent',
                  color: item.active ? 'white' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '12px'
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Content Area: Summary Card */}
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '6px' }}>Review Your Profile</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Please review your Techora profile summary before finalizing your registration.
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            border: '1px solid var(--border-cream)',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '24px'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '20px', borderBottom: '1px solid var(--border-cream)', paddingBottom: '12px' }}>
              Your Techora Profile
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '2px' }}>Full Name</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--brand-primary)' }}>{fullName || 'Alex Mercer'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '2px' }}>Email Address</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--brand-primary)' }}>{uniEmail || 'alex.mercer@example.com'}</div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-cream)', paddingTop: '16px' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Education</div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '16px' }}>🎓</span>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand-primary)' }}>{university || 'University of Colombo'}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{degree || 'BSc Computer Science'}</div>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-cream)', paddingTop: '16px' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Career Goal</div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ fontSize: '16px' }}>💼</span>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand-primary)' }}>{careerDirection}</div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-cream)', paddingTop: '16px' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>Technical Skills</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {formattedSkills.length > 0 ? formattedSkills.map(s => (
                    <span key={s} style={{
                      backgroundColor: '#FCFAF7',
                      border: '1px solid var(--border-cream)',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--text-secondary)'
                    }}>{s}</span>
                  )) : (
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>No skills selected</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setStep(4)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '13px'
              }}
            >
              Back to Skills
            </button>
            <button
              type="button"
              onClick={handleCreateProfile}
              style={{
                backgroundColor: 'var(--brand-primary)',
                color: 'white',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              Create My Techora Account
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderSuccess = () => (
    <div className="success-card" style={{ padding: '60px 20px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '520px',
        padding: '50px 40px',
        boxShadow: '0 20px 40px rgba(66, 75, 84, 0.08), 0 1px 3px rgba(66, 75, 84, 0.04)',
        border: '1px solid rgba(229, 210, 205, 0.5)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative background glows */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(213, 172, 169, 0.3) 0%, rgba(255,255,255,0) 70%)',
          filter: 'blur(20px)',
          zIndex: 0
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-10%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(235, 207, 178, 0.3) 0%, rgba(255,255,255,0) 70%)',
          filter: 'blur(20px)',
          zIndex: 0
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Celebratory Check Mark Circle */}
          <div style={{
            background: 'linear-gradient(135deg, #B38D97 0%, #D5ACA9 100%)',
            color: 'white',
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            margin: '0 auto 28px auto',
            boxShadow: '0 8px 20px rgba(179, 141, 151, 0.3)',
          }}>
            ✓
          </div>

          <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-primary)', marginBottom: '12px', letterSpacing: '-0.5px' }}>
            Welcome Aboard!
          </h2>
          
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '32px', padding: '0 10px' }}>
            Hi <strong>{fullName}</strong>, your student profile has been successfully created. Your personalized path to becoming a <strong>{careerDirection}</strong> is now initialized. We wish you all the best for your career journey!
          </p>

          {/* Onboarding Complete Stat Card */}
          <div style={{
            backgroundColor: '#FCFAF7',
            border: '1px solid var(--border-cream)',
            borderRadius: '16px',
            padding: '18px 24px',
            marginBottom: '36px',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Onboarding Status</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--brand-primary)' }}>Profile 100% Prepared</div>
            </div>
            <span style={{ fontSize: '24px' }}>🚀</span>
          </div>

          <button
            className="onboarding-primary-btn"
            onClick={handleFinish}
            style={{
              width: '100%',
              backgroundColor: 'var(--brand-primary)',
              color: 'white',
              border: 'none',
              padding: '16px',
              borderRadius: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '15px',
              boxShadow: '0 4px 12px rgba(66, 75, 84, 0.15)',
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="onboarding-container" style={{ minHeight: '100vh', display: 'flex' }}>
      {renderLeftPanel()}
      <div className="onboarding-right" style={{ flex: 1, backgroundColor: 'white', padding: '40px 6%' }}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderStep5()}
        {step === 6 && renderSuccess()}
      </div>
    </div>
  );
}

export default RegisterPage;
