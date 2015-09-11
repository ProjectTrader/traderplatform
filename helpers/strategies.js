"use strict";
var CONSTANTS = require('./constants.js');

var httpsHelper = require("./https-helper");
var syncJob = require('./sync_jobs');
var mongooseIds = require('../helpers/mongoose_objectid');
var modelProvider = require('../db/models/modelProvider');
var markets =  require('../helpers/markets');

var Market = null;
var User = null;
var Strategy = null;

/**
 * Init this router, inject models, etc
 */
exports.init = function(){
	markets.init();
	User = modelProvider.request('User');
	Market = modelProvider.request('Market');;
	Strategy = modelProvider.request('Strategy');
}

exports.findOrCreateDefaultStrategiesForGoogle = function(user,callbackSuccess,callbackError){

  var job1 = function(onSuccess, onError){
    findOrCreateDefaultStrategy(user._id,onSuccess,onError);
  }

  syncJob.syncUpJobs([job1], callbackSuccess,callbackError);
}

var findOrCreateDefaultStrategy = function (id, onSuccess, onError) {
	var user = {_id : id};
	var onSuccessCreateStrategy = function (market) {
		var findOptions = {
			user: user._id,
			name: CONSTANTS.STRATEGIES.FOREX_ARBITRAGE_1.name,
			market: market
		}

		var createOptions = createDefaultStrategyOptions(user,market);

		exports.findOrCreateNewStrategy(user, findOptions, createOptions,onSuccess,onError);
	}
	var market = markets.findOrCreateDefaultMarket(onSuccessCreateStrategy,onError);

}

var createDefaultStrategyOptions = function (user,market) {
	return  {
		user: user._id,
		name: CONSTANTS.STRATEGIES.FOREX_ARBITRAGE_1.name,
		description: CONSTANTS.STRATEGIES.FOREX_ARBITRAGE_1.description,
		market: market
	}
}

var findStrategy = function(user,condition, callbackSuccess,callbackError){
  condition.user = (typeof user._id) == "string"? mongooseIds.castToObjectId(user._id): user._id;
  console.log("look for strategy", condition);
  Strategy.findOne(condition, function(err,strategy){
    if(err){
      callbackError(err);
    }else{
      console.log("strategy found", strategy);
      callbackSuccess(strategy);
    }
  });
}

var createStrategy = function(user,options,callbackSuccess,callbackError){
  console.log('create strategy',options);
  Strategy.create(
    options, function(err,strategy){
    if(err){
      callbackError(err);
    }else{
      callbackSuccess(strategy);
    }
  });
}

var findDefaultStrategy = function(user,callbackSuccess,callbackError){
  var condition = {name: CONSTANTS.STRATEGIES.FOREX_ARBITRAGE_1.name, user: user._id};

  findStrategy(user,condition,callbackSuccess,callbackError);
}

var createDefaultStrategy = function(user,callbackSuccess,callbackError){
  var market = markets.findOrCreateDefaultMarket(callbackSuccess,callbackError);
	var options = createDefaultStrategyOptions(user);
	createStrategy(user, options,callbackSuccess,callbackError);
}

exports.findOrCreateNewStrategy = function(user, findOptions, createOptions,callbackSuccess,callbackError){

	var callbackSuccessFind = function(strategy){
		if(strategy == null){
			createStrategy(user, createOptions, callbackSuccess,callbackError);
		}else{
			callbackSuccess(strategy);
		}
	}
	findStrategy(user, findOptions, callbackSuccessFind,callbackError);
}
