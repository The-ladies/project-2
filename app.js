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
const models = require('./models');

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
const { post } = require("./routes/index");
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

app.post('/newpost', function(req, res) {
    const post = models.post.build({
        userId: req.session.userId,
        title: req.body.gabtitle,
        body: req.body.gabbody
    })
    post.save().then(function(post) {
        console.log(post);
    })
})

app.get('/home', function(req, res) {
    models.post.findAll({post}).then(function(posts) {
        res.render('home', {
            posts: posts,
            name: req.session.username
        })
    })
})

// app.get('/newgab', function(req, res) {
//     models.post.findAll().then(function(posts) {
//         res.render('newgab', {
//             posts: posts,
//             name: req.session.username
//         })
//     })
// })

app.post('/home', function(req, res) {
    const post = models.post.build({
        title: req.body.gabtitle = req.session.post,
        body: req.body.gabbody = req.session.post,
    })
    console.log(req.session.post);

    post.save();
    res.redirect('/home')
})

app.post('/likes', function(req, res) {
    const like = models.like.build({
        like: true,
        userId: req.session.userId,
        postId: req.body.submitbtn,
    })
    like.save().then(function(like) {
        console.log(like);
    });
});

app.get('/liked', function(req, res) {
   models.like.findAll({
        include: ({
            model: models.user,
            as: 'user'
        })
    }).then(function(likes) {
        console.log(likes);
        res.render('liked', {
            likes: likes
        })
    });
});


app.use("/", index);
app.use('/', authRouter); 
app.use("/auth", require("./routes/auth.routes/auth"));
// app.use("/comments", require("./routes/comments.routes/comments"));
app.use("/like", require("./routes/like.routes/like"));
// app.use("/liked", require(".routes/like.routes/liked"));
//app.use("/post", require("./routes/post.routes/post"));
// app.use("/user", require("./routes/user.routes/user"));
app.use("/newgab", require("./routes/post.routes/newgab"));

module.exports = app;
