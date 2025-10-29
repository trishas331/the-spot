import React from 'react';
import './SpotCard.css';

function SpotCard({ place, onDelete, user }) {
  return (
    <div className="spot-card">
      {place.ImageUrl && (
        <img src={place.ImageUrl} alt={place.Name} className="spot-image" />
      )}
      <div className="spot-info">
        <h2>{place.Name}</h2>
        <p><strong>Category:</strong> {place.Category}</p>
        <p><strong>Location:</strong> {place.Location}</p>
        <p>{place.Description}</p>
        {place.Rating && (
          <p><strong>Rating:</strong> {place.Rating}</p>
        )}
        {place.userName && (
          <p><em>Added by: {place.userName}</em></p>
        )}
        <button onClick={() => onDelete(place.id)}>Delete</button>
      </div>
    </div>
  );
}

export default SpotCard;