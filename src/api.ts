const API_KEY =
  "5b0ed4f18da081df82b2b16ffc09f72d";
const BASE_PATH = "https://api.themoviedb.org/3/movie";


interface IMovie{
    id:number,
    backdrop_path:string,
    poster_path:string,
    title:string,
    overview:string,
}

export interface IGetMovieResult {
    dates : {
        maximum : string;
        minimum : string;
    };
    page: number,
    results:IMovie[],
    total_pages:number,
    total_results:number,
}

export const getMovies = () => {
  return fetch(`${BASE_PATH}/now_playing?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
};