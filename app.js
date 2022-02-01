require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const index = require("./routes/index");
const authRouter = require('./routes/auth');
const models = require('./models');
const likes = require('./routes/likes');

mongoose
    .connect(process.env.MONGODB_URI, {useNewUrlParser: true})
    .then((x) => {
        console.log(
            `Connected to Mongo! Database name: "${x.connections[0].name}"`
        );
    })
    .catch((err) => {
        console.error("Error connecting to mongo", err);
    });

const app_name = require("./package.json").name;
const {post} = require("./routes/index");
const axios = require("axios");
const debug = require("debug")(
    `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();
// require('./config/session.config')(app);


// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// Express View engine setup

// app.use(
//     require("node-sass-middleware")({
//         src: path.join(__dirname, "public"),
//         dest: path.join(__dirname, "public"),
//         sourceMap: true,
//     })
// );

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("imag"));
//app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

app.use(
    session({
        secret: "This is my secret and no one elses",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI,
        }),
    })
);

// default value for title local
app.locals.title = "Express - Generated with IronGenerator";

app.use((req, res, next) => {
    app.locals.currentUser = req.session.user ? req.session.user : false;
    next();
});

app.use((req, res, next) => {
    if (app.locals.currentUser) {
        // using a funny API
        axios.get(`https://api.agify.io/?name=${app.locals.currentUser.username}`)
            .then(response => {
                app.locals.currentUser.funnyAge = response.data.age;
            })
            .catch(error => {
                console.log(error);
            })
            .finally(error => {
                next();
            });
    } else {
        next();
    }
});

app.use('/', index);
app.use('/', authRouter);

// Auth
app.use("/auth", require("./routes/auth"));

// Posts
app.use('/posts', require("./routes/posts"));

//Comments
app.use('/comments', require("./routes/comments"));

//Likes
app.use("/likes", require("./routes/likes"));

// app.use("/user", require("./routes/user.routes/user"));


// Register Helpers
const hb = require('hbs');
const moment = require("moment");

hb.registerHelper('dateFormat', function (date, options) {
    const formatToUse = (arguments[1] && arguments[1].hash && arguments[1].hash.format) || "DD/MM/YYYY"
    return moment(date).format(formatToUse);
});

hb.registerHelper( "when",function(operand_1, operator, operand_2, options) {
    var operators = {
        'eq': function(l,r) { return l == r; },
        'noteq': function(l,r) { return l != r; },
        'gt': function(l,r) { return Number(l) > Number(r); },
        'or': function(l,r) { return l || r; },
        'and': function(l,r) { return l && r; },
        '%': function(l,r) { return (l % r) === 0; }
    }
        , result = operators[operator](operand_1,operand_2);

    if (result) return options.fn(this);
    else  return options.inverse(this);
});

module.exports = app;
