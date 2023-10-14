const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); // Body parsing middleware
app.use(cookieParser()); // Cookie parsing middleware

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies.username // Pass the username to the template
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    username: req.cookies.username // Pass the username to the template
  };
  res.render("urls_show", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { username: req.cookies.username }; // Pass the username to the template
  res.render("urls_new", templateVars);
});

app.get("/register", (req, res) => {
  res.render("registration"); // Render the registration template
});

app.post("/login", (req, res) => {
  const { username } = req.body;
  if (username) {
    res.cookie("username", username);
    res.redirect("/urls");
  } else {
    res.status(400).send("Invalid username");
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
