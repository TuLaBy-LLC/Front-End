export function extractValues(obj1, obj2) {
  const result = {};

  for (const key in obj1) {
    if (obj2.hasOwnProperty(key)) {
      // Check if the value is undefined, null, "undefined" (string), or "null" (string)
      result[key] = (obj2[key] === undefined || obj2[key] === null || obj2[key] === "undefined" || obj2[key] === "null")
        ? ""
        : obj2[key];
    }
  }

  return result;
}

export function convertDate(dateString) {
  // Create a new Date object from the input string
  const date = new Date(dateString);

  // Format the date using toLocaleDateString method
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return formattedDate
}
export function convertDateTime(dateString) {
  // Create a new Date object from the input string
  const date = new Date(dateString);

  // Format the date using toLocaleDateString and toLocaleTimeString methods
  const formattedDateTime = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }) + ' .. ' + date.toLocaleTimeString('en-US');

  return formattedDateTime;
}
export const calculateDuration = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const diffInMs = Math.abs(endDate - startDate); // Difference in milliseconds
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60)); // Difference in minutes
  const hours = Math.floor(diffInMinutes / 60); // Extract hours
  const minutes = diffInMinutes % 60; // Extract remaining minutes

  return `${hours}H and ${minutes}M`;
};


/**
 * Calculate relative time ago
 * @param {Date} date
 * @param {boolean} isEnglish
 * @returns {String}
 */
export function timeAgo(date, isEnglish) {
  const now = new Date();
  const utcNow = new Date(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds()
  );
  const pastDate = new Date(date);
  const diff = utcNow - pastDate;

  if (isNaN(diff)) {
    return !isEnglish ? "تاريخ غير صحيح" : "Invalid date";
  } if (Math.floor(diff / 1000) < 1) {
    return !isEnglish ? "الأن" : "Just Now";
  }

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  const units = {
    seconds: { singular: "ثانية", dual: "ثانيتين", plural: "ثواني" },
    minutes: { singular: "دقيقة", dual: "دقيقتين", plural: "دقائق" },
    hours: { singular: "ساعة", dual: "ساعتين", plural: "ساعات" },
    days: { singular: "يوم", dual: "يومين", plural: "أيام" },
    months: { singular: "شهر", dual: "شهرين", plural: "أشهر" },
    years: { singular: "سنة", dual: "سنتين", plural: "سنوات" },
  };

  const getArabicTime = (value, unit) => {
    if (value === 1) return `منذ ${value} ${unit.singular}`;
    if (value === 2) return `منذ ${unit.dual}`;
    if (value >= 3 && value <= 10) return `منذ ${value} ${unit.plural}`;
    return `منذ ${value} ${unit.plural}`;
  };

  if (!isEnglish) {
    if (seconds < 60) return getArabicTime(seconds, units.seconds);
    if (minutes < 60) return getArabicTime(minutes, units.minutes);
    if (hours < 24) return getArabicTime(hours, units.hours);
    if (days < 30) return getArabicTime(days, units.days);
    if (months < 12) return getArabicTime(months, units.months);
    return getArabicTime(years, units.years);
  } else {
    if (seconds < 60) return `${seconds} seconds ago`;
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 30) return `${days} days ago`;
    if (months < 12) return `${months} months ago`;
    return `${years} years ago`;
  }
}