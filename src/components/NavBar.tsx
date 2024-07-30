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
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
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
                  <Nav.Link className="nav-link" href="/">
                    Home
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <NavDropdown className="basic-nav-dropdown" title="Products">
                    <NavDropdown.Item eventKey="link-2.1" className="nav-link" href="/sparkscity">Sparks City</NavDropdown.Item>
                    <NavDropdown.Item eventKey="link-2.2" className="nav-link" href="/aireportal">AI Reportal</NavDropdown.Item>
                  </NavDropdown>
                </Nav.Item>
                <Nav.Item>
                  {/* Conditionally render Pricing link as disabled */}
                  <Nav.Link eventKey="link-3" className="nav-link" href="/pricing">
                    Pricing
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  {isLoggedIn ? (
                    <Nav.Link eventKey="link-4" href="/" onClick={logout} className="nav-link">
                      Logout
                    </Nav.Link>
                  ) : (
                    <Nav.Link eventKey="link-5" href="/login" className="nav-link">
                      Login / Register
                    </Nav.Link>
                  )}
                </Nav.Item>
                </Nav> 
              </Navbar.Collapse>
            </Container>    
          </Navbar>
        </Col>
      </Row>
    </Container>
  );
};

export default NavBar;
