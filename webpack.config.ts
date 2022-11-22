import * as Path from 'path';
import webpack from 'webpack';
import 'webpack-dev-server';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import HTMLInlineCSSWebpackPlugin from 'html-inline-css-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import SitemapPlugin from 'sitemap-webpack-plugin';
import * as git from 'git-rev-sync';
import * as helpers from './webpack.helpers';
import * as AppConfig from './app/config';
import * as Sitemap from './app/sitemap';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PackageInfo = require('./package.json');

/* eslint-disable no-console */
/* global process */

const pathResolve = helpers.pathResolve;

type GeneratorFilename = webpack.Configuration['output']['assetModuleFilename'];

function castPlugin<T>(plugin: T): webpack.WebpackPluginInstance {
    return plugin as any as webpack.WebpackPluginInstance;
}

const siteConfig = (env: any): webpack.Configuration => {
    env = env || {};

    const noClear = env.noclear !== undefined;
    const isProd = process.env.NODE_ENV === 'production';
    const analyzBundle = !!env.analyze;

    const publicPath = env.public_path_override || '/';
    const outputPath = pathResolve('./dist');

    const getFilename = (n = '[name]') => isProd ? `${n}.[contenthash:6]` : n;

    const RuntimeEnvs = {
        ...helpers.flattenEnvObject({
            // NODE_ENV: process.env.NODE_ENV || 'development',
            APP_ENV: AppConfig.APP_ENV || 'development',
            APP_CONFIG: AppConfig.CurrentConfig,
            APP_VERSION: PackageInfo?.version || '0.0.1',
            APP_NAME: PackageInfo?.name || 'app',
            APP_HASH: process.env.APP_HASH || git.short(),
            PUBLIC_PATH_OVERRIDE: publicPath,
        }, 'process.env', 0),
        process: { env: { } },
    };

    console.log('Webpack config options:', {
        publicPath,
        outputPath,
        noClear,
        isProd,
        RuntimeEnvs,
    });

    const typescriptTranspileOnly = !isProd;

    const htmlBuilder = new helpers.HtmlBuilder(Sitemap.DependenciesPriorities, true);

    const config: webpack.Configuration = {
        devtool: isProd ? undefined : 'source-map',
        entry: Sitemap.ApplicationEntryPoints,
        output: {
            publicPath: publicPath,
            path: outputPath,
            filename: `${getFilename()}.js`,
            chunkFilename: isProd ? '[name].[id].[chunkhash:6].js' : '[name].[id].js',
            assetModuleFilename: `assets/${getFilename()}[ext][query]`,
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.svg', '.png', '.js', '.jsx', '.ejs', '.json', '.html', '.sass', '.scss'],
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
                    resourceQuery: { not: [/raw/] },
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
                                configFile: 'tsconfig.runtime.json',
                                transpileOnly: typescriptTranspileOnly,
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
                    resourceQuery: { not: [/inline/] },
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader',
                        'sass-loader',
                    ],
                },
                {
                    test: /\.css$|\.sass$|\.scss$/,
                    resourceQuery: /inline/,
                    use: [
                        'css-loader',
                        'postcss-loader',
                        'sass-loader',
                    ],
                },
                {
                    test: /\.(png|jpg|gif|webp|ico)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: `assets/img/${getFilename()}[ext][query]`,
                    },
                },
                {
                    test: /\.(svg)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: `assets/img/${getFilename()}[ext][query]`,
                    },
                    use: [{
                        loader: 'svgo-loader',
                        options: {
                            configFile: pathResolve('./svgo.config.js'),
                        },
                    }],
                },
                {
                    resourceQuery: /raw/,
                    type: 'asset/source',
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: `assets/fonts/${getFilename()}[ext][query]`,
                    },
                },
                {
                    test: /\.(webm|mp4|ogv)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: `assets/video/${getFilename()}[ext][query]`,
                    },
                },
                {
                    test: /\.mp3$|\.wav$/,
                    type: 'asset/resource',
                    generator: {
                        filename: `assets/audio/${getFilename()}[ext][query]`,
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
                            const result = Path.join('assets', relPath, `${getFilename()}[ext][query]`);
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
                plugin: castPlugin(new CleanWebpackPlugin()),
                enabled: !noClear,
            },

            new webpack.DefinePlugin(RuntimeEnvs),

            ...Sitemap.PagesFlatten
                .filter(p => !p.skipRender)
                .map(p => htmlBuilder.createHtmlPlugin(p.output.path, p.templateName, p.id, { Page: p })),

            castPlugin(new MiniCssExtractPlugin({
                filename: `${getFilename()}.css`,
            })),

            typescriptTranspileOnly && new ForkTsCheckerWebpackPlugin() as any as webpack.WebpackPluginInstance,

            new HTMLInlineCSSWebpackPlugin({
                filter(fileName) {
                    const result = Sitemap.PagesFlatten.some(p => p.inlineCss && (
                        fileName.includes(p.id) || fileName.includes(Path.basename(p.output.path, 'html'))
                    ));
                    if (result && fileName.includes('css')) console.log(' HTMLInlineCSSWebpackPlugin: a CSS file is going to be inlined: ', fileName);
                    return result;
                },
                styleTagFactory({ style }) {
                    return `<style inlined type="text/css">\n${style}\n</style>`;
                },
                replace: {
                    target: '@inline css here@',
                    removeTarget: true,
                },
            }),

            castPlugin(new CopyWebpackPlugin({
                patterns: [
                    {
                        from: './app/lottie/',
                        to: 'assets/lottie/lottie/',
                        globOptions: { ignore: ['*.json'] },
                        noErrorOnMissing: true,
                    },
                ],
            })),
            new SitemapPlugin({
                base: Sitemap.Hostname,
                paths: Sitemap.SitemapInfo,
            }),

            {
                enabled: analyzBundle,
                name: 'Bundle Analyzer',
                plugin: new BundleAnalyzerPlugin(),
            },
        ]),
        optimization: {
            // runtimeChunk: true,
            // concatenateModules: false,
            minimize: isProd,
            minimizer: [
                '...',
                castPlugin(new CssMinimizerPlugin()),
            ],
            splitChunks: {
                minSize: 0,
                maxSize: Infinity,
                chunks: 'all',
                cacheGroups: {
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true,
                    },
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
            compress: true,
            host: '0.0.0.0',
            port: 8080,
            static: {
                staticOptions: {
                    extensions: [
                        'html',
                    ],
                },
            },
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        },
    };

    return config;
};

export default siteConfig;
