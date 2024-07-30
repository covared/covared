"use client";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useAuth } from "@/context/AuthContext";
import { AIWriterAPI } from "@/app/api/AIWriterAPI";
import { usePathname } from "next/navigation";
import { NavDropdown } from "react-bootstrap";

const images = {
  logo: { name: "logo", image: "/thumbnail2-nobg.png" },
};

const NavBar: React.FC = () => {
  const currentRoute=usePathname()
  const { isLoggedIn, setIsLoggedIn, setEmail } = useAuth();

  const logout = async () => {
    try {
      await AIWriterAPI.postAuthLogout();
      setIsLoggedIn(false);
      setEmail("");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };
  

  return (
    <Navbar collapseOnSelect bg="light" data-bs-theme="light" expand="lg" className="bg-body-tertiary justify-content-between">
      <Container>
        <Navbar.Brand href="/">
            Springverse
            <img
              src={images.logo.image}
              alt={images.logo.name}
              style={{ maxWidth: "2rem", height: "auto", marginLeft: "10px", marginRight: "10px"}}
            />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link className="nav-link" href="/">
              Home
            </Nav.Link>
            <NavDropdown className="basic-nav-dropdown" title="Products">
              <NavDropdown.Item className="nav-link" href="/sparkscity">Sparks City</NavDropdown.Item>
              <NavDropdown.Item className="nav-link" href="/aireportal">AI Reportal</NavDropdown.Item>
            </NavDropdown>
              {/* Conditionally render Pricing link as disabled */}
            <Nav.Link className="nav-link" href="/pricing">
                Pricing
            </Nav.Link>
            {isLoggedIn ? (
              <Nav.Link href="/" onClick={logout} className="nav-link">
                Logout
              </Nav.Link>
            ) : (
              <Nav.Link href="/login" className="nav-link">
                Login / Register
              </Nav.Link>
            )}          
            
          </Nav> 
        </Navbar.Collapse>
      </Container>    
    </Navbar>
  );
};

export default NavBar;
