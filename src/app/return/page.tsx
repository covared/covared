"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

import NavBar from "@/components/NavBar";
import { AIWriterAPI } from "../api/AIWriterAPI";

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
      <div className="container ">
        <div className="row justify-content-center">
          <div className="col-10">
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
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Return;
