import { presetWind3, presetIcons, defineConfig } from "unocss";

export default defineConfig({
  presets: [presetWind3(), presetIcons()],
  theme: {
    colors: {
      // Text emphasis color
      emphasis: "#002677",
    },
  },
});
