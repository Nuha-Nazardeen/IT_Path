import logoSvg from '../../assets/images/logo.svg';

interface LogoProps {
  className?: string;
  onNavigate?: (path: string) => void;
}

export function Logo({ className = '', onNavigate }: LogoProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate('/');
    }
  };

  return (
    <a href="/" onClick={handleClick} className={`logo-container ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '0px', textDecoration: 'none' }}>
      <img src={logoSvg} alt="Techora Logo" style={{ height: '120px', width: 'auto', display: 'block', marginRight: '-12px' }} />
      <span style={{ fontWeight: 800, fontSize: '48px', color: 'var(--brand-primary)' }}>Techora</span>
    </a>
  );
}
