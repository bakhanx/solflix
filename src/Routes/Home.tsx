import { useQuery } from "react-query";
import styled from "styled-components";
import {
  getMovies_latest,
  getMovies_now_playing,
  getMovies_popular,
  getMovies_top_rated,
  getMovies_upcoming,
  iGetMovieResult,
  iMovie,
} from "../api";
import Slider from "../Components/Slider";

import Banner from "../Components/Banner";

// ================================================
//               Constant
// ================================================
export const enum CATEGORY {
  "LATEST" = "LATEST",
  "TOP_RATED" = "TOP_RATED",
  "UPCOMING" = "UPCOMING",
  "NOW_PLAYING" = "NOW_PLAYING",
  "POPULAR" = "POPULAR",

  "AIRING_TODAY" = "AIRING_TODAY",
  "ON_THE_AIR" = "ON_THE_AIR",
}

// ================================================
//               Styled-Components
// ================================================

export const Wrapper = styled.div`
  background-color: black;
`;
export const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// ================================================
//                Home
// ================================================

const Home = () => {
  const { data: data_latest, isLoading: isloading_latest } = useQuery<iMovie>(
    ["movies", "latest"],
    getMovies_latest
  );

  const { data: data_top_rated, isLoading: isloading_top_rated } =
    useQuery<iGetMovieResult>(["movies", "topRated"], getMovies_top_rated);

  const { data: data_upcoming, isLoading: isLoading_data_upcoming } =
    useQuery<iGetMovieResult>(["movies", "upcoming"], getMovies_upcoming);

  const { data: data_now_playing, isLoading: isLoading_now_playing } =
    useQuery<iGetMovieResult>(["movies", "nowPlaying"], getMovies_now_playing);

  const { data: data_popular, isLoading: isLoading_data_popular } =
    useQuery<iGetMovieResult>(["movies", "popular"], getMovies_popular);

  // ============= Return ===========================
  return (
    <Wrapper>
      {isLoading_now_playing ||
      isLoading_data_popular ||
      isloading_top_rated ||
      isLoading_data_upcoming ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          {/* Banner */}
          <Banner
            data={data_popular as iGetMovieResult}
            urlType={"movies"}
          />

          {/* Slider */}
          <Slider
            cate={CATEGORY.NOW_PLAYING}
            data={data_now_playing as iGetMovieResult}
            title={"Now Playing"}
            urlType="movies"
          />
          <Slider
            cate={CATEGORY.TOP_RATED}
            data={data_top_rated as iGetMovieResult}
            title={"Top Rated"}
            urlType="movies"
          />
          <Slider
            cate={CATEGORY.POPULAR}
            data={data_popular as iGetMovieResult}
            title={"Popular"}
            urlType="movies"
          />
          <Slider
            cate={CATEGORY.UPCOMING}
            data={data_upcoming as iGetMovieResult}
            title={"Upcomming"}
            urlType="movies"
          />
        </>
      )}
    </Wrapper>
  );
};

export default Home;
