var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Post  = require("./models/post"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    mongoose    = require("mongoose"),
    serveStatic = require("serve-static"),
    cookieParser = require('cookie-parser'),
    csrf = require('csurf'),
    helpers = require("./static/js/requirehelpers");
    
mongoose.Promise = global.Promise;


// Starting the bot.
var bot = require("./bot/bot");


// Requring routes
var commentRoutes = require("./routes/comments"),
    postRoutes = require("./routes/posts"),
    indexRoutes = require("./routes/index"),
    userRoutes = require("./routes/users");

// Connecting to mongoose.
mongoose.connect("mongodb://localhost/afeka_book", {useMongoClient: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//Setting up where the static methods will be.
app.use(express.static(__dirname+"/static"));
// Allowing MethodOverride for PUT and DELETE methods.
app.use(methodOverride("_method"));
// Adding the use of flash messages.
app.use(flash());

// Passport configuration for encrypting the password.
app.use(require("express-session")({
    secret: "Guy and Vadim project",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Adding CSRF protection to the app.
app.use(csrf({ cookie: false }));
app.use(cookieParser());

//Saving variables to locals.
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    var token = req.csrfToken();
    res.cookie('XSRF-TOKEN', token);
    res.locals._csrf = token;
    
    // Allow the use of the function 'checkInFriends' in EJS files.
    res.locals.checkInFriends = helpers.checkInFriendsObj.checkInFriends;
    
    return next();
});

// Express router use.
app.use("/", indexRoutes);
app.use("/friends", userRoutes);
app.use("/posts", postRoutes);
app.use("/posts/:id/comments", commentRoutes);

// Wait for connection.
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("AfekaBook server Has started.\n");
});