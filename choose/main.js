import { doc } from 'firebase/firestore';
import { generateEmoji } from '../js/emoji-generator.js';
import {
  checkUser,
  addUser,
  removeUser,
  checkIfChallenged,
} from '../js/firebase.js';
import { generateOpponentList } from '../js/createOpponentsList.js';
import { generateTermsPopup } from '../js/termsPopupGenerator.js';

const loading = document.getElementById('loadingPopup');

// var the_best = generateEmoji(`Roasted Toasted`);
// console.log(the_best);

const default_nick = `Unnamed User#${Math.floor(Math.random() * 10000)}`;

var nick = default_nick;

var current_status = 'nick';

var is_run = false;
//  (mr nimo should i add this)
generateTermsPopup()

window.addEventListener('load', () => {
  if (is_run) return;
  is_run = true;

  alert(
    'Please do notice that this version is not finished, you currently cannot enter the chat system to roast. This version is in development. Expect the first release in about 2-4 weeks.',
  );
  document.getElementById('startGame').addEventListener('click', (e) => {
    e.preventDefault();

    console.log('🥑🥑🥑🥑🥑🥑🥑🥑🥑🥑🥑🥑🥑🥑🥑🥑🥑🥑');

    const nickInput = document.getElementById('nick');
    const nickValue = nickInput.value.trim();

    checkUser(nickValue)
      .then((userExists) => {
        if (userExists) {
          alert('This nick is already taken! Please, choose another one!');
          throw new Error('User already exists');
        }

        let nick = nickValue || default_nick; // If no nick provided, use default
        nickInput.value = nick;

        // Generating emoji and full nick
        let emoji = generateEmoji(nick);

        document
          .getElementById('page_enter_nickname')
          .setAttribute('data-active', 'false');
        document
          .getElementById('page_choose')
          .setAttribute('data-active', 'true');

        current_status = 'opponent';
        console.log(nick);
        // Update Username Property
        document.getElementById('username').innerText = emoji + ' ' + nick;
        loading.style.opacity = 1;
        document.body.dataset.nick = nick;
        return addUser(emoji, nick);
      })
      .then(() => {
        return generateOpponentList('opponents_online');
      })
      .catch((error) => {
        console.error(error);
      });

    setInterval(async () => {
      loading.style.opacity = 0;
      await checkIfChallenged();
      generateOpponentList('opponents_online').catch((error) => {
        console.error(error);
      });
    }, 10000);
  });
});

// Check every 2 minutes if the user has moved their mouse
var idleTime = 0;
var idleInterval = setInterval(timerIncrement, 600000); // 10 minutes
window.addEventListener('mousemove', function (e) {
  idleTime = 0;
});

async function timerIncrement() {
  idleTime = idleTime + 1;
  if (idleTime > 0.2 && current_status == 'opponent') {
    await removeUser(nick);
    clearInterval(idleInterval);
    window.alert('You have been disconnected due to inactivity');
    window.location.reload();
  }
}
