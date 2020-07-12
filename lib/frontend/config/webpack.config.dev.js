const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { InjectManifest } = require("workbox-webpack-plugin");

module.exports = {
  entry: ["react-hot-loader/patch", path.resolve(__dirname, "../src/index.tsx")],
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
        exclude: /node_modules/,
        use: ["file-loader?name=[name].[ext]"], // ?name=[name].[ext] is only necessary to preserve the original file name
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, "../public"),
    compress: true,
    port: 9000,
    historyApiFallback: true,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      "react-dom": "@hot-loader/react-dom",
    },
  },
  output: {
    filename: "[name].[hash].bundle.js",
    path: path.resolve(__dirname, "../build"),
    chunkFilename: "[name].[contenthash:10].chunk.js",
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
      filename: path.resolve(__dirname, "../build/index.html"),
    }),
    new InjectManifest({
      swSrc: path.resolve(__dirname, "../src/sw/index.ts"),
      swDest: path.resolve(__dirname, "../build/service-worker.js"),
    }),
  ],
};
