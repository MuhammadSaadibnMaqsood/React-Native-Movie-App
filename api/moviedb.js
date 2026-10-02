import axios from "axios";

export const apiKey = "96885333b13c0fbeeb72df1f519c03d9";

const apiBaseURL = "https://api.themoviedb.org/3";
const apiCall = async (endpoint, params = {}, signal) => {
  const response = await axios.get(`${apiBaseURL}${endpoint}`, {
    params: { api_key: apiKey, ...params },
    signal,
  });
  return response.data;
};

export const getImageUrl = (path, size = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

export const fetchTrendingMovies = (signal) =>
  apiCall("/trending/movie/day", {}, signal);

export const fetchUpcomingMovies = (signal) =>
  apiCall("/movie/upcoming", {}, signal);

export const fetchTopRatedMovies = (signal) =>
  apiCall("/movie/top_rated", {}, signal);

export const searchMovies = (query, signal) =>
  apiCall("/search/movie", { query }, signal);

export const fetchMovieDetails = (movieId, signal) =>
  apiCall(`/movie/${movieId}`, {}, signal);

export const fetchMovieCredits = (movieId, signal) =>
  apiCall(`/movie/${movieId}/credits`, {}, signal);

export const fetchSimilarMovies = (movieId, signal) =>
  apiCall(`/movie/${movieId}/similar`, {}, signal);

export const fetchPersonDetails = (personId, signal) =>
  apiCall(`/person/${personId}`, {}, signal);

export const fetchPersonMovies = (personId, signal) =>
  apiCall(`/person/${personId}/movie_credits`, {}, signal);
