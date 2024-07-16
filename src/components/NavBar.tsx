"use client";
import Link from "next/link";

import { useAuth } from "@/context/AuthContext";
import { AIWriterAPI } from "@/app/api/AIWriterAPI";

const images = {
  logo: { name: "logo", image: "/thumbnail2-nobg.png" },
};

const NavBar: React.FC = () => {
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

  return (
    <div className="navbar">
      <div className="navbar-left">
        <Link href="/">
          Springverse
          <img
            src={images.logo.image}
            alt={images.logo.name}
            style={{ maxWidth: "2rem", height: "auto", marginLeft: "10px", marginRight: "10px"}}
          />
        </Link>
        <span>{isLoggedIn ? `${email} logged in` : ""}</span>
      </div>
      <div className="navbar-right">
        {/* Conditionally render Pricing link as disabled */}
        <Link className="space-right" href="/product">
          Product
        </Link>
        <Link className="space-right disabled-link" href="/pricing">
          Pricing
        </Link>
        {isLoggedIn ? (
          <button onClick={logout} className="btn btn-custom-standard">
            Logout
          </button>
        ) : (
          <Link href="/login" className="btn btn-custom-standard">
            Login / Register
          </Link>
        )}
      </div>
    </div>
  );
};

export default NavBar;
