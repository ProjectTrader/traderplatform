module.exports = function(mongoose){
  var Strategy = mongoose.Schema({
	  rules: [mongoose.Schema.Mixed],
    tags: [String],
		market: {type: mongoose.Schema.ObjectId, ref: 'Market', required: true},
    user: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
    unique_name: {type: String, default: "Strategy (" + (new Date()).toDateString() + ")",  required: true},
		image_url: {type: String, default: '/app/img/stock-small.png'},
		market: {type: mongoose.Schema.ObjectId, ref: 'Market', required: true},
		description: {type: String},
		rate: {type: Number},
    created_at: {type: Date, default: Date.now },
    updated_at: {type: Date, default: Date.now }
  });

  //Strategy.index( { content: "text", tags: "text" } , { name: "StrategyIndex" })

  return mongoose.model('Strategy', Strategy);
};
