import { presetWind3, presetIcons, defineConfig } from "unocss";

export default defineConfig({
  presets: [presetWind3(), presetIcons()],
  content: {
    filesystem: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  },
  theme: {
    colors: {
      // Text emphasis color
      emphasis: "#002677",
    },
  },
});
