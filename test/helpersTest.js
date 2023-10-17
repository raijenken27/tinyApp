const { assert } = require('chai');
const { getUserByEmail, getUserUrls } = require('../helpers/userHelpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const urlDatabase = {
  b6UTxQ: { longURL: 'http://www.lighthouselabs.ca', userID: "raijenken27" },
  i3BoGr: { longURL: 'https://www.google.ca', userID: "raijenken27" },
  'a2f747': { longURL: 'https://www.nba.com', userID: "user2RandomID" },
  '3f0037': { longURL: 'https://www.hubrisight.com', userID: "user2RandomID" }
};


describe('getUserByEmail', () => {
  it('should return a user with valid email', () => {
    const user = getUserByEmail(testUsers, "user@example.com").id;
    const expectedOutput = "userRandomID";
    assert.equal(user, expectedOutput);
  });
  it('should return a undefined with an invalid email', () => {
    const user = getUserByEmail(testUsers, "cooluser@example.com").id;
    const expectedOutput = undefined;
    assert.equal(user, expectedOutput);
  });
});


describe('getUserUrls', () => {

  it('should return longURL with shortURL of b6UTxQ', () => {
    const user = getUserUrls(urlDatabase, "user2RandomID").b6UTxQ.longURL;
    const expectedOutput = "https://www.hubrisight.com";
    assert.equal(user, expectedOutput);
  });
  it('should return undefined with unmatching shortURL', () => {
    const user = getUserUrls(urlDatabase, "userRandomID").b6UTxQ;
    const expectedOutput = undefined;
    assert.equal(user, expectedOutput);
  });
});