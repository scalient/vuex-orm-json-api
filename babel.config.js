module.exports = {
  presets: ['@babel/preset-env'],
  plugins: [
    [
      require('@babel/plugin-proposal-class-properties').default,
      {
        loose: true,
      },
    ],
    [
      require('@babel/plugin-proposal-private-methods').default,
      {
        'loose': true,
      },
    ],
    [
      require('@babel/plugin-transform-runtime').default,
      {
        helpers: false,
        regenerator: true,
        corejs: false,
      },
    ],
  ],
};
