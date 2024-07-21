"use client";
import Link from "next/link";

import { useAuth } from "@/context/AuthContext";
import { AIWriterAPI } from "@/app/api/AIWriterAPI";
import { usePathname } from "next/navigation";
import { NavDropdown } from "react-bootstrap";

const images = {
  logo: { name: "logo", image: "/thumbnail2-nobg.png" },
};

const NavBar: React.FC = () => {
  const currentRoute=usePathname()
  const { isLoggedIn, email, setIsLoggedIn, setEmail } = useAuth();

  const logout = async () => {
    try {
      await AIWriterAPI.postAuthLogout();
      setIsLoggedIn(false);
      setEmail("");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };
  const getLinkClass=(arg: string)=>{
    if (currentRoute==arg) return "nav-item active"
    return "nav-item"
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="navbar-brand">
        <Link href="/">
          Springverse
          <img
            src={images.logo.image}
            alt={images.logo.name}
            style={{ maxWidth: "2rem", height: "auto", marginLeft: "10px", marginRight: "10px"}}
          />
        </Link> 
      </div>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="nav nav-pills">
        <li className={getLinkClass("/")}>
          <Link className="nav-link" href="/">
            Home
          </Link>
        </li>
        <li className="nav-item">
          <NavDropdown className="basic-nav-dropdown" title="Products">
            <NavDropdown.Item className="nav-link" href="/sparkscity">Sparks City</NavDropdown.Item>
            <NavDropdown.Item className="nav-link" href="/aireportal">AI Reportal</NavDropdown.Item>
          </NavDropdown>
        </li>
        {/* Conditionally render Pricing link as disabled */}
        <li className={getLinkClass("/pricing")}>
          <Link className="nav-link" href="/pricing">
            Pricing
          </Link>
        </li>
        <li className="nav-item">
        {isLoggedIn ? (
          <Link href="/" onClick={logout} className="nav-link">
            Logout
          </Link>
        ) : (
          <Link href="/login" className="nav-link">
            Login / Register
          </Link>
        )}
        </li>
        
      </ul>
  </div>     
</nav>
  );
};

export default NavBar;
