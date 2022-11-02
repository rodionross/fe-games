import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Reviews } from "./components/reviews/Reviews";
import { Navbar } from "./components/navbar/Navbar";
import { Home } from "./components/home/Home";
import { SingleReview } from "./components/review/SingleReview";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/review/:id" element={<SingleReview />} />
          <Route path="/reviews/categories" element={<Reviews />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
