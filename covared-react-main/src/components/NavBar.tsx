import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './../AuthContext';
import { AIWriterAPI } from "../api/AIWriterAPI";
import './LandingPage.css';
import './NavBar.css';

const images = {
  logo: { name: "logo", image: `${process.env.PUBLIC_URL}/Images/thumbnail2-nobg.png` }, 
};

const NavBar: React.FC = () => {
  const { isLoggedIn, email, setIsLoggedIn, setEmail } = useAuth();

  const logout = async () => {
    try {
      await AIWriterAPI.postAuthLogout();
      setIsLoggedIn(false);
      setEmail('');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <Link to="/">
          BreezEd.co.uk
          <img src={images.logo.image} alt={images.logo.name} style={{ maxWidth: '4rem', height: 'auto' }} />
        </Link>
        <span>{isLoggedIn ? `${email} logged in` : 'Not logged in'}</span>
      </div>
      <div className="navbar-right">
        <Link className="space-right" to="/pricing">Pricing</Link>
        {isLoggedIn ? (
          <button onClick={logout} className="btn btn-custom-standard">Logout</button>
        ) : (
          <Link to="/login" className="btn btn-custom-standard">Login / Register</Link>
        )}
      </div>
    </div>
  );
};

export default NavBar;
