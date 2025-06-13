import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HomePage from "./HomePage";
import axios from "axios";
import '@testing-library/jest-dom';

jest.mock("./movies.json", () => [
  {
    imdbID: "tt8178634",
    Title: "RRR",
    Year: "2022",
    Poster: "https://m.media-amazon.com/images/M/MV5BNWMwODYyMjQtMTczMi00NTQ1LWFkYjItMGJhMWRkY2E3NDAyXkEyXkFqcGc@._V1_SX300.jpg",
    Genre: "Action,Adventure, Drama",
    imdbRating: "7.8"
  },
  {
    imdbID: "tt4849438",
    Title: "Baahubali 2: The Conclusion",
    Year: "2017",
    Poster: "https://m.media-amazon.com/images/M/MV5BNTRhYTlhZTgtYmMyYy00NWI4LTk4MzItOWM2YjBmYTg2OTI2XkEyXkFqcGc@._V1_SX300.jpg",
    Genre: "Action, Drama",
    imdbRating: "8.2"
  }
]);

describe("HomePage Component", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test("renders heading and search input", () => {
    render(<HomePage />);
    expect(screen.getByText(/movie search/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search for a movie/i)).toBeInTheDocument();
  });

  test("fetches and displays movies on search", async () => {
    axios.get.mockResolvedValueOnce({
      data: { Response: "True", Search: mockMovies }
    });

    render(<HomePage />);
    const input = screen.getByPlaceholderText(/search for a movie/i);
    const button = screen.getByRole("button", { name: "🔍" });

    fireEvent.change(input, { target: { value: "Inception" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Inception/i)).toBeInTheDocument();
      expect(screen.getByText(/Interstellar/i)).toBeInTheDocument();
    });
  });

  test("shows error message if API fails", async () => {
    axios.get.mockResolvedValueOnce({
      data: { Response: "False", Error: "Movie not found!" }
    });

    render(<HomePage />);
    const input = screen.getByPlaceholderText(/search for a movie/i);
    fireEvent.change(input, { target: { value: "unknownmovie" } });

    fireEvent.click(screen.getByRole("button", { name: "🔍" }));

    await waitFor(() => {
      expect(screen.getByText(/no movies found/i)).toBeInTheDocument();
    });
  });

  test("adds movie to favourites", async () => {
    render(<HomePage />);
    const movie = mockMovies[0];

    fireEvent.click(screen.getByText("Favourites❤️"));
    const favs = JSON.parse(window.localStorage.getItem("favourites"));

    expect(favs).toBeTruthy();
  });

  test("toggles dark mode", () => {
    render(<HomePage />);
    const toggleButton = screen.getByRole("button", { name: "🌙" });

    fireEvent.click(toggleButton);
    expect(document.body.className).toContain("dark-mode");

    fireEvent.click(toggleButton);
    expect(document.body.className).not.toContain("dark-mode");
  });

  test("renders filter and sort controls", () => {
    render(<HomePage />);
    expect(screen.getByText(/filter by genre/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/filter by year/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/min imdb rating/i)).toBeInTheDocument();
    expect(screen.getByText(/sort by/i)).toBeInTheDocument();
  });
});
