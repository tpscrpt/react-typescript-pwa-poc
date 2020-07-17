const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { InjectManifest } = require("workbox-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: { App: path.resolve(__dirname, "../src/index.tsx") },
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
        test: /\.(png|svg|jpg|jpeg|gif|ico|json)$/,
        exclude: /node_modules/,
        use: ["file-loader?name=[name].[ext]"], // ?name=[name].[ext] is only necessary to preserve the original file name
      },
      {
        test: /\.css$/i,
        use: ["style-loader", { loader: "css-loader", options: { importLoaders: 1 } }, "postcss-loader"],
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  output: {
    filename: (thing) =>
      thing.chunk.name === "service-worker" ? "service-worker.bundle.js" : "[name].[contenthash:10].bundle.js",
    path: path.resolve(__dirname, "../build"),
    chunkFilename: "[name].[contenthash:10].chunk.js",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
      filename: path.resolve(__dirname, "../build/index.html"),
    }),
    new InjectManifest({
      swSrc: path.resolve(__dirname, "../src/sw/index.ts"),
      swDest: path.resolve(__dirname, "../build/service-worker.js"),
    }),
    new CopyPlugin({
      patterns: [
        path.resolve(__dirname, "../public/logo192.png"),
        path.resolve(__dirname, "../public/logo512.png"),
        path.resolve(__dirname, "../public/favicon.ico"),
        path.resolve(__dirname, "../public/robots.txt"),
        path.resolve(__dirname, "../public/manifest.json"),
      ],
    }),
  ],
};
