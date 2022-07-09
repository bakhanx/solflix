const API_KEY = "5b0ed4f18da081df82b2b16ffc09f72d";
const BASE_PATH = "https://api.themoviedb.org/3";

interface iMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface iGetMovieResult {
  dates?: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: iMovie[];
  total_pages: number;
  total_results: number;
}

interface iTv {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
}
export interface iGetTvResult {
  page: number;
  results: iTv[];
  total_pages: number;
  total_results: number;
}

// Movies
export const getMovies_now_playing = () => {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
};

export const getMovies_popular = () => {
  return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
};
export const getMovies_upcoming = () => {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
};

// Tv
export const getTv_on_the_air = () => {
  return fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
};

export const getTv_popular = () => {
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
};

export const getTv_top_rate = () =>{
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}