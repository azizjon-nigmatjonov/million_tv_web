import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyBFs7er-LV3YCGc3hQrk5CqCoamJuKDYUc',
    authDomain: 'milliontv-90999.firebaseapp.com',
    projectId: 'milliontv-90999',
    storageBucket: 'milliontv-90999.appspot.com',
    messagingSenderId: '680476755747',
    appId: '1:680476755747:web:d6a9bd83a9ec5b27a7ae96',
    measurementId: 'G-6QZLQV9NL2',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const authorization = getAuth(app)
