// app/register/page.tsx
"use client";

import RegisterForm from '@/components/RegistrationForm';
import NavBar from "@/components/NavBar";



export default function Register() {
  return (
    <div className="container">
        <div className="row justify-content-center">
            <div className="col-10">
                <NavBar />
                <div className="page-container">
                    <h1>Register for the Event</h1>
                    <RegisterForm />
                </div>
            </div>
        </div>
    </div>
  );
}