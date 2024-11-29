
export const setQueryStringInURL = (query, pageName) => {
    const cleanQuery = query.startsWith("?") ? query.slice(1) : query;
  
    // Edit the browser URL with a single `?`
    const newUrl = cleanQuery
      ? `/${pageName}?${cleanQuery}`
      : `/${pageName}`;
    window.history.replaceState(null, null, newUrl); // Updates the URL without navigating
  };

  
export const handleQueryFormat = (query) => {
    return query[0] == "?" ? query : `?${query}`;
  };