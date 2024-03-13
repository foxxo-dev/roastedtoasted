import {
  addUserToDB,
  checkIfRecievedRequest,
  getAllUserNicks,
  sendChatRequest
} from '../js/firebase.js';
import { parseURLParams } from '../js/parseURLParams.js';
import { updateDropdown } from '../js/updateDropdown.js';

const nickInput = document.getElementById('nick');
const opponentDropdown = document.getElementById('enemy');

const users = await getAllUserNicks();

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

document.getElementById('startGame').addEventListener('click', (e) => {
  e.preventDefault();
  if (nickInput.value.trim() === '') {
    alert('Please enter a nickname.');
    return;
  }
  if (opponentDropdown.value === '--Select--') {
    alert('Please select an opponent.');
    return;
  }
  document.getElementById('loadingPopup').style.opacity = 1;

  sendChatRequest(nickInput.value, opponentDropdown.value);
});

setInterval(async () => {
  const request = await checkIfRecievedRequest(nickInput.value);
  if (request) {
    const req_nick = request[0].sender;
    const res = confirm(`${req_nick} wants to play with you. Do you accept?`);
    if (res) {
      window.location.href = `../game/index.html?nick=${nickInput.value}&opponent=${req_nick}`;
    } else {
      alert('Request rejected.');
    }
  }
}, 5000);

document.getElementById('leaveLink').addEventListener('click', async () => {
  await removeSelfFromDB(nickInput.value);
  window.location.href = '../index.html';
});
