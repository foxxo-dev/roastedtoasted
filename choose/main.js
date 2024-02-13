import { getUsers, addUserToDB, removeSelfFromDB } from '../js/firebase.js';
import { parseURLParams } from '../js/parseURLParams.js';
import { updateDropdown } from '../js/updateDropdown.js';

const nickInput = document.getElementById('nick');
const opponentDropdown = document.getElementById('enemy');

const users = await getUsers();

updateDropdown(users, opponentDropdown);

nickInput.addEventListener('change', async () => {
  if (nickInput.value.trim() !== '') {
    opponentDropdown.removeAttribute('disabled');
    await addUserToDB(nickInput.value);
    // nickInput.addAttribute('disabled', null);
  }
});

const nick = parseURLParams();
if (nick.nick) {
  nickInput.value = nick.nick;
  nickInput.dispatchEvent(new Event('change'));
}

document.getElementById('leaveLink').addEventListener('click', async () => {
  await removeSelfFromDB(nickInput.value);
  window.location.href = '../index.html';
});
