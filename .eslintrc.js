module.exports = {
    "extends": [
        "@zajno/eslint-config"
    ],
    "parserOptions": {
        "project": "tsconfig.json",
        "sourceType": "module",
    },
    "rules": {
        "proposal/class-property-no-initialized": 0
    }
};
