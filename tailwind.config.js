// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores Clean e Modernas
        'primary-blue': '#4F46E5', // Azul Vibrante
        'secondary-gray': '#E5E7EB', // Cinza Claro para fundos
        'text-dark': '#1F2937', // Texto Principal Escuro
        'success-green': '#10B981', // Verde de Sucesso
        'danger-red': '#EF4444', // Vermelho de Perigo
      },
      fontFamily: {
        // Fonte Clean (Exemplo: Inter - já comum no React)
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        // Sombras para dar profundidade de forma sutil
        'custom': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}