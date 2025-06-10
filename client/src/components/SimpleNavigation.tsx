interface NavigationProps {
  children: React.ReactNode;
}

export function SimpleNavigation({ children }: NavigationProps) {
  return <div>{children}</div>;
}

export const navigateToPage = (path: string) => {
  window.location.href = path;
};

export const Link = ({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) => {
  return (
    <a 
      href={to} 
      className={className}
      onClick={(e) => {
        e.preventDefault();
        navigateToPage(to);
      }}
    >
      {children}
    </a>
  );
};