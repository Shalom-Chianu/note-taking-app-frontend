import * as firebase from "firebase/app";
import "firebase/auth";

const app = firebase.initializeApp({
    apiKey: "AIzaSyCHSWCGHA8bCcMFUb4WYPa_Q_TbO-NziDA",
    authDomain: "note-taking-app-frontend.firebaseapp.com",
    databaseURL: "https://note-taking-app-frontend.firebaseio.com",
    projectId: "note-taking-app-frontend",
    storageBucket: "note-taking-app-frontend.appspot.com",
    messagingSenderId: "473602148324",
});

export default app;