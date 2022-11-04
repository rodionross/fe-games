import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Reviews } from "./components/reviews/Reviews";
import { Navbar } from "./components/navbar/Navbar";
import { Home } from "./components/home/Home";
import { SingleReview } from "./components/review/SingleReview";
import { Login } from "./components/users/Login";
import { ActiveUserContext } from "./components/contexts/UserContext";
import { useState } from "react";
import { NotFound } from "./components/not_found/NotFound";

function App() {
  const [activeUser, setActiveUser] = useState(null);
  return (
    <BrowserRouter>
      <div className="App">
        <ActiveUserContext.Provider value={{ activeUser, setActiveUser }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/review/:id" element={<SingleReview />} />
            <Route path="/reviews/categories" element={<Reviews />} />
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </ActiveUserContext.Provider>
      </div>
    </BrowserRouter>
  );
}

export default App;
