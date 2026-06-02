import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    signOut,
    sendEmailVerification
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDAjWP999YXQdTgT2cwlkdbdfOQz2EWJHs",
    authDomain: "hajoubi.firebaseapp.com",
    projectId: "hajoubi",
    storageBucket: "hajoubi.firebasestorage.app",
    messagingSenderId: "730167198068",
    appId: "1:730167198068:web:3a95fc978870585da5ec21",
    measurementId: "G-GVMTQQEY5G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    client_id: '730167198068-qnthplfv76jqj18ue68ij8dgbjcggm3h.apps.googleusercontent.com'
});

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const authSection = document.getElementById('auth-section');
    if (!authSection) return; // Exit if not on a page with auth

    const signupForm = document.getElementById('signup-form');
    const signinForm = document.getElementById('signin-form');
    const loggedInSection = document.getElementById('logged-in-section');

    // Toggles
    const showSigninLink = document.getElementById('show-signin');
    const showSignupLink = document.getElementById('show-signup');
    const googleBtn = document.getElementById('google-signin-btn');
    const logoutBtn = document.getElementById('logout-btn');

    // User display
    const userEmailDisplay = document.getElementById('user-email');
    const authErrorMsg = document.getElementById('auth-error-msg');

    // Forms
    const formSignup = document.getElementById('form-signup');
    const formSignin = document.getElementById('form-signin');

    // --- UI State Management ---
    function showSignin() {
        signupForm.style.display = 'none';
        loggedInSection.style.display = 'none';
        signinForm.style.display = 'block';
        authErrorMsg.textContent = '';
    }

    function showSignup() {
        signinForm.style.display = 'none';
        loggedInSection.style.display = 'none';
        signupForm.style.display = 'block';
        authErrorMsg.textContent = '';
    }

    function showLoggedIn(user) {
        signinForm.style.display = 'none';
        signupForm.style.display = 'none';
        loggedInSection.style.display = 'block';
        userEmailDisplay.textContent = user.email || user.displayName || 'User';
        authErrorMsg.textContent = '';
    }

    function showError(err) {
        console.error("Auth Error:", err);
        // Clean up Firebase error codes for users
        let msg = err.message;
        if (err.code === 'auth/email-already-in-use') msg = "This email is already registered.";
        if (err.code === 'auth/invalid-credential') msg = "Incorrect email or password.";
        if (err.code === 'auth/weak-password') msg = "Password should be at least 6 characters.";
        authErrorMsg.textContent = msg;
    }

    // --- Event Listeners ---
    if (showSigninLink) showSigninLink.addEventListener('click', (e) => { e.preventDefault(); showSignin(); });
    if (showSignupLink) showSignupLink.addEventListener('click', (e) => { e.preventDefault(); showSignup(); });

    // Handle Sign Up
    if (formSignup) {
        formSignup.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = formSignup.querySelector('input[name="email"]').value;
            const password = formSignup.querySelector('input[name="password"]').value;
            const confirm = formSignup.querySelector('input[name="confirm-password"]').value;

            if (password !== confirm) {
                authErrorMsg.textContent = "Passwords do not match.";
                return;
            }

            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    sendEmailVerification(user)
                        .then(() => {
                            authErrorMsg.style.color = "#4CAF50"; // Green for success
                            authErrorMsg.textContent = "Sign up successful! Please check your email and verify your account.";
                            setTimeout(() => {
                                authErrorMsg.style.color = "#ff4d4d"; // Reset back to red
                                showSignin();
                            }, 5000);
                        })
                        .catch((error) => showError(error));
                    formSignup.reset();
                })
                .catch((error) => showError(error));
        });
    }

    // Handle Sign In
    if (formSignin) {
        formSignin.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = formSignin.querySelector('input[name="email"]').value;
            const password = formSignin.querySelector('input[name="password"]').value;

            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    if (!user.emailVerified) {
                        authErrorMsg.textContent = "Please verify your email before signing in.";
                        signOut(auth); // Sign them out immediately
                        formSignin.reset();
                    }
                    // If verified, automatically handled by onAuthStateChanged
                })
                .catch((error) => showError(error));
        });
    }

    // Handle Google Sign in
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            signInWithPopup(auth, googleProvider)
                .then((result) => {
                    // Handle success
                }).catch((error) => showError(error));
        });
    }

    // Handle Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            signOut(auth).then(() => {
                showSignup(); // Default back to sign up screen
            }).catch((error) => showError(error));
        });
    }

    // --- Auth State Observer ---
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // Check if user has verified their email OR signed in with Google (which often auto-verifies)
            if (user.emailVerified || user.providerData.some(p => p.providerId === 'google.com')) {
                showLoggedIn(user);
            } else {
                authErrorMsg.textContent = "Please verify your email before signing in.";
                signOut(auth);
                showSignin();
            }
        } else {
            // User is signed out
            // By default, if not signed in, show Sign Up
            if (loggedInSection.style.display !== 'none') {
                showSignup();
            }
        }
    });

});
