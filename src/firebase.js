// import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCjKvdrVTVsfJiQl1SZ2BtAp3JtggsU0nU",
    authDomain: "tkpm-images.firebaseapp.com",
    projectId: "tkpm-images",
    storageBucket: "tkpm-images.appspot.com",
    messagingSenderId: "489550804516",
    appId: "1:489550804516:web:eaaeae820fda1c9fb14ab1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
