module.exports = function(mongoose){
  var HistoricalData = mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String},
		resolution: {type: String},
    created_at: {type: Date, default: Date.now },
    updated_at: {type: Date, default: Date.now },
    price_quotes: [mongoose.Schema.Types.Mixed],
		market: {type: mongoose.Schema.ObjectId, ref: 'Market', required: true},
		created_at: {type: Date, default: Date.now },
		updated_at: {type: Date, default: Date.now }
  });

  HistoricalData.index( {name: 1, resolution: 1}, {unique: true} );

  return mongoose.model('HistoricalData', HistoricalData);
};
