/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1536px",
        "xl": "1280px",
        "lg": "1024px",
        "md": "768px",
      },
    },
    extend: {
      screens: {
        "2xl": "1536px",
        "xl": "1280px",
        "lg": "1024px",
        "md": "768px",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom Vision Hub colors
        vision: {
          beige: "#f9f5ef",
          ochre: "#e6c28b",
          charcoal: "#333333",
          navy: "#445566",
        },
        // Pastel color palette for badges
        pastel: {
          cream: "#FAEDCB",
          mint: "#C9E4DE", 
          sky: "#C6DEF1",
          lavender: "#DBCDF0",
          rose: "#F2C6DE",
          peach: "#F7D9C4",
          sage: "#D1E7DD",
          green: "#D4EDDA",
          orange: "#F8D7DA",
          pink: "#F8D7DA",
          purple: "#E2D9F3",
          blue: "#D1ECF1",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#333333',
            a: {
              color: '#e6c28b',
              '&:hover': {
                color: '#d4b075',
              },
            },
            h1: {
              color: '#333333',
            },
            h2: {
              color: '#333333',
            },
            h3: {
              color: '#333333',
            },
            h4: {
              color: '#333333',
            },
            strong: {
              color: '#333333',
            },
            code: {
              color: '#333333',
              backgroundColor: '#f9f5ef',
            },
            'pre code': {
              backgroundColor: 'transparent',
            },
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} 