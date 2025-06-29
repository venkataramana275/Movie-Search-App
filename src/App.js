import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./components/HomePage";
import MovieDetails from "./components/MovieDetails";
import Favourites from "./components/Favourites";
import Watching from "./components/Watching";
import './App.css';

function App() {
  return (
    <div>
     <Router>
       <nav>
          <Link to="/">Home🏠 </Link>
          <Link to="/favourites">Favourites❤️</Link>
          <Link to="/watching">Watching👀</Link>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/watching" element={<Watching />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
