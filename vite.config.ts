import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://t1.daumcdn.net",
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
    open: true, //Auto Open new window
  },
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
  ],
});
