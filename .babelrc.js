module.exports = {
    "presets": [
        ["@babel/preset-env", {
            "useBuiltIns": "entry",
            "corejs": "3.9",
            "targets": {
                "esmodules": true
            }
        }]
    ],
    "plugins": [
        "@babel/plugin-syntax-dynamic-import",
        ["@babel/plugin-proposal-decorators", { "legacy": true }],
        ["@babel/plugin-proposal-class-properties", { "loose": true }]
    ]
}
