/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cashmere: "#F4F1EA",
        milk: "#FAF9F5",
        graphite: "#1E1E1E",
        walnut: "#4A3B32",
        oak: "#8C7A6B",
        brass: {
          DEFAULT: "#3D2418",
          soft: "#6B4A3A",
          muted: "rgba(61, 36, 24, 0.4)",
        },
      },
      fontFamily: {
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 24px -8px rgba(30, 30, 30, 0.12), 0 24px 64px -28px rgba(74, 59, 50, 0.28)",
        lift: "0 8px 30px -10px rgba(30, 30, 30, 0.22), 0 28px 70px -36px rgba(74, 59, 50, 0.35)",
        deep: "0 16px 50px -20px rgba(30, 30, 30, 0.45), 0 40px 100px -48px rgba(30, 30, 30, 0.5)",
        brass:
          "0 0 0 1px rgba(61, 36, 24, 0.32), 0 14px 40px -16px rgba(61, 36, 24, 0.38)",
        insetSoft: "inset 0 1px 0 rgba(255,255,255,0.35)",
      },
      backgroundImage: {
        wood:
          "linear-gradient(180deg, rgba(250,249,245,0.1) 0%, rgba(0,0,0,0.14) 100%), linear-gradient(rgba(61,36,24,0.92), rgba(61,36,24,0.92)), url('/images/real/wood-texture.jpg')",
        "grid-brass":
          "linear-gradient(rgba(61,36,24,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(61,36,24,0.12) 1px, transparent 1px)",
        "hero-warm":
          "radial-gradient(ellipse at 20% 30%, rgba(122,90,74,0.18), transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(74,59,50,0.18), transparent 45%), linear-gradient(160deg, #1E1E1E 0%, #4A3B32 55%, #8C7A6B 100%)",
        vignette:
          "radial-gradient(ellipse at center, transparent 40%, rgba(30,30,30,0.45) 100%)",
      },
      backgroundSize: {
        grid: "72px 72px",
        wood: "cover",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
