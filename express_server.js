const express = require('express');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');

app.use(cookieSession({
  name: 'session',
  keys: ['your-secret-key'],
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
}));

app.use(bodyParser.urlencoded({ extended: true }));

const users = {};

// Sample users database
// Replace this with your actual user database
users['userRandomID'] = {
  id: 'userRandomID',
  email: 'user@example.com',
  password: bcrypt.hashSync('purple-monkey-dinosaur', 10),
};

// Sample URLs database
const urlDatabase = {
  'b2xVn2': { longURL: 'http://www.lighthouselabs.ca', userID: 'userRandomID' },
  '9sm5xK': { longURL: 'http://www.google.com', userID: 'userRandomID' },
};

// Middleware to check if a user is logged in
function requireLogin(req, res, next) {
  if (!req.session.user_id) {
    res.redirect('/login');
  } else {
    next();
  }
}

app.get('/register', (req, res) => {
  res.render('urls_register');
});

app.get('/login', (req, res) => {
  res.render('urls_login');
});

app.get('/urls/new', requireLogin, (req, res) => {
  res.render('urls_new');
});

app.get('/urls/:shortURL', requireLogin, (req, res) => {
  const shortURL = req.params.shortURL;
  const url = urlDatabase[shortURL];

  if (!url) {
    res.status(404).send('Short URL not found');
  } else if (url.userID !== req.session.user_id) {
    res.status(403).send('Access denied');
  } else {
    res.render('urls_show', { url });
  }
});

app.get('/urls', requireLogin, (req, res) => {
  const userURLs = {};

  for (const key in urlDatabase) {
    if (urlDatabase[key].userID === req.session.user_id) {
      userURLs[key] = urlDatabase[key];
    }
  }

  res.render('urls_index', { urls: userURLs });
});

app.post('/register', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send('Email and password are required');
  } else if (Object.values(users).some((user) => user.email === email)) {
    res.status(400).send('Email already in use');
  } else {
    const id = generateRandomString();
    const hashedPassword = bcrypt.hashSync(password, 10);
    users[id] = { id, email, password: hashedPassword };
    req.session.user_id = id;
    res.redirect('/urls');
  }
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = Object.values(users).find((u) => u.email === email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    res.status(403).send('Invalid email or password');
  } else {
    req.session.user_id = user.id;
    res.redirect('/urls');
  }
});

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

function generateRandomString() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
