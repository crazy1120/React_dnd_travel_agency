import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  console.log(mode);
  return {
    define: {
      "process.env": {},
    },
    server: {
      port: 3000,
    },
    build: {
      outDir: "build",
    },
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "src"),
      },
    },
    plugins: [react()],
  };
});
