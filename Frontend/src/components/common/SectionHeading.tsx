interface SectionHeadingProps {
  title: string;
  description: string;
  subtitle?: string;
}

export function SectionHeading({ title, description, subtitle }: SectionHeadingProps) {
  return (
    <div className="challenge-header">
      {subtitle && <div className="section-subtitle">{subtitle}</div>}
      <h2 className="challenge-title">{title}</h2>
      <p className="challenge-description">{description}</p>
    </div>
  );
}
