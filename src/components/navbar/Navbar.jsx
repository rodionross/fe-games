import { Link } from "react-router-dom";
import "./Navbar.css";
import { useContext } from "react";
import { ActiveUserContext } from "../contexts/UserContext";

export const Navbar = () => {
  const { activeUser } = useContext(ActiveUserContext);
  return (
    <nav className="navbar">
      {activeUser ? (
        <img
          src={activeUser.avatar_url}
          alt={activeUser.name}
          className="navbar-img"
        />
      ) : null}
      <ul>
        <Link to="/login">
          <li>LOGIN</li>
        </Link>
        <Link to="/">
          <li>HOME</li>
        </Link>
        <Link to="/reviews/categories">
          <li>REVIEWS</li>
        </Link>
      </ul>
    </nav>
  );
};
