const express = require('express');
const app = express();
const db = require('./db');
const middleware = require('./middleware');
const path = require('path');

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use middleware
app.use(middleware.someMiddleware);

// Define routes
app.get('/', (req, res) => {
  res.render('index');
});

// Start the server
const port = process.env.PORT || 3000;
db.connect().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(err => {
  console.error('Error connecting to database:', err);
});
