const SemiWebpackPlugin = require("@douyinfe/semi-webpack-plugin").default;

module.exports = {
  plugins: [
    new SemiWebpackPlugin({
      theme: "@semi-bot/semi-theme-feishu-dashboard",
      include: "~@semi-bot/semi-theme-feishu-dashboard/scss/local.scss",
    }),
  ],
};
