/**
 * Created by gary on 9/7/15.
 */
"use strict";
var CONSTANTS = require('./constants.js');

var httpsHelper = require("./https-helper")
var syncJob = require('./sync_jobs');
var mongooseIds = require('../helpers/mongoose_objectid');
var modelProvider = require('../db/models/modelProvider');

var Market = null;
var User = null;
var Strategy = null;

var marketCache = {};

/**
 * Init this router, inject models, etc
 */
exports.init = function(){
	User = modelProvider.request('User');
	Market = modelProvider.request('Market');;
	Strategy = modelProvider.request('Strategy');
}

exports.findMarket = function(condition, callbackSuccess,callbackError){
	console.log("look for market", condition);
	Market.findOne(condition, function(err,group){
		if(err){
			callbackError(err);
		}else{
			console.log("group found", group);
			callbackSuccess(group);
		}
	});
}

exports.createMarket = function(options,callbackSuccess,callbackError){
	console.log('create market',options);
	Market.create(
		options, function(err,group){
			if(err){
				callbackError(err);
			}else{
				callbackSuccess(group);
			}
		});
}

var findDefaultMarket = function(callbackSuccess,callbackError){
	var condition = {name: CONSTANTS.MARKETS.FOREX.name};

	exports.findMarket(condition,callbackSuccess,callbackError);
}

var createDefaultMarket = function(callbackSuccess,callbackError){
	var options = {
		name: CONSTANTS.MARKETS.FOREX.name,
		description: CONSTANTS.MARKETS.FOREX.description
	}
	exports.createMarket( options,callbackSuccess,callbackError);
}

exports.findOrCreateNewMarket = function( findOptions, createOptions,callbackSuccess,callbackError){

	var callbackSuccessFind = function(group){
		if(group == null){
			createMarket( createOptions, callbackSuccess,callbackError);
		}else{
			callbackSuccess(group);
		}
	}
	exports.findMarket( findOptions, callbackSuccessFind,callbackError);
}

exports.findOrCreateDefaultMarket = function( callbackSuccess,callbackError){

	var callbackSuccessFind = function(market){
		if(market == null){
			createDefaultMarket( callbackSuccess,callbackError);
		}else{
			callbackSuccess(market);
		}
	}
	findDefaultMarket( callbackSuccessFind,callbackError);
}

var getMarketFromCache = function (options) {
	var result = null;
	if (options.id ) {
		result = marketCache[id];
	} else if (options.name) {
		result = marketCache[options.name];
	}

	return result;
}

var addMarketToCache = function (market) {
	marketCache[market.name] = market;
}
