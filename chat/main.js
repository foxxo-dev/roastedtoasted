import { getMsgs_firebase, sendMsg_firebase } from '../js/firebase';
import { getURLParams } from '../js/getParams';
import { generateEmoji } from '../js/emoji-generator';
var { nick, opponent, starting } = getURLParams(window.location.href);

document.getElementById('loadingPopup').style.opacity = 0;

var messages_log = new Array();

starting == 'true'
  ? (document.getElementById('info-text').innerHTML = 'You start the battle.')
  : (document.getElementById('info-text').innerHTML =
      'Opponent starts the battle.');

var user_emoji = '🗿';
var enemy_emoji = '🦽';

let player_turn_time = 30000;

var total_messages = 0;


document.getElementById('gameOver_enemy').innerText = opponent;

let enemyWin = () => {
  //while(true)
  {
    console.log('enemy win');
    document.body.style.backgroundColor = 'red';
    document.getElementById('gameOver').style.display = 'flex';
    document.getElementById('gameOver_wonlost').innerText = 'lost';
    document.getElementById('gameOver_Message').innerText =
      'Uh oh, try again next time!';

    document.getElementById('gameOver_enemy').innerText = opponent;
    document.getElementById('total_msgs').innerText = total_messages
      .toString()
      .padStart(2, '0');

    let currentTimestamp = new Date().getTime();
    document.getElementById('gameOver_time').innerText =
      currentTimestamp - gameTimeStartTimestamp;
  }
};

let userWin = () => {
  //while(true)
  {
    console.log('user win');

    document.getElementById('gameOver').style.display = 'flex';
  }
};

var gameTimeStartTimestamp = new Date().getTime();
var gameOverTime = 0;

var timerRemaining;

let updateTimer = () => {
  console.log(gameOverTime);
  document.getElementById('remaining').innerText = new Date(
    gameOverTime - new Date().getTime(),
  )
    .toISOString()
    .substr(15, 4);

  if (new Date() > gameOverTime) {
    if (starting) {
      document.getElementById('gameOver_wonlost').innerText = 'lost';
      enemyWin();
    } else {
      userWin();
    }
  }
};

class Message {
  constructor(author, target, content, timestamp, emoji) {
    this.author = author;
    this.target = target;
    this.content = content;
    this.emoji = emoji;
    this.timestamp = timestamp;
    this.seen = false;
  }

  async send() {
    await sendMsg_firebase(
      this.author,
      this.target,
      this.content,
      this.timestamp,
      this.seen,
    );
  }

  getTimestamp() {
    return this.timestamp;
  }

  render() {
    let message_msg = document.createElement('div');
    message_msg.className = 'msg';

    let emoji_container = document.createElement('div');
    emoji_container.innerHTML = this.emoji;
    emoji_container.className = 'message_emoji';
    message_msg.appendChild(emoji_container);

    let nick_container = document.createElement('div');
    nick_container.innerHTML = this.author;
    nick_container.className = 'message_name';
    message_msg.appendChild(nick_container);

    let content_container = document.createElement('div');
    content_container.innerHTML = this.content;
    content_container.className = 'message_text';
    message_msg.appendChild(content_container);

    if (this.author == nick) {
      message_msg.classList.add('my_msg');
    } else {
      message_msg.classList.add('opponent_msg');
    }

    document.getElementById('chatMessages').appendChild(message_msg);
    document.getElementById('chatMessages').appendChild(message_msg);

    total_messages++;
  }
}

const enemyTurn = () => {
  document.getElementById('sendButton').disabled = 'true';
  document.getElementById('sendButton').innerText = "Opponent's Turn";
  document.getElementById('messageInput').placeholder =
    'Meanwhile, you can prepare your roast...';

  document.getElementById('remaining').innerText = '0:00';
  document.getElementById('turn_remaining').innerText = 'opponent has:';

  starting = false;
};

const userTurn = () => {
  document.getElementById('sendButton').removeAttribute('disabled');
  document.getElementById('sendButton').innerText = 'Send';
  document.getElementById('messageInput').placeholder =
    'Type your roast here...';

  document.getElementById('remaining').innerText = '0:00';
  document.getElementById('turn_remaining').innerText = 'time remaining:';

  starting = true;
};

const gotMessage = (msg) => {
  var message = new Message(
    msg.from,
    msg.to,
    msg.message,
    msg.timestamp,
    generateEmoji(msg.from),
  );
  message.render();

  // scroll div chatmessages to the bottom
  document.getElementById('chatMessages').scrollTop =
    document.getElementById('chatMessages').scrollHeight;

  console.log(msg.timestamp);

  gameOverTime = msg.timestamp + player_turn_time;

  console.log(gameOverTime);

  console.log(message.getTimestamp() + player_turn_time);
  console.log(message);
  console.log(message.getTimestamp());

  userTurn();
};
const loop = async () => {
  if (!starting) {
    const msgs = await getMsgs_firebase(nick);
    msgs.forEach((msg) => {
      gotMessage(msg);
    });
  }
};

const sending = async () => {
  if (!starting) return;

  if (document.getElementById('messageInput').value == '') return;
  var message = new Message(
    nick,
    opponent,
    document.getElementById('messageInput').value,
    new Date().getTime(),
    user_emoji,
  );
  messages_log.push(message);
  await message.send();
  message.render();
  document.getElementById('messageInput').value = '';
  console.log('Message Sent!');

  // scroll div chatmessages to the bottom
  document.getElementById('chatMessages').scrollTop =
    document.getElementById('chatMessages').scrollHeight;

  gameOverTime = new Date().getTime() + player_turn_time;

  enemyTurn();
};

var loopInterval;
window.addEventListener('load', () => {
  if (starting == 'true' || starting == true) starting = true;
  else starting = false;

  gameOverTime = new Date().getTime() + player_turn_time;

  if (starting) {
    userTurn();
  } else {
    enemyTurn();
  }

  user_emoji = generateEmoji(nick);
  enemy_emoji = generateEmoji(opponent);

  loop();

  loopInterval = setInterval(() => {
    loop();
  }, 5000); // 5sek

  timerRemaining = setInterval(() => {
    updateTimer();
  }, 500);

  document.getElementById('messageInput').addEventListener('keydown', (e) => {
    if (event.keyCode === 13 && starting) sending();
  });
  document.getElementById('sendButton').addEventListener('click', (e) => {
    e.preventDefault();
    sending();
  });

  document
    .getElementById('save_chat_history')
    .addEventListener('click', function () {
      const element = document.querySelector('.gameOver_canvas');
      html2canvas(element).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'gameOver_canvas.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    });
});
