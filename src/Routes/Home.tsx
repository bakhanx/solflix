import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { url } from "inspector";
import { useState } from "react";
import { useQuery } from "react-query";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMovies, IGetMovieResult } from "../api";
import { makeImagePath } from "../utils";

// ================================================
//               Constant
// ================================================

const OFFSET = 6;

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
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
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
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const { data, isLoading } = useQuery<IGetMovieResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const bigMovieMatch = useMatch("/movies/:movieId");
  const { scrollY } = useViewportScroll();
  const navigate = useNavigate();

  // ============ Handle Function ============

  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / OFFSET) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  const onOverlayClick = () => navigate("/");
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie) => String(movie.id) === bigMovieMatch.params.movieId
    );
  console.log(clickedMovie);
  // ============= Return ===========================

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                key={index}
                variants={RowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 2 }}
              >
                {data?.results
                  .slice(1)
                  .slice(index * OFFSET, index * OFFSET + OFFSET)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      initial="normal"
                      whileHover="hover"
                      variants={BoxVariants}
                      transition={{ type: "tween" }}
                      key={movie.id}
                      bg_photo={makeImagePath(
                        movie.backdrop_path || "",
                        "w500"
                      )}
                      onClick={() => onBoxClicked(movie.id)}
                    >
                      <Info variants={InfoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <BigMovie
                  layoutId={bigMovieMatch.params.movieId}
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
