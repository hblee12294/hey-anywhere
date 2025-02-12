const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    background: './background.js',
    content: './content.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { 
          from: "manifest.json",
          transform(content) {
            // Remove type: "module" from manifest when copying
            const manifest = JSON.parse(content);
            delete manifest.background.type;
            return JSON.stringify(manifest, null, 2);
          }
        },
        { from: "icon_48.png" },
        { from: "icon_128.png" }
      ],
    }),
  ]
}; 