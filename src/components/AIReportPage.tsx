"use client";
import React from "react";
import NavBar from "./NavBar";
import { useRouter } from "next/navigation";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const images = {
  hero: { name: "hero", image: "thumbnail2-nobg.png" },
};

const features = [
  { name: "Report Writer", comingSoon: false },
  { name: "Email Writer", comingSoon: true },
  { name: "AI Tutor", comingSoon: true },
  { name: "Lesson Planner", comingSoon: true },
  { name: "Quiz Maker", comingSoon: true },
  { name: "Automatic Quiz Marking", comingSoon: true },
  //{ name: 'Classroom Manager', comingSoon: true },
  //{ name: 'Video Maker', comingSoon: true },
];

const AIReportPage: React.FC = () => {
  const router = useRouter();

  const loginRegisterNavigate = () => {
    router.push("/login");
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={10}>
          <NavBar />
          <div className="page-container">
            <header className="hero-section text-center">
              <div className="hero-content">
                <div>
                  <h2>AI Reportal</h2>
                  <p>
                    Efficient teaching and learning tools, superpowered by AI.
                  </p>
                  <button
                    className="btn btn-custom-standard"
                    onClick={loginRegisterNavigate}
                  >
                    Get Started for Free
                  </button>
                </div>
              </div>
            </header>

            <section className="features-section">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`card ${
                    feature.comingSoon ? "coming-soon" : "live"
                  }`}
                  onClick={() =>
                    feature.name === "Report Writer"
                      ? router.push("/report-writer")
                      : null
                  }
                >
                  <div className="card-body">
                    <h5 className="card-title">{feature.name}</h5>
                    {feature.comingSoon && (
                      <p className="card-text">Coming Soon</p>
                    )}
                  </div>
                </div>
              ))}
            </section>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AIReportPage;
