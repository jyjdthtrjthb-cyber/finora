module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"] ,
  theme: {
    extend: {
      colors: {
        finora: {
          gold: '#D4AF37',
          'gold-light': '#FFF8D6',
          'gold-dark': '#7C4A00'
        },
        accent: {
          savings: '#10B981',
          'savings-light': '#D1FAE5',
          'savings-dark': '#047857',
          goals: '#3B82F6',
          'goals-light': '#DBEAFE',
          'goals-dark': '#1E40AF',
          business: '#8B5CF6',
          'business-light': '#EDE9FE',
          'business-dark': '#5B21B6',
          wisdom: '#F97316',
          'wisdom-light': '#FFEDD5',
          'wisdom-dark': '#9A3412',
          whatif: '#14B8A6',
          'whatif-light': '#CCFBF1',
          'whatif-dark': '#0D9488',
          habit: '#EF4444',
          'habit-light': '#FEE2E2',
          'habit-dark': '#991B1B',
          account: '#6366F1',
          'account-light': '#E0E7FF',
          'account-dark': '#312E81',
          reviews: '#EC4899',
          'reviews-light': '#FCE7F3',
          'reviews-dark': '#9D174D',
          calculator: '#3B82F6',
          'calculator-light': '#DBEAFE',
          'calculator-dark': '#1E40AF'
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'pattern-dots': 'radial-gradient(circle, rgba(212, 175, 55, 0.05) 1px, transparent 1px)',
        'pattern-grid': 'linear-gradient(90deg, rgba(212, 175, 55, 0.03) 1px, transparent 1px), linear-gradient(rgba(212, 175, 55, 0.03) 1px, transparent 1px)'
      },
      backgroundSize: {
        'pattern-dots': '20px 20px',
        'pattern-grid': '20px 20px'
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'medium': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'premium': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'glow-gold': '0 0 20px rgba(212, 175, 55, 0.3)',
        'glow-savings': '0 0 20px rgba(16, 185, 129, 0.3)',
        'glow-goals': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-business': '0 0 20px rgba(139, 92, 246, 0.3)'
      }
    }
  },
  plugins: []
}
