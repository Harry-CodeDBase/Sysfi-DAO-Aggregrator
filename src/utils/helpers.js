// src/utils/helpers.js

export const stripHtmlAndTruncate = (html, maxLength) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const text = doc.body.textContent || "";
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };
  