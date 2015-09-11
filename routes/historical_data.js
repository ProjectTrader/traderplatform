var modelProvider = require('../db/models/modelProvider');

var Market = null;
var User = null;
var Strategy = null;

/**
 * Init this router, inject models, etc
 */
exports.init = function(){
	User = modelProvider.request('User');
	Market = modelProvider.request('Market');;
	Strategy = modelProvider.request('Strategy');
}