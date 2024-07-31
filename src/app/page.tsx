"use client";
import { useState } from 'react';
import NavBar from "@/components/NavBar";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";



export default function index() {
  const [showForm, setShowForm] = useState(false);

  const handleRegisterClick = () => {
    setShowForm(true);
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={10}>
          <NavBar />
            <div>
              <br />
            <h1>Welcome to Springsverse</h1>
            <br></br>
            <div className="text-block"></div>
              <h2>
                Springsverse is a dynamic way to engage more students in science and maths.
              </h2>
            </div>
            <br></br>
            <div className="button-block">
              <Button as='a' href="/register" variant="primary">Register your interest for the Springsverse pilot kick-off</Button>
            </div>
            <br></br>
            <div className="buttom-text">
              <p>
                Springsverse AI-powered platform offers you new, innovative tools to engage all your students in science 
                and maths and ready-to-go resources to allow your teachers to do their job to their optimal.
              </p>
              <p>
                With Springsverse, you are going to discover:<b />
                New, simple tools that would engage and improve all your students' outcome in science and maths.
              </p>
              <p>
                Ready-to-go resources to build their skills in using science and maths.
              </p>
              <p>
                Topping that is connecting your school to employers with our <strong>exclusive</strong> live streaming of scientists, 
                mathematicians and professionals doing science and maths in their job to tell your students their stories 
                and to allow your students to see how they use science and maths in the real world.
              </p>
              <p>
                <strong>Join</strong> Springsverse pilot waiting list and start steering your school with new, dynamic, 
                innovative tools and ready-to-go resources to build your future scientists and mathematicians.
              </p>
          </div>
          <br></br>
            <div className="button-block">
              <Button as='a' href="/register" variant="primary">Register your interest for the Springsverse pilot kick-off</Button>
            </div>
        </Col>
      </Row>
    </Container>
  )
}
