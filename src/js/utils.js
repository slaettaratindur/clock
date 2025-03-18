/**
 * Utilities
 */

/**
 * Get local time and convert it to 'HH:MM' format.
 *
 * @returns {string} formatted time
 */
const getLocalTime = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  return `${('0' + hours).slice(-2)}:${('0' + minutes).slice(-2)}`;
};

/**
 * Repeat a function when a specific interval changes (default: 1 minute).
 * 
 * setInterval only fires after one minute. For the clock image to correctly change,
 *   this function computes the time difference between the current time
 *   and the next minute.
 *
 * @param {func} func Function to repeat
 * @param {number} interval Repetition interval, in ms (default: 1 minute)
 */
const repeatFunction = (func, interval = 60 * 1000) => {
  const now = new Date();
  const delay = interval - now % interval;

  const start = () => {
    func();
    setInterval(func, interval);
  };

  setTimeout(start, delay);
};
