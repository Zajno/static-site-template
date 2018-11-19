
module.exports = {
	"extends": ["airbnb"],
	"parser": "babel-eslint",
	"parserOptions": {
		"ecmaVersion": 8,
		"sourceType": "module",
		"ecmaFeatures": {
			"jsx": true,
			"modules": false,
			"globalReturn": false
		}
	},
	"plugins": ["react", "import"],
	"rules": {
		"camelcase": 2,
		"indent": ["warn", 4, { "SwitchCase": 1 }],
		"quotes": [2, "single"],
		"no-unused-vars": 1,
		"no-use-before-define": "warn",
		"no-console": 1,
		"no-continue": 0,
		"no-plusplus": 1,
		"no-tabs": 0,
		"linebreak-style": ["warn", process.platform === 'win32' ? 'windows' : "unix"],
		"react/prop-types": 0,
		"react/jsx-filename-extension": 0,
		"react/no-did-mount-set-state": 0,
		"react/jsx-indent-props": 0,
		"react/jsx-indent": [0, "tab"],
		"react/prefer-stateless-function": "warn",
		"react/sort-comp": 0,
		"prefer-destructuring": 1,
		"jsx-a11y/anchor-is-valid": [ "error", { "components": [ "Link" ], "specialLink": [ "to" ] } ],
		"jsx-a11y/media-has-caption": [ 0 ],
		"prefer-template": 1,
		"react/no-array-index-key": 1,
		"global-require": 1,
		"import/no-unresolved": 1,
		"no-param-reassign": 1,
		"func-names": 0,
		"prefer-arrow-callback": 0,
		"no-underscore-dangle": 0,
		"class-methods-use-this": 1,
		"no-unused-expressions": 1,
		"arrow-parens": 0,
		"nonblock-statement-body-position": 0,
		"curly": 0,
		"padded-blocks": 0,
		"no-multi-spaces": 0,
		"object-shorthand": 1,
		"max-len": [1, { "comments": 150 }],
	},
	"settings": {
		"import/resolver": "webpack"
	},
	"env": {
		"es6": true,
		"node": true,
		"browser": true
	}
};
