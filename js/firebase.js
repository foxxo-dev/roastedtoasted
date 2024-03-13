// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc
} from 'firebase/firestore';

var users = [];

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyA_tQZ9xzTXrXqRCgtnX-artCy9-cJoqxM',
  authDomain: 'musicas-45376.firebaseapp.com',
  projectId: 'musicas-45376',
  storageBucket: 'musicas-45376.appspot.com',
  messagingSenderId: '221087713786',
  appId: '1:221087713786:web:ed06bd647da83ea5d0bc43'
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
// Your web app's Firebase configuration

// Initialize Firebase

// Function to go online
export async function addUserToDB(nick) {
  const usersRef = collection(db, 'users');
  const querySnapshot = await getDocs(usersRef);
  const users = querySnapshot.docs.map((doc) => doc.data());
  const user = users.find((user) => user.nick === nick);
  if (user) {
    console.log(`User ${nick} already exists.`);
  } else {
    await addDoc(collection(db, 'users'), { nick: nick });
    console.log(`User ${nick} added to database.`);
  }
}

// Function to send chat request
export async function sendChatRequest(senderNick, receiverNick) {
  const usersRef = collection(db, 'users');
  const querySnapshot = await getDocs(usersRef);
  const users = querySnapshot.docs.map((doc) => doc.data());

  const sender = users.find((user) => user.nick === senderNick);
  const receiver = users.find((user) => user.nick === receiverNick);

  if (sender && receiver) {
    // Add chat request to receiver's requests collection
    await addDoc(collection(db, 'users', receiver.id, 'requests'), {
      sender: senderNick,
      timestamp: new Date().toISOString()
    });
    console.log(`Chat request sent from ${senderNick} to ${receiverNick}.`);
  } else {
    console.log(`User ${senderNick} or ${receiverNick} not found.`);
  }
}

export async function checkIfRecievedRequest(nick) {
  const usersRef = collection(db, 'users');
  const querySnapshot = await getDocs(usersRef);
  const users = querySnapshot.docs.map((doc) => doc.data());

  const user = users.find((user) => user.nick === nick);
  if (user) {
    const requestsRef = collection(db, 'users', user.id, 'requests');
    if (!requestsRef) return null;
    const querySnapshot = await getDocs(requestsRef);
    const requests = querySnapshot.docs.map((doc) => doc.data());
    console.log(requests);
    return requests;
  } else {
    console.log(`User ${nick} not found.`);
    return null;
  }
}

// Function to get all user nicks
export async function getAllUserNicks() {
  const usersRef = collection(db, 'users');
  const querySnapshot = await getDocs(usersRef);
  const users = querySnapshot.docs.map((doc) => doc.data());
  const nicks = users.map((user) => user.nick);
  console.log(nicks);
  return nicks;
}
