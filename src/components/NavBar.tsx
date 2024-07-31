"use client";
import { useAuth } from "@/context/AuthContext";
import { AIWriterAPI } from "@/app/api/AIWriterAPI";
import { usePathname } from "next/navigation";
import  Container from "react-bootstrap/Container";
import  NavDropdown from "react-bootstrap/NavDropdown";
import  Nav from "react-bootstrap/Nav";
import  Navbar from "react-bootstrap/Navbar";

const images = {
  logo: { name: "logo", image: "/thumbnail2-nobg.png" },
};

const NavBar: React.FC = () => {
  const { isLoggedIn, setIsLoggedIn, setEmail } = useAuth();
  const pathname = usePathname(); // Get the current route
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
          <Nav className="me-auto" variant="pills" defaultActiveKey="/" 
               activeKey={pathname} // Dynamically set the active key based on the current route
          > 
          <Nav.Item>
            <Nav.Link href="/" active={pathname === '/'}>Home</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <NavDropdown className="basic-nav-dropdown" title="Products">
              <NavDropdown.Item active={pathname === '/sparkcity'} href="/sparkscity">Sparks City</NavDropdown.Item>
              <NavDropdown.Item active={pathname === '/aireportal'} href="/aireportal">AI Reportal</NavDropdown.Item>
            </NavDropdown>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link active={pathname === '/pricing'} href="/pricing"> Pricing </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            {isLoggedIn ? (
              <Nav.Link active={pathname === '/'} href="/" onClick={logout}>Logout</Nav.Link>
            ) : (
              <Nav.Link active={pathname === '/login'} href="/login">Login / Register</Nav.Link>
            )}
          </Nav.Item>
          </Nav> 
        </Navbar.Collapse>
      </Container>    
    </Navbar>
       
  );
};

export default NavBar;
