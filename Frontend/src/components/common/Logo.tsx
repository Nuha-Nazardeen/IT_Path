interface LogoProps {
  className?: string;
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <a href="#" className={`logo-container ${className}`}>
      <div className="logo-icon">𝄲</div>
      <span>ITPath</span>
    </a>
  );
}
