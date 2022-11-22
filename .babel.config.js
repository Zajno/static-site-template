module.exports = {
    presets: [
        ["@babel/preset-env", {
            useBuiltIns: "entry",
            corejs: "3.26",
            targets: {
                esmodules: true,
            },
            loose: false,
            exclude: [
                'proposal-dynamic-import',
            ],
        }]
    ],
    comments: false,
}
