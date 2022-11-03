import { Login } from "../users/Login";
import "./Popup.css";
import { useContext } from "react";
import { ActiveUserContext } from "../contexts/UserContext";

export const Popup = ({ msg, whenClicked }) => {
  const { activeUser } = useContext(ActiveUserContext);

  const handleClick = () => {
    whenClicked();
  };

  return (
    <section className="popup-container">
      <div className="popup-inside">
        <h2 className="popup-msg">
          {activeUser ? `Logged in as ${activeUser.username}` : msg}
        </h2>
        <Login />
        <button onClick={handleClick} className="popup-btn">
          {activeUser ? "CLOSE" : "OK"}
        </button>
      </div>
    </section>
  );
};
