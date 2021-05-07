module.exports = {
    presets: [
        ["@babel/preset-env", {
            useBuiltIns: "entry",
            corejs: "3.12",
            targets: {
                esmodules: true,
            },
            loose: true,
        }]
    ],
    plugins: [
        "@babel/plugin-syntax-dynamic-import",
        ["@babel/plugin-proposal-decorators", { "legacy": true }],
        ["@babel/plugin-proposal-class-properties", { "loose": true }]
    ]
}
