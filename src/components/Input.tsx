export const Input: React.FC<{
  name: string;
  value: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  labelClassName?: string;
  required?: boolean;
  children?: React.ReactNode;
}> = ({ name, value, onChange, placeholder, type = "text", className, labelClassName, required, children }) => {
  return (
    <div className="grid gap-2 text-sm">
      <label htmlFor={name} className={labelClassName}>
        {children}
      </label>
      <input
        id={name}
        name={name}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        required={required}
        className={`border rounded-[12px] px-[14px] py-3 w-full ${className}`}
      />
    </div>
  );
}