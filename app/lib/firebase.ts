import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBazg8vpK1JMpOtS9nOEYzfsVMSTJ_BPxk",
  authDomain: "fixter-67253.firebaseapp.com",
  databaseURL: "https://fixter-67253.firebaseio.com",
  projectId: "fixter-67253",
  storageBucket: "fixter-67253.appspot.com",
  messagingSenderId: "590084716663",
  appId: "1:590084716663:web:3c3c704a3f37078c",
};
const app = initializeApp(firebaseConfig);
export const googleLogin = async () => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  const result = await signInWithPopup(auth, provider);
  console.log("login Result: ", result);
  return result.user;
};
