'use strict';

angular.module('traderplatform').controller('StrategyListController',
  ['$scope', '$location','$document', 'HistoricalData', 'Shared','Strategy',
  function($scope, $location,$document, HistoricalData, Shared, Strategy){

  $.material.init();
	//Highcharts.setOptions({
	//	global: {
	//		Date: undefined,
	//		VMLRadialGradientURL: "http://code.highcharts.com/highstock/{version}/gfx/vml-radial-gradient.png",
	//		getTimezoneOffset: -4,
	//		timezoneOffset: 0,
	//		useUTC: true
	//	},
	//	lang: {
	//		contextButtonTitle: "Chart context menu",
	//		decimalPoint: ".",
	//		downloadJPEG: "Download JPEG image",
	//		downloadPDF: "Download PDF document",
	//		downloadPNG: "Download PNG image",
	//		downloadSVG: "Download SVG vector image",
	//		invalidDate: undefined,
	//		loading: "Loading...",
	//		months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	//		numericSymbols: ["k", "M", "G", "T", "P", "E"],
	//		printChart: "Print chart",
	//		rangeSelectorFrom: "From",
	//		rangeSelectorTo: "To",
	//		rangeSelectorZoom: "Zoom",
	//		resetZoom: "Reset zoom",
	//		resetZoomTitle: "Reset zoom level 1:1",
	//		shortMonths: {
	//			thousandsSep: " ",
	//			weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
	//		}
	//	}
	//});

		//console.log('GroupController init', $location);

  $scope.strategyList = {};
  $scope.$parent.userStrategies = {};
  $scope.strategyCount = 0;

  $scope.showAlert = false;
  $scope.image_url = ""


  $scope.deleteStrategy = function($event, strategy) {
    strategy.userId = Shared.userId;
    strategy.user = Shared.userId;
    strategy.id = strategy._id
    if(Shared.loggingEnabled) console.log('the group you tried to delete is:', strategy);
    Strategy.remove(strategy);
    removeStrategyFromDom(strategy);
    if($event)$event.stopPropagation()
  }

  /*TODO add to helper (also defined in snippetcontroller) */
  var getIndexBy = function (list, name, value) {
    for (var i = 0; i < list.length; i++) {
      if (list[i][name] == value) {
          return i;
      }
    }
  };

  var removeStrategyFromDom = function(group) {
    var groups = $scope.strategyList.groups
    groups.splice(getIndexBy(groups, "_id", group._id), 1);
  }

  $scope.createStrategy = function () {
    var image_url = $('#image_url_box').val()
    var description = $('#description_box').val()
    var name = $('#name_box').val()
    var strategy = {
      name: name,
      description: description,
      image_url: image_url,
      userId: Shared.userId,
      user: Shared.userId
    }
    if(Shared.loggingEnabled) console.log('creating group:', strategy);
    /*TODO: push the returned JSON
      object back into $scope.strategy_list
      instead of getting them all
      back again */
    Strategy.post(strategy).$promise.then(function(){
      getStrategies();}
    );
    // insertDefaultPicture(group);
    // $scope.strategyList.strategy_list.push(group);
  };

  /* This overrides the default picture setting on the server side.
  It's necessary because otherwise pictures don't show up until the page
  reloads */

  var insertDefaultPicture = function(obj) {
    if (!obj.image_url) {
      obj.image_url = 'app/img/default-code-image.png';
    }
  }

  $scope.shareStrategy = function (group) {
    if(Shared.loggingEnabled) console.log('this group should be shared:', group)
  }

  var hiddenInput = document.getElementById("hidden-input");

  var getStrategies = function(){
    if($scope.$parent.user){
      Strategy.query({userId:$scope.$parent.user._id}).$promise.then(function(strategies){
        $scope.strategyList = strategies;
        $scope.$parent.userStrategies = strategies;
        setTimeout(positionStrategies,200);
        strategies.forEach(function(item){item.rate = item.rate || 0});
      });
    }
  }

  var positionStrategies = function(){
    var vw = $( window ).width();
    //assume standard width of 230
    //TODO move CONSTANTS to top
    var standardSize = 230,
        marginBetweenStrategies = 8,
        //obtain from New HistoricalData element
        topOffset = $("#newStrategyButton").offset().top + $("#newStrategyButton").outerHeight() + 24,
        topMargin = 8,
        previousRowHeights = [],
        currentRowHeights = [],
        topPosition = topOffset,
        leftMargin = $("#newStrategyButton").offset().left,
        leftOffset = 0,
        elementsPerRow = Math.floor((vw - leftMargin)/(standardSize)),
        column = 0;


    $(".strategy-list-item").each(function(index){

      if(column === elementsPerRow){
        //next row
        previousRowHeights = currentRowHeights;
        currentRowHeights = [];
        leftOffset = leftMargin;
        column = 0;
      }

      leftOffset = standardSize*column+marginBetweenStrategies + leftMargin;

      if(previousRowHeights[column]){
        topPosition = previousRowHeights[column] + topMargin;
      }
      console.log($(this).height());
      currentRowHeights.push($(this).height() + topPosition);

      $(this).offset({top: topPosition , left: leftOffset});
      column++;

    });


  }

  $( window ).resize(function() {
    positionStrategies();
  });

  getStrategies();

  $scope.showStrategy = function(id){
    if(Shared.loggingEnabled) console.log($scope.strategyList);
    Shared.groups = $scope.strategyList;
    Shared.currentStrategyId = id;
    $location.path('strategy/'+id );
  }

}]);

// ]
