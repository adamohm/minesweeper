const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssPresetEnv = require('postcss-preset-env');
const path = require('path');

const mode = process.env.NODE_ENV;
const devMode = mode === 'development';

module.exports = {
  mode,
  target: devMode ? 'web' : 'browserslist',
  devtool: devMode ? 'eval-source-map' : 'source-map',
  resolve: {
    alias: {
      '@': path.resolve('src'),
    },
  },
  performance: {
    maxAssetSize: 512000,
  },
  output: {
    path: path.resolve('build'),
    filename: '[contenthash:8].js',
    chunkFilename: '[contenthash:8].js',
    sourceMapFilename: 'maps/[file].map',
    assetModuleFilename: 'assets/[hash:8][ext]',
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      favicon: 'public/favicon.png',
    }),
    new MiniCssExtractPlugin({
      filename: '[contenthash:8].css',
      chunkFilename: '[contenthash:8].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: devMode ? '[name]_[local]' : '[hash:8]',
              },
              sourceMap: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [postcssPresetEnv()],
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        resolve: {
          extensions: ['.js', '.jsx'],
        },
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['react-require'],
            presets: ['@babel/preset-env', '@babel/preset-react'],
            cacheDirectory: true,
          },
        },
      },
    ],
  },
};
