import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar'; 
import { useAuth } from './../AuthContext';
import { AIWriterAPI } from "../api/AIWriterAPI";
import './LandingPage.css';
import './LoginPage.css';

const images = {
  logo: { name: "logo", image: `${process.env.PUBLIC_URL}/Images/thumbnail2-nobg.png` }, 
};

const LoginPage: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [email, setEmail] = useState(''); 
  const [isLoading, setIsLoading] = useState(false); 

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/report-writer');
    }
  }, []);


  const handleEmailChange = (event: any) => {
    setEmail(event.target.value);
  };

  const SendEmailCodeNavigate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const response = await AIWriterAPI.postEmail(email);
    localStorage.setItem('email', email);
    navigate('/check-email-code');
    setIsLoading(false);
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-10">
          <NavBar /> 
          <div className="page-container">
            <img src={images.logo.image} alt={images.logo.name} style={{ height: '10rem', width: 'auto', marginTop: '5rem' }} />
            <h1>BreezEd.co.uk</h1>
            <p>You need to log in to access the teacher tools or subscribe.</p>
            <p>There is no need to create a password.</p>
            <p>Enter your email, then enter the one-time passcode.</p>
            <h5>Email Address</h5>
            <div className="login-box">
              <form onSubmit={SendEmailCodeNavigate}>
                <input type="email" name="email" placeholder="Email Address" value={email} onChange={handleEmailChange} autoComplete="email" />
                <button className='btn btn-custom-standard' disabled={isLoading}>Login / Register with email</button>
              </form>
              {/* put these in later
              <hr />
              <button className='btn btn-custom-green'>Log in with Google</button>
              <button className='btn btn-custom-red'>Log in with Microsoft</button>
              */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
