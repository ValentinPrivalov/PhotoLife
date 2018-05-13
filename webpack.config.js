const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        app: './public'
    },
    output: {
        path: __dirname + '/public/build',
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(css|less)$/,
                loaders: ['style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000'
            }
        ]
    },
    devtool: "source-map",
    plugins: [
        new CleanWebpackPlugin(['public/build'])
    ]
};
