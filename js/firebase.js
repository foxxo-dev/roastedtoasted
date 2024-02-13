// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
import { deleteDoc } from 'firebase/firestore';

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

export async function getUsers() {
  const querySnapshot = await getDocs(collection(db, 'users'));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    console.log(data);
    users.push({
      isFree: data.status == 'awaiting' ? true : false,
      pair: data.pair,
      nick: data.nick
    });
  });
  console.log(users);
  return users;
}

export async function addUserToDB(name) {
  console.log(name);
  const querySnapshot = await getDocs(collection(db, 'users'));
  let userExists = false;
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.nick === name) {
      userExists = true;
      console.log('User already exists:', data);
      alert('User already exists');
    }
  });
  if (!userExists) {
    const obj = {
      nick: name,
      status: 'awaiting',
      pair: null
    };
    console.log(obj);
    const docRef = await addDoc(collection(db, 'users'), obj);
    console.log('User added to database with ID: ', docRef.id);
  }
}

export async function removeSelfFromDB(name) {
  console.log(name);
  const querySnapshot = await getDocs(collection(db, 'users'));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.nick === name) {
      console.log('User found:', data);
      deleteDoc(doc.ref);
    }
  });
  console.log('User removed from database');
}
