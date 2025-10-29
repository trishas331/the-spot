import React, { useState } from 'react';
import { db, auth } from '../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';

function PlaceForm({ user, onPlaceAdded }) {
  const [newPlace, setNewPlace] = useState({
    Name: '',
    Category: '',
    Location: '',
    Description: '',
    ImageUrl: '',
    Rating: '',
  });

  const handleChange = (e) => {
    setNewPlace({
      ...newPlace,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddPlace = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('You must sign in to add a place.');
      return;
    }

    if (!newPlace.Name || !newPlace.Category || !newPlace.Location || !newPlace.Description) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      await addDoc(collection(db, 'Places'), {
        ...newPlace,
        userId: user.uid,
        userName: user.displayName,
      });

      setNewPlace({
        Name: '',
        Category: '',
        Location: '',
        Description: '',
        ImageUrl: '',
        Rating: '',
      });

      onPlaceAdded();
      console.log('✅ Place added');
    } catch (error) {
      console.error('❌ Error adding place:', error);
    }
  };

  return (
    user && (
      <form className="place-form" onSubmit={handleAddPlace}>
        <input name="Name" placeholder="Name" value={newPlace.Name} onChange={handleChange} required />
        <input name="Category" placeholder="Category" value={newPlace.Category} onChange={handleChange} required />
        <input name="Location" placeholder="Location" value={newPlace.Location} onChange={handleChange} required />
        <textarea name="Description" placeholder="Description" value={newPlace.Description} onChange={handleChange} required />
        <input name="ImageUrl" placeholder="Image URL (optional)" value={newPlace.ImageUrl} onChange={handleChange} />
        <input name="Rating" placeholder="Rating (optional)" value={newPlace.Rating} onChange={handleChange} />
        <button type="submit">Add Place</button>
      </form>
    )
  );
}

export default PlaceForm;
