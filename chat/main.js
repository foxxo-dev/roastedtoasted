import { getMsgs_firebase, sendMsg_firebase } from '../js/firebase';
import { getURLParams } from '../js/getParams';
import { generateEmoji } from '../js/emoji-generator';
var { nick, opponent, starting } = getURLParams(window.location.href);

// document.getElementById('loadingPopup').style.opacity = 0;

messages_log = new Array();

starting == 'true'
  ? (document.getElementById('info-text').innerHTML = 'You start the battle.')
  : (document.getElementById('info-text').innerHTML =
      'Opponent starts the battle.');

var user_emoji = '🗿';
var enemy_emoji = '🦽';

let player_turn_time = 30000;

let gameOver = () => {
  document.getElementById('remaining').innerText = '0:00';
  clearInterval(timerRemaining);

  messages_log.forEach((msg) => {
    msg.render_history();
  });
};

let enemyWin = () => {
  //while(true)
  {
    console.log('enemy win');
    document.body.style.backgroundColor = 'red';
  }
};

let userWin = () => {
  //while(true)
  {
    console.log('user win');

    window.location.href =
      '../win/index.html?isShared=false&opponentName=' + opponent;
  }
};

var timerRemaining;
var gameOverTime = 0;

let updateTimer = () => {
  console.log(gameOverTime);
  document.getElementById('remaining').innerText = new Date(
    gameOverTime - new Date().getTime(),
  )
    .toISOString()
    .substr(15, 4);

  if (new Date() > gameOverTime) {
    if (starting) {
      enemyWin();
    } else {
      userWin();
    }
    gameOverTime();
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
  }

  render_history() {
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

    document.getElementById('gameOver_chat').appendChild(message_msg);
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
});
