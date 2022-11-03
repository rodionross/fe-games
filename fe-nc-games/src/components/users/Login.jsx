import axios from "axios";
import { useContext } from "react";
import { useEffect, useState } from "react";
import { ActiveUserContext } from "../contexts/UserContext";
import "./Login.css";
import { User } from "./User";

export const Login = () => {
  const [users, setUsers] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { setActiveUser } = useContext(ActiveUserContext);

  useEffect(() => {
    setIsLoading(true);

    axios
      .get("https://board-games-mern-app.herokuapp.com/api/users")
      .then(({ data }) => {
        setIsLoading(false);
        setUsers(data.users);
      });
  }, []);

  const handleUser = (user) => {
    setActiveUser(user);
  };

  if (isLoading) return <h2>Loading...</h2>;
  return (
    <section className="login-page-container">
      <div className="login-all-users">
        {users.map((user) => {
          return <User key={user.username} user={user} setUser={handleUser} />;
        })}
      </div>
    </section>
  );
};
