import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // A stray package-lock.json in the parent directory confuses
  // workspace-root inference; pin it to this project.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
