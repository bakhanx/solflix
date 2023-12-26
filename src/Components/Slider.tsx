import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { iGetMovieResult, iMovie } from "../api";
import { makeImagePath_backdrop } from "../utils";
import { CATEGORY } from "../Routes/Home";
import Detail from "./Detail";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { onOffOverlay, slideOffset } from "../atom";

// const OFFSET = 6;

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
  @media screen and (max-width: 768px) {
    font-size: 28px;
  }
`;
export const BtnWrapper = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 200px;
  width: 100%;
`;
export const SlideBtn = styled.button`
  font-size: 36px;
  height: 80%;
  z-index: 5;
  color: #dfdfdfdc;
  background-color: rgba(0, 0, 0, 0.1);
  border-style: none;
  cursor: pointer;
  &:hover {
    color: white;
    scale: 1.5;
  }
  @media screen and (max-width: 768px) {
    font-size: 28px;
  }
`;
export const Row = styled(motion.div)<{ offset: number }>`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(${(props) => props.offset}, 1fr);
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
  div {
    padding: 5px;
  }
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
  @media screen and (max-width: 768px) {
    font-size: 16px;
  }
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
export const Info = styled(motion.div)`
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  padding: 10px;
  /* position: absolute; */
  width: 100%;
  bottom: 0;
  font-size: 16px;

  p {
    text-align: center;
  }

  @media screen and (max-width: 768px) {
    font-size: 12px;
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
  const [clickedData, setClickedData] = useState<iGetMovieResult | iMovie>();
  const [category, setCategory] = useState("");

  const navigate = useNavigate();
  const toggleLeaving = () => setLeaving((prev) => !prev);
  // count Total Movies
  const [totalMovies, setTotalMovies] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const OFFSET = useRecoilValue(slideOffset);

  const setIsOnOverlay = useSetRecoilState(onOffOverlay);

  useEffect(() => {
    if (data && data?.results) {
      setTotalMovies(data?.results.length - 1);
      setMaxIndex(Math.floor(totalMovies / OFFSET) - 1);
    }
  }, [data, totalMovies, OFFSET]);

  const increaseIndex = () => {
    //연속 버튼 방지
    setIsIncrease(true);
    if (leaving) return;
    toggleLeaving();
    setIndex((prev) => (index === maxIndex ? 0 : prev + 1));
  };

  const decreaseIndex = () => {
    //연속 버튼 방지
    setIsIncrease(false);
    if (leaving) return;
    toggleLeaving();
    setIndex((prev) => (index === maxIndex ? 2 : prev - 1));
  };

  const onBoxClicked = (movieId: number | string, cate: CATEGORY) => {
    // setCategory(cate);
    setClickedData(data);
    setIsOnOverlay(cate);
    navigate(`/${urlType}/${movieId}`);
  };
  return (
    <>
      {data && (
        <>
          <Slide>
            <Filter key={cate}>{title}</Filter>

            <BtnWrapper>
              <SlideBtn onClick={decreaseIndex}>{`<`}</SlideBtn>
              <SlideBtn onClick={increaseIndex}>{`>`}</SlideBtn>
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
                transition={{ type: "tween", duration: 1 }}
                custom={isIncrease}
                offset={OFFSET}
              >
                {data?.results
                  .slice(index * OFFSET, index * OFFSET + OFFSET)
                  .map((movie) => (
                    <Box
                      key={cate + movie.id}
                      layoutId={cate + String(movie.id)}
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
                      <div>{movie.title || movie.name}</div>
                      <Info variants={InfoVariants}>
                        <p>{movie.release_date || movie.first_air_date}</p>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slide>

          <Detail
            data={clickedData as iGetMovieResult}
            urlType={urlType}
            cate={cate}
          />
        </>
      )}
    </>
  );
};

export default Slider;
