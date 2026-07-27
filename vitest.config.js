import { defineConfig } from "vitest/config";
import path from "path";

const mdxPlugin = {
  name: "mdx-mock-plugin",
  transform(code, id) {
    if (id.endsWith(".md") || id.endsWith(".mdx")) {
      return {
        code: 'import React from "react"; export default function MockMDX() { return React.createElement("div", null, "MDX Content"); }',
        map: null,
      };
    }
  },
};

export default defineConfig({
  plugins: [mdxPlugin],
  esbuild: {
    loader: "jsx",
    jsxInject: `import React from 'react'`,
    include: /src\/.*\.[jt]sx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.js"],
  },
  resolve: {
    alias: {
      "@site": path.resolve(__dirname, "./"),
      "@docusaurus/Translate": path.resolve(__dirname, "./src/test/mocks/docusaurusTranslate.js"),
      "@docusaurus/useDocusaurusContext": path.resolve(__dirname, "./src/test/mocks/docusaurusContext.js"),
    },
  },
});
