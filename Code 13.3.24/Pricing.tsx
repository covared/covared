import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar'; 
import { useAuth } from './../AuthContext';
import './LandingPage.css';
import './Pricing.css';

const Pricing: React.FC = () => {
  const [showMultipleSubs, setShowMultipleSubs] = useState(false);
	const { isLoggedIn, isSubscribedMonthly, isSubscribedLifetime } = useAuth();

  const navigate = useNavigate();

	const handleButtonClick = (planType: string) => {
		// Set the selected plan type in local storage for persistence
		localStorage.setItem('selectedPlanType', planType);

		// Navigate based on the login status and plan type
		if (planType === "Free") {
			navigate(isLoggedIn ? '/report-writer' : '/login');
		} else {
      if (planType === "Monthly Subscription" && isSubscribedMonthly || isSubscribedLifetime) {
        setShowMultipleSubs(true);
      }
      else if (planType === "Lifetime Subscription" && isSubscribedLifetime) {
        setShowMultipleSubs(true);
      }
      else {
        navigate(isLoggedIn ? '/checkout' : '/login'); 
      }
		}
	};

  const pricingOptions = [
    {
      title: "Free",
      description: "Ideal for getting started.",
      price: "£0",
      frequency: "/month",
      features: {
        "Unlimited report writer basic layout": true,
        "Limited (5) report writer better layout": false,
        "Limited access to new features": false,
      },
    },
    {
      title: "Monthly Subscription",
      description: "All available features, pay per month",
      price: "£5",
      frequency: "/month",
      features: {
        "Unlimited report writer basic layout": true,
        "Unlimited report writer better layout": true,
        "Unlimited access to new features": true,
        "Early access to features in testing": true,
        "Email support access": true,
      },
    },
    {
      title: "Lifetime Subscription",
      description: "All available features, limited time offer, pay once for lifetime access",
      price: "£15",
      frequency: " one-time",
      features: {
        "Unlimited report writer basic layout": true,
        "Unlimited report writer better layout": true,
        "Unlimited access to new features": true,
        "Early access to features in testing": true,
        "Email support access": true,
        "Access to all of this forever": true,
      },
    },
  ];

  
  const handleCloseMultipleSubs = () => setShowMultipleSubs(false);
 

  return (
    <div className="container pricing-page">
      <div className="row justify-content-center">
        <div className="col-10">
          <NavBar /> 
          <h1>Pricing</h1>
          <div className="row">
            {pricingOptions.map((option, index) => (
            <div key={index} className="col-md-4">
              <div className="card pricing-card">
                <div className="card-body">
                  <div className="card-top">
                    <h5 className="card-title">{option.title}</h5>
                    <p className="card-text">{option.description}</p>
                  </div>
                  <p className="price">{option.price} {option.frequency}</p>
                  <ul className="features-list mt-2">
                  {Object.entries(option.features).map(([feature, available]) => (
                      <li key={feature} className={available ? "tick" : "cross"}>
                        {available ? 
                          <i className="bi bi-check-lg icon-large"></i> : 
                          <i className="bi bi-x-lg"></i>
                        } {feature}
                      </li>
                  ))}
                  </ul>
                  <button className="btn btn-primary checkout-button" onClick={() => handleButtonClick(option.title)} >
                    {option.title === "Free" ? "Get Started Now" : "Checkout Now"}
                  </button>
                </div>
              </div>
            </div>
            ))}
          </div>
          <Modal show={showMultipleSubs} onHide={handleCloseMultipleSubs}>
            <Modal.Header closeButton>
              <Modal.Title>Warning</Modal.Title>
            </Modal.Header>
            <Modal.Body>You cannot subscribe when already subscribed.</Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleCloseMultipleSubs}>
                OK
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
