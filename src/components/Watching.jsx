import { useState, useEffect } from "react";

const Watching = () => {
  const [watching, setWatching] = useState([]);

  useEffect(() => {
    const watchingMovies = JSON.parse(localStorage.getItem("watching")) || [];
    setWatching(watchingMovies);
  }, []);

  return (
    <div className="container">
      <h1>👀 Watching Movies</h1>
      {watching.length === 0 ? <p>No movies in the Watching list yet.</p> : null}
      <div className="movies">
        {watching.map((movie) => (
          <div key={movie.imdbID} className="movie-card">
            <img src={movie.Poster} alt={movie.Title} />
            <h3>{movie.Title} ({movie.Year})</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watching;
