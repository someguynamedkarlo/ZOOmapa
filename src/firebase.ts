import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB0xVPcTwZb5vYCZZKYPr8uimM8nKxM900",
  authDomain: "mapa-fe85d.firebaseapp.com",
  databaseURL:
    "https://mapa-fe85d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mapa-fe85d",
  storageBucket: "mapa-fe85d.firebasestorage.app",
  messagingSenderId: "1061731964525",
  appId: "1:1061731964525:web:7b1aecf2d5c3a04caad164",
  measurementId: "G-63RZV3H9KB",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const fetchData = async () => {
  const dbRef = ref(db, "/");
  try {
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No data available");
      return [];
    }
  } catch (error) {
    console.error("Error reading data:", error);
    return [];
  }
};

export default fetchData;
