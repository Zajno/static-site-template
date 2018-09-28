const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const fs = require('fs');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const wrapPlugins = require('./webpack.wrapPlugins');

module.exports = env => {
    env = env || {};

    const noClear = env.noclear !== undefined;
    const fullMinify = !!env.fullminify;
    const isProd = process.env.NODE_ENV === 'production';

    const PUBLIC_PATH_OVERRIDE = env.public_path_override || '';
    console.log('Webpack config options:', {
        PUBLIC_PATH_OVERRIDE,
        noClear,
        fullMinify,
        isProd,
    });

    function generateHtmlPlugins(templateDir = './app/templates/') {
        const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
        const minifyOptions = fullMinify
            && {
                removeAttributeQuotes: true,
                collapseWhitespace: false,
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
                const name = parts.join().toLowerCase();

                return new HtmlWebPackPlugin({
                    filename: name === 'index' ? item : `${name}/index.html`,
                    cache: false,
                    template: path.resolve(__dirname, `${templateDir}/${item}`),
                    minify: minifyOptions,
                });
            })
            .filter(p => p);
    }

    return {
        entry: {
            app: './app/js/main.js',
        },
        output: {
            publicPath: PUBLIC_PATH_OVERRIDE || '/',
            path: path.join(__dirname, '/dist'),
            filename: isProd ? '[hash:6].js' : '[name].js',
            chunkFilename: isProd ? '[chunkhash:6].[id].js' : '[name].[id].js',
        },
        resolve: {
            modules: [path.resolve('./app/js'), 'node_modules'],
            alias: {
                app: path.resolve(__dirname, 'app/'),
            },
        },
        module: {
            rules: [
                {
                    test: /\.svgb$/,
                    loader: 'raw-loader',
                },
                {
                    test: /\.html$/,
                    loader: 'underscore-template-loader',
                    query: {
                        attributes: [
                            'img:src',
                            'x-img:src',
                            'object:data',
                            'source:src',
                            'img:data-src',
                            'source:data-src',
                            'link:href',
                            'source:srcset',
                            'div:data-bodymovin-path',
                        ],
                    },
                },

                {
                    test: /\.js$/,
                    use: {
                        loader: 'babel-loader',
                    },
                    exclude: [/node_modules/, /dist/],
                },
                {
                    test: /\.(png|jpg|gif|webp|svg|ico|webmanifest)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                outputPath: 'assets/img',
                            },
                        },
                        // , 'image-webpack-loader'
                    ],
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            name: '[hash].[ext]',
                            outputPath: 'assets/fonts',
                        },
                    }],
                },
                {
                    test: /\.(webm|mp4|ogv)$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'assets/video',
                        },
                    }],
                },
                {
                    type: 'javascript/auto',
                    test: /\.json$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'assets/bodymovin',
                        },
                    }],
                },
                {
                    test: /\.css$|\.sass$|\.scss$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        // resolve-url-loader may be chained before sass-loader if necessary
                        use: ['css-loader', 'postcss-loader', 'sass-loader'],
                    }),
                },
            ],
        },
        plugins: wrapPlugins([
            {
                name: 'clean',
                plugin: new CleanWebpackPlugin([path.resolve(__dirname, './dist')], { allowExternal: true }),
                enabled: !noClear,
            },

            new webpack.DefinePlugin({
                process: {
                    env: {
                        NODE_ENV: JSON.stringify(
                            process.env.NODE_ENV || 'development',
                        ),
                        PUBLIC_PATH_OVERRIDE: JSON.stringify(
                            PUBLIC_PATH_OVERRIDE,
                        ),
                    },
                },
            }),

            ...generateHtmlPlugins(),

            new ExtractTextPlugin({
                filename: getPath => getPath(isProd ? '[hash:6].css' : '[name].css'),
                disable: false,
                allChunks: true,
            }),

            {
                name: 'minify',
                plugin: new MinifyPlugin({}, { comments: false }),
                enabled: fullMinify,
            },

            {
                name: 'minifycss',
                plugin: new OptimizeCssAssetsPlugin(),
                enabled: fullMinify,
            },
        ]),
        devServer: {
            contentBase: path.join(__dirname, '/dist'),
            compress: true,
            port: 8080,
            staticOptions: {
                extensions: [
                    'html',
                ],
            },
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        },
    };
};
