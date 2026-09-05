import { type LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

interface Props {
  index: any;
  title: string;
  value?: string;
  trend: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
}

export const StatsGrid = ({icon, index, title, value = '-', trend}: Props) => {
  const Icon = icon;
  const isPositive = trend.startsWith('+');

  return (
    <div
      key={index}
      className="rounded-xl p-4 md:p-3 border transition-all duration-200 hover:shadow-lg group hover:cursor-pointer"
      style={{
        borderColor: 'var(--color-primary-light-gray)'
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-lg transition-all duration-200 group-hover:scale-110" style={{backgroundColor: 'var(--color-primary-light-gray)'}}>
          <Icon className="w-5 h-5 text-[var(--primary-deep-blue)]"/>
        </div>
        <span className={`text-xs font-medium flex items-center gap-1 px-2 py-1 rounded-full bg-[--color-primary-light-gray] ${
          isPositive ? 'text-green-600 ' : 'text-red-600'
        }`}>
          {trend}
        </span>
      </div>
      <h3 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--color-primary-deep-blue)' }}>
        {value}
      </h3>
      <p className="text-xs mt-1 text-end font-bold" style={{ color: 'var(--color-primary-slate-gray)' }}>
        {title}
      </p>
    </div>
  )
}