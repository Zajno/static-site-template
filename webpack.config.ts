import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import tsNameof from 'ts-nameof';
import * as Path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import SitemapPlugin from 'sitemap-webpack-plugin';

import * as helpers from './webpack.helpers';
import * as sitemapData from './app/sitemap';

/* eslint-disable no-console */
/* global process */

const pathResolve = helpers.pathResolve;

const siteConfig = (env: any): webpack.Configuration => {
    env = env || {};

    const noClear = env.noclear !== undefined;
    const fullMinify = !!env.fullminify;
    const isProd = process.env.NODE_ENV === 'production';
    const hmr = env.hmr !== undefined;

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
        devtool: isProd ? undefined : 'inline-source-map',
        entry: sitemapData.ApplicationEntryPoints,
        output: {
            publicPath: publicPath,
            path: outputPath,
            filename: isProd ? '[name].[hash:6].js' : '[name].js',
            chunkFilename: isProd ? '[chunkhash:6].[id].js' : '[name].[id].js',
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.svg', '.png', '.js', '.jsx', '.ejs', '.json', '.html', '.sass'],
            modules: [pathResolve('./app'), 'node_modules'],
            alias: {
                app: pathResolve('./app/scripts/'),
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
                            'div:data-lottie-path',
                            'source:data-srcset',
                        ],
                    },
                },
                {
                    test: /\.tsx?$/,
                    use: [
                        'babel-loader',
                        {
                            loader: 'ts-loader',
                            options: {
                                getCustomTransformers: () => ({ before: [tsNameof] }),
                                configFile: 'tsconfig.json',
                            },
                        },
                    ],
                    exclude: [/node_modules/],
                },
                {
                    test: /\.jsx?$/,
                    use: {
                        loader: 'babel-loader',
                    },
                    exclude: [/node_modules/, /dist/],
                },
                {
                    test: /\.(png|jpg|gif|webp|svg|ico)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                esModule: false,
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
                            esModule: false,
                            name: '[name].[ext]',
                            outputPath: 'assets/video',
                        },
                    }],
                },
                {
                    test: /\.json$/,
                    type: 'javascript/auto',
                    use: [{
                        loader: 'file-loader',
                        options: {
                            esModule: false,
                            name: '[name].[ext]',
                            outputPath: (url, resourcePath) => {
                                const split = resourcePath.split(Path.sep);
                                const page = split[split.length - 3];
                                const section = split[split.length - 2];
                                // console.log('JSON output path', resourcePath, page, section, url);
                                return Path.join('assets', 'bodymovin', page, section, url);
                            },
                        },
                    }],
                },
                {
                    test: /\.css$|\.sass$|\.scss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: { hmr },
                        },
                        'css-loader', 'postcss-loader', 'sass-loader',
                    ],
                },
                {
                    test: /\.glsl$/,
                    use: 'raw-loader',
                },
                {
                    test: /browserconfig\.xml$|\.webmanifest/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            esModule: false,
                            name: '[name].[ext]',
                            outputPath: 'assets',
                        },
                    }],
                },
                {
                    test: /\.mp3$|\.wav$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: isProd ? '[name].[contenthash:5].[ext]' : '[name].[ext]',
                                outputPath: 'assets/sounds',
                            },
                        },
                    ],
                },
            ],
        },
        plugins: helpers.wrapPlugins([
            {
                name: 'clean',
                plugin: new CleanWebpackPlugin(),
                enabled: !noClear,
            },

            new webpack.DefinePlugin({
                process: {
                    env: {
                        NODE_ENV: JSON.stringify(
                            process.env.NODE_ENV || 'development',
                        ),
                        HOSTNAME: JSON.stringify(
                            process.env.HOSTNAME || 'http://localhost',
                        ),
                        PUBLIC_PATH_OVERRIDE: JSON.stringify(
                            publicPath,
                        ),
                    },
                },
            }),

            ...sitemapData.PagesFlatten.map(p => htmlBuilder.createHtmlPlugin(p.output.path, p.templateName, p.id, { page: p })),

            new MiniCssExtractPlugin({
                filename: isProd ? '[name].[hash:6].css' : '[name].css',
                chunkFilename: isProd ? '[hash:6].[id].css' : '[name].[id].css',
            }),

            // {
            //     name: 'minify',
            //     plugin: new MinifyPlugin({}, { comments: false }),
            //     enabled: fullMinify,
            // },

            {
                name: 'minifycss',
                plugin: new OptimizeCssAssetsPlugin(),
                enabled: fullMinify,
            },
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: './app/bodymovin/',
                        to: 'assets/bodymovin/bodymovin/',
                        globOptions: { ignore: ['*.json'] },
                        noErrorOnMissing: true,
                    },
                ],
            }),
            new SitemapPlugin({
                base: sitemapData.Hostname,
                paths: sitemapData.SitemapInfo,
            }),
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

export default siteConfig;
