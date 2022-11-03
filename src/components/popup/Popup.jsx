import "./Popup.css";

export const Popup = ({ msg, whenClicked }) => {
  const handleClick = () => {
    whenClicked();
  };

  return (
    <section className="popup-container">
      <div className="popup-inside">
        <h2 className="popup-msg">{msg}</h2>
        <button onClick={handleClick} className="popup-btn">
          OK
        </button>
      </div>
    </section>
  );
};
