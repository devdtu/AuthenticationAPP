var mongoose = require('mongoose'); // used to setup schema 
var bcrypt = require('bcryptjs'); // to encrypt the password

// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	}
});

// user is the variable used outside this file
var User = module.exports = mongoose.model('User', UserSchema);

// now we will write all the user functions 

//
module.exports.createUser = function(newUser, callback){
	
	// the below code is directly copied form https://www.npmjs.com/package/bcryptjs

	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

// User model function to match username
module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

// User model function to compare password
module.exports.comparePassword = function(candidatePassword, hash, callback){
	
	//hash the entered password and check if it matches
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
	
}