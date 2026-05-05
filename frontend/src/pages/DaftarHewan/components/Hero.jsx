import React from 'react';
import './Hero.css';
import heroBg from '../../../assets/image_8.png';
import logoPaw from '../../../assets/logo/logo2-removebg-preview 2.png';

const Hero = () => {
  return (
    <div className="dh-hero">
      <div className="dh-hero-bg" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="dh-hero-overlay"></div>
      </div>
      
      <div className="dh-hero-content">
        <div className="dh-paw-icon-large">
          <img src={logoPaw} alt="Paw" style={{ height: '64px' }} />
        </div>
        <h1 className="dh-hero-title">Daftar Hewan</h1>
        <p className="dh-hero-subtitle">temukan hewan kesayangan yang siap diadopsi</p>
      </div>
    </div>
  );
};

export default Hero;
