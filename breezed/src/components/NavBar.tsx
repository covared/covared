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
          BreezEd.co.uk
          <img
            src={images.logo.image}
            alt={images.logo.name}
            style={{ maxWidth: "4rem", height: "auto" }}
          />
        </Link>
        <span>{isLoggedIn ? `${email} logged in` : "Not logged in"}</span>
      </div>
      <div className="navbar-right">
        <Link className="space-right" href="/pricing">
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
