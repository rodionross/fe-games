import { Link } from "react-router-dom";
import "./Navbar.css";

export const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
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
