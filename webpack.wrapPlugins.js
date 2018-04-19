/**
 * @typedef {Object} Plugin 
 */

/**
 * @param {{name:string,plugin:Plugin,allowedEnv:string,enabled:boolean}[]} plugins
 * @returns {Plugin[]}
 */

module.exports = function wrapPlugins(plugins) {
    return plugins.filter(pp => {
        if (!pp.name || !pp.plugin) {
            return true;
        }

        if (process.argv.indexOf(`--disable-${pp.name}-plugin` ) >= 0) {
            console.log(`[Webpack Config] Skipping plugin '${pp.name}' because it was explicitly disabled by cl args.`);
            return false;
        }

        if (pp.allowedEnv && process.env.NODE_ENV !== pp.allowedEnv) {
            console.log(`[Webpack Config] Skipping plugin '${pp.name}' because it was disabled by NODE_ENV. Allowed = ${pp.allowedEnv}, current = ${process.env.NODE_ENV}`);
            return false;
        }

        if (pp.enabled !== undefined && typeof pp.enabled === 'boolean') {
            if (!pp.enabled) {
                console.log(`[Webpack Config] Skipping plugin '${pp.name}' because it was explicitly disabled by option.`);
            }

            return pp.enabled;
        }

        return true;
    }).map(pp => pp.name ? pp.plugin : pp);
}