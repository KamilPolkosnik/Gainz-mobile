const { FileStore } = require('metro-cache');
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

module.exports = {
  ...config,
  transformer: {
    ...config.transformer,
    minifierConfig: {
      compress: {
        passes: 2,
      },
    },
  },
  maxWorkers: 2,
  cacheStores: [
    new FileStore({
      root: path.join(__dirname, 'node_modules/.cache/metro'),
    }),
  ],
  resolver: {
    ...config.resolver,
    assetExts: [...config.resolver.assetExts],
    sourceExts: [...config.resolver.sourceExts],
  },
};