/**
 * Formats a date object or string into "Month Day, Year" format (e.g., April 1, 2025)
 * @param {Date|string} date - The date to format
 * @returns {string} Formatted date string
 */
const formatDate = (date) => {
  if (!date) return date;
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return date; // Return original if invalid date

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(d);
};

/**
 * Recursively walks through an object or array and formats all Date objects found
 * @param {any} data - The data to process
 * @returns {any} Processed data with formatted dates
 */
const formatDatesInObject = (data) => {
  if (data === null || data === undefined) {
    return data;
  }

  if (data instanceof Date) {
    return formatDate(data);
  }

  if (Array.isArray(data)) {
    return data.map(item => formatDatesInObject(item));
  }

  if (typeof data === 'object') {
    const newData = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        // Specifically target fields that we know are dates in our schema
        // or any field that is an instance of Date
        if (data[key] instanceof Date) {
          newData[key] = formatDate(data[key]);
        } else if (typeof data[key] === 'object') {
          newData[key] = formatDatesInObject(data[key]);
        } else {
          newData[key] = data[key];
        }
      }
    }
    return newData;
  }

  return data;
};

module.exports = {
  formatDate,
  formatDatesInObject
};
