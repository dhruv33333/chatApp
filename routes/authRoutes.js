const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');





// router.get('/fakeuser', async(req, res) => {

//     const user = new User({
//         username: 'ashish',
//         email: 'ashish@mail.com'
//     });
//                                                //password
//     const newUser = await User.register(user, 'ashiah@123'); 

//     res.send(newUser);

// });








// Get the signup form
router.get('/register', (req, res) => {
    res.render('auth/signup');
})





// register the new user to the database
router.post('/register', async(req, res) => {

    try{

        // console.log(req.body);

        const {username, email, password} = req.body;


        const user = new User({
            username: username,
            email: email        
        });
                                               
        const newUser = await User.register(user, password); 
        

        req.flash('success', 'Registeration Successful !!!');
    
        res.redirect('/login');

        // res.send(newUser);

        // res.send("POST REQUEST");

        


    }

    catch(e) {
        req.flash('error', 'Same username or email already exists');
        res.redirect('/register');
    }

});








//get the login page
router.get('/login', (req, res) => {
    res.render('auth/login')
})






var usern="";

router.post('/login', 
    passport.authenticate('local', 
        { 
            failureRedirect: '/login', 
            failureFlash: true 
        }), 
        
    (req, res) => {

        const { username } = req.user;
        usern = username;
        req.flash('success', `Welcome Back ${username} Again!!!`)
        
        res.redirect('/startChat');

    });



    router.get('/startChat', (req, res) => {
        if(usern == "") {
            return res.redirect('/login');
        }
        res.render('chat', {
            user: usern
        });
    });
    






router.get('/logout', (req, res) => {
    req.logout();
    usern = "";
    req.flash('success', 'Logout Successfully');
    res.redirect('/');
})


router.get('/', (req, res) => {
    res.render('home');
});

module.exports = router;