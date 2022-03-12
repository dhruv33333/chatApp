
const express = require('express');
const app = express();

const path = require('path');

const session = require('express-session');
const flash = require('connect-flash');

//getting the database
const mongoose = require('mongoose');
const db = require('./config/mongoose');

const passport = require('passport');
const LocalStrategy = require('passport-local');

//getting the model
const User = require('./models/user')

const authRoutes = require('./routes/authRoutes');


const http = require('http');
const server = http.createServer(app);

// setting up socket.io
const socketio = require('socket.io');
const { SocketAddress } = require('net');
const io = socketio(server);

//setting up the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//setting up the static files
app.use(express.static(path.join(__dirname , 'assets')));

app.use(express.urlencoded({extended:true}));

sessionConfig = {
    secret: 'weneedsomebettersecret',
    resave: false,
    saveUninitialized: true
}

// MiddleWares

app.use(session(sessionConfig));
app.use(flash());

//setting up the flash middleware
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currectUser = req.user;
    next();
});

//setting up the passport middleware
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// all the routes
app.use(authRoutes);

const users={}    // we make a users object

// if a message is sent we handle that here
io.on('connection', (socket) => {
    
    socket.on('send_msg', (data) => {
        io.emit('recieved_msg', {
            msg: data.msg,
            user: data.user
        })

    });

    socket.on('login', (data) => {
        users[socket.id] = data.user;   
    });

});

// listening on the port
const port = 8000;
server.listen(port, () => {
    console.log('server running at port 8000');
})