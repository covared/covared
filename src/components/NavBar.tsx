"use client";
import { useAuth } from "@/context/AuthContext";
import { AIWriterAPI } from "@/app/api/AIWriterAPI";
import { usePathname } from "next/navigation";
import { Container, NavDropdown, Nav, Navbar, Col, Row } from "react-bootstrap";

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
          <Nav className="me-auto" variant="pills" defaultActiveKey="/">
          <Nav.Item>
            <Nav.Link href="/">Home</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <NavDropdown className="basic-nav-dropdown" title="Products">
              <NavDropdown.Item eventKey="link-2.1" href="/sparkscity">Sparks City</NavDropdown.Item>
              <NavDropdown.Item eventKey="link-2.2" href="/aireportal">AI Reportal</NavDropdown.Item>
            </NavDropdown>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="link-3" href="/pricing"> Pricing </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            {isLoggedIn ? (
              <Nav.Link eventKey="link-4" href="/" onClick={logout}>Logout</Nav.Link>
            ) : (
              <Nav.Link eventKey="link-5" href="/login">Login / Register</Nav.Link>
            )}
          </Nav.Item>
          </Nav> 
        </Navbar.Collapse>
      </Container>    
    </Navbar>
       
  );
};

export default NavBar;
