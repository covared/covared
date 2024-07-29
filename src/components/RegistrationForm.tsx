// components/RegisterForm.tsx
"use client";
import React from "react";
import { useRouter } from 'next/navigation';  // Import useRouter

import { useState, ChangeEvent, FormEvent } from 'react';
import '../styles/RegistrationForm.module.css'; // Import the CSS module

interface FormData {
  name: string;
  email: string;
  event: string;
}

export default function RegisterForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    event: ''
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
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="formGroup">
          <label className="label">Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="input" required />
        </div>
        <div className="formGroup">
          <label className="label">Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="input" required />
        </div>
        <div className="formGroup">
          <label className="label">Event:</label>
          <input type="text" name="event" value={formData.event} onChange={handleChange} className="input" required />
        </div>
        <button type="submit" className="button">Submit Registration</button>
      </form>
    </div>
  );
}
