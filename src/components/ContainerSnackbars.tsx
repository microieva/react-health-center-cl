export const ContainerSnackbars: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => {
  return (
    <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 ${className}`} {...props}>
      {children}
    </div>
  );
}