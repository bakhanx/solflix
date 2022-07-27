// https://developers.themoviedb.org/3/getting-started/

const API_KEY = "5b0ed4f18da081df82b2b16ffc09f72d";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface iMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  release_date : string;
  popularity : number;

  results?:[];
  name?:string;
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

  id?:number;
  title?: string;
  backdrop_path?: string;
  poster_path?: string;
  overview?: string;
  release_date? : string;
  popularity? : number;
  
}

export interface iTv {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
  release_date : string;
  popularity : number;

  results?:[];
  title?:string;

}
export interface iGetTvResult {
  page: number;
  results: iTv[];
  total_pages: number;
  total_results: number;

  id?:number;
  name?: string;
  backdrop_path?: string;
  poster_path?: string;
  overview?: string;
  release_date? : string;
  popularity? : number;
}

// Movies


export const getMovies_latest= ()=>{
  return fetch(`${BASE_PATH}/movie/latest?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export const getMovies_top_rated= ()=>{
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

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


// ==================== Tv

export const getTv_airing_today = () => {
  return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
};

export const getTv_popular = () => {
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
};


export const getTv_top_rated = () => {
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
};
export const getTv_on_the_air = () => {
  return fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
};
export const getTv_latest = () => {
  return fetch(`${BASE_PATH}/tv/latest?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
};

export const getMovies = (keyword:string) => {
  return fetch(`${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${keyword}&page=1`).then(
    (response) => response.json()
  );
}
export const getTv = (keyword:string) => {
  return fetch(`${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${keyword}&page=1`).then(
    (response) => response.json()
  );
}