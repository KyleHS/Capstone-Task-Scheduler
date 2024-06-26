const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate'); //allows us to include boilerplate content in pages. Eg.  Define Layout Model
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');

//routes
const tasks = require('./routes/tasks');
const users = require('./routes/users');
const { userSchema } = require('./schemas');

mongoose.connect('mongodb://localhost:27017/schedule', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//Checks if there is an error in the Database connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'thisissecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //formula to go from milliseconds to 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//User Login Page
app.use('/users', users);

//New Task page
app.use('/tasks', tasks);
//Overview Page
app.get('/', (req, res) => {
    res.render('Overview');
});


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use( (err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong!'
    res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
    console.log("Open on port 3000");
});