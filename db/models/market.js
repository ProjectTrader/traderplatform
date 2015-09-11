module.exports = function(mongoose){
	var Market = mongoose.Schema({
		name: {type: String, required: true},
		description: {type: String},
		created_at: {type: Date, default: Date.now },
		updated_at: {type: Date, default: Date.now }
	});

	Market.index( {name: 1}, {unique: false} );

	return mongoose.model('Market', Market);
};
