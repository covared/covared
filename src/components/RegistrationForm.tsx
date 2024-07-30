// components/RegisterForm.tsx
"use client";
import React from "react";
import { useRouter } from 'next/navigation';  // Import useRouter
import { Container } from "react-bootstrap";
import { useState, ChangeEvent, FormEvent } from 'react';
import Form from 'react-bootstrap/Form';


interface FormData {
  name: string;
  schoolname: string;
  email: string;
  event: string;
  questions: string;
}

export default function RegisterForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    schoolname: '',
    email: '',
    event: '',
    questions: ''
  });
  const router = useRouter();  // Initialize useRouter

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
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Name</Form.Label>
          <Form.Control as="input" name="name" value={formData.name} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
          <Form.Label>School Name</Form.Label>
          <Form.Control as="input" name="schoolname" value={formData.schoolname} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" name="email" placeholder="email@school.co.uk" value={formData.email} 
                        onChange={handleChange} required 
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>I've some questions about joining the program</Form.Label>
          <Form.Control as="textarea" placeholder="Type your questions here" rows={5} name="questions" 
                        value={formData.questions} onChange={handleChange} required 
          />
        </Form.Group>
   
      
        <button type="submit" className="button">Submit Registration</button>
      </Form>
    </Container>
  );
}
