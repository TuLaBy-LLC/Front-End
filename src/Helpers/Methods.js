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
 * Returns relative time text.
 *
 * @param {string|Date} date
 * @param {string} isEnglish Supported: true, false
 * @returns {string} HTML string
 */
export function timeAgo(date, isEnglish) {

    const timestamp = new Date(date).getTime();

    if (isNaN(timestamp)) {
        return !isEnglish
            ? "تاريخ غير صحيح"
            : "Invalid date";
    }

    const diffInSeconds = Math.floor(
        (timestamp - Date.now()) / 1000
    );

    const locale =
        !isEnglish
            ? "ar"
            : "en";

    const rtf = new Intl.RelativeTimeFormat(
        locale,
        { numeric: "auto" }
    );

    const intervals = [
        { unit: "year", seconds: 31536000 },
        { unit: "month", seconds: 2592000 },
        { unit: "day", seconds: 86400 },
        { unit: "hour", seconds: 3600 },
        { unit: "minute", seconds: 60 },
        { unit: "second", seconds: 1 }
    ];

    for (const interval of intervals) {

        const value = Math.trunc(
            diffInSeconds / interval.seconds
        );

        if (Math.abs(value) >= 1) {

            return rtf.format(
                value,
                interval.unit
            );
        }
    }

    return !isEnglish
        ? "الآن"
        : "Just now";
}