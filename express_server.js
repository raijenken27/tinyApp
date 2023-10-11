const express = require("express");
const app = express();
const PORT = 8080; // The server will listen on port 8080

// This is a simple in-memory database storing shortened URLs
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Define a route that responds with "Hello!" when you access the root path "/"
app.get("/", (req, res) => {
  res.send("Hello!");
});

// Define a route that responds with the JSON representation of the urlDatabase when you access "/urls.json"
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// Define a route that responds with an HTML message when you access "/hello"
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
