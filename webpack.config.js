var path = require('path');

module.exports = {
    target: 'node',
    mode: 'production',
    entry: './src/DataListInput.jsx',
    output: {
        path: path.resolve('lib'),
        library: 'DataListInput',
        libraryTarget: 'umd', //libraryTarget: 'commonjs2'
        filename: 'DataListInput.js',
        globalObject: 'this'
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
        react: 'umd react',
        'react-dom' : 'umd react-dom'
    }
}

