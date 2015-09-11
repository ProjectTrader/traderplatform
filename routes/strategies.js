"use strict";

var CONSTANTS = require('../helpers/constants');
var strategies = require('../helpers/strategies');
var modelProvider = require('../db/models/modelProvider');

var Market = null;
var User = null;
var Strategy = null;


/**
 * Init this router, inject models, etc
 */
exports.init = function(){
	strategies.init();
	User = modelProvider.request('User');
	Market = modelProvider.request('Market');;
	Strategy = modelProvider.request('Strategy');
}

var SearchQuery = function(type, limit, query){
	this.type = type;
	this.limit = limit;
	this.query = query;
}


var handleErrors = function(err, res, msg){
  console.log(err.stack);
  msg = msg || 'Unable to process your request';
  res.status(500).send(msg);
};

var getQueryParams = function(req){
  return new SearchQuery(req.query.type, req.query.limit, req.query.query);
}


//TODO linit this to admins only
exports.getAllStrategies = function(){
  return function(req,res){
    console.log(req.params)
    Strategy.find({}).sort({updated_at: -1}).exec(function(error, strategy){
        if(error){
          handleErrors(error, res);
        }else{

          res.json(strategy);
        }
    });
  }
}


exports.deleteStrategy = function(){
  return function(req,res){
    Strategy.findOneAndRemove(
      {_id: req.params.id}
       ).exec(
      function(error, snippet){
        if(error){
          handleErrors(error, res);
        }else{
          res.json(snippet);
        }
    });
  }
}


exports.findStrategy = function(){
  return function(req,res){
    Strategy.findById(req.params.id).populate('user').exec(
      function(error, strategy){
        if(error){
          handleErrors(err, res);
        }else{
          res.json(strategy);
        }

    });
  }
}


exports.findUserStrategies = function(){
  return function(req,res){
    Strategy.find({user: req.params.user_id}).populate('market').sort({updated_at: -1}).exec(function(error, strategy){
        if(error){
          handleErrors(error, res);
        }else{
          res.json(strategy);
        }

    });
  }
}



exports.createStrategy = function(){
  return function(req,res){
    var callbackError = function(err){
        handleErrors(err,res, "Failed to save the strategy");
    }

    var callbackSuccess = function(snippet){
       processSuccessStrategyOperation(res,snippet, true);
    }

    if(req.body.group){
      //group is resolved, create the snippet
     createStrategyFromRequest(req, res,callbackSuccess,callbackError);
    }else{
      //findOrCreateNewStrategy = function(user, findOptions, createOptions,callbackSuccess,callbackError)
      var callbackSuccessGroupCreate = function(group){
        req.body.group = group._id;
        createStrategyFromRequest(req, res, callbackSuccess,callbackError);
      }

      strategies.findOrCreateUncategorized(req.body.user, callbackSuccessGroupCreate,callbackError);
    }
  }
}

exports.editStrategy = function(){
  return function(req,res){
     var paramsIn = createStrategyMapFromRequest(req);


    Strategy.findOne({_id: req.body._id}).exec(
      function(error,strategy){

        if(error){
          handleErrors(error, res);
        }else{

          var callbackSuccess = function(){
            res.json(strategy);
            createOrUpdateStrategy(strategy);
          }
          updateFieldsOnStrategy(strategy, paramsIn, callbackSuccess);
        }
    });
  }
}

var updateFieldsOnStrategy = function(strategy, paramsIn, callbackSuccess){
  strategy.rules = paramsIn.rules;
  strategy.unique_name = paramsIn.unique_name;
  strategy.tags = paramsIn.tags;
  strategy.updated_at = new Date();
  strategy.save(function(err){
      if(err){
        handleErrors(err,res, "Failed to save the snippet");
      }else{
        callbackSuccess();
      }
    }
  );
}

exports.searchStrategy = function(){
  return function(req,res){
    var searchQuery = getQueryParams(req);
    console.log(searchQuery);
    Strategy.find({user: req.params.id,
                 $text : { $search : searchQuery.query} },
                 function(error, strategies){
        if(error){
          handleErrors(error, res);
        }else{
          res.json(strategies);
        }

    });
  }
}
var createStrategyMapFromRequest = function(req){
   var paramsIn = {
        market: req.body.market,
        user: req.body.user,
        rules: req.body.rules
	  }

    if(req.body.unique_name){
      paramsIn.unique_name = req.body.unique_name;
    }else{
      paramsIn.unique_handle = "New Strategy (" + (new Date()).toDateString() + ")"
    }

    if(req.body.tags){
      paramsIn.tags = req.body.tags;
    }
    console.log("Out parms", paramsIn);
    return paramsIn;
}

var createStrategyFromRequest = function(req,res,callbackSuccess,callbackError){

    var paramsIn = createStrategyMapFromRequest(req);

    console.log("create new snippet",  paramsIn);

    var snippet = Strategy(paramsIn);

    snippet.save(function(err){
      if(err){
        handleErrors(err,res, "Failed to save the snippet");
      }else{
        processSuccessStrategyOperation(res, snippet, true);
      }

    });
}

var createOrUpdateStrategy = function(strategy, isNew){
    if(!isNew){
      isNew = false;
    }
    var callbackSuccess = function(gist){
      console.log("success: updated strategy", gist);
    }

    var callbackError = function(){
      console.log("FAILED: to update strategy", strategy);
    }

    Strategy.findOne({_id: strategy._id}).populate('user').populate('market').exec(

      function(err,snippet){
        console.log("resolve strategy", snippet, err);
        if(!err){
          //TODO update strategy
        }else{
          callbackError(err);
        }
      }
    );
}


var processSuccessStrategyOperation = function(res,strategy, isNew){
  console.log("New Strategy", isNew, strategy);
  res.status(200).send();

  if(!isNew){
    isNew = false;
  }
  createOrUpdateStrategy(strategy, isNew);
}

