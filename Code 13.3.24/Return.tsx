import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AIWriterAPI } from './../api/AIWriterAPI';
import NavBar from './NavBar'; 
import './LandingPage.css';
import './Return.css';

const Return: React.FC = () => {
	const [status, setStatus] = useState(null);
	const [customerEmail, setCustomerEmail] = useState('');

	const navigate = useNavigate();

	useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      AIWriterAPI.checkSessionStatus(sessionId)
        .then((data) => {
          setStatus(data.status);
          setCustomerEmail(data.customer_email);
        })
        .catch((error) => console.error("Error fetching session status:", error));
    } else {
      navigate("/checkout"); // Redirect if no session ID is found
    }
  }, [navigate]);

	const loginNavigate = () => {
    navigate('/login');
  }

	if (status === 'open') {
		navigate("/checkout");
		return null;
	}

	if (status === 'complete') {
		return (
			<div className="container ">
				<div className="row justify-content-center">
					<div className="col-10">
						<NavBar /> 
						<div className="return-page">
							<h1>Order Complete</h1>
							<p>
								We appreciate your business! A confirmation email will be sent to {customerEmail}.
							</p>
							<p>
								If you have any questions, please email <a href="mailto:info@covared.com">info@covared.com</a>.
							</p>
							<button className="btn btn-custom-standard mt-1" onClick={loginNavigate}>Get Started</button>
						</div>
					</div>
				</div>
			</div>
		)
	}

	return null;
}

export default Return;