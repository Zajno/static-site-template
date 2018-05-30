const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const fs = require('fs');
const wrapPlugins = require('./webpack.wrapPlugins');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    entry: {
        app: './app/js/main.js'
    },
    output: {
        // publicPath: 'dist/',
        path: path.join(__dirname, '/dist'),
        filename: '[name].bundle.js'
    },
    resolve: {
        modules: [path.resolve('./app'), 'node_modules'],
    },
    externals: {
        jquery: 'jQuery',
        TweenMax: 'TweenMax'
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'underscore-template-loader',
                query: {
                    attributes: ['img:src', 'x-img:src', 'object:data', 'source:src', 'img:data-src', 'source:data-src', 'link:href', 'source:srcset']
                }
            },
            {
                test: /\.js$/,
                use: [{
                    loader: 'babel-loader',
                    options: { presets: ['env', 'react'] },
                }],
                exclude: [/node_modules/, /dist/],
            },
            {
                test: /\.(png|jpg|gif|webp|svg|ico|webmanifest)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'assets/img'
                    }
                }]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[hash].[ext]',
                        outputPath: 'assets/fonts'
                    }
                }]
            },
            {
                test: /\.(webm|mp4|ogv)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'assets/video'
                    }
                }]
            },
            {
                test: /\.sass$|\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    // resolve-url-loader may be chained before sass-loader if necessary
                    use: ['css-loader', 'sass-loader'],
                    // publicPath: '/dist',
                }),
            }
        ]
    },
    plugins: wrapPlugins([
        { 
            name: 'clean',
            plugin: new CleanWebpackPlugin([ path.resolve(__dirname, './dist') ], { allowExternal: true }), 
            allowedEnv: 'production',
        },

        new webpack.DefinePlugin({
            process: {
                env: {
                    NODE_ENV: JSON.stringify(
                        process.env.NODE_ENV || 'development'
                    ),
                },
            },
        }),

        ...generateHtmlPlugins(),

        new ExtractTextPlugin({
            filename: getPath => getPath('[name].css'),
            disable: false,
            allChunks: true
        }),

        {
            name: 'minify',
            plugin: new MinifyPlugin({}, { comments: false }),
            allowedEnv: 'production',
        },

        {
            name: 'minifycss',
            plugin: new OptimizeCssAssetsPlugin(),
            allowedEnv: 'production', 
        }
    ]),
    devServer: {
        contentBase: path.join(__dirname, '/dist'),
        compress: true,
        port: 8080
    }
};

function generateHtmlPlugins(templateDir = './app/templates/') {
    const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
    const minify = process.env.NODE_ENV === 'production' &&
        {
            removeAttributeQuotes: true,
            collapseWhitespace: true,
            html5: true,
            minifyCSS: true,
            removeComments: true,
            removeEmptyAttributes: true,
        };

    return templateFiles
        .map(item => {
            const parts = item.split('.');

            if (parts.pop() !== 'html')
                return null;

            return new HtmlWebPackPlugin({
                filename: item,
                cache: false,
                template: path.resolve(__dirname, `${templateDir}/${item}`),
                minify,
            })
        })
        .filter(p => p);
}