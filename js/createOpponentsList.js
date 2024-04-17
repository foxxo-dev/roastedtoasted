import { getUsers } from './firebase';
import { challengeOpponent } from './firebase';
// <div id='opponent_i-break-into-homes' class='oponent'>
//  <span class='oponent_name'>? We still lodin</span>
//  <button class='challenge_opponent' disabled>
//    I have no idea why!
//  </button>
//</div>;

export async function generateOpponentList(containerDOM) {
  var users = await getUsers();
  console.log(users);
  const container = document.getElementById(containerDOM);
  container.innerHTML = '';
  users.forEach((user) => {
    if (
      user.status === 'awaiting' &&
      user.nick !== document.body.dataset.nick
    ) {
      container.appendChild(createOpponentCard(user));
    }
  });
}

function createOpponentCard(user) {
  const card = document.createElement('div');
  card.id = `opponent_${user.nick}`;
  const name = document.createElement('span');
  name.className = 'oponent_name';
  name.innerText = `${user.emoji} ${user.nick}`;
  const button = document.createElement('button');
  button.className = 'challenge_opponent';
  button.innerText = 'Challenge';
  button.addEventListener(
    'click',
    async () => await challengeOpponent(user.nick),
  );
  card.appendChild(name);
  card.appendChild(button);
  return card;
}
