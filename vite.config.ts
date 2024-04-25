import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/ncw-web-demo/",
  plugins: [react(), splitVendorChunkPlugin()],
  server: {
    open: false,
    host: 'localhost',
    hmr: true,
  },
  optimizeDeps: {
    exclude: ["@fireblocks/ncw-js-sdk", "tsl-apple-cloudkit"],
  },
});
