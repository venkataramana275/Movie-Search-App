import { useState, useEffect } from "react";

const Favourites = () => {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    const favMovies = JSON.parse(localStorage.getItem("favourites")) || [];
    setFavourites(favMovies);
  }, []);

  return (
    <div className="container">
      <h1>❤️ Favourite Movies</h1>
      {favourites.length === 0 ? <p>No favourite movies yet.</p> : null}
      <div className="movies">
        {favourites.map((movie) => (
          <div key={movie.imdbID} className="movie-card">
            <img src={movie.Poster} alt={movie.Title} />
            <h3>{movie.Title} ({movie.Year})</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favourites;




