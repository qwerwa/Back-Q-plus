import firebase from 'firebase'
import 'firebase/firestore'

const config = {
    apiKey: "AIzaSyB_P9y9ire2jY7XRlGCpqb-CAKQGUQa11c",
    authDomain: "test-1-e7012.firebaseapp.com",
    databaseURL: "https://test-1-e7012.firebaseio.com",
    projectId: "test-1-e7012",
    storageBucket: "test-1-e7012.appspot.com",
    messagingSenderId: "319180543042",
    appId: "1:319180543042:web:574d76c06b694b1bee09db",
    measurementId: "G-6BERML41SJ"
}

const firebaseApp = firebase.initializeApp(config)

const datab = firebaseApp.firestore()
datab.settings({ timestampsInSnapshots: true })


export const db = datab
