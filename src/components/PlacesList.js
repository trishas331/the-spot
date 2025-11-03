import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import SpotCard from './SpotCard';

function PlacesList({ user, refreshTrigger }) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState('');
  const [filteredPlaces, setFilteredPlaces] = useState([]);

  useEffect(() => {
    fetchPlaces();
  }, [refreshTrigger]);

  // Filter places whenever search changes
  useEffect(() => {
    if (searchLocation.trim() === '') {
      setFilteredPlaces(places);
    } else {
      const filtered = places.filter(place =>
        place.Location.toLowerCase().includes(searchLocation.toLowerCase())
      );
      setFilteredPlaces(filtered);
    }
  }, [searchLocation, places]);

  const fetchPlaces = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Places'));
      const placesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPlaces(placesList);
    } catch (error) {
      console.error('Error fetching places:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlace = async (id) => {
    try {
      await deleteDoc(doc(db, 'Places', id));
      setPlaces((prev) => prev.filter((place) => place.id !== id));
      console.log('✅ Place deleted');
    } catch (error) {
      console.error('Error deleting place:', error);
    }
  };

  const searchTikTok = async (query) => {
    if (!query.trim()) {
      alert('Enter a location to search!');
      return;
    }
  
    try {
      console.log(`🔍 Searching TikTok for: ${query}`);
      const response = await fetch(`http://localhost:8000/api/tiktok/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (response.ok) {
        console.log('✅ TikTok search successful:', data);
        alert(`Found ${data.spots.length} trending spots!`);
        fetchPlaces(); // Refresh the list
      } else {
        alert('Error searching TikTok: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to search TikTok');
    }
  };

  return (
    <div>
      <h2>Explore Spots 🔍</h2>
      
      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by location (e.g., New York, Brooklyn)..."
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          className="search-input"
        />
        <button 
          className="search-tiktok-btn"
          onClick={() => searchTikTok(searchLocation)}
        >
          🔥 Search TikTok
        </button>
      </div>

      {loading ? (
        <p className="loading-text">Loading places...</p>
      ) : filteredPlaces.length === 0 ? (
        <p className="no-results">
          {searchLocation 
            ? `No spots found in "${searchLocation}". Try a different location!` 
            : 'No places found yet. Add one to get started!'}
        </p>
      ) : (
        <div>
          <p className="results-count">
            Found {filteredPlaces.length} spot{filteredPlaces.length !== 1 ? 's' : ''} 
            {searchLocation ? ` in ${searchLocation}` : ''}
          </p>
          <div className="places-grid">
            {filteredPlaces.map((place) => (
              <SpotCard
                key={place.id}
                place={place}
                onDelete={handleDeletePlace}
                user={user}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PlacesList;