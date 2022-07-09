import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  getMovies_now_playing,
  getMovies_popular,
  getMovies_upcoming,
  iGetMovieResult,
} from "../api";
import { makeImagePath_backdrop } from "../utils";

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
  font-size: 28px;
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

const BtnWrapper = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 200px;
  width: 100%;
  /* z-index: 1000; */
`;

const SlideBtn = styled.button`
  font-size: 30px;
  height: 80%;
  z-index: 1000;
  color:#dfdfdfdc;
  background-color: rgba(0,0,0,0.1);
  border-style: none;
  cursor: pointer;
  &:hover{
    color:white;
    scale:1.5;
  }
`;
// ======================================
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
  hidden: { x: +window.outerWidth - 5 },
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
//            Initial
// ================================================
let totalMovies_now = 0;
let totalMovies_popular = 0;
let totalMovies_upcoming = 0;
let maxIndex_now = 2;
let maxIndex_popular = 2;
let maxIndex_upcoming = 2;
let minIndex_now = 0;
let minIndex_popular = 0;
let minIndex_upcoming = 0;

// ================================================
//                Home
// ================================================

const Home = () => {
  // ============ Hook ========================
  const [index_now, setIndex_now] = useState(0);
  const [index_popular, setIndex_popular] = useState(0);
  const [index_upcoming, setIndex_upcoming] = useState(0);

  const [isIncrease, setIsIncrease] = useState<boolean>(false);
  const [leaving, setLeaving] = useState<boolean>(false);

  const [category, setCategory] = useState<CATEGORY>(CATEGORY.NOW_PLAYING);
  const [clickedData, setClickedData] = useState<iGetMovieResult>();

  const { data: data_now_playing, isLoading: isLoading_now_playing } =
    useQuery<iGetMovieResult>(["movies", "nowPlaying"], getMovies_now_playing);
  const { data: data_popular, isLoading: isLoading_data_popular } =
    useQuery<iGetMovieResult>(["movies", "popular"], getMovies_popular);
  const { data: data_upcoming, isLoading: isLoading_data_upcoming } =
    useQuery<iGetMovieResult>(["movies", "upcoming"], getMovies_upcoming);

  const bigMovieMatch = useMatch("/movies/:movieId");
  const { scrollY } = useViewportScroll();
  const navigate = useNavigate();

  // ============ Handle Function ============

  const toggleLeaving = () => setLeaving((prev) => !prev);

  // Increase
  if (data_now_playing) {
    totalMovies_now = data_now_playing.results.length - 1;
    maxIndex_now = Math.floor(totalMovies_now / OFFSET) - 1;
  }

  if (data_popular) {
    totalMovies_popular = data_popular.results.length - 1;
    maxIndex_popular = Math.floor(totalMovies_popular / OFFSET) - 1;
  }

  if (data_upcoming) {
    totalMovies_upcoming = data_upcoming.results.length - 1;
    maxIndex_upcoming = Math.floor(totalMovies_upcoming / OFFSET) - 1;
  }

  const increaseIndex = (cate: CATEGORY) => {
    setIsIncrease(true);
    //연속 버튼 방지
    if (leaving) return;
    toggleLeaving();
    console.log(index_now);
    console.log(maxIndex_now);
    console.log(isIncrease);
    switch (cate) {
      case CATEGORY.NOW_PLAYING:
        setIndex_now((prev) => (index_now === maxIndex_now ? 0 : prev + 1));
        break;
      case CATEGORY.POPULAR:
        setIndex_popular((prev) =>
          index_popular === maxIndex_popular ? 0 : prev + 1
        );
        break;
      case CATEGORY.UPCOMING:
        setIndex_upcoming((prev) =>
          index_upcoming === maxIndex_upcoming ? 0 : prev + 1
        );
        break;
    }
  };
  const decreaseIndex = (cate: CATEGORY) => {
    setIsIncrease((prev) => false);
    console.log(index_now);
    console.log(minIndex_now);
    console.log(isIncrease);
    //연속 버튼 방지
    if (leaving) return;
    toggleLeaving();

    switch (cate) {
      case CATEGORY.NOW_PLAYING:
        setIndex_now((prev) => (index_now === minIndex_now ? 2 : prev - 1));
        break;
      case CATEGORY.POPULAR:
        setIndex_popular((prev) =>
          index_popular === minIndex_popular ? 2 : prev - 1
        );
        break;
      case CATEGORY.UPCOMING:
        setIndex_upcoming((prev) =>
          index_upcoming === minIndex_upcoming ? 2 : prev - 1
        );
        break;
    }
  };

  // Common
  const onBoxClicked = (movieId: number | string, cate: CATEGORY) => {
    setCategory(cate);

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
    navigate(`/movies/${movieId}`);
  };

  const onOverlayClick = () => navigate("/");

  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    clickedData?.results.find(
      (movie) => String(movie.id) === bigMovieMatch.params.movieId
    );

  // ============= Return ===========================
  return (
    <Wrapper>
      {isLoading_now_playing ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath_backdrop(
              data_now_playing?.results[0].backdrop_path || ""
            )}
          >
            <Title>{data_now_playing?.results[0].title}</Title>
            <Overview>{data_now_playing?.results[0].overview}</Overview>
          </Banner>

          {/* Now Playing */}
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Filter key="key_now_playing">Now Playing</Filter>
              <BtnWrapper>
                <SlideBtn onClick={() => decreaseIndex(CATEGORY.NOW_PLAYING)}>
                  {`<`}
                </SlideBtn>
                <SlideBtn onClick={() => increaseIndex(CATEGORY.NOW_PLAYING)}>
                  {`>`}
                </SlideBtn>
              </BtnWrapper>
              <Row
                key={index_now}
                variants={RowVariants}
                initial={isIncrease ? "hidden" : "exit"}
                animate="visible"
                exit={isIncrease ? "exit" : "hidden"}
                transition={{ type: "tween", duration: 2 }}
              >
                {data_now_playing?.results
                  .slice(1)
                  .slice(index_now * OFFSET, index_now * OFFSET + OFFSET)
                  .map((movie) => (
                    <Box
                      key={movie.id}
                      layoutId={CATEGORY.NOW_PLAYING + "_" + movie.id}
                      initial="normal"
                      whileHover="hover"
                      variants={BoxVariants}
                      transition={{ type: "tween" }}
                      bg_photo={makeImagePath_backdrop(
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
              <Filter key="key_popular">Popular</Filter>
              <BtnWrapper>
                <SlideBtn onClick={() => decreaseIndex(CATEGORY.POPULAR)}>
                {`<`}
                </SlideBtn>
                <SlideBtn
                  id="popular"
                  onClick={() => increaseIndex(CATEGORY.POPULAR)}
                >
                  {`>`}
                </SlideBtn>
              </BtnWrapper>
              <Row
                key={index_popular}
                variants={RowVariants}
                initial={isIncrease ? "hidden" : "exit"}
                animate="visible"
                exit={isIncrease ? "exit" : "hidden"}
                transition={{ type: "tween", duration: 2 }}
              >
                {data_popular?.results
                  .slice(1)
                  .slice(
                    index_popular * OFFSET,
                    index_popular * OFFSET + OFFSET
                  )
                  .map((movie) => (
                    <Box
                      layoutId={CATEGORY.POPULAR + "_" + movie.id}
                      initial="normal"
                      whileHover="hover"
                      variants={BoxVariants}
                      transition={{ type: "tween" }}
                      key={movie.id + "p"}
                      bg_photo={makeImagePath_backdrop(
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
              <Filter key="key_upcoming">Upcoming</Filter>
              <BtnWrapper>
                <SlideBtn onClick={() => decreaseIndex(CATEGORY.UPCOMING)}>
                {`<`}
                </SlideBtn>
                <SlideBtn
                  id="upcoming"
                  onClick={() => increaseIndex(CATEGORY.UPCOMING)}
                >
                  {`>`}
                </SlideBtn>
              </BtnWrapper>
              <Row
                key={index_upcoming}
                variants={RowVariants}
                initial={isIncrease ? "hidden" : "exit"}
                animate="visible"
                exit={isIncrease ? "exit" : "hidden"}
                transition={{ type: "tween", duration: 2 }}
              >
                {data_upcoming?.results
                  .slice(1)
                  .slice(
                    index_upcoming * OFFSET,
                    index_upcoming * OFFSET + OFFSET
                  )
                  .map((movie) => (
                    <Box
                      layoutId={CATEGORY.UPCOMING + "_" + movie.id}
                      initial="normal"
                      whileHover="hover"
                      variants={BoxVariants}
                      transition={{ type: "tween" }}
                      key={movie.id + "u"}
                      bg_photo={makeImagePath_backdrop(
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
                          backgroundImage: `linear-gradient(to top, black, transparent),url(${makeImagePath_backdrop(
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
