type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  labelClassName?: string;
};

export const Textarea: React.FC<TextareaProps> = ({children, labelClassName, ...props}) => {
  return (

    <label className={`grid gap-2 text-sm ${labelClassName || ''}`}>
      {children}
      <textarea 
        {...props}
        name="text"
        rows={5} 
        className={`rounded-[12px] border px-[14px] py-3 w-full ${props.className || ''}`}
      />
    </label>
  );
}