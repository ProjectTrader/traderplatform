var nconf = require('nconf');

// First consider commandline arguments and environment variables, respectively
nconf.argv().env();
// Then load configuration from a designated file.
nconf.file({ file: 'config.json' });

//TODO READ THEM FROM CONFIG FILE
//DEVELOPMENT/PRODUCTION GOOGLE
exports.GOOGLE_CLIENT_ID = nconf.get("google:client_id");
exports.GOOGLE_CLIENT_SECRET = nconf.get("google:client_secret");

exports.PROD_GOOGLE_REDIRECT_URI = nconf.get("google:redirect_uri:production");
exports.DEV_GOOGLE_REDIRECT_URI = nconf.get("google:redirect_uri:development");

exports.MARKETS = {
		FOREX: {
			name: 'FOREX',
			description: "Currentcy 24/7 market"
		},
		NASDAQ: {
			name: 'NASDAQ',
			description: 'U.S. technology stocks'
		}
};

exports.STRATEGIES = {
		FOREX_ARBITRAGE_1: {
			name: 'Forex Complementing Pair Arbitrage',
			rules: [],
			description: 'trade forex pairs'
		}

};



