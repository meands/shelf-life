import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    eslint({
      failOnError: false,
      failOnWarning: false,
      include: ["src/**/*.ts", "src/**/*.tsx"],
      exclude: ["node_modules/**", "dist/**"],
      lintOnStart: true,
    }),
  ],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "./src/components"),
      "@routes": path.resolve(__dirname, "./src/routes"),
      "@api": path.resolve(__dirname, "./src/api"),
      "@prisma/client": path.resolve(
        __dirname,
        "../server/node_modules/.prisma/client/index.d.ts"
      ),
      "@types": path.resolve(__dirname, "../server/types"),
      // https://github.com/tabler/tabler-icons/issues/1233#issuecomment-2549771202
      "@tabler/icons-react": "@tabler/icons-react/dist/esm/icons/index.mjs",
    },
  },
  server: {
    hmr: {
      overlay: true,
    },
  },
});
