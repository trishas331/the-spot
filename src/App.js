import React, { useState, useEffect } from 'react';
import './App.css';
import { auth } from './firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Auth from './components/Auth';
import PlaceForm from './components/PlaceForm';
import PlacesList from './components/PlacesList';

function App() {
  const [user, setUser] = useState(null);
  const [refreshPlaces, setRefreshPlaces] = useState(0);

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handlePlaceAdded = () => {
    setRefreshPlaces(prev => prev + 1);
  };

  return (
    <div className="app-container">
      <h1>The Spot 🏙️</h1>
      <p>Discover and share your favorite spots around town.</p>

      <Auth user={user} setUser={setUser} />

      <PlaceForm user={user} onPlaceAdded={handlePlaceAdded} />

      <PlacesList user={user} refreshTrigger={refreshPlaces} />
    </div>
  );
}

export default App;
