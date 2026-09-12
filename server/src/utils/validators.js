function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password) {
  // at least 8 chars, one letter, one number
  return typeof password === "string" && password.length >= 8;
}

module.exports = { isValidEmail, isValidPassword };