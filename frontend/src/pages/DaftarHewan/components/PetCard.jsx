import React from 'react';
import { Link } from 'react-router-dom';
import './PetCard.css';

const PetCard = ({ pet }) => {
  const imageUrl = pet.image_url 
    ? (pet.image_url.startsWith('http') ? pet.image_url : `http://localhost:3000${pet.image_url}`) 
    : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=500&q=80';

  return (
    <Link to={`/daftar-hewan/${pet.id}`} style={{ textDecoration: 'none' }}>
      <div className="dh-pet-card">
        <div className="dh-pet-image-container">
          <img src={imageUrl} alt={pet.name} className="dh-pet-image" />
        </div>
        <div className="dh-pet-info">
          <h3 className="dh-pet-name">{pet.name}</h3>
          <div className="dh-pet-badges">
            <span className="dh-pet-badge">{pet.gender}</span>
            <span className="dh-pet-badge">{pet.age} {pet.age === 1 ? 'month' : 'months'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PetCard;
