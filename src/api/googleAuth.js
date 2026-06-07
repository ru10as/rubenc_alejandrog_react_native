import { GoogleSignin } from '@react-native-google-signin/google-signin';

// IMPORTANTE: este Client ID debe ser el "Web client" del MISMO proyecto Firebase
// que está en src/api/firebaseConfig.js (the12thman2 — project number 35486353245).
// Lo obtienes en Firebase Console → Authentication → Sign-in method → Google →
// "Web SDK configuration" → Web client ID.
const WEB_CLIENT_ID = '35486353245-6ijrrm69jcqbjld6mo7gh7er9b7ddm4b.apps.googleusercontent.com';

let configured = false;

export const configureGoogleSignIn = () => {
    if (configured) return;
    GoogleSignin.configure({
        webClientId: WEB_CLIENT_ID,
        offlineAccess: true,
    });
    configured = true;
};
