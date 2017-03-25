var express = require('express');
var router = express.Router();
var passport = require('passport'); // include passport
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// Register
router.get('/register', function(req, res){
	res.render('register');
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});

// Register User
router.post('/register', function(req, res){
	
	//get data from the register form
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	//console.log(name);
	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors(); // fucntion to check errors

	if(errors){
		//if errors are there then we get back to register page and display errors
		res.render('register',{
			errors:errors // this basicall
		});
	} else { 

		// if there are no errors in the registration form 
		var newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password
		});
       // here User is the model in user.js

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		console.log(name);

		//for below flash code we have also places a placeholder in layout.handler 
		req.flash('success_msg','Hi ' + name + '   Registration complete! You have to now login');

		res.redirect('/users/login');
	}
});

// for authentication we will use passport

//Below fucntion gets the username and matches it and validates the password
passport.use(new LocalStrategy(
  function(username, password, done) {

  	//call the model function 
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		// if there is not a match then we do this 
   		return done(null, false, {message: 'User not found'});
   	}

 // now we will compare the password
   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			// Password matched 
   			return done(null, user);
   		} else {
   			// wrong password
   			return done(null, false, {message: 'Enter the correct password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

// post request for /login
router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true})); 
//suucessredirect and failure redirect are basically route options on success or failure


router.get('/logout', function(req, res){
	req.logout();
//	console.log("i am in logout");
	req.flash('success_msg', 'Log Out Successfull');

// after logout go to login page
	res.redirect('/users/login');
});

module.exports = router;