const {getDefaultConfig} = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Remove or override unstable options from Metro defaults
if (config.watcher) {
  delete config.watcher.unstable_lazySha1;
  delete config.watcher.unstable_autoSaveCache;
}

config.transformer.babelTransformerPath = require.resolve(
  'react-native-svg-transformer',
);
config.resolver.assetExts = config.resolver.assetExts.filter(
  ext => ext !== 'svg',
);
config.resolver.sourceExts.push('svg');

module.exports = config;
