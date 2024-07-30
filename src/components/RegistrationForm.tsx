// components/RegisterForm.tsx
"use client";
import React from "react";
import { useRouter } from 'next/navigation';  // Import useRouter
import { Container } from "react-bootstrap";
import { useState, ChangeEvent, FormEvent } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';


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
  const isAgreeYes = formData.attendance === 'yes';
  const isAlternativeDateYes = formData.altdate === 'yes';

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
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
      alert('You have been successfully registered for this event!');
    } else {
      alert(response)
      alert('Registration failed. Please, contact the admin');
    }
    router.push('/');  // Redirect to home page on success
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Form.Group as={Row} className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label column sm="4">Name:</Form.Label>
          <Col sm="8">
            <Form.Control as="input" name="name" value={formData.name} onChange={handleChange} required />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="exampleForm.ControlInput2">
          <Form.Label column sm="4">School Name:</Form.Label>
          <Col sm="8">
            <Form.Control as="input" name="schoolname" value={formData.schoolname} onChange={handleChange} required />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="exampleForm.ControlInput3">
          <Form.Label column sm="4">Email Address:</Form.Label>
          <Col sm="8">
            <Form.Control type="email" name="email" placeholder="email@school.co.uk" value={formData.email} 
                          onChange={handleChange} required 
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="exampleForm.ControlTextarea1">
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
        <Form.Group as={Row} className="mb-3" controlId="exampleForm.ControlInput4">
          <Form.Label column sm={4}>Select a Date:</Form.Label>
          <Col sm={8}>
            <Form.Control type="date" name="newdate" value={formData.newdate} onChange={handleChange} />
          </Col>
        </Form.Group>
      )}
        <Button type="submit" variant="primary" disabled={(formData.newdate === '') && (!isAgreeYes || isAlternativeDateYes)}>
          Submit Registration
        </Button>
      </Form>
    </Container>
  );
}
