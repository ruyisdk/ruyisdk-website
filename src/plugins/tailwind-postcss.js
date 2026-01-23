// src/plugins/tailwind-postcss.js
module.exports = function tailwindPostcssPlugin() {
  return {
    name: 'tailwind-postcss',
    configurePostCss(postcssOptions) {
      // Tailwind v4
      postcssOptions.plugins.push(require('@tailwindcss/postcss'));
      postcssOptions.plugins.push(require('autoprefixer'));
      return postcssOptions;
    },
  };
};
