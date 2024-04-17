import { acceptChallenge } from './firebase.js';

export function generateChallengedDOM(from, emoji) {
  document.getElementById('challenges').innerHTML = '';
  const challenged_container = document.createElement('div');
  challenged_container.id = 'challenge_' + from.replace(/ /g, '_');
  challenged_container.className = 'oponent';
  const opponent_name = document.createElement('span');
  opponent_name.className = 'oponent_name';
  opponent_name.innerText = emoji + ' ' + from;
  const accept_button = document.createElement('button');
  accept_button.className = 'accept_challenge';
  accept_button.innerText = 'Accept';
  accept_button.addEventListener(
    'click',
    async () => await acceptChallenge(from),
  );

  challenged_container.appendChild(opponent_name);
  challenged_container.appendChild(accept_button);

  document.getElementById('challenges').appendChild(challenged_container);
}
