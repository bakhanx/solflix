import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  getMovies_now_playing,
  getMovies_popular,
  getMovies_upcoming,
  IGetMovieResult,
} from "../api";
import { makeImagePath } from "../utils";

// ================================================
//               Constant
// ================================================

const OFFSET = 6;
const enum CATEGORY {
  "NOW_PLAYING" = "NOW_PLAYING",
  "POPULAR" = "POPULAR",
  "UPCOMING" = "UPCOMING",
}

// ================================================
//              Components
// ================================================

const Wrapper = styled.div`
  background-color: black;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(
      rgba(0, 0, 0, 1),
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 1)
    ),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;
const Title = styled.h2`
  font-size: 58px;
  margin-bottom: 20px;
`;
const Overview = styled.p`
  font-size: 24px;
  width: 50%;
`;
const Slider = styled.div`
  position: relative;
  top: -150px;
  width: 95%;
  margin: auto;
  margin-bottom: 220px;
`;
const Filter = styled.div`
  font-size: 36px;
  padding-bottom: 15px;
`;
const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;
const Box = styled(motion.div)<{ bg_photo: string }>`
  background-color: white;
  height: 200px;
  color: white;
  font-size: 20px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url(${(props) => props.bg_photo});
  background-size: cover;
  background-position: center;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }

  &:hover {
    background-image: url(${(props) => props.bg_photo});
    cursor: pointer;
    color: red;
  }
`;
const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
  }
`;
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;
const BigMovie = styled(motion.div)<{ scrolly: number }>`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  top: ${(props) => props.scrolly + 100}px;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
`;
const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center;
  height: 400px;
`;
const BigContent = styled.div`
  color: ${(props) => props.theme.white.lighter};
  position: relative;
  top: -80px;
`;
const BigTitle = styled.h3`
  font-size: 36px;
  padding: 20px;
`;
const BigOverview = styled.p`
  font-size: 18px;
  padding: 20px;
`;
const NextBtn = styled.button``;
// ================================================
//            Variannts
// ================================================
const BoxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: { delay: 0.3, duration: 0.3, type: "tween" },
  },
};
const RowVariants = {
  hidden: { x: window.outerWidth - 5 },
  visible: { x: 0 },
  exit: { x: -window.outerWidth + 5 },
};
const InfoVariants = {
  hover: {
    opacity: 1,
    transition: { delay: 0.3, duration: 0.3, type: "tween" },
  },
};

// ================================================
//                Home
// ================================================

const Home = () => {
  // ============ Hook ========================
  const categoryIndex = { NOW_PLAYING: 0, POPULAR: 0, UPCOMING: 0 };

  const [index, setIndex] = useState(categoryIndex);
  const [leaving, setLeaving] = useState<boolean>(false);

  const [category, setCategory] = useState<string>("");
  const [clickedData, setClickedData] = useState<IGetMovieResult>();

  const { data: data_now_playing, isLoading: isLoading_now_playing } =
    useQuery<IGetMovieResult>(["movies", "nowPlaying"], getMovies_now_playing);
  const { data: data_popular, isLoading: isLoading_data_popular } =
    useQuery<IGetMovieResult>(["movies", "popular"], getMovies_popular);
  const { data: data_upcoming, isLoading: isLoading_data_upcoming } =
    useQuery<IGetMovieResult>(["movies", "upcoming"], getMovies_upcoming);

  const bigMovieMatch = useMatch("/movies/:movieId");
  const { scrollY } = useViewportScroll();
  const navigate = useNavigate();

  // ============ Handle Function ============

  const clickedCategory = (cate: string) => {
    setCategory(cate);
    console.log("cllicked cate", category);
    switch (cate) {
      case CATEGORY.NOW_PLAYING:
        setClickedData(data_now_playing);
        break;
      case CATEGORY.POPULAR:
        setClickedData(data_popular);
        break;
      case CATEGORY.UPCOMING:
        setClickedData(data_upcoming);
        break;
    }
  };

  // Increase
  const increaseIndex = (cate: string) => {

    clickedCategory(cate);
    console.log("increase cate", category);
    if (clickedData) {
      const totalMovies = clickedData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / OFFSET) - 1;

      //연속 버튼 방지
      if (leaving) return;
      toggleLeaving();

      const newIndex = { ...index };
      newIndex.NOW_PLAYING === maxIndex
        ? (newIndex.NOW_PLAYING = 0)
        : newIndex.NOW_PLAYING += 1;
      setIndex(newIndex);
    }
    console.log(index.NOW_PLAYING);
  };
  
  const toggleLeaving = () => setLeaving((prev) => !prev);

  // Common
  const onBoxClicked = (movieId: number | string, category: string) => {
    clickedCategory(category);
    navigate(`/movies/${movieId}`);
  };

  const onOverlayClick = () => navigate("/");

  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    clickedData?.results.find(
      (movie) => String(movie.id) === bigMovieMatch.params.movieId
    );

  console.log("clicekd", clickedMovie);
  // ============= Return ===========================
  console.log(data_now_playing);
  return (
    <Wrapper>
      {isLoading_now_playing ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(
              data_now_playing?.results[0].backdrop_path || ""
            )}
          >
            <Title>{data_now_playing?.results[0].title}</Title>
            <Overview>{data_now_playing?.results[0].overview}</Overview>
          </Banner>

          {/* Now Playing */}
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Filter>Now Playing</Filter>
              <NextBtn onClick={() => increaseIndex(CATEGORY.NOW_PLAYING)}>
                next
              </NextBtn>
              <Row
                key={index.NOW_PLAYING}
                variants={RowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 2 }}
              >
                {data_now_playing?.results
                  .slice(1)
                  .slice(
                    index.NOW_PLAYING * OFFSET,
                    index.NOW_PLAYING * OFFSET + OFFSET
                  )
                  .map((movie) => (
                    <Box
                      layoutId={CATEGORY.NOW_PLAYING + "_" + movie.id}
                      initial="normal"
                      whileHover="hover"
                      variants={BoxVariants}
                      transition={{ type: "tween" }}
                      key={movie.id}
                      bg_photo={makeImagePath(
                        movie.backdrop_path || "",
                        "w500"
                      )}
                      onClick={() => {
                        onBoxClicked(movie.id, CATEGORY.NOW_PLAYING);
                      }}
                    >
                      {movie.title}
                      <Info variants={InfoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>

          {/* Popular */}
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Filter>Popular</Filter>
              <NextBtn
                id="popular"
                onClick={() => increaseIndex(CATEGORY.POPULAR)}
              >
                next
              </NextBtn>
              <Row
                key={index + "popular"}
                variants={RowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 2 }}
              >
                {data_popular?.results
                  .slice(1)
                  .slice(
                    index.POPULAR * OFFSET,
                    index.POPULAR * OFFSET + OFFSET
                  )
                  .map((movie) => (
                    <Box
                      layoutId={CATEGORY.POPULAR + "_" + movie.id}
                      initial="normal"
                      whileHover="hover"
                      variants={BoxVariants}
                      transition={{ type: "tween" }}
                      key={movie.id + "p"}
                      bg_photo={makeImagePath(
                        movie.backdrop_path || "",
                        "w500"
                      )}
                      onClick={() => {
                        onBoxClicked(movie.id, CATEGORY.POPULAR);
                      }}
                    >
                      {movie.title}
                      <Info variants={InfoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>

          {/* Upcoming */}
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Filter>Upcoming</Filter>
              <NextBtn
                id="upcoming"
                onClick={() => increaseIndex(CATEGORY.UPCOMING)}
              >
                next
              </NextBtn>
              <Row
                key={index + "upcoming"}
                variants={RowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 2 }}
              >
                {data_upcoming?.results
                  .slice(1)
                  .slice(
                    index.UPCOMING * OFFSET,
                    index.UPCOMING * OFFSET + OFFSET
                  )
                  .map((movie) => (
                    <Box
                      layoutId={CATEGORY.UPCOMING + "_" + movie.id}
                      initial="normal"
                      whileHover="hover"
                      variants={BoxVariants}
                      transition={{ type: "tween" }}
                      key={movie.id + "u"}
                      bg_photo={makeImagePath(
                        movie.backdrop_path || "",
                        "w500"
                      )}
                      onClick={() => {
                        onBoxClicked(movie.id, CATEGORY.UPCOMING);
                      }}
                    >
                      {movie.title}
                      <Info variants={InfoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>

          {/* Detail Pop up */}
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <BigMovie
                  layoutId={category + "_" + bigMovieMatch.params.movieId}
                  scrolly={scrollY.get()}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent),url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigContent>
                        <BigTitle>{clickedMovie.title}</BigTitle>
                        <BigOverview>{clickedMovie.overview}</BigOverview>
                      </BigContent>
                    </>
                  )}
                </BigMovie>
              </>
            ) : (
              "null"
            )}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
};

export default Home;
