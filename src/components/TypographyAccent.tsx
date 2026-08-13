export const TypographyAccent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  return (
    <p className={`uppercase tracking-[0.2em] text-xs m-0 text-accent-purple ${className || ''}`}>{children}</p>
  );
}