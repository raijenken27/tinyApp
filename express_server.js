const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs"); // Set EJS as the view engine

// Define your urlDatabase
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Route to render the URLs index page
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// Route to render a single URL's details
app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  const templateVars = { id, longURL };
  res.render("urls_show", templateVars);
});

// Other routes...

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
