export default function unocssPlugin() {
  return {
    name: "docusaurus-unocss",
    configurePostCss(postcssOptions) {
      postcssOptions.plugins.push("@unocss/postcss");
      return postcssOptions;
    },
  };
}
