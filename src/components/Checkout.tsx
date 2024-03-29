import React, { useState, useEffect } from "react";
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { AIWriterAPI } from './../api/AIWriterAPI';
import NavBar from './NavBar'; 
import { useAuth } from './../AuthContext';
import './LandingPage.css';


// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// This is your test public API key.
// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY_TEST?? '');
// This is your live public API key.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY_LIVE?? '');


const Checkout: React.FC = () => {
  const { isLoggedIn, email } = useAuth();
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    const userEmail: string = isLoggedIn ? email : '';
    const planType = localStorage.getItem('selectedPlanType')?? '';
    AIWriterAPI.createCheckoutSession(userEmail, planType)
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => console.error("Error in creating checkout session:", error));
  }, []);

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-10">
          <NavBar /> 
					<div id="checkout">
						{clientSecret && (
								<EmbeddedCheckoutProvider
								stripe={stripePromise}
								options={{clientSecret}}
								>
								<EmbeddedCheckout />
								</EmbeddedCheckoutProvider>
						)}
					</div>
				</div>
			</div>
		</div>
  )
}

export default Checkout;