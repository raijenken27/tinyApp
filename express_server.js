const express = require("express");
const app = express();
const PORT = 8080;

// Middleware
const bodyParser = require("body-parser");
const morgan = require('morgan');
const cookieSession = require('cookie-session');
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(morgan('dev'));
app.use(cookieSession({
  name: 'session',
  keys: ['hamilton', 'biminibonboulash']
}));
app.use(express.static('public'));

// URL and user databases
const urlDatabase = {
  b6UTxQ: {
    longURL: "http://www.lighthouselabs.ca",
    userID: "raijenken27",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "raijenken27",
  },
  a2f747: {
    longURL: "https://www.nba.com",
    userID: "user2RandomID",
  },
  '3f0037': {
    longURL: "https://www.hubrisight.com",
    userID: "user2RandomID",
  },
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

  next();
};

app.get('/urls/news', requireLogin, (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID];
  const templateVars = { user };
  res.render('urls_news', templateVars);
});


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

// Route for /urls/news
app.get('/urls/news', requireLogin, (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID];
  const templateVars = { user };
  res.render('urls_news', templateVars);
});

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
      user = users[uid];
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
  let urls = urlDatabase;
  const templateVars = { urls, user };
  res.render('urls_index', templateVars);
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

// SUBMIT NEW LONG-URL - stores new URL in the database of the user and adds URL prefix if non-existent
app.post("/urls", requireLogin, (req, res) => {
  let { longURL } = req.body;

  if (!longURL.startsWith('http')) {
    longURL = `http://${longURL}`;
  }

  const userID = req.session.user_id;
  const genShortURL = generateRandomString();
  urlDatabase[genShortURL] = { longURL, userID };
  res.redirect(`/urls/${genShortURL}`);
});

// DELETE EXISTING URL - owner of an existing URL can delete their stored URL
app.post("/urls/:shortURL/delete", requireLogin, (req, res) => {
  const userID = req.session.user_id;
  const { shortURL } = req.params;
  if (userID !== urlDatabase[shortURL].userID) {
    res.sendStatus(404);
    return;
  }

  delete urlDatabase[shortURL];
  res.redirect(`/urls`);
});

// EDIT EXISTING URL - owner of a URL can edit the URL. If no prefix for the URL is given, it adds the correct prefix.
app.post("/urls/:shortURL/edit", requireLogin, (req, res) => {
  const userID = req.session.user_id;
  let { longURL } = req.body;
  const { shortURL } = req.params;

  if (userID !== urlDatabase[shortURL].userID) {
    res.status(404).send('You do not have permission to edit this link');
    return;
  }
  if (!longURL.startsWith('http')) {
    longURL = `http://${longURL}`;
  }

  urlDatabase[shortURL] = { longURL, userID };
  res.redirect(`/urls`);
});

// ... (previous code)

// Generate a random short URL
function generateRandomString() {
  let randomString = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomString;
}

// POST /urls - Create a new short URL (Requires authentication)
app.post("/urls", requireLogin, (req, res) => {
  const longURL = req.body.longURL;

  let shortURL;
  do {
    shortURL = generateRandomString();
  } while (urlDatabase[shortURL]);

  urlDatabase[shortURL] = { longURL, userID: req.session.user_id };

  res.redirect(`/urls/${shortURL}`);
});


app.listen(PORT, () => {
  console.log(`TinyApp is running on PORT: ${PORT}`);
});
