import * as Path from 'path';
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import SitemapPlugin from 'sitemap-webpack-plugin';
import * as helpers from './webpack.helpers';
import * as AppConfig from './app/config';
import * as sitemapData from './app/sitemap';

/* eslint-disable no-console */
/* global process */

const pathResolve = helpers.pathResolve;

type GeneratorFilename = webpack.Configuration['output']['assetModuleFilename'];

const siteConfig = (env: any): webpack.Configuration => {
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

    const htmlBuilder = new helpers.HtmlBuilder(isProd);

    return {
        devtool: isProd ? undefined : 'inline-source-map',
        entry: sitemapData.ApplicationEntryPoints,
        output: {
            publicPath: publicPath,
            path: outputPath,
            filename: isProd ? '[name].[contenthash:6].js' : '[name].js',
            chunkFilename: isProd ? '[chunkhash:6].[id].js' : '[name].[id].js',
            assetModuleFilename: `assets/[${isProd ? 'contenthash:6' : 'name'}][ext][query]`,
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
                    test: /\.(html|ejs)$/,
                    loader: 'underscore-template-loader',
                    options: {
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
                    test: /\.css$|\.sass$|\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader', 'postcss-loader', 'sass-loader',
                    ],
                },
                {
                    test: /\.(png|jpg|gif|webp|ico)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: `assets/img/[${isProd ? 'contenthash:6' : 'name'}][ext][query]`,
                    },
                },
                {
                    test: /\.(svg)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: `assets/img/[${isProd ? 'contenthash:6' : 'name'}][ext][query]`,
                    },
                    use: [{
                        loader: 'svgo-loader',
                        options: {
                            configFile: pathResolve('./svgo.config.js'),
                        },
                    }],
                },
                {
                    resourceQuery: /inline/,
                    type: 'asset/source',
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: `assets/fonts/[${isProd ? 'contenthash:6' : 'name'}][ext][query]`,
                    },
                },
                {
                    test: /\.(webm|mp4|ogv)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: `assets/video/[${isProd ? 'contenthash:6' : 'name'}][ext][query]`,
                    },
                },
                {
                    test: /\.mp3$|\.wav$/,
                    type: 'asset/resource',
                    generator: {
                        filename: `assets/audio/[${isProd ? 'contenthash:6' : 'name'}][ext][query]`,
                    },
                },
                {
                    test: /lottie[\\/].*\.json$/,
                    type: 'asset/resource',
                    generator: {
                        filename: <GeneratorFilename>((path) => {
                            const pp = Path.parse(path.filename);
                            const i = pp.dir.indexOf('lottie');
                            const relPath = pp.dir.substring(i);
                            const result = Path.join('assets', relPath, `[${isProd ? 'contenthash:6' : 'name'}][ext][query]`);
                            // console.log('LOTTIE JSON', path.filename, '=>', result);
                            return result;
                        }),
                    },
                },
                {
                    test: /\.glsl$/,
                    type: 'asset/source',
                },
                {
                    test: /browserconfig\.xml$|\.webmanifest/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'assets/[name][ext][query]',
                    },
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
                        APP_ENV: JSON.stringify(
                            AppConfig.APP_ENV || 'development',
                        ),
                        APP_CONFIG: JSON.stringify(
                            AppConfig.CurrentConfig,
                        ),
                        COMMON_UTILS_LOGGER: JSON.stringify(AppConfig.CurrentConfig.EnableLogger ? 'console' : false),
                        PUBLIC_PATH_OVERRIDE: JSON.stringify(
                            publicPath,
                        ),
                    },
                },
            }),

            ...sitemapData.PagesFlatten
                .filter(p => !p.skipRender)
                .map(p => htmlBuilder.createHtmlPlugin(p.output.path, p.templateName, p.id, { Page: p })),

            new MiniCssExtractPlugin({
                filename: isProd ? '[name].[contenthash:6].css' : '[name].css',
                chunkFilename: isProd ? '[contenthash:6].[id].css' : '[name].[id].css',
            }),

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
        optimization: {
            runtimeChunk: 'single',
            concatenateModules: false,
            minimize: isProd || fullMinify,
            minimizer: [
                '...',
                new CssMinimizerPlugin(),
            ],
            splitChunks: {
                maxInitialRequests: Infinity,
                minSize: 50000,
                maxSize: 250000,
                chunks(chunk) {
                    return chunk.name !== 'polyfills';
                },
                cacheGroups: {
                    // default: false,
                    npm: {
                        reuseExistingChunk: true,
                    },
                    // Merge all the CSS into one file
                    styles: {
                        name: 'styles',
                        test: /\.s?css$/,
                        chunks: 'all',
                        enforce: true,
                    },
                },

            },
        },
        devServer: {
            contentBase: outputPath,
            compress: true,
            host: '0.0.0.0',
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
