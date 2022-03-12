const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

// Get the signup form
router.get('/register', (req, res) => {
    res.render('signup');
})


// register the new user to the database
router.post('/register', async (req, res) => {

    if (req.body.password != req.body.confirmPassword) {
        req.flash('error', 'Passwords do not match');
        return res.redirect('/register');
    }
    try {

        const { username, email, password } = req.body;


        const user = new User({
            username: username,
            email: email
        });

        const newUser = await User.register(user, password);
        
        req.flash('success', 'Registeration Successful');

        res.redirect('/login');

    }

    catch (e) {
        req.flash('error', 'Same username or email already exists');
        res.redirect('/register');
    }

});

//get the login page
router.get('/login', (req, res) => {
    res.render('login')
})

//user name variable
var usern = "";

//posting the login information after a succesfull login
router.post('/login',
    passport.authenticate('local',
        {
            failureRedirect: '/login',
            failureFlash: true
        }),

    (req, res) => {

        const { username } = req.user;
        usern = username;
        req.flash('success', `Welcome Back ${username} `);
        res.redirect('/startChat');

});


//getting the chat page
router.get('/startChat', (req, res) => {
    if (usern == "") {
        return res.redirect('/login');
    }
    res.render('chat', {
        user: usern
    });
});

//logging out the user and redirecting to the home page
router.get('/logout', (req, res) => {
    req.logout();
    usern = "";
    req.flash('success', 'Logout Successfully');
    res.redirect('/');
})

//rendering the home page
router.get('/', (req, res) => {
    res.render('home');
});

module.exports = router;