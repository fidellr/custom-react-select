import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  splitting: false,
  minify: true, // Minify to keep the injected JS small
  external: ["react", "react-dom"],
  injectStyle: true, // This wraps the CSS in a JS function that injects a <style> tag
});
