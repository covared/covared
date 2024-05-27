import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import { useAuth } from './../AuthContext';
import { AIWriterAPI } from "../api/AIWriterAPI";
import './LandingPage.css';
import './LoginPage.css';
import './CheckEmailCode.css';
import { set } from 'react-ga';

const images = {
  logo: { name: "logo", image: `${process.env.PUBLIC_URL}/Images/thumbnail2-nobg.png` }, 
};

const CheckEmailCode: React.FC = () => {
  const { setIsLoggedIn, setEmail, isLoggedIn } = useAuth();
  const [email] = useState(() => localStorage.getItem('email') || '');
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const [shake, setShake] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/report-writer');
    }
  }, []);

  const handleCodeChange = (event: any) => {
    const value = event.target.value.slice(0, 6).replace(/[^0-9]/gi, '');
    setCode(value);
    setErrorMessage(''); 
    setShake(false); 
  };

  const CheckEmailCodeNavigate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true); // Start loading
    try {
      const response = await AIWriterAPI.postCode(code, email);
      if (response['success']) {
        setIsLoggedIn(true);
        setEmail(email);
        navigate('/report-writer');
      } else {
        setErrorMessage('Wrong verification code, please try again.');
        setShake(true);
      }
    } catch (error) {
      setErrorMessage('An error occurred, please try again.');
    }
    setIsLoading(false);
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-10">
          <NavBar /> 
          <div className={`page-container ${shake ? 'shake' : ''}`}>
            <img src={images.logo.image} alt={images.logo.name} style={{ height: '10rem', width: 'auto', marginTop: '5rem' }} />
            <h1>BreezEd.co.uk</h1>
            <h5>You have been sent a 6 digit code</h5>
            <h5>Please enter it below</h5>
            <div className="login-box">
              <form onSubmit={CheckEmailCodeNavigate}>
                <input type="code" placeholder="Verification Code" value={code} onChange={handleCodeChange}  />
                <button className='btn btn-custom-standard' disabled={isLoading}>Submit Code</button>
              </form>
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckEmailCode;