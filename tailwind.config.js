/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        fg: "var(--fg)",
        mut: "var(--mut)",
        line: "var(--line)",
        glass: "var(--glass)",
        amb: "var(--amb)",
        cor: "var(--cor)",
        vio: "var(--vio)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      keyframes: {
        spinSlow: {
          to: { transform: "rotate(360deg)" },
        },
        floatPill: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        marquee: {
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "spin-slow": "spinSlow 40s linear infinite",
        "float-pill": "floatPill 7s ease-in-out infinite",
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
}
