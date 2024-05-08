import { getMsgs_firebase, sendMsg_firebase } from '../js/firebase';
import { getURLParams } from '../js/getParams';
import { generateEmoji } from '../js/emoji-generator';

var { nick, opponent, starting } = getURLParams(window.location.href);

var user_emoji = '🗿';
var enemy_emoji = '🦽';

class Message {
  constructor(author, target, content, timestamp, emoji) {
    this.author = author;
    this.target = target;
    this.content = content;
    this.emoji = emoji;
    this.timestamp = new Date();
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
}

const enemyTurn = () => {
  document.getElementById('sendButton').disabled = 'true';
  document.getElementById('sendButton').innerText = "Opponent's Turn";

  starting = false;
};

const userTurn = () => {
  document.getElementById('sendButton').removeAttribute('disabled');
  document.getElementById('sendButton').innerText = 'Send';

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
  document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight;

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
    new Date(),
    user_emoji,
  );
  await message.send();
  message.render();
  document.getElementById('messageInput').value = '';
  console.log('Message Sent!');

    // scroll div chatmessages to the bottom
    document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight;

  enemyTurn();
};

var loopInterval;
window.addEventListener('load', () => {
  console.log(starting);
  if (starting == 'true' || starting == true) starting = true;
  else starting = false;
  console.log(starting);

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

  document.getElementById('messageInput').addEventListener('keydown', (e) => {
    if (event.keyCode === 13 && starting) sending();
  });
  document.getElementById('sendButton').addEventListener('click', (e) => {
    e.preventDefault();
    sending();
  });
});
