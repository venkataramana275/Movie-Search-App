import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import moviesData from "./movies.json";
import "../App.css";

const API_KEY = "e92e2ba5"; 


const HomePage = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState(moviesData); 
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [error, setError] = useState("");
  const [favourites, setFavourites] = useState([]);
  const [watching, setWatching]= useState([]);
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [sortOption, setSortOption] = useState("");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const [page, setPage] = useState(1);
  const observer = useRef();

  useEffect(() => {
    const favMovies = JSON.parse(localStorage.getItem("favourites")) || [];
    const watchingMovies = JSON.parse(localStorage.getItem("watching")) || [];
    setFavourites(favMovies);
    setWatching(watchingMovies);

  }, []);

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "";
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

 

  const fetchMovies = async () => {
    if (query.length < 3) {
      setMovies(moviesData);
      setError("");
      return;
    }

    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`
      );

      if (response.data.Response === "True") {
        setMovies(response.data.Search.slice(0, 15)); 
        setError("");
      } else {
        setMovies(moviesData); 
        setError("No movies found! Showing default movies.");
      }
    } catch (err) {
      setMovies(moviesData); 
      setError("Something went wrong! Showing default movies.");
    }
  };

  useEffect(() =>{
    fetchMovies();
  }, []);

  const lastMovieRef = useRef();

  useEffect(() => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => {
            fetchMovies(query, prevPage + 1);
            return prevPage + 1;
          });
        }
      },
      { threshold: 1.0 }
    );
    if (lastMovieRef.current) observer.current.observe(lastMovieRef.current);
  }, [movies]);


  useEffect(() => {
    let updatedMovies = [...movies];
    
    if (genre) {
      updatedMovies = updatedMovies.filter((movie) => movie.Genre && movie.Genre.includes(genre));
    }

    
    if (year) {
      updatedMovies = updatedMovies.filter((movie) => movie.Year === year);
    }

    
    if (minRating > 0) {
      updatedMovies = updatedMovies.filter((movie) => Number(movie.imdbRating) >= minRating);
    }

    
    if (sortOption === "name") {
      updatedMovies.sort((a, b) => a.Title.localeCompare(b.Title));
    } else if (sortOption === "year") {
      updatedMovies.sort((a, b) => b.Year - a.Year);
    } else if (sortOption === "rating") {
      updatedMovies.sort((a, b) => b.imdbRating - a.imdbRating);
    }

    setFilteredMovies(updatedMovies);
  }, [genre, year, minRating, sortOption, movies]);

  const addToFavourites = (movie) => {
    if (!favourites.some((fav) => fav.imdbID === movie.imdbID)) {
      const updatedFavs= [...favourites, movie];
      setFavourites(updatedFavs);
      localStorage.setItem("favourites", JSON.stringify(updatedFavs));
    }
  };

  const addToWatching = (movie) => {
    if (!watching.some((w) => w.imdbID === movie.imdbID)) {
      const updatedWatching = [...watching, movie];
      setWatching(updatedWatching);
      localStorage.setItem("watching", JSON.stringify(updatedWatching));
    }
  }

  return (
    <div className= {`Search-container ${darkMode ? "dark": ""}`}>
      <h1 className="movie-search-title">Movie Search🎬 </h1>
      
      

      <div className="search-box">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button onClick={fetchMovies} className="search-button">🔍</button>
        <button onClick={() => setDarkMode(!darkMode)} className="dark-mode-toggle">
        {darkMode ? "☀️" : "🌙"}
        </button>
        
      
        </div>
        

      <div className="filters">
        <select onChange={(e) => setGenre(e.target.value)}>
          <option value="">Filter by Genre</option>
          <option value="Action">Action</option>
          <option value="Comedy">Comedy</option>
          <option value="Drama">Drama</option>
          <option value="Horror">Horror</option>
          <option value="Sci-Fi">Sci-Fi</option>
        </select>

        <input
          type="number"
          placeholder="Filter by Year"
          onChange={(e) => setYear(e.target.value)}
        />

        <input
          type="number"
          placeholder="Min IMDB Rating"
          onChange={(e) => setMinRating(e.target.value)}
        />

        <select onChange={(e) => setSortOption(e.target.value)}>
          <option value="">Sort By</option>
          <option value="name">Name (A-Z)</option>
          <option value="year">Year (Newest-Oldest)</option>
          <option value="rating">Rating (Highest-Lowest)</option>
        </select>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="Movie-container">
        {movies.map((movie, index) => (
          <div key={movie.imdbID || index} className="movie-card">
            <Link to={`/movie/${movie.imdbID}`}>
            <img src={movie.Poster} alt={movie.Title} className="movie-poster" />
            <h2 className="movie-title">{movie.Title}</h2>
            <p className="movie-year">{movie.Year}</p>
            </Link>
            <button onClick={() => addToFavourites(movie)}>Favourites❤️</button>
            <button onClick={() => addToWatching(movie)}>Watching👀</button>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default HomePage;
