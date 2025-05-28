/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette cocktail sophistiquée
        cocktail: {
          // Tons ambrés et dorés (comme la tequila)
          amber: {
            50: "#FEF7ED",
            100: "#FDECD3",
            200: "#FAD5A5",
            300: "#F6B76D",
            400: "#F19332",
            500: "#ED7611",
            600: "#DE5A07",
            700: "#B84309",
            800: "#92350F",
            900: "#782D10",
          },
          // Tons terre cuite (esprit mexicain raffiné)
          terracotta: {
            50: "#FDF4F3",
            100: "#FCE7E4",
            200: "#F9D2CE",
            300: "#F4B4AB",
            400: "#EC8B7A",
            500: "#E06B50",
            600: "#CD4F32",
            700: "#AB4025",
            800: "#8D3722",
            900: "#753322",
          },
          // Tons verts naturels (lime, agave)
          sage: {
            50: "#F6F7F6",
            100: "#E3E7E3",
            200: "#C7D0C7",
            300: "#A3B2A3",
            400: "#7A8F7A",
            500: "#5C7360",
            600: "#485A4C",
            700: "#3C4A3F",
            800: "#323D35",
            900: "#2B342E",
          },
          // Tons crème et beige (sophistiqués)
          cream: {
            50: "#FEFDFB",
            100: "#FDF9F3",
            200: "#FAF1E4",
            300: "#F5E6D3",
            400: "#EDD5B7",
            500: "#E1C29F",
            600: "#D2A679",
            700: "#B8935F",
            800: "#967750",
            900: "#7A6244",
          },
        },
        // Couleurs neutres chaleureuses
        warm: {
          50: "#FAFAF9",
          100: "#F5F5F4",
          200: "#E7E5E4",
          300: "#D6D3D1",
          400: "#A8A29E",
          500: "#78716C",
          600: "#57534E",
          700: "#44403C",
          800: "#292524",
          900: "#1C1917",
        },
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
      },
      backgroundImage: {
        // Gradients subtils et élégants
        "cocktail-warm": "linear-gradient(135deg, #FEF7ED 0%, #FDECD3 100%)",
        "cocktail-sunset": "linear-gradient(135deg, #F6B76D 0%, #E06B50 100%)",
        "cocktail-sage": "linear-gradient(135deg, #E3E7E3 0%, #C7D0C7 100%)",
        "cocktail-elegant": "linear-gradient(135deg, #FAF1E4 0%, #F5E6D3 100%)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },
      boxShadow: {
        // Ombres douces et naturelles
        cocktail: "0 4px 20px rgba(237, 118, 17, 0.08)",
        "cocktail-lg": "0 8px 30px rgba(237, 118, 17, 0.12)",
        "cocktail-xl": "0 12px 40px rgba(237, 118, 17, 0.15)",
        warm: "0 4px 20px rgba(224, 107, 80, 0.08)",
        elegant: "0 2px 15px rgba(0, 0, 0, 0.04)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "gentle-bounce": "gentleBounce 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        gentleBounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
      borderRadius: {
        cocktail: "16px",
        "cocktail-lg": "20px",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography"), require("tailwindcss-animate")],
}
