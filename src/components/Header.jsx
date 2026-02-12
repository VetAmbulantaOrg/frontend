import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext.jsx";
import "../styles/app.scss";

const Header = () => {
  const { isVet , isHelp,isAuthenticated, logout } = useContext(AuthContext);

  return (
    <header className="header"> 
      <h1>Veterinarska Ambulanta Inđija</h1>
      <nav>
        <ul className="nav-list">
          <li><Link to="/">Početna</Link></li>

          {(isVet || isHelp) && (
            <>
              <li><Link to="/patients">Pacijenti</Link></li>
              <li><Link to="/appointments">Pregledi</Link></li>
            </>
          )}
          
          {!isAuthenticated ? (
            <>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/login">Login</Link></li>
            </>
          ) : (
            <li>
              <button onClick={logout} className="logout-btn">Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
