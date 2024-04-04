const express = require('express');
const router2 = express.Router();
const User = require('../models/user');

// Middleware to parse request bodies
const bodyParser = require('body-parser');
router2.use(bodyParser.urlencoded({ extended: true }));

// Route for the registration page
router2.get('/register', async (req, res) => {
    try {
        // Render the registration page
        res.render('scheduler/register', { user: {} }); // Pass an empty object as user data
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// POST /register - Register a new user
router2.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if a user with the same username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            req.flash('error', 'Username or email already exists');
            return res.redirect('/users/register');
        }

        // Create a new user instance
        const newUser = new User({
            username,
            email,
            password // Remember to hash the password before saving
        });

        // Save the new user to the database
        await newUser.save();

        // Redirect the user to the login page upon successful registration
        req.flash('success', 'Registration successful');
        res.redirect('/users/login');
    } catch (error) {
        console.error('Error registering user:', error);
        req.flash('error', 'Failed to register user');
        res.redirect('/users/register');
    }
});



// Route for the login page
router2.get('/login', (req, res) => {
    res.render('scheduler/login', { user: {} }); // Pass an empty object as user data
});

// POST /login - Authenticate user
router2.post('/login', async (req, res) => {
    try {
        // Extract username and password from request body
        const { username, password } = req.body;

        // Find the user with the provided username
        const user = await User.findOne({ username });

        // If user not found, send error response
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Check if the provided password matches the user's password
        const isValidPassword = await user.isValidPassword(password);

        // If password is not valid, send error response
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // If authentication is successful, create a session or token to keep the user logged in
        // For example, you can use sessions with Express Session middleware
        req.session.userId = user._id;

        // Redirect the user to the overview page upon successful login
        res.redirect('/tasks');
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router2;
