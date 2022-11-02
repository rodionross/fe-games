import "./User.css";
import { useState } from "react";

export const User = (props) => {
  const { username, name, avatar_url } = props.user;
  const { setUser } = props;
  const [displayForm, setDisplayForm] = useState(false);
  const [inputVal, setInputVal] = useState("");

  const handleClick = (e) => {
    e.preventDefault();
    let inputName = inputVal.toUpperCase();
    if (name.toUpperCase() === inputName) {
      setInputVal("");
      setUser(props.user);
    } else {
      setInputVal("");
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setInputVal(value);
  };

  return (
    <div className="single-user">
      <div
        className="name-img-container"
        onClick={() => {
          setDisplayForm(!displayForm);
          //to help login
          console.log(name);
        }}
      >
        <img className="single-user-img" src={avatar_url} alt={name} />
        <h3 className="single-user-name">{username}</h3>
      </div>

      <form className={!displayForm ? "hide-login-form" : "login-form"}>
        <input
          className="login-input"
          type="text"
          name="name"
          id="name"
          value={inputVal}
          placeholder="User's Full Name"
          onChange={handleChange}
        />
        <input
          className="login-btn"
          type="submit"
          value="LOGIN"
          onClick={handleClick}
        />
      </form>
    </div>
  );
};
