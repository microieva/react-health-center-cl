export const Checkbox: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  className?: string;
  labelClassName?: string;
}> = ({ checked, onChange, label, className, labelClassName }) => {
  return (
    <label className={`flex items-center gap-2 text-sm ${labelClassName || ''}`}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className={`accent-accent-purple ${className || ''}`}
        />
        {label}
      </label>
  );
}