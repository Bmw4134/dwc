import { ReactNode } from 'react';

interface AdaptiveLayoutWrapperProps {
  children: ReactNode;
  className?: string;
}

export function AdaptiveLayoutWrapper({ children, className = '' }: AdaptiveLayoutWrapperProps) {
  // Minimal implementation without hooks to prevent React errors
  return (
    <div className={`w-full ${className}`}>
      {children}
    </div>
  );
}