/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary-deep-blue': '#0f172a',        // Used for background, text, borders
        'primary-white': '#f8fafc',            // Used for background, text
        'primary-light-gray': '#e2e8f0',       // Used for text
        'primary-medium-gray': '#cbd5e1',      // Used for borders, text
        'primary-dark-gray': '#475569',        // Used for text
        'primary-slate-gray': '#64748b',       // Used for text
        'primary-charcoal': '#334155',         // Used for text
        'secondary-light-blue': '#94a3b8',   // Used for 'no data' placeholdertext

        // Accent Colors
        'accent-purple': '#af6faee6',          // Used as main accent color for buttons, headings
        'accent-purple-border': 'rgba(175, 111, 174, 0.65)', // Used for border colors
        
        
        // Status Colors
        'status-blue': '#0284c7',              // Used for "Get in touch" heading
        'status-blue-light': '#dbeafe',        // Used for location card background
        
        // White/Transparent Variants
        'white-08': 'rgba(255, 255, 255, 0.08)', // Used for border bottom
        'white': '#fff',                       // Used for text, backgrounds
        'transparent': 'transparent',          // Used as background

        // Background Variants
        'bg-light-blue': '#f1f5f9',            // Used for phone/location cards
        'bg-dark-blue': '#1e293b',             // Used for testimonial cards
        'bg-white': '#fff',                    // Used for service cards, form
        
        // Shadow Colors (for boxShadow)
        'shadow-dark': 'rgba(15, 23, 42, 0.24)',
        'shadow-light': 'rgba(15, 23, 42, 0.08)',
        'shadow-medium': 'rgba(15, 23, 42, 0.1)',
        'shadow-strong': 'rgba(15, 23, 42, 0.22)',
        
        // Gradient Colors
        'gradient-dark-start': 'rgba(15, 23, 42, 0.18)',
        'gradient-dark-end': 'rgba(15, 23, 42, 0.82)',
        'gradient-blue-1': 'rgba(59, 130, 246, 0.18)',
        'gradient-blue-2': 'rgba(14, 165, 233, 0.14)',
        'gradient-white': 'rgba(255, 255, 255, 0.35)',
        'gradient-gray': 'rgba(148, 163, 184, 0.28)',
      }
    },
  },
  plugins: [],
}

