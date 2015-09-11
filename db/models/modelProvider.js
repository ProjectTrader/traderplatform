/**
 * Created by gary on 9/6/15.
 */
var modelMap = {};

exports.provide = function(name, model) {
	modelMap[name] = model;
};

exports.request = function (name, model) {
	return modelMap[name];
}
