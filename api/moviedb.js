export const apiKey = "96885333b13c0fbeeb72df1f519c03d9";

import axios from "axios";

// endpoints
const apiBaseURL = "https://api.themoviedb.org/3";
const trendingMovesURL = `${apiBaseURL}/trending/movie/day?api_key=${apiKey}`;
const upComingMoviesURL = `${apiBaseURL}/movie/upcoming?api_key=${apiKey}`;
const topRatedMoviesURL = `${apiBaseURL}/movie/top_rated?api_key=${apiKey}`;

const apiCall = async (endpoints, params) => {
  const option = {
    method: "GET",
    url: endpoints,
    params: params ? params : {},
  };

  try {
    const response = await axios.request(option);
    return response.data;
  } catch (error) {
    console.log("error in API call: ", error);
    return {};
  }
};

export const fetchTrendingMovies = () => {
  return apiCall(trendingMovesURL);
};
export const fetchUpcomingMovies = () => {
  return apiCall(upComingMoviesURL);
};
export const fetchTopRatedMovies = () => {
  return apiCall(topRatedMoviesURL);
};
