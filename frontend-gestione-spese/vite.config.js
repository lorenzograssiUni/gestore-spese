import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <--- Aggiungi questo

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(), // <--- E aggiungi questo
    ],
})
