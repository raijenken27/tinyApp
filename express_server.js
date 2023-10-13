const express = require("express");
const cookieParser = require("cookie-parser"); // Import the cookie-parser middleware
const app = express();
const PORT = 8080;

app.use(cookieParser()); // Use the cookie-parser middleware

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies.username }; // Pass the username cookie to the templateVars
  res.render("urls_index", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], username: req.cookies.username }; // Pass the username cookie to the templateVars
  res.render("urls_show", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { username: req.cookies.username }; // Pass the username cookie to the templateVars
  res.render("urls_new", templateVars);
});

app.post("/login", (req, res) => {
  const { username } = req.body;
  res.cookie("username", username); // Set the username cookie
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
