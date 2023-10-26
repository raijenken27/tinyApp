const isRegisteredEmail = (email, userDatabase) => {
  for (const userId in userDatabase) {
    if (userDatabase[userId].email === email) {
      return true;
    }
  }
  return false;
};

/**
 * Get the user object by user ID.
 * @param {string} userId - The user ID to search for.
 * @param {object} userDatabase - The user database.
 * @returns {object} - The user object or undefined if not found.
 */
const getUser = (userId, userDatabase) => {
  return userDatabase[userId];
};

/**
 * Find the user object in the "users" database by email.
 * @param {string} email - The email to search for.
 * @param {object} userDatabase - The user database.
 * @returns {object|null} - The user object or null if not found.
 */
const getUserByEmail = (email, userDatabase) => {
  for (const userId in userDatabase) {
    if (userDatabase[userId].email === email) {
      return userDatabase[userId];
    }
  }
};

/**
 * Return an object of all the URLs in the urlDatabase that belong to a user.
 * @param {string} id - The user's ID.
 * @param {object} urlDatabase - The URL database.
 * @returns {object} - An object containing URLs belonging to the user.
 */
const urlsForUser = (id, urlDatabase) => {
  const userUrls = {};
  for (const shortUrlKey in urlDatabase) {
    if (urlDatabase[shortUrlKey].userId === id) {
      userUrls[shortUrlKey] = urlDatabase[shortUrlKey];
    }
  }
  return userUrls;
};

/**
 * Check if a short URL is in our database.
 * @param {string} shortUrl - The short URL key to check.
 * @param {object} urlDatabase - The URL database.
 * @returns {boolean} - True if the short URL is in the database, false otherwise.
 */
const isValidUrl = (shortUrl, urlDatabase) => {
  if (urlDatabase[shortUrl]) {
    return true;
  }
  return false;
};

/**
 * Check if the short URL belongs to the user.
 * @param {string} shortUrl - The short URL key to check.
 * @param {object} user - The user object.
 * @param {object} urlDatabase - The URL database.
 * @returns {boolean} - True if the URL's user ID matches the user's ID, false otherwise.
 */
const isUserUrl = (shortUrl, user, urlDatabase) => {
  if (isValidUrl(shortUrl, urlDatabase) && urlDatabase[shortUrl].userId === user.id) {
    return true;
  }
  return false;
};

module.exports = {
  isRegisteredEmail,
  getUser,
  getUserByEmail,
  urlsForUser,
  isUserUrl,
  isValidUrl,
};
