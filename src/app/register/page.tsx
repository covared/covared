// app/register/page.tsx
"use client";

import RegisterForm from '@/components/RegistrationForm';
import NavBar from "@/components/NavBar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";


export default function Register() {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={10}>
          <NavBar />
            <div className="page-container">
                <h1>Register your Interest</h1>
                <RegisterForm />
            </div>
        </Col>
      </Row>
    </Container>
  );
}