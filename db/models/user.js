module.exports = function(mongoose){
  var User = mongoose.Schema({
    username: {type: String, required: true, index: {unique:true}},
    email: {type: String, required: true, index: {unique:true}},
    password: {type: String} ,//TODO not used for now as we utilize gmail
    token: {type: String},
    refreshToken: {type: String},
    userType: {type: String, default:"trader"},
    googleId: {type:String},
		created_at: {type: Date, default: Date.now },
		updated_at: {type: Date, default: Date.now }
  });

  return mongoose.model('User', User);
};
