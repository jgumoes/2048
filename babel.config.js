module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',
      "@babel/preset-react",
      ['@babel/preset-env', {targets: {node: 'current'}}],
      '@babel/preset-typescript',
    ],
    env: {
      test: {
        // https://github.com/react-native-community/upgrade-support/issues/152
        plugins: ['@babel/plugin-transform-flow-strip-types'],
      },
    },
  };
};
