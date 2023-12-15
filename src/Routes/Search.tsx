import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { getMovies, getTv, iGetMovieResult, iGetTvResult } from "../api";
import { makeImagePath } from "../utils";

// ================================================
//              Components
// ================================================
const Wrapper = styled.div`
  background-color: black;
  padding: 60px;
`;
const KeyWord = styled.div`
  margin-top: 200px;
  font-size: 48px;
  margin-bottom: 20px;
`;
const Results = styled.div`
  padding: 30px;
  height: 100vh;
`;
const Row = styled.div`
  width: 100vw;
  height: 240px;
  display: flex;
  margin-top: 30px;
  margin-bottom: 30px;
`;
const Poster = styled.div<{ bg: string }>`
  width: 320px;
  height: 240px;
  border: 1px solid;
  background-image: url(${(props) => props.bg});
  background-size: cover;
  background-position: center;
`;
const Content = styled.div`
  margin-left: 30px;
  width: 100vw;
  height: 240px;
`;
const Title = styled.div`
  font-size: 36px;
  padding: 10px;
`;
const Overview = styled.div`
  font-size: 18px;
  padding: 10px;
  width: 60vw;
`;
const Detail = styled.div`
  width: 60vw;
  display: flex;
  justify-content: space-between;
`;
const Release = styled.p`
  font-size: 16px;
`;
const Popularity = styled.p`
  font-size: 16px;
`;
const MovieBtn = styled.button<{ color: string }>`
  width: 80px;
  height: 30px;
  border: none;
  background: none;

  color: ${(props) => props.color};
  &:hover {
    color: #eee;
    cursor: pointer;
    transition: 0.2s ease;
  }
  border-left: 1px solid;
  border-top: 1px solid;
  border-top-left-radius: 5px;
`;
const TvBtn = styled(MovieBtn)`
`;
const NoResult = styled.div`
  font-size: 36px;
`;
// ================================================
//                Search
// ================================================
const Search = () => {
  const location = useLocation();

  const keyword: any = new URLSearchParams(location.search).get("keyword");

  // const searchMatch: PathMatch<string> | null = useMatch("/search/:search");

  const {
    data: data_movie,
    isLoading: data_movie_isLoading,
    refetch: refetch_movie,
  } = useQuery<iGetMovieResult>(["movies", "searchMovies"], async () =>
    getMovies(keyword)
  );

  const {
    data: data_tv,
    isLoading: data_tv_isLoading,
    refetch: refetch_tv,
  } = useQuery<iGetTvResult>(["tv", "searchTv"], async () => getTv(keyword));

  const [isMovie, setIsMovie] = useState(true);

  const onClickMovie = () => {
    if (!isMovie) setIsMovie(true);
  };
  const onClickTv = () => {
    if (isMovie) setIsMovie(false);
  };

  useEffect(() => {
    if (isMovie) {
      refetch_movie();
    } else if (!isMovie) {
      refetch_tv();
    }
  }, [keyword, isMovie]);

  return (
    <Wrapper>
      {(isMovie ? data_movie_isLoading : data_tv_isLoading) ? (
        "Loading..."
      ) : (
        <>
          <KeyWord>
            {isMovie ? "Movie" : "TV"} Search : "{keyword}"
          </KeyWord>
          <MovieBtn
            onClick={onClickMovie}
            color={isMovie ? "red" : "#eeeeeec1"}
          >
            Movie
          </MovieBtn>
          <TvBtn onClick={onClickTv} color={isMovie ? "#eeeeeec1" : "red"}>
            TV
          </TvBtn>

          <hr />
          <Results>
            {(isMovie ? data_movie?.total_results : data_tv?.total_results) === 0 ? <NoResult>{`No Results :(`}</NoResult> : ""}
            {(isMovie ? data_movie : data_tv)?.results.map((data) => (
              <div key={data.id}>

                <Row>
                  <Poster
                    bg={makeImagePath(
                      data.backdrop_path,
                      data.poster_path,
                      "w500"
                    )}
                  />
                  <Content>
                    <Detail>
                      <Popularity>{`💕 popularity : ${data.popularity}`}</Popularity>
                      <Release>{`🎬 Release Date : ${data.release_date || "unknown"}`}</Release>
                    </Detail>

                    <Title>{isMovie ? data?.title : data?.name}</Title>
                    <Overview>
                      {data.overview ? data.overview : "Coming soon..."}
                    </Overview>
                  </Content>
                </Row>
                <hr />
              </div>
            ))}
          </Results>
        </>
      )}
    </Wrapper>
  );
};

export default Search;
