require('dotenv').config();
const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require('next/constants');
const Dotenv = require('dotenv-webpack');
const fs = require('fs');
const path = require('path');

const nextConfig = {
  cssLoaderOptions: {
    url: false,
  },
  analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
  analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: 'static',
      reportFilename: '../bundles/server.html',
    },
    browser: {
      analyzerMode: 'static',
      reportFilename: '../bundles/client.html',
    },
  },
  webpack: (config, { dev, isServer }) => {
    const conf = config;
    // Fixes npm packages that depend on `fs` module
    conf.node = {
      fs: 'empty',
    };

    conf.plugins = conf.plugins || [];

    conf.plugins = [
      ...conf.plugins,

      // Read the .env file
      new Dotenv({
        path: path.join(__dirname, '.env'),
        systemvars: true,
      }),
    ];

    // Webpack 4 doesn't minify out of the box
    // https://spectrum.chat/?t=9f9f43b8-ec8b-45e5-a8e3-5b57a62e9e67
    if (
      conf.mode === 'production' &&
      Array.isArray(conf.optimization.minimizer)
    ) {
      const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
      conf.optimization.minimizer.push(new OptimizeCSSAssetsPlugin({}));
    }

    return conf;
  },
};

module.exports = (phase) => {
  if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
    const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
    const withSize = require('next-size');
    const withSass = require('@zeit/next-sass');
    const withCSS = require('@zeit/next-css');

    // fix: prevents error when .css files are required by node
    if (typeof require !== 'undefined') {
      require.extensions['.scss'] = (file) => {};
      require.extensions['.css'] = (file) => {};
    }

    return withCSS(withSass(withSize(withBundleAnalyzer(nextConfig))));
  }

  return nextConfig;
};
