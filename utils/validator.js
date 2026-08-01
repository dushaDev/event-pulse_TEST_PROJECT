function isValidString(str) {
  return typeof str === 'string' && str.trim().length > 0;
}

function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

function sanitizeInput(inputStr) {
  if (typeof inputStr !== 'string') return '';
  return inputStr
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

module.exports = {
  isValidString,
  isValidEmail,
  sanitizeInput
};
