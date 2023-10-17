const express = require("express");
const app = express();
const PORT = 8080;

// Middleware and configurations
const bodyParser = require("body-parser");
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
app.use(bodyParser.urlencoded({ extended: true })); // Parses the form POST requests
app.set("view engine", "ejs");
app.use(morgan('dev'));
app.use(cookieSession({
  name: 'session',
  keys: ['hamilton', 'biminibonboulash']
}));
app.use(express.static('public')); // Serve static files from the 'public' folder

// Helper functions
const { getUserByEmail, generateRandomString, getUserUrls } = require('./helpers/userHelpers');

// URL and user databases
const urlDatabase = {
  b6UTxQ: { longURL: 'http://www.lighthouselabs.ca', userID: "raijenken27" },
  i3BoGr: { longURL: 'https://www.google.ca', userID: "raijenken27" },
  'a2f747': { longURL: 'https://www.nba.com', userID: "user2RandomID" },
  '3f0037': { longURL: 'https://www.hubrisight.com', userID: "user2RandomID" }
};

const users = {
  "raijenken27": {
    id: "raijenken27", // Change userID to id
    email: "c.jerome.garcia@gmail.com",
    password: 'HelloWorld999'
  },
  "userRandomID": {
    id: 'userRandomID',
    email: 'user@example.com',
    password: 'purple-monkey-dinosaur'
  }
};

// Routes

// Homepage - Redirect to login
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Register Page
app.get('/register', (req, res) => {
  const userID = req.session.user_id; // Should be req.session.user_id
  if (!userID) {
    const templateVars = {
      user: null
    };
    res.render('register', templateVars);
  } else {
    res.redirect('/urls');
  }
});

// Login Page
app.get('/login', (req, res) => {
  const userID = req.session.user_id;
  if (!userID) {
    const templateVars = {
      user: null
    };
    res.render('login', templateVars);
  } else {
    res.redirect('/urls');
  }
});

// Create New URL Page
app.get("/urls/new", (req, res) => {
  const userID = req.session.user_id;
  if (!userID) {
    req.flash('error', 'Please log in or register to use TinyApp!');
    res.redirect('/login');
  } else {
    const user = users[userID];
    if (!user) {
      req.flash('error', 'Please log in or register to use TinyApp!');
      res.redirect('/login');
    } else {
      const templateVars = { user };
      res.render("urls_new", templateVars);
    }
  }
});

// User Dashboard
app.get('/urls', (req, res) => {
  const userID = req.session.user_id;
  if (!userID) {
    req.flash('error', 'Please log in or register to use TinyApp!');
    res.redirect("/login");
  } else {
    const user = users[userID];
    if (!user) {
      req.flash('error', 'Please log in or register to use TinyApp!');
      res.status(403).send('Please log in or register to use TinyApp!');
    } else {
      let urls = getUserUrls(urlDatabase, userID);
      const templateVars = { urls, user };
      res.render('urls_index', templateVars);
    }
  }
});
// ... Other routes ...

app.listen(PORT, () => {
  console.log(`TinyApp is running on PORT: ${PORT}`);
});
