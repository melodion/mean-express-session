var express      = require('express');
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var morgan       = require('morgan');

var app = express();
//app.set('port', 3000);
var port = process.env.PORT || 8000
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    key: 'user_session',
    secret: 'researchsession',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

app.use((req, res, next) => {
    if (req.cookies.user_session && !req.session.username) {
        res.clearCookie('user_session');        
    }
    next();
});
// Function Cek Session
var sessionCek = (req, res, next) => {
    if (req.session.username && req.cookies.user_session) {
        console.log(req.session.username);
        res.redirect('/dashboard');
    } else {
        next();
    }    
};

// Route Home
app.get('/', sessionCek, (req, res) => {
    res.redirect('/login');
});

// Route Log In
app.route('/login')
    .get(sessionCek, (req, res) => {
        res.sendFile(__dirname + '/public/login.html');
    })
    .post((req, res) => {
        var username = req.body.username,
            password = req.body.password;
            console.log("Usernama : "+username);
            console.log("Password : "+password);
            if (username =='alun.itn@gmail.com' && password =='123') {
                req.session.username = username;
                res.redirect('/dashboard');
            }else{
                res.redirect('/login');
            }
    });

//Route Dasboard
app.get('/dashboard', (req, res) => {
    console.log(req.cookies);
    if (req.session.username && req.cookies.user_session) {
         res.sendFile(__dirname + '/public/dasboard.html');
    } else {
        res.redirect('/login');
    }
});

// Route Log Out
app.get('/logout', (req, res) => {
    if (req.session.username && req.cookies.user_session) {
        res.clearCookie('user_session');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

// Route url salah/tidak ada
app.use(function (req, res, next) {
  res.status(404).send("Halaman tidak ada !")
});

// Start Express Server (Port  : 3000)
app.listen(port, function() {
    console.log("App is running on port " + port);
});
