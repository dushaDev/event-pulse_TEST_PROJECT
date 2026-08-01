/**
 * Date formatting and temporal helper utility module.
 * Provides standard date transformations and relative time string generation.
 */

/**
 * Format a Date object or timestamp into ISO date string (YYYY-MM-DD).
 * @param {Date|string|number} dateInput - The input date object or timestamp.
 * @returns {string} Formatted ISO date string.
 */
function formatDateISO(dateInput) {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date input provided to formatDateISO');
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculate the relative time string between now and the provided target timestamp.
 * @param {Date|string|number} targetDate - The target date to compare against.
 * @returns {string} Human readable relative time format (e.g., '2 days ago', 'In 5 hours').
 */
function getRelativeTimeString(targetDate) {
  const target = new Date(targetDate);
  const now = new Date();
  const diffInSeconds = Math.floor((target.getTime() - now.getTime()) / 1000);

  const absoluteSeconds = Math.abs(diffInSeconds);
  const past = diffInSeconds < 0;

  if (absoluteSeconds < 60) {
    return 'just now';
  }

  const minutes = Math.floor(absoluteSeconds / 60);
  if (minutes < 60) {
    return past ? `${minutes} minutes ago` : `in ${minutes} minutes`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return past ? `${hours} hours ago` : `in ${hours} hours`;
  }

  const days = Math.floor(hours / 24);
  return past ? `${days} days ago` : `in ${days} days`;
}

/**
 * Check whether a target deadline date is in the past compared to current time.
 * @param {Date|string} deadlineDate - The deadline timestamp to evaluate.
 * @returns {boolean} True if the deadline has passed, false otherwise.
 */
function isOverdue(deadlineDate) {
  if (!deadlineDate) return false;
  const deadline = new Date(deadlineDate);
  const now = new Date();
  return deadline.getTime() < now.getTime();
}

module.exports = {
  formatDateISO,
  getRelativeTimeString,
  isOverdue
};
