import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useEffect, useState } from "react";
import {
  useLocation,
  useMatch,
  useNavigate,
  useParams,
} from "react-router-dom";
import styled from "styled-components";
import { iGetMovieResult, iMovie } from "../api";
import { makeImagePath_backdrop } from "../utils";
import { CATEGORY } from "../Routes/Home";
import Detail from "./Detail";

const OFFSET = 6;

export const Slide = styled.div`
  position: relative;
  top: -150px;
  width: 95%;
  margin: auto;
  margin-bottom: 220px;
`;
export const Filter = styled.div`
  font-size: 36px;
  padding-bottom: 15px;
`;
export const BtnWrapper = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 200px;
  width: 100%;
  /* z-index: 1000; */
`;
export const SlideBtn = styled.button`
  font-size: 30px;
  height: 80%;
  z-index: 1000;
  color: #dfdfdfdc;
  background-color: rgba(0, 0, 0, 0.1);
  border-style: none;
  cursor: pointer;
  &:hover {
    color: white;
    scale: 1.5;
  }
`;
export const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;
export const Box = styled(motion.div)<{ bg_photo: string }>`
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
export const Info = styled(motion.div)`
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
// ============== Variants ====================
export const BoxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: { delay: 0, duration: 0.3, type: "tween" },
  },
};
export const RowVariants = {
  hidden: (isIncrease: boolean) => {
    return {
      x: isIncrease ? +window.outerWidth - 5 : -window.outerWidth + 5,
    };
  },
  visible: { x: 0 },
  exit: (isIncrease: boolean) => {
    return {
      x: isIncrease ? -window.outerWidth + 5 : +window.outerWidth - 5,
    };
  },
};
export const InfoVariants = {
  hover: {
    opacity: 1,
    transition: { delay: 0.3, duration: 0.3, type: "tween" },
  },
};

// Increase

interface iSlider {
  cate: CATEGORY;
  data: iGetMovieResult;
  title: string;
  urlType: "tvs" | "movies";
}

const Slider = ({ cate, data, title, urlType }: iSlider) => {
  const [index, setIndex] = useState(0);

  const [isIncrease, setIsIncrease] = useState<boolean>(true);
  const [leaving, setLeaving] = useState<boolean>(false);

  const [category, setCategory] = useState<CATEGORY>(CATEGORY.NOW_PLAYING);
  const [clickedData, setClickedData] = useState<iGetMovieResult | iMovie>();

  const bigMovieMatch = useMatch(`/${urlType}/:movieId`);
  const { scrollY } = useViewportScroll();
  const navigate = useNavigate();
  const toggleLeaving = () => setLeaving((prev) => !prev);
  // count Total Movies
  const [totalMovies, setTotalMovies] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);

  useEffect(() => {
    if (data && data?.results) {
      setTotalMovies(data?.results.length - 1);
      setMaxIndex(Math.floor(totalMovies / OFFSET) - 1);
    }
  }, [data, totalMovies]);

  const increaseIndex = (cate: CATEGORY) => {
    //연속 버튼 방지
    setIsIncrease(true);
    if (leaving) return;
    toggleLeaving();
    setIndex((prev) => (index === maxIndex ? 0 : prev + 1));
  };

  const decreaseIndex = (cate: CATEGORY) => {
    //연속 버튼 방지
    setIsIncrease(false);
    if (leaving) return;
    toggleLeaving();
    setIndex((prev) => (index === maxIndex ? 2 : prev - 1));
  };

  const onBoxClicked = (movieId: number | string, cate: CATEGORY) => {
    // setCategory(cate);
    setClickedData(data);
    navigate(`/${urlType}/${movieId}`);
  };

  return (
    <>
      <Slide>
        <Filter key={cate}>{title}</Filter>

        <BtnWrapper>
          <SlideBtn onClick={() => decreaseIndex(cate)}>{`<`}</SlideBtn>
          <SlideBtn onClick={() => increaseIndex(cate)}>{`>`}</SlideBtn>
        </BtnWrapper>

        <AnimatePresence
          initial={false}
          onExitComplete={toggleLeaving}
          custom={isIncrease}
        >
          <Row
            key={index}
            variants={RowVariants}
            initial={"hidden"}
            animate="visible"
            exit={"exit"}
            transition={{ type: "tween", duration: 2 }}
            custom={isIncrease}
          >
            {data?.results
              .slice(1)
              .slice(index * OFFSET, index * OFFSET + OFFSET)
              .map((movie) => (
                <Box
                  key={movie.id}
                  layoutId={cate + "_" + movie.id}
                  initial="normal"
                  whileHover="hover"
                  variants={BoxVariants}
                  transition={{ type: "tween" }}
                  bg_photo={makeImagePath_backdrop(
                    movie.backdrop_path || "",
                    "w500"
                  )}
                  onClick={() => {
                    onBoxClicked(movie.id, cate);
                  }}
                >
                  {movie.title || movie.name}
                  <Info variants={InfoVariants}>
                    <h4>{movie.title || movie.name}</h4>
                  </Info>
                </Box>
              ))}
          </Row>
        </AnimatePresence>
      </Slide>

      <Detail data={clickedData as iGetMovieResult} urlType={urlType} />
    </>
  );
};

export default Slider;
