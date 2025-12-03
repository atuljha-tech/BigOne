// utils/eventUtils.js

/**
 * Filters events by city.
 * @param {Array} events - Array of event objects
 * @param {String} city - Selected city (or "All")
 * @returns {Array}
 */
export function filterByCity(events, city) {
  if (!city || city === "All") return events;
  return events.filter((ev) => ev.city === city);
}

/**
 * Searches events by title or description.
 * @param {Array} events
 * @param {String} query
 * @returns {Array}
 */
export function searchEvents(events, query) {
  if (!query.trim()) return events;

  const q = query.toLowerCase();

  return events.filter(
    (ev) =>
      ev.title.toLowerCase().includes(q) ||
      ev.description.toLowerCase().includes(q)
  );
}

/**
 * Sort events by date (upcoming first).
 * @param {Array} events
 * @returns {Array}
 */
export function sortEventsByDate(events) {
  return [...events].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
}

/**
 * Applies all filters at once → city + search + sorting.
 */
export function applyEventFilters(events, city, search) {
  let output = [...events];
  output = filterByCity(output, city);
  output = searchEvents(output, search);
  output = sortEventsByDate(output);
  return output;
}
