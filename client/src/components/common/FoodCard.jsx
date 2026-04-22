import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, MapPin } from 'lucide-react';
import getImageUrl from '../../utils/imageUtils';

const FoodCard = ({ restaurant }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="card"
      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
      style={{ cursor: 'pointer', overflow: 'hidden' }}
    >
      <div style={{ position: 'relative', height: '180px' }}>
        <img
          src={getImageUrl(restaurant.image)}
          alt={restaurant.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          backgroundColor: 'white',
          padding: '4px 8px',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '12px',
          fontWeight: 600,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <Star size={14} fill="#FFD700" color="#FFD700" />
          <span>{restaurant.rating}</span>
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        <h3 style={{ marginBottom: '8px', fontSize: '1.2rem' }}>{restaurant.name}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '15px' }}>
          {restaurant.cuisine} • {restaurant.description.substring(0, 50)}...
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', borderTop: '1px solid var(--border)', paddingTop: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '12px' }}>
            <Clock size={14} />
            <span>25-35 min</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '12px' }}>
            <MapPin size={14} />
            <span>2.4 km</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FoodCard;
