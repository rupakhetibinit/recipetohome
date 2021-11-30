import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';
const firebaseConfig = {
	apiKey: 'AIzaSyCv0Euf7b24pfdBol3EGKxEaSvhafSSkVM',
	authDomain: 'recipe-app-react-native.firebaseapp.com',
	projectId: 'recipe-app-react-native',
	storageBucket: 'recipe-app-react-native.appspot.com',
	messagingSenderId: '438725345175',
	appId: '1:438725345175:web:1d03c362537ef0cbfb4ed2',
};

let app;

if (firebase.apps.length === 0) {
	app = firebase.initializeApp(firebaseConfig);
} else {
	app = firebase.app();
}

const db = app.firestore();
const fbauth = app.auth();

export { db, fbauth };
