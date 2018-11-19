const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const helpers = require('./webpack.helpers');

const sitemapData = require('./app/sitemap');

// eslint-disable-next-line prefer-destructuring
const pathResolve = helpers.pathResolve;

module.exports = env => {
    env = env || {};

    const noClear = env.noclear !== undefined;
    const fullMinify = !!env.fullminify;
    const isProd = process.env.NODE_ENV === 'production';

    const publicPath = env.public_path_override || '/';
    const outputPath = pathResolve('./dist');

    console.log('Webpack config options:', {
        publicPath,
        outputPath,
        noClear,
        fullMinify,
        isProd,
    });

    const htmlBuilder = new helpers.HtmlBuilder(fullMinify);

    return {
        entry: {
            app: './app/js/main.js',
        },
        output: {
            publicPath: publicPath,
            path: outputPath,
            filename: isProd ? '[hash:6].js' : '[name].js',
            chunkFilename: isProd ? '[chunkhash:6].[id].js' : '[name].[id].js',
        },
        resolve: {
            modules: [pathResolve('./app/js'), 'node_modules'],
            alias: {
                app: pathResolve('./app/js/'),
                assets: pathResolve('./app/assets/'),
                styles: pathResolve('./app/styles/'),
            },
        },
        module: {
            rules: [
                {
                    test: /\.svgb$/,
                    loader: 'raw-loader',
                },
                {
                    test: /\.(html|ejs)$/,
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

                    use: [
                        isProd ? MiniCssExtractPlugin.loader : 'style-loader',
                        'css-loader', 'postcss-loader', 'sass-loader',
                    ],
                },
            ],
        },
        plugins: helpers.wrapPlugins([
            {
                name: 'clean',
                plugin: new CleanWebpackPlugin([outputPath], { allowExternal: true }),
                enabled: !noClear,
            },

            new webpack.DefinePlugin({
                process: {
                    env: {
                        NODE_ENV: JSON.stringify(
                            process.env.NODE_ENV || 'development',
                        ),
                        PUBLIC_PATH_OVERRIDE: JSON.stringify(
                            publicPath,
                        ),
                    },
                },
            }),

            ...sitemapData.pagesFlatten.map(p => htmlBuilder.createHtmlPlugin(p.output, p.templateName, { page: p })),

            new MiniCssExtractPlugin({
                filename: isProd ? '[name].[hash:6].css' : '[name].css',
                chunkFilename: isProd ? '[hash:6].[id].css' : '[name].[id].css',
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
            contentBase: outputPath,
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
