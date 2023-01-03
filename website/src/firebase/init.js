import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAGX9Mmr_I5e55SUol7dKz87gAZR8PlEPc",
  authDomain: "database-test-bd81a.firebaseapp.com",
  projectId: "database-test-bd81a",
  storageBucket: "database-test-bd81a.appspot.com",
  messagingSenderId: "571577355674",
  appId: "1:571577355674:web:47cf7d3eacc831a710fe23",
  measurementId: "G-QXX73W108Y"
};

const app = initializeApp(firebaseConfig);

export default app