/* eslint-disable no-console */
import * as fs from 'fs';
import * as Path from 'path';
import HtmlWebpackPlugin, { MinifyOptions } from 'html-webpack-plugin';
import { WebpackPluginInstance as Plugin } from 'webpack';

/* global __dirname, process */

export function pathResolve(p: string) {
    return Path.resolve(__dirname, p);
}

export class HtmlBuilder {

    readonly htmlMinifyOptions: MinifyOptions | false;

    constructor(minify = false) {
        this.htmlMinifyOptions = minify
            ? {
                removeAttributeQuotes: true,
                collapseWhitespace: true,
                conservativeCollapse: true,
                preserveLineBreaks: true,
                html5: true,
                minifyCSS: true,
                removeComments: true,
                removeEmptyAttributes: true,
            } : false;
    }

    createHtmlPlugin(output: string, templatePath: string, id: string, options = {}) {
        return new HtmlWebpackPlugin({
            filename: output,
            cache: false,
            template: templatePath,
            minify: this.htmlMinifyOptions,
            inject: false,
            chunks: ['polyfills', `${id}`],
            chunksSortMode: 'manual',
            templateParameters: options,
        });
    }

    generateHtmlPlugins(templateDir: string = './app/html/', extensions: string[] = ['html', 'ejs']) {
        const templateFiles = fs.readdirSync(pathResolve(templateDir));

        return templateFiles
            .map(item => {
                const parts = item.split('.');
                const ext = parts.pop();

                if (!extensions.includes(ext)) {
                    return null;
                }
                const name = parts.join().toLowerCase();

                const outputName = name === 'index' ? 'index.html' : `${name}/index.html`;
                const templatePath = pathResolve(`${templateDir}/${item}`);

                return this.createHtmlPlugin(outputName, templatePath, item);
            })
            .filter(p => p);
    }
}

export type PluginOption = {
    name: string,
    plugin: Plugin,
    allowedEnv?: string,
    enabled?: boolean,
};

export function wrapPlugins(plugins: (PluginOption | Plugin)[]): Plugin[] {
    return plugins.map(p => {
        const pp = p as Plugin;
        const po = p as PluginOption;

        if (!po.name || !po.plugin) {
            return pp;
        }

        if (process.argv.indexOf(`--disable-${po.name}-plugin`) >= 0) {
            console.log(`[Webpack Config] Skipping plugin '${po.name}' because it was explicitly disabled by cl args.`);
            return null;
        }

        if (po.allowedEnv && process.env.NODE_ENV !== po.allowedEnv) {
            console.log(`[Webpack Config] Skipping plugin '${po.name}' because it was disabled by NODE_ENV. Allowed = ${po.allowedEnv}, current = ${process.env.NODE_ENV}`);
            return null;
        }

        if (po.enabled !== undefined && typeof po.enabled === 'boolean') {
            if (!po.enabled) {
                console.log(`[Webpack Config] Skipping plugin '${po.name}' because it was explicitly disabled by option.`);
                return null;
            }

            return po.plugin;
        }

        return po.plugin;
    }).filter(pp => pp);
}
