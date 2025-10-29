import React from 'react';
import SpotCard from '../components/SpotCard';

const spots = [
  {
    name: "Sunny Cafe",
    category: "Coffee Shop",
    image: "https://source.unsplash.com/250x150/?coffee,cafe",
    vibe: "Minimalist"
  },
  {
    name: "Bloom Boutique",
    category: "Fashion",
    image: "https://source.unsplash.com/250x150/?fashion,store",
    vibe: "Boho"
  },
  {
    name: "Matcha Heaven",
    category: "Desserts",
    image: "https://source.unsplash.com/250x150/?matcha,cake",
    vibe: "Aesthetic"
  }
];

function Discover() {
  return (
    <div>
      <h1>Discover Spots</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {spots.map((spot, index) => (
          <SpotCard
            key={index}
            name={spot.name}
            category={spot.category}
            image={spot.image}
            vibe={spot.vibe}
          />
        ))}
      </div>
    </div>
  );
}

export default Discover;
