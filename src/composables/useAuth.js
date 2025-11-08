import { auth } from '@/firebase'; //Importación de mi archivo firebase.js
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';
import { ref } from 'vue';

const user = ref(null);

onAuthStateChanged(auth, (firebaseUser) => {
  user.value = firebaseUser;
});

export function useAuth() {
  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };
  const register = async (email, password) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };
  const logout = async () => {
    await signOut(auth);
  };
  const waitForAuthReady = () => {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, () => {
        unsubscribe();
        resolve();
      });
    });
  };
  return {
    user,
    login,
    register,
    logout,
    waitForAuthReady
  };
}
