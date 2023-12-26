import { useQuery } from "react-query";
import {
  getTv_airing_today,
  getTv_on_the_air,
  getTv_popular,
  getTv_top_rated,
  iGetMovieResult,
} from "../api";
import { CATEGORY, Loader, Wrapper } from "./Home";
import Banner from "../Components/Banner";
import Slider from "../Components/Slider";

// ================================================
//                Const
// ================================================

// ================================================
//                Component
// ================================================

// ================================================
//                TV
// ================================================

const Tv = () => {
  const { data: data_airing_today, isLoading: isLoading_airing_today } =
    useQuery<iGetMovieResult>(["tv", "airing_today"], getTv_airing_today);
  const { data: data_popular, isLoading: isLoading_popular } =
    useQuery<iGetMovieResult>(["tv", "popular"], getTv_popular);

  const { data: data_top_rated, isLoading: isLoading_top_rated } =
    useQuery<iGetMovieResult>(["tv", "top_rate"], getTv_top_rated);

  // const { data: data_latest, isLoading: isLoading_latest } = useQuery<iMovie>(
  //   ["tv", "latest"],
  //   getTv_latest
  // );

  const { data: data_on_the_air, isLoading: isLoading_on_the_air } =
    useQuery<iGetMovieResult>(["tv", "on_the_air"], getTv_on_the_air);

  return (
    <Wrapper>
      {isLoading_on_the_air ||
      isLoading_top_rated ||
      isLoading_airing_today ||
      isLoading_popular ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner data={data_on_the_air as iGetMovieResult} urlType={"tvs"} />

          {/* Slider */}
          <Slider
            cate={CATEGORY.ON_THE_AIR}
            data={data_on_the_air as iGetMovieResult}
            title="On The Air"
            urlType="tvs"
          />
          <Slider
            cate={CATEGORY.AIRING_TODAY}
            data={data_airing_today as iGetMovieResult}
            title="Airing Today"
            urlType="tvs"
          />
          <Slider
            cate={CATEGORY.POPULAR}
            data={data_popular as iGetMovieResult}
            title="Popular"
            urlType="tvs"
          />
          <Slider
            cate={CATEGORY.TOP_RATED}
            data={data_top_rated as iGetMovieResult}
            title="Top Rated"
            urlType="tvs"
          />
        </>
      )}
    </Wrapper>
  );
};

export default Tv;
