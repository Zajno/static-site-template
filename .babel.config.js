module.exports = {
    presets: [
        ["@babel/preset-env", {
            useBuiltIns: "entry",
            corejs: "3.25",
            targets: {
                esmodules: true,
            },
            loose: false,
            exclude: [
                'proposal-dynamic-import',
            ],
        }]
    ],
    plugins: [
        ["@babel/plugin-proposal-decorators", { "legacy": true }],
        ["@babel/plugin-proposal-class-properties", { "loose": false }]
    ],
    comments: false,
}
