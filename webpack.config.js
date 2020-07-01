const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  entry: {
    app: path.join(__dirname, "./src/index.ts"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "public"),
  },
  devServer: {
    contentBase: path.join(__dirname, "public"),
    port: 8080,
    hot: true,
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
};
