// components/RegisterForm.tsx
"use client";
import React from "react";
import { useRouter } from 'next/navigation';  // Import useRouter
import Container from "react-bootstrap/Container";
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";



interface FormData {
  name: string;
  schoolname: string;
  email: string;
  questions: string;
  attendance: string;
  altdate: string;
  newdate: string;
}

export default function RegisterForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    schoolname: '',
    email: '',
    questions: '',
    attendance: '',
    altdate: '',
    newdate: ''
  });
  const router = useRouter();  // Initialize useRouter
  const isAlternativeDateYes = formData.altdate === 'yes';

  // set alert variables
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState<React.ReactNode | string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      let newData = { ...prevData, [name]: value };

      // Reset dependent fields when their conditions change
      if (name === 'attendance' && value === 'yes') {
        newData = { ...newData, altdate: '', newdate: '' };
      } else if (name === 'attendance' && value === 'no') {
        newData = { ...newData, altdate: '', newdate: '' };
      } else if (name === 'altdate' && value === 'no') {
        newData = { ...newData, newdate: '' };
      }

      return newData;
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      setAlertMessage('You have been successfully registered for this event!');
    } else {
      const errorData = await response.json();
      const errorMessage = `Error: ${errorData.message}`;
      const additionalMessage = 'Registration failed. Please, contact the admin';
      setAlertMessage(`${errorMessage}\n${additionalMessage}`);
    }
    setShowAlert(true);
  };
    
  const handleCloseAlert = () => {
    setShowAlert(false);
    
    router.push('/');  // Redirect to home page on success
  };

  // Auto-dismiss and redirect after 5 seconds if not manually dismissed
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(handleCloseAlert, 5000); // 5 seconds

      return () => clearTimeout(timer); // Cleanup the timer if the component unmounts or showAlert changes
    }
  }, [showAlert]);

  // Determine if the submit button should be enabled
  const isSubmitEnabled = () => {
    if (formData.attendance === 'yes') return true;
    if (formData.attendance === 'no') {
      if (formData.altdate === 'no') return true;
      if (formData.altdate === 'yes' && formData.newdate) return true;
    }
    return false;
  };

  return (
    <Container>
      {showAlert && (
        <Alert
          variant="success"
          onClose={handleCloseAlert}
          dismissible
        >
          {alertMessage}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group as={Row} className="mb-3" controlId="Form.ControlInput1">
          <Form.Label column sm="4">Name:</Form.Label>
          <Col sm="8">
            <Form.Control as="input" name="name" value={formData.name} onChange={handleChange} required />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="Form.ControlInput2">
          <Form.Label column sm="4">School Name:</Form.Label>
          <Col sm="8">
            <Form.Control as="input" name="schoolname" value={formData.schoolname} onChange={handleChange} required />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="Form.ControlInput3">
          <Form.Label column sm="4">Email Address:</Form.Label>
          <Col sm="8">
            <Form.Control type="email" name="email" placeholder="email@school.co.uk" value={formData.email} 
                          onChange={handleChange} required 
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="Form.ControlTextarea1">
          <Form.Label column sm="4">I've some questions about joining the program:</Form.Label>
          <Col sm="8">
            <Form.Control as="textarea" placeholder="Type your questions here" rows={3} name="questions" 
                          value={formData.questions} onChange={handleChange} required 
            />
          </Col>
        </Form.Group>
      <fieldset className="mb-3">
        <Form.Group as={Row}>
          <Form.Label as="legend" column sm={4}>
            My school can join the pilot kick-off on Wednesday 2 October, 2024
          </Form.Label>
          <Col sm={4}>
            <Form.Check
              type="radio"
              label="Yes"
              name="attendance"
              id="formHorizontalRadios1"
              value="yes"
              checked={formData.attendance === 'yes'}
              onChange={handleChange}
            />
          </Col>
          <Col sm={4}>
            <Form.Check
              type="radio"
              label="No"
              name="attendance"
              id="formHorizontalRadios2"
              value="no"
              checked={formData.attendance === 'no'}
              onChange={handleChange}
            />
          </Col>
        </Form.Group>
      </fieldset>
      
      {formData.attendance === 'no' && (
        <fieldset className="mb-3">
          <Form.Group as={Row}>
            <Form.Label as="legend" column sm={4}>
              I'd like to consider another suitable date:
            </Form.Label>
            <Col sm={4}>
              <Form.Check
                type="radio"
                label="Yes"
                name="altdate"
                id="formHorizontalRadios3"
                value="yes"
                checked={formData.altdate === 'yes'} onChange={handleChange}
              />
            </Col>
            <Col sm={4}>
              <Form.Check
                type="radio"
                label="No"
                name="altdate"
                id="formHorizontalRadios4"
                value="no"
                checked={formData.altdate === 'no'} onChange={handleChange}
              />
            </Col>
          </Form.Group>
        </fieldset>
      )}

      {isAlternativeDateYes && (
        <Form.Group as={Row} className="mb-3" controlId="Form.ControlInput4">
          <Form.Label column sm={4}>Select a Date:</Form.Label>
          <Col sm={8}>
            <Form.Control type="date" name="newdate" value={formData.newdate} onChange={handleChange} />
          </Col>
        </Form.Group>
      )}
        <Button type="submit" variant="primary" disabled={!isSubmitEnabled()}>
          Submit Interest
        </Button>
      </Form>
    </Container>
  );
}
