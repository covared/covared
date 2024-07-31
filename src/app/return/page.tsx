"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import { AIWriterAPI } from "../api/AIWriterAPI";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";


const Return: React.FC = () => {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get("session_id");

    if (sessionId) {
      AIWriterAPI.checkSessionStatus(sessionId)
        .then((data) => {
          setStatus(data.status);
          setCustomerEmail(data.customer_email);
        })
        .catch((error) =>
          console.error("Error fetching session status:", error)
        );
    } else {
      router.push("/checkout"); // Redirect if no session ID is found
    }
  }, [router]);

  const loginNavigate = () => {
    router.push("/login");
  };

  if (status === "open") {
    router.push("/checkout");
    return null;
  }

  if (status === "complete") {
    return (
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={10}>
            <NavBar />
            <div className="return-page">
              <h1>Order Complete</h1>
              <p>
                We appreciate your business! A confirmation email will be sent
                to {customerEmail}.
              </p>
              <p>
                If you have any questions, please email{" "}
                <a href={process.env.INFO_EMAIL}>info@springsverse.co.uk</a>.
              </p>
              <button
                className="btn btn-custom-standard mt-1"
                onClick={loginNavigate}
              >
                Get Started
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  return null;
};

export default Return;
