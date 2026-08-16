import { ArrowRight } from "lucide-react";

export const OptionCard: React.FC<{
  title: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  onClick: () => void;
}> = ({ title, description, features, icon, onClick }) => {

  const Tag = ({ text }: { text: string }) => (
    <span className="px-2 py-0.5 rounded-full text-xs text-center"
      style={{
        backgroundColor: '#f1f5f9',
        color: '#475569'
      }}>
      {text}
    </span>
  );
  return (
    <button
      onClick={onClick}
      className="group relative p-6 rounded-xl border-2 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] text-left"
      style={{
        backgroundColor: '#ffffff',
        borderColor: '#e2e8f0'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#af6faee6';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(175, 111, 174, 0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e2e8f0';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        {/* Icon */}
        <div className="p-4 rounded-full transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg flex-shrink-0"
            style={{
              backgroundColor: 'rgba(175, 111, 174, 0.08)',
              color: '#af6faee6'
            }}>
          {icon}
        </div>
        
        {/* Content - Title and Description in vertical layout */}
        <div className="flex-1">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-semibold text-center sm:text-left" style={{ color: '#0f172a' }}>
              {title}
            </h3>
            <p className="text-sm text-center sm:text-left" style={{ color: '#64748b' }}>
              {description}
            </p>
          </div>
        </div>
        
        {/* Feature tags - 3 rows horizontal */}
        <div className="flex flex-col gap-1.5 flex-shrink-0">
          {features.map((feature, index) => (
            <Tag key={index} text={feature} />
          ))}
        </div>

        {/* CTA - Unchanged */}
        <div className="flex items-center gap-2 text-sm font-medium transition-all duration-300 group-hover:gap-3 flex-shrink-0"
            style={{ color: '#af6faee6' }}>
          <span>Login</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </button>
  );
};