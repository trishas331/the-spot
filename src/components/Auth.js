import React from 'react';
import { auth } from '../firebase/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

function Auth({ user, setUser }) {
  const provider = new GoogleAuthProvider();

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      console.log('✅ Signed in:', result.user.displayName);
    } catch (error) {
      console.error('❌ Error signing in:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      console.log('✅ Signed out');
    } catch (error) {
      console.error('❌ Error signing out:', error);
    }
  };

  return (
    <div className="auth-buttons">
      {user ? (
        <>
          <p>Signed in as: {user.displayName}</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </>
      ) : (
        <button onClick={handleSignIn}>Sign in with Google</button>
      )}
    </div>
  );
}

export default Auth;
