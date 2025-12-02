import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		keyframes: {
			'accordion-down': {
				from: { height: '0', opacity: '0' },
				to: { height: 'var(--radix-accordion-content-height)', opacity: '1' }
			},
			'accordion-up': {
				from: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
				to: { height: '0', opacity: '0' }
			},
			'fade-in': {
				'0%': { opacity: '0', transform: 'translateY(8px)' },
				'100%': { opacity: '1', transform: 'translateY(0)' }
			},
			'fade-out': {
				'0%': { opacity: '1', transform: 'translateY(0)' },
				'100%': { opacity: '0', transform: 'translateY(8px)' }
			},
			'scale-in': {
				'0%': { transform: 'scale(0.96)', opacity: '0' },
				'100%': { transform: 'scale(1)', opacity: '1' }
			},
			'scale-out': {
				'0%': { transform: 'scale(1)', opacity: '1' },
				'100%': { transform: 'scale(0.96)', opacity: '0' }
			},
			'slide-in-left': {
				'0%': { transform: 'translateX(-100%)', opacity: '0' },
				'100%': { transform: 'translateX(0)', opacity: '1' }
			},
			'slide-out-left': {
				'0%': { transform: 'translateX(0)', opacity: '1' },
				'100%': { transform: 'translateX(-100%)', opacity: '0' }
			},
			'slide-in-right': {
				'0%': { transform: 'translateX(100%)', opacity: '0' },
				'100%': { transform: 'translateX(0)', opacity: '1' }
			},
			'slide-out-right': {
				'0%': { transform: 'translateX(0)', opacity: '1' },
				'100%': { transform: 'translateX(100%)', opacity: '0' }
			},
			'slide-in-top': {
				'0%': { transform: 'translateY(-100%)', opacity: '0' },
				'100%': { transform: 'translateY(0)', opacity: '1' }
			},
			'slide-out-top': {
				'0%': { transform: 'translateY(0)', opacity: '1' },
				'100%': { transform: 'translateY(-100%)', opacity: '0' }
			},
			'slide-in-bottom': {
				'0%': { transform: 'translateY(100%)', opacity: '0' },
				'100%': { transform: 'translateY(0)', opacity: '1' }
			},
			'slide-out-bottom': {
				'0%': { transform: 'translateY(0)', opacity: '1' },
				'100%': { transform: 'translateY(100%)', opacity: '0' }
			},
			'pulse-soft': {
				'0%, 100%': { opacity: '1' },
				'50%': { opacity: '0.7' }
			},
			'shimmer': {
				'0%': { backgroundPosition: '-200% 0' },
				'100%': { backgroundPosition: '200% 0' }
			},
			'zoom-in': {
				'0%': { transform: 'scale(1)' },
				'100%': { transform: 'scale(1.15)' }
			}
		},
		animation: {
			'accordion-down': 'accordion-down 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
			'accordion-up': 'accordion-up 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
			'fade-in': 'fade-in 0.3s cubic-bezier(0.32, 0.72, 0, 1) both',
			'fade-out': 'fade-out 0.2s cubic-bezier(0.32, 0.72, 0, 1) both',
			'scale-in': 'scale-in 0.25s cubic-bezier(0.32, 0.72, 0, 1) both',
			'scale-out': 'scale-out 0.2s cubic-bezier(0.32, 0.72, 0, 1) both',
			'slide-in-left': 'slide-in-left 0.3s cubic-bezier(0.32, 0.72, 0, 1) both',
			'slide-out-left': 'slide-out-left 0.25s cubic-bezier(0.32, 0.72, 0, 1) both',
			'slide-in-right': 'slide-in-right 0.3s cubic-bezier(0.32, 0.72, 0, 1) both',
			'slide-out-right': 'slide-out-right 0.25s cubic-bezier(0.32, 0.72, 0, 1) both',
			'slide-in-top': 'slide-in-top 0.3s cubic-bezier(0.32, 0.72, 0, 1) both',
			'slide-out-top': 'slide-out-top 0.25s cubic-bezier(0.32, 0.72, 0, 1) both',
			'slide-in-bottom': 'slide-in-bottom 0.3s cubic-bezier(0.32, 0.72, 0, 1) both',
			'slide-out-bottom': 'slide-out-bottom 0.25s cubic-bezier(0.32, 0.72, 0, 1) both',
			'pulse-soft': 'pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
			'shimmer': 'shimmer 2s linear infinite',
			'enter': 'fade-in 0.3s cubic-bezier(0.32, 0.72, 0, 1) both',
			'exit': 'fade-out 0.2s cubic-bezier(0.32, 0.72, 0, 1) both',
			'zoom-in': 'zoom-in 20s ease-out forwards'
		},
  		fontFamily: {
  			sans: [
  				'Poppins',
  				'ui-sans-serif',
  				'system-ui',
  				'sans-serif',
  				'Apple Color Emoji',
  				'Segoe UI Emoji',
  				'Segoe UI Symbol',
  				'Noto Color Emoji'
  			],
  			serif: [
  				'ui-serif',
  				'Georgia',
  				'Cambria',
  				'Times New Roman',
  				'Times',
  				'serif'
  			],
  			mono: [
  				'ui-monospace',
  				'SFMono-Regular',
  				'Menlo',
  				'Monaco',
  				'Consolas',
  				'Liberation Mono',
  				'Courier New',
  				'monospace'
  			]
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
