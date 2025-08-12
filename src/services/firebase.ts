import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, collection, doc, addDoc, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD-b_9AxLPyW64BPZPWPrEN6L8bE8snD1s",
  authDomain: "tungaloybidding.firebaseapp.com",
  databaseURL: "https://tungaloybidding-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tungaloybidding",
  storageBucket: "tungaloybidding.firebasestorage.app",
  messagingSenderId: "225561706650",
  appId: "1:225561706650:web:6adc040c2cdcac5d8f5f23",
  measurementId: "G-X3FEE454KP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };
export const auth = getAuth(app);

export const createUser = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const loginUser = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = async () => {
  return await signOut(auth);
};

export const addScheduleEntry = async (userId: string, entry: any) => {
  const entriesCol = collection(db, "schedules", userId, "entries");
  return await addDoc(entriesCol, entry);
};

export const getScheduleEntries = async (userId: string) => {
  const entriesCol = collection(db, "schedules", userId, "entries");
  return await getDocs(entriesCol);
};

export const addHomeworkAssignment = async (userId: string, assignment: any) => {
  const assignmentsCol = collection(db, "homework", userId, "assignments");
  return await addDoc(assignmentsCol, assignment);
};

export const getHomeworkAssignments = async (userId: string) => {
  const assignmentsCol = collection(db, "homework", userId, "assignments");
  return await getDocs(assignmentsCol);
};