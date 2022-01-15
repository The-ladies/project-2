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
const authRouter = require('./routes/auth.routes/auth'); 


mongoose
    .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
    .then((x) => {
        console.log(
            `Connected to Mongo! Database name: "${x.connections[0].name}"`
        );
    })
    .catch((err) => {
        console.error("Error connecting to mongo", err);
    });

const app_name = require("./package.json").name;
const debug = require("debug")(
    `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();
// require('./config/session.config')(app);


// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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

app.use("/", index);
app.use('/', authRouter); 
app.use("/auth", require("./routes/auth.routes/auth"));
//app.use("/tasks", require("./routes/task-routes/task"));
//app.use("/trips", require("./routes/trip-routes/trip"));

module.exports = app;
