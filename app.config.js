module.exports = () => {
	if (process.env.MY_ENVIRONMENT === 'production') {
		return {
			ios: { bundleIdentifier: 'com.rupakhetibinit.recipetohome' },
			android: { package: 'com.rupakhetibinit.recipetohome' },
			jsEngine: 'hermes',
		};
	} else {
		return {
			ios: { bundleIdentifier: 'dev.com.rupakhetibinit.recipetohome' },
			android: {
				package: 'dev.com.rupakhetibinit.recipetohome',
			},
			jsEngine: 'hermes',
		};
	}
};