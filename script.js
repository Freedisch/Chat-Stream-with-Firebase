// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

var firebaseConfig = {
  apiKey: 'AIzaSyAFHssswSY3PLuf9ywyfDdl-I_G7R3PYuA',
  authDomain: 'fir-app-6bdf7.firebaseapp.com',
  databaseURL: 'https://fir-app-6bdf7-default-rtdb.firebaseio.com',
  projectId: 'fir-app-6bdf7',
  storageBucket: 'fir-app-6bdf7.appspot.com',
  messagingSenderId: '996959809696',
  appId: '1:996959809696:web:10cdda4473b767405c99c5',
};

firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

if (!localStorage.getItem('name')) {
  name = prompt('What is your name?');
  localStorage.setItem('name', name);
} else {
  name = localStorage.getItem('name');
}
document.querySelector('#name').innerText = name;

document.querySelector('#change-name').addEventListener('click', () => {
  name = prompt('What is your name?');
  localStorage.setItem('name', name);
  document.querySelector('#name').innerText = name;
});

document.querySelector('#message-form').addEventListener('submit', e => {
  e.preventDefault();

  let message = document.querySelector('#message-input').value;
  db.collection('messages')
    .add({
      name: name,
      message: message,
      date: firebase.firestore.Timestamp.fromMillis(Date.now()),
    })
    .then(docRef => {
      console.log(`Document written with ID: ${docRef.id}`);
      document.querySelector('#message-form').reset();
    })
    .catch(error => {
      console.log(`Error adding document: ${error}`);
    });
});

db.collection('messages')
  .orderBy('date', 'asc')
  .onSnapshot(snapshot => {
    document.querySelector('#messages').innerHTML = '';
    snapshot.forEach(doc => {
      let message = document.createElement('div');
      message.innerHTML = `
		<p class="name">${doc.data().name}</p>
		<p>${doc.data().message}</p>
		`;
      document.querySelector('#messages').prepend(message);
    });
  });

document.querySelector('#clear').addEventListener('click', () => {
  db.collection('messages')
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        db.collection('messages')
          .doc(doc.id)
          .delete()
          .then(() => {
            console.log('Document successfully deleted!');
          })
          .catch(error => {
            console.error(`Error removing document: ${error}`);
          });
      });
    })
    .catch(error => {
      console.log(`Error getting documents: ${error}`);
    });
});
