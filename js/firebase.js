// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

import { generateChallengedDOM } from './generateChallengedDOM.js';
var users = [];

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyA_tQZ9xzTXrXqRCgtnX-artCy9-cJoqxM',
  authDomain: 'musicas-45376.firebaseapp.com',
  projectId: 'musicas-45376',
  storageBucket: 'musicas-45376.appspot.com',
  messagingSenderId: '221087713786',
  appId: '1:221087713786:web:ed06bd647da83ea5d0bc43',
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

function getSelf() {
  return document.body.dataset.nick;
}

// Reading All Active Users

export async function getUsers() {
  const query_snapshot = await getDocs(collection(db, 'online'));
  const users = [];
  query_snapshot.forEach(async (doc) => {
    if (doc.data().expire <= Date.now()) {
      await deleteDoc(doc.ref);
    } else {
      users.push(doc.data());
    }
  });

  console.log(users);
  return users;
}

// Adding User

export async function addUser(emoji, nick) {
  // Before Calling this function, make sure that the user does not exist.
  await addDoc(collection(db, 'online'), {
    nick: nick,
    emoji,
    status: 'awaiting',
    expire: Date.now() + 1000 * 60 * 5, // now + 5min
  });
  setInterval(async () => {
    await updateDoc(doc(db, 'online', nick), {
      expire: Date.now() + 1000 * 60 * 5, // now + 5min
    });
  }, 1000 * 60 * 4);
}

// Check if User Exists

export async function checkUser(nick) {
  try {
    const users_snapshot = await getDocs(collection(db, 'online'));
    let userExists = false;
    users_snapshot.forEach((doc) => {
      if (doc.data().nick === nick) {
        userExists = true;
      }
    });
    return userExists;
  } catch (error) {
    console.error('Error checking user:', error);
    return false; // Return false in case of an error
  }
}

// Remove User

export async function removeUser(nick) {
  const users_snapshot = await getDocs(collection(db, 'online'));
  users_snapshot.forEach(async (doc) => {
    if (doc.data().nick === nick) {
      await deleteDoc(doc.ref);
    }
  });
}

// Challenge Opponent

export async function challengeOpponent(nick, buttonDOM) {
  console.log('got challanged');
  const users_snapshot = await getDocs(collection(db, 'online'));
  users_snapshot.forEach(async (doc) => {
    if (doc.data().nick === nick) {
      await updateDoc(doc.ref, {
        status: 'challenged',
        target: nick,
        from: getSelf(),
      });
      buttonDOM.innerText = 'Sent!';
      buttonDOM.disabled = true;
      buttonDOM.removeEventListener('click', challengeOpponent);
      buttonDOM.style.backgroundColor = 'gray';
      buttonDOM.style.color = 'white';
    }
  });

  setInterval(async () => {
    const users_snapshot = await getDocs(collection(db, 'challenges'));
    users_snapshot.forEach(async (doc) => {
      console.log('Checking if challenged', doc.data());
      if (doc.data().from === getSelf()) {
        // remove the challenges document
        await deleteDoc(doc.ref);
        window.location.href =
          '../chat/index.html?nick=' +
          getSelf() +
          '&opponent=' +
          nick +
          '&starting=false';
      }
    });
  }, 1000);
}

export async function checkIfChallenged() {
  console.log('i am:', getSelf());
  const users_snapshot = await getDocs(collection(db, 'online'));
  users_snapshot.forEach(async (doc) => {
    console.log('Checking if challenged', doc.data());
    if (doc.data().target === getSelf()) {
      console.log('You have been challenged by ' + doc.data().nick);
      generateChallengedDOM(doc.data().from, doc.data().emoji);
    }
  });
}

export async function acceptChallenge(nick) {
  await removeUser(nick);
  // Add the user to the challenges collection
  await addDoc(collection(db, 'challenges'), {
    nick: nick,
    emoji: '',
    status: 'accepted',
    from: getSelf(),
  });

  await removeUser(document.body.dataset.nick);

  await addDoc(collection(db, 'challenges'), {
    nick: document.body.dataset.nick,
    emoji: '',
    status: 'accepted',
    from: nick,
  });
  document.getElementById('challenges').innerHTML = '';
  document.getElementById('loadingPopup').style.opacity = 1;
  window.location.href =
    '../chat/index.html?nick=' +
    document.body.dataset.nick +
    '&opponent=' +
    nick +
    '&starting=true';
}

export async function removeFromChallenges(nick) {
  const users_snapshot = await getDocs(collection(db, 'challenges'));
  users_snapshot.forEach(async (doc) => {
    if (doc.data().nick === nick) {
      await deleteDoc(doc.ref);
    }
  });
}

export async function getPlayer(nick) {
  const query_snapshot = await getDocs(collection(db, 'challenges'));
  let user = null;
  query_snapshot.forEach(async (doc) => {
    console.log(doc.data());
    if (doc.data().nick === nick) {
      user = doc.data();
    }
  });

  return user;
}

export async function sendMsg_firebase(
  nick_slef,
  nick_opponent,
  msg,
  timestamp,
  seen,
) {
  const messageCollections = collection(db, 'messages');
  await addDoc(messageCollections, {
    from: nick_slef,
    to: nick_opponent,
    message: msg,
    timestamp: timestamp,
    seen: seen,
  });
}

export async function getMsgs_firebase(nick_self) {
  const q = query(
    collection(db, 'messages'),
    where('to', '==', nick_self),
    where('seen', '==', false),
  );

  const query_snapshot = await getDocs(q);
  const messages = [];
  query_snapshot.forEach((doc) => {
    messages.push(doc.data());
    deleteDoc(doc.ref);
  });

  return messages;
}
