import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import './LandingPage.css';


const images = {
  hero: { name: "hero", image: `${process.env.PUBLIC_URL}/Images/BreezEd_robot_logo3.png` }, 
};

const features = [
  { name: 'Report Writer', comingSoon: false },
  { name: 'Email Writer', comingSoon: true },
  { name: 'AI Tutor', comingSoon: true },
  { name: 'Lesson Planner', comingSoon: true },
  { name: 'Quiz Maker', comingSoon: true },
  { name: 'Automatic Quiz Marking', comingSoon: true },
  //{ name: 'Classroom Manager', comingSoon: true },
  //{ name: 'Video Maker', comingSoon: true },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const loginRegisterNavigate = () => {
    navigate('/login');
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-10">
          <NavBar />
          <div className="page-container">
            <header className="hero-section text-center">
              <div className="hero-content">
                <div>
                  <h1>BreezEd</h1>
                  <p>Efficient teaching and learning tools, superpowered by AI.</p>
                  <button className="btn btn-custom-standard" onClick={loginRegisterNavigate}>Get Started for Free</button>
                </div>
                <img src={images.hero.image} alt={images.hero.name} style={{ width: '30%', height: 'auto' }} />
              </div>
            </header>

            <section className="features-section">
              {features.map((feature, index) => (
                <div key={index} className={`card ${feature.comingSoon ? 'coming-soon' : 'live'}`} 
                  onClick={() => feature.name === 'Report Writer'  ? navigate('/report-writer') : null}>
                  <div className="card-body">
                    <h5 className="card-title">{feature.name}</h5>
                    {feature.comingSoon && <p className="card-text">Coming Soon</p>}
                  </div>
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
