const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Cookie parsing middleware

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {}; // Initialize an empty users object to store user data

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies.user_id] // Pass the user object to the template
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: users[req.cookies.user_id] // Pass the user object to the template
  };
  res.render("urls_show", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id] // Pass the user object to the template
  };
  res.render("urls_new", templateVars);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    // Search for a user with the provided email
    for (const user in users) {
      if (users[user].email === email) {
        if (users[user].password === password) {
          res.cookie("user_id", user);
          res.redirect("/urls");
          return;
        }
      }
    }
  }
  res.status(400).send("Invalid email or password");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id]
  };
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    // Check if the email already exists
    for (const user in users) {
      if (users[user].email === email) {
        res.status(400).send("Email already exists");
        return;
      }
    }

    const userId = generateRandomString();
    users[userId] = {
      id: userId,
      email,
      password
    };

    res.cookie("user_id", userId);
    res.redirect("/urls");
  } else {
    res.status(400).send("Invalid email or password");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// Function to generate a random string (used for generating user IDs)
function generateRandomString() {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
