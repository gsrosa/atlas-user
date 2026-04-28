/* eslint-disable */
const path = require('path');
const webpack = require('webpack');
const { ModuleFederationPlugin } = require('webpack').container;
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  return {
    mode: isProd ? 'production' : 'development',
    entry: './src/main.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[contenthash].js',
      chunkFilename: '[name].[contenthash].js',
      publicPath: 'auto',
      clean: true,
    },
    devServer: {
      port: 3003,
      historyApiFallback: true,
      hot: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store',
      },
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NEXT_PUBLIC_API_URL': JSON.stringify(process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'),
      }),
      new ModuleFederationPlugin({
        name: 'userApp',
        filename: 'remoteEntry.js',
        exposes: {
          './App': './src/bootstrap.tsx',
          './Skeleton': './src/skeleton.tsx',
          './ProfileLayout': './src/features/users/profile-layout.tsx',
          './ProfileAboutPage': './src/features/users/components/profile-page.tsx',
          './ProfilePasswordPage': './src/features/users/components/password-page.tsx',
          './ProfilePreferencesPage': './src/features/users/components/preferences-page.tsx',
        },
        shared: {
          react: {
            singleton: true,
            requiredVersion: '^19.0.0',
            strictVersion: false,
            eager: false,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: '^19.0.0',
            strictVersion: false,
            eager: false,
          },
          '@gsrosa/nexploring-ui': {
            singleton: true,
            requiredVersion: false,
            strictVersion: false,
          },
          'lucide-react': {
            singleton: true,
            requiredVersion: '^1.7.0',
            strictVersion: false,
          },
          'react-router-dom': {
            singleton: true,
            requiredVersion: '^7.0.0',
            strictVersion: false,
          },
          '@tanstack/react-query': {
            singleton: true,
            requiredVersion: '^5.0.0',
            strictVersion: false,
          },
          '@trpc/client': {
            singleton: true,
            requiredVersion: '^11.0.0',
            strictVersion: false,
          },
          '@trpc/tanstack-react-query': {
            singleton: true,
            requiredVersion: '^11.0.0',
            strictVersion: false,
          },
        },
      }),
      new HtmlWebpackPlugin({
        template: './index.html',
      }),
    ],
  };
};
