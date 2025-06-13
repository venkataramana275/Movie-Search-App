import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_KEY = "e92e2ba5"; 
const RAPIDAPI_KEY = "d0bf0bf944mshba923765850aa7cp188ea0jsn33b688bed6a4";
const TRAILER_API_URL = "https://movie-trailers-now-api.p.rapidapi.com/past%2Bmovies?country=US&date=2024-08";

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    setMovie(null);
    setLoading(true);
    setError("");

    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          if (data.Response === "True") {
            setMovie(data);
            setError("");
            fetchTrailer(data.Title);
          } else {
            setError("Movie not found! Please try again.");
          }
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError("Failed to fetch movie details. Please try again later.");
          setLoading(false);
        }
      });

    const storedReviews = JSON.parse(localStorage.getItem(`reviews-${id}`)) || [];
    setReviews(storedReviews);

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleAddReview = () => {
    if (!newReview.trim() || rating === 0) {
      alert("Please enter a review and select a rating.");
      return;
    }

    const reviewData = { review: newReview, rating, date: new Date().toLocaleString() };
    const updatedReviews = [...reviews, reviewData];

    setReviews(updatedReviews);
    localStorage.setItem(`reviews-${id}`, JSON.stringify(updatedReviews));

    setNewReview("");
    setRating(0);
  };

  const fetchTrailer = async (movieTitle) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await fetch(`${TRAILER_API_URL}?query=${encodeURIComponent(movieTitle)}`, {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": "movie-trailers-now-api.p.rapidapi.com",
        },
      });

      const data = await response.json();
      console.log("Trailer API Response:", data);

      if (data.results && data.results.length > 0) {
        setTrailerUrl(data.results[0].trailer);
      } else {
        setTrailerUrl(null);
      }
    } catch (error) {
      console.error("Failed to fetch trailer:", error);
      setTrailerUrl(null);
    }
  };

  if (loading) return <h2>Loading... ⏳</h2>;
  if (error) return <h2 className="error-message">{error}</h2>;
  if (!movie) return <h2>No movie details available.</h2>;

  return (
    <div className="movie-details" key={id}>
      <img src={movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"} alt={movie.Title} />
      <h2>{movie.Title} ({movie.Year})</h2>
      <p><strong>Genre:</strong> {movie.Genre}</p>
      <p><strong>Plot:</strong> {movie.Plot}</p>
      <p><strong>IMDB Rating:</strong> {movie.imdbRating}</p>
      <p><strong>Director:</strong> {movie.Director}</p>
      <p><strong>Released:</strong> {movie.Released}</p>
      <p><strong>Actors:</strong> {movie.Actors}</p>
      <p><strong>Runtime:</strong> {movie.Runtime}</p>
      <p><strong>Rated:</strong> {movie.Rated}</p>
      <p><strong>Language:</strong> {movie.Language}</p>

      <button onClick={() => navigate(-1)}>🔙 Go Back</button>

      {trailerUrl ? (
        <div className="trailer-section">
          <h3>🎬 Watch Trailer</h3>
          <iframe
            width="100%"
            height="400px"
            src={trailerUrl}
            title="Movie Trailer"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <p>No trailer available.</p>
      )}

      <div className="reviews-section">
        <h3>User Reviews & Ratings</h3>

        <textarea
          placeholder="Write your review..."
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          className="review-input"
        />
        
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          <option value="0">Rate the Movie ⭐</option>
          <option value="1">⭐</option>
          <option value="2">⭐⭐</option>
          <option value="3">⭐⭐⭐</option>
          <option value="4">⭐⭐⭐⭐</option>
          <option value="5">⭐⭐⭐⭐⭐</option>
        </select>

        <button onClick={handleAddReview}>Submit Review ✅</button>

        <div className="reviews-list">
          {reviews.length === 0 ? (
            <p>No reviews yet. Be the first to review! 📝</p>
          ) : (
            reviews.map((rev, index) => (
              <div key={index} className="review-item">
                <p>⭐ {rev.rating} - {rev.review}</p>
                <small>🕒 {rev.date}</small>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;


