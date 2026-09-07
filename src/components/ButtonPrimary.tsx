export const ButtonPrimary: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => {
  return (
    <button 
      {...props}
      disabled={props.disabled}
      className={`
        
        bg-accent-purple 
        px-5 py-[14px] rounded-[12px] 
        cursor-pointer 
        font-semibold 
        border border-accent-purple-border
        transition-colors duration-300 ease-in-out
        ${props.className || ''}
        ${props.disabled ? 'opacity-70 cursor-not-allowed' : ''} 
        `
      }
    >
      {children}
    </button>
  );
};