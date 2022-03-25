require("dotenv").config()
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const path = require("path")
const webpack = require("webpack")

module.exports = (_env, argv) => ({
  entry: "./src/index.js",
  target: argv.mode === "production" ? "browserslist" : "web",
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "build"),
    clean: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.API_URL": JSON.stringify(process.env.API_URL),
    }),
    new HtmlWebpackPlugin({
      minify: argv.mode === "production",
      template: "./src/index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx"],
    modules: [path.join(__dirname, "node_modules")],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.(sa|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName:
                  argv.mode === "production" ? "[hash:base64]" : "[local]",
              },
            },
          },
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
  },
  devServer: {
    hot: true,
    https: true,
    proxy: {
      "/api": {
        target: "https://kladr-api.ru",
        secure: false,
        changeOrigin: true,
        pathRewrite: { "^/api": "/api.php" },
      },
    },
  },
})
