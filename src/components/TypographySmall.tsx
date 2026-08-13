export const TypographySmall: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ children, className, ...props }) => {
  return (
    <p className={`text-[14px] leading-[1.4] ${className}`} {...props}>
      {children}
    </p>
  );
}