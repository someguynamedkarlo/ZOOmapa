import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Define Vite configuration
export default defineConfig({
  plugins: [react()],
  base: "/", // Use the environment variable or default to '/'
});
