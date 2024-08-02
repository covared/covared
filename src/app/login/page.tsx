"use client";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

import NavBar from "@/components/NavBar";
import { useAuth } from "@/context/AuthContext";
import { AIWriterAPI } from "../api/AIWriterAPI";


const LoginPage: React.FC = () => {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/report-writer");
    }
  }, []);

  const handleEmailChange = (event: any) => {
    setEmail(event.target.value);
  };

  const SendEmailCodeNavigate = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setIsLoading(true);
    setError(undefined);
    const res = await AIWriterAPI.postEmail(email);

    if (res.success === true) {
      localStorage.setItem("email", email);
      router.push("/check-email-code");
    } else {
      setError(res.message);
    }
    setIsLoading(false);
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={10}>
          <NavBar />
          {error && <Alert variant="danger">{error}</Alert>}
          <br></br>
          <div className="page-container">
            <h1>Welcome to Springsverse</h1>
            <br></br>
            <p>You need to log in to access the teacher tools or subscribe.</p>
            <p>There is no need to create a password.</p>
            <p>Enter your email, then enter the one-time passcode.</p>
            <div>
              <Form onSubmit={SendEmailCodeNavigate}>
                <Form.Group className="mb-3" controlId="loginemail">
                <Form.Label>Email address</Form.Label>
                
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={handleEmailChange}
                  autoComplete="email"
                />
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isLoading}
                >
                  Login / Register with email
                </Button>
                </Form.Group>
              </Form>
              {/* put these in later
              <hr />
              <button className='btn btn-custom-green'>Log in with Google</button>
              <button className='btn btn-custom-red'>Log in with Microsoft</button>
              */}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
