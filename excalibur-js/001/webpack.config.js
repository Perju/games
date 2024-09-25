const path = require("path");
const slash = require("slash");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const nameFn = function (resourcePath, resourceQuery) {
  const dirs = slash(resourcePath).split("/");
  const srcDir = dirs.indexOf("src");
  if (srcDir !== -1) {
    return dirs.slice(srcDir + 1).join("/");
  } else {
    return "js/" + dirs.slice(dirs.length - 1).join("/");
  }
};

module.exports = {
  entry: "./src/ts/index.ts",
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].[contenthash].js",
  },
  optimization: {
    moduleIds: "hashed",
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "excalibur",
          chunks: "all",
        },
      },
    },
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 4000,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        include: [path.resolve(__dirname, "src/ts")],
      },
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
      {
        test: /\.(png|css)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: nameFn,
            },
          },
        ],
      },
      {
        test: /\.json$/,
        use: {
          loader: "file-loader",
          options: {
            name: nameFn,
          },
        },
        type: "javascript/auto",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.ejs",
      filename: "index.html",
    }),
  ],
};
