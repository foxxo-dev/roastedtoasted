export function parseURLParams() {
  const url = window.location.href;
  const urlParams = new URL(url);
  const params = urlParams.searchParams;
  const nick = params.get('username');
  return { nick };
}
