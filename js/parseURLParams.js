export function parseURLParams() {
  const url = window.location.href;
  const urlParams = new URL(url);
  const params = urlParams.searchParams;
  const nick = params.get('username');
  return { nick };
}

export function parseURLParamsWin() {
  const url = window.location.href;
  const urlParams = new URL(url);
  const params = urlParams.searchParams;
  const isShared = params.get('isShared');
  const opponentName = params.get('opponentName');

  return { isShared, opponentName };
}
