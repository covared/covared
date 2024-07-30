"use client";
import React, { useState, useEffect } from "react";
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { useAuth } from "@/context/AuthContext";
import NavBar from "@/components/NavBar";
import { AIWriterAPI } from "../api/AIWriterAPI";
import { Container, Row, Col } from 'react-bootstrap';


// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// This is your test public API key.
// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY_TEST?? '');
// This is your live public API key.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY_LIVE?? '');


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
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={10}>
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
          </Col>
      </Row>
    </Container>
  )
}

export default Checkout;