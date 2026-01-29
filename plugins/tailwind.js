export default function tailwindPlugin() {
  return {
    name: "docusaurus-tailwind",
    configurePostCss(postcssOptions) {
      postcssOptions.plugins.push("tailwindcss");
      postcssOptions.plugins.push("autoprefixer");
      return postcssOptions;
    },
  };
}
