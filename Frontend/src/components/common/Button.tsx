import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'cta' | 'cta-primary' | 'cta-secondary';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const getClassName = () => {
    switch (variant) {
      case 'primary':
        return 'primary-btn';
      case 'secondary':
        return 'secondary-btn';
      case 'cta':
        return 'cta-btn';
      case 'cta-primary':
        return 'cta-primary-btn';
      case 'cta-secondary':
        return 'cta-secondary-btn';
      default:
        return 'primary-btn';
    }
  };

  return (
    <button className={`${getClassName()} ${className}`} {...props}>
      {children}
    </button>
  );
}
