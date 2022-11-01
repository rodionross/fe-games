import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Reviews } from "./components/reviews/Reviews";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/reviews/categories" element={<Reviews />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
