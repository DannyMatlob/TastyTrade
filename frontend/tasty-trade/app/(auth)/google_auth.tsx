import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID, MEASUREMENT_ID } from "@env";

const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appid: APP_ID,
    measurementId: MEASUREMENT_ID
}

// TODO: Test why removing this causes the API_KEY request in login.tsx to have quotation marks appended,
// TODO: causing an invalid-api-key error. Is console.log somehow removing the quotes???
console.log(firebaseConfig.apiKey);
console.log(API_KEY);

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;