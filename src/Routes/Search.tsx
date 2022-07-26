import { useQuery } from "react-query";
import {
  PathMatch,
  useLocation,
  useMatch,

} from "react-router-dom";
import styled from "styled-components";
import { getMovies, getTv, iGetMovieResult } from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background-color: black;
  padding: 60px;
`;

const KeyWord = styled.div`
  margin-top: 80px;
  font-size: 48px;
  margin-bottom : 20px;
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
  /* background-image: url(${(props) => props.bg}); */
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

const Error = styled.div`
  color:red;
`

const Search = () => {
  const location = useLocation();

  const keyword: any = new URLSearchParams(location.search).get("keyword");

  const movieMatch: PathMatch<string> | null = useMatch("/movie/search");
  const tvMatch: PathMatch<string> | null = useMatch("/tv/search");

  const { data: data_movie, isLoading: data_movie_isLoading } =
    useQuery<iGetMovieResult>(["movies", "searchMovies"], async () =>
      getMovies(keyword)
    );

  const { data: data_tv, isLoading: data_tv_isLoading } =
    useQuery<iGetMovieResult>(["tv", "searchTv"], async () => getTv(keyword));

  let matchData = movieMatch ? data_movie : data_tv;
  let searchType = movieMatch ? "Movie" : "TV";

  return (
    <Wrapper>
      {data_movie_isLoading ? (
        "Loading..."
      ) : (
        <>
          <KeyWord>
            {searchType} Search : "{keyword}"
          </KeyWord>
          <div>Updating... </div>
          <Error>   Content Security Policy : 
           Load Image source, Page Refresh </Error>
        

          <hr />
          <Results>
            {matchData?.results.map((tv) => {
              return (
                <>
                  <Row>
                    <Poster
                      bg={makeImagePath(
                        tv.backdrop_path,
                        tv.poster_path,
                        "w500"
                      )}
                    />
                    <Content>
                      <Detail>
                        <Popularity>{`💕 popularity : ${tv.popularity}`}</Popularity>
                        <Release>{`🎬 Release Date : ${tv.release_date}`}</Release>
                      </Detail>

                      <Title>{tv.title}</Title>
                      <Overview>
                        {tv.overview ? tv.overview : "Coming soon..."}
                      </Overview>
                    </Content>
                  </Row>
                  <hr />
                </>
              );
            })}
          </Results>
        </>
      )}
    </Wrapper>
  );
};

export default Search;
