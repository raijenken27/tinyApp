const express = require("express");
const app = express();
const PORT = 8080;

// Middleware
const bodyParser = require("body-parser");
const morgan = require('morgan');
const cookieSession = require('cookie-session');
app.use(bodyParser.urlencoded({ extended: true })); // Formats the form POST requests
app.set("view engine", "ejs");
app.use(morgan('dev'));
app.use(cookieSession({
  name: 'session',
  keys: ['hamilton', 'biminibonboulash']
}));
app.use(express.static('public')); // Serve static files from the 'public' folder

// URL and user databases
const urlDatabase = {
  b6UTxQ: { longURL: 'http://www.lighthouselabs.ca', userID: "raijenken27" },
  i3BoGr: { longURL: 'https://www.google.ca', userID: "raijenken27" },
  'a2f747': { longURL: 'https://www.nba.com', userID: "user2RandomID" },
  '3f0037': { longURL: 'https://www.hubrisight.com', userID: "user2RandomID" }
};

const users = {
  "raijenken27": {
    id: "raijenken27",
    email: "c.jerome.garcia@gmail.com",
    password: 'HelloWorld999'
  },
  "userRandomID": {
    id: 'userRandomID',
    email: 'user@example.com',
    password: 'purple-monkey-dinosaur'
  }
};

// Middleware function to check if the user is authenticated
const requireLogin = (req, res, next) => {
  const userID = req.session.user_id;
  if (!userID) {
    return res.redirect('/login');
  }

  next(); // Continue to the next middleware or route handler
};

// GET /urls/:shortURL
app.get('/urls/:shortURL', requireLogin, (req, res) => {
  const userID = req.session.user_id;
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];

  if (longURL && longURL.userID === userID) {
    const templateVars = { shortURL, longURL, user: users[userID] };
    res.render('urls_show', templateVars);
  } else if (!longURL) {
    res.status(404).send('URL not found');
  } else {
    res.status(403).send('Access denied');
  }
});

// POST /urls/:shortURL/update
app.post('/urls/:shortURL/update', requireLogin, (req, res) => {
  const userID = req.session.user_id;
  const shortURL = req.params.shortURL;
  const updatedURL = req.body.updatedURL;

  if (urlDatabase[shortURL] && urlDatabase[shortURL].userID === userID) {
    urlDatabase[shortURL].longURL = updatedURL;
    res.redirect('/urls');
  } else {
    res.status(403).send('Access denied');
  }
});

// POST /urls/:shortURL/delete
app.post('/urls/:shortURL/delete', requireLogin, (req, res) => {
  const userID = req.session.user_id;
  const shortURL = req.params.shortURL;

  if (urlDatabase[shortURL] && urlDatabase[shortURL].userID === userID) {
    delete urlDatabase[shortURL];
    res.redirect('/urls');
  } else {
    res.status(403).send('Access denied');
  }
});

// POST /logout
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
});

// ... Other routes ...

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/register', (req, res) => {
  const userID = req.session.user_id;
  if (!userID) {
    const templateVars = {
      user: null
    };
    res.render('register', templateVars);
  } else {
    res.redirect('/urls');
  }
});

app.post('/register', (req, res) => {
  console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;
  const id = 2134;
  users[id] = {
    id, email, password
  };
  console.log(users);
  res.redirect('/login');
});

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

app.post('/login', (req, res) => {
  console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;

  let user = null;
  for (const uid in users) {
    if (users[uid].email === email) {
      user = users[uid]
    }
  }
  if (!user) {
    return res.send('Invalid Credentials');
  }
  if (user.password !== password) {
    return res.send('Invalid Credentials');
  }

  req.session.user_id = user.id;
  res.redirect('/urls');
});

app.get('/urls', requireLogin, (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID];
  let urls = urlDatabase; // Replace with your user-specific URLs
  const templateVars = { urls, user };
  res.render('urls_index', templateVars);
});

app.get('/urls/news', requireLogin, (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID];
  const templateVars = { user };
  res.render('urls_news', templateVars);
});

app.get('/urls/new', requireLogin, (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID];
  const templateVars = { user };
  res.render('urls_new', templateVars);
});

app.post('/urls', requireLogin, (req, res) => {
  const userID = req.session.user_id;
  const longURL = req.body.longURL;

  if (!userID || !longURL) {
    // Handle the case where userID or longURL is missing
    return res.status(400).send("Invalid data. Please provide both a URL and be logged in.");
  }

  // Generate a new shortURL (you'll need a function for this)
  const shortURL = generateShortURL();

  // Save the new URL to the database
  urlDatabase[shortURL] = {
    longURL: longURL,
    userID: userID,
  };

  res.redirect(`/urls/${shortURL}`);
});


app.get('/u/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const url = urlDatabase[shortURL];
  if (url) {
    res.redirect(url.longURL);
  } else {
    res.status(404).send('URL not found');
  }
});

app.listen(PORT, () => {
  console.log(`TinyApp is running on PORT: ${PORT}`);
});
