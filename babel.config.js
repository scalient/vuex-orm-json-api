module.exports = {
  presets: ["@babel/preset-env"],
  plugins: [
    [
      require("@babel/plugin-proposal-class-properties").default,
      {
        loose: true
      }
    ]
  ]
};
