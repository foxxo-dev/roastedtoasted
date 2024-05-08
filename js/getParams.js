export function getURLParams(url) {
  const params = {};
  const urlParts = url.split('?');
  if (urlParts.length === 1) {
    return params;
  }
  const queryString = urlParts[1];
  const keyValuePairs = queryString.split('&');
  keyValuePairs.forEach((keyValuePair) => {
    const [key, value] = keyValuePair.split('=');
    params[key] = decodeURIComponent(
      value.replace(/\+/g, ' ').replace(/%20/g, ' '),
    );
  });
  console.log(params);
  return params;
}
