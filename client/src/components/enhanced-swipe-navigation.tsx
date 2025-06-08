import { ReactNode } from 'react';

interface EnhancedSwipeNavigationProps {
  children: ReactNode;
  sidebarContent?: ReactNode;
}

// Minimal implementation without hooks to prevent React errors
export function EnhancedSwipeNavigation({ children }: EnhancedSwipeNavigationProps) {
  return (
    <div className="w-full h-full">
      {children}
    </div>
  );
}