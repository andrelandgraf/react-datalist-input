var path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/DataListInput.jsx',
    output: {
        path: path.resolve('lib'),
        filename: 'DataListInput.js',
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                use: 'babel-loader'
            },
            {
                test: /^(?!.*?\.module).*\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.module\.css$/,
                use: ['style-loader', {
                    loader: 'css-loader',
                    options: {
                        modules: true
                    }
                }]
            }
        ]
    },
    externals: {
        // Use external version of React
        "react": "React"
    },
}

