module.exports = {
	env: {
		es2021: true,
		node: true,
	},
	extends: ['eslint:recommended', 'plugin:react/recommended', 'prettier'],
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 13,
		sourceType: 'module',
	},
	plugins: ['react'],
	rules: {
		'react/prop-types': 0,
		'no-unused-vars': 'warn',
		'react/no-unescaped-entities': 'off',
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
	globals: { fetch: false },
};
