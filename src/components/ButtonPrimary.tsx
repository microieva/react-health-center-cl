export const ButtonPrimary: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => {
  return (
    <button 
      {...props}
      disabled={props.disabled}
      className={`
        ${props.className || ''}
        bg-accent-purple 
        text-primary-deep-blue 
        px-5 py-[14px] rounded-[12px] 
        cursor-pointer 
        font-semibold 
        hover:bg-transparent
        hover:text-accent-purple
        border border-accent-purple-border
        transition-colors duration-300 ease-in-out
        ${props.disabled ? 'opacity-70 cursor-not-allowed' : ''} 
        `
      }
    >
      {children}
    </button>
  );
};