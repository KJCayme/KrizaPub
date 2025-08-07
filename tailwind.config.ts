
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
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
				},
				// Semantic section colors
				hero: {
					'bg-start': 'hsl(var(--hero-bg-start))',
					'bg-mid': 'hsl(var(--hero-bg-mid))',
					'bg-end': 'hsl(var(--hero-bg-end))',
					'blob-1': 'hsl(var(--hero-blob-1))',
					'blob-2': 'hsl(var(--hero-blob-2))',
					'blob-3': 'hsl(var(--hero-blob-3))',
					'text-primary': 'hsl(var(--hero-text-primary))',
					'text-secondary': 'hsl(var(--hero-text-secondary))',
					'button-start': 'hsl(var(--hero-button-bg-start))',
					'button-end': 'hsl(var(--hero-button-bg-end))',
				},
				about: {
					'bg-start': 'hsl(var(--about-bg-start))',
					'bg-end': 'hsl(var(--about-bg-end))',
					'text-primary': 'hsl(var(--about-text-primary))',
					'text-secondary': 'hsl(var(--about-text-secondary))',
					'card-bg': 'hsl(var(--about-card-bg))',
					'highlight-start': 'hsl(var(--about-highlight-bg-start))',
					'highlight-end': 'hsl(var(--about-highlight-bg-end))',
				},
				nav: {
					'bg': 'hsl(var(--nav-bg))',
					'text': 'hsl(var(--nav-text))',
					'text-hover': 'hsl(var(--nav-text-hover))',
					'text-active': 'hsl(var(--nav-text-active))',
					'bg-active': 'hsl(var(--nav-bg-active))',
					'bg-hover': 'hsl(var(--nav-bg-hover))',
					'border': 'hsl(var(--nav-border))',
					'button-start': 'hsl(var(--nav-button-bg-start))',
					'button-end': 'hsl(var(--nav-button-bg-end))',
				},
				skills: {
					'bg-start': 'hsl(var(--skills-bg-start))',
					'bg-end': 'hsl(var(--skills-bg-end))',
					'text-primary': 'hsl(var(--skills-text-primary))',
					'text-secondary': 'hsl(var(--skills-text-secondary))',
					'card-bg': 'hsl(var(--skills-card-bg))',
					'card-border': 'hsl(var(--skills-card-border))',
				},
				portfolio: {
					'bg-start': 'hsl(var(--portfolio-bg-start))',
					'bg-end': 'hsl(var(--portfolio-bg-end))',
					'text-primary': 'hsl(var(--portfolio-text-primary))',
					'text-secondary': 'hsl(var(--portfolio-text-secondary))',
					'card-bg': 'hsl(var(--portfolio-card-bg))',
					'card-border': 'hsl(var(--portfolio-card-border))',
					'tag-bg': 'hsl(var(--portfolio-tag-bg))',
					'tag-text': 'hsl(var(--portfolio-tag-text))',
				},
				testimonials: {
					'bg-start': 'hsl(var(--testimonials-bg-start))',
					'bg-end': 'hsl(var(--testimonials-bg-end))',
					'text-primary': 'hsl(var(--testimonials-text-primary))',
					'text-secondary': 'hsl(var(--testimonials-text-secondary))',
					'card-bg': 'hsl(var(--testimonials-card-bg))',
					'star-fill': 'hsl(var(--testimonials-star-fill))',
					'star-empty': 'hsl(var(--testimonials-star-empty))',
				},
				certificates: {
					'bg-start': 'hsl(var(--certificates-bg-start))',
					'bg-end': 'hsl(var(--certificates-bg-end))',
					'text-primary': 'hsl(var(--certificates-text-primary))',
					'text-secondary': 'hsl(var(--certificates-text-secondary))',
					'card-bg': 'hsl(var(--certificates-card-bg))',
				},
				tools: {
					'bg-start': 'hsl(var(--tools-bg-start))',
					'bg-end': 'hsl(var(--tools-bg-end))',
					'text-primary': 'hsl(var(--tools-text-primary))',
					'text-secondary': 'hsl(var(--tools-text-secondary))',
					'card-bg': 'hsl(var(--tools-card-bg))',
					'icon-bg': 'hsl(var(--tools-icon-bg))',
					'icon-text': 'hsl(var(--tools-icon-text))',
				},
				contact: {
					'bg-start': 'hsl(var(--contact-bg-start))',
					'bg-end': 'hsl(var(--contact-bg-end))',
					'text-primary': 'hsl(var(--contact-text-primary))',
					'text-secondary': 'hsl(var(--contact-text-secondary))',
					'form-bg': 'hsl(var(--contact-form-bg))',
					'form-border': 'hsl(var(--contact-form-border))',
				},
				config: {
					'bg-start': 'hsl(var(--config-bg-start))',
					'bg-end': 'hsl(var(--config-bg-end))',
					'text-primary': 'hsl(var(--config-text-primary))',
					'text-secondary': 'hsl(var(--config-text-secondary))',
				},
				funnel: {
					'bg-start': 'hsl(var(--funnel-bg-start))',
					'bg-end': 'hsl(var(--funnel-bg-end))',
					'text-primary': 'hsl(var(--funnel-text-primary))',
					'text-secondary': 'hsl(var(--funnel-text-secondary))',
					'device-bg': 'hsl(var(--funnel-device-bg))',
					'device-bg-active': 'hsl(var(--funnel-device-bg-active))',
					'device-text': 'hsl(var(--funnel-device-text))',
					'device-text-active': 'hsl(var(--funnel-device-text-active))',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'scale-in': {
					'0%': {
						transform: 'scale(0.95)',
						opacity: '0'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'slide-in-left': {
					'0%': {
						opacity: '0',
						transform: 'translateX(-50px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				'slide-in-right': {
					'0%': {
						opacity: '0',
						transform: 'translateX(50px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
				'slide-in-left': 'slide-in-left 0.6s ease-out',
				'slide-in-right': 'slide-in-right 0.6s ease-out'
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		function({ addUtilities }: any) {
			addUtilities({
				'.scrollbar-hide': {
					'-ms-overflow-style': 'none',
					'scrollbar-width': 'none',
					'&::-webkit-scrollbar': {
						display: 'none'
					}
				}
			})
		}
	],
} satisfies Config;
