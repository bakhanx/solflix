import { AnimatePresence, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  getTv_airing_today,
  getTv_latest,
  getTv_on_the_air,
  getTv_popular,
  getTv_top_rated,
  iGetTvResult,
  iTv,
} from "../api";
import { makeImagePath } from "../utils";
import {
  Banner,
  BigContent,
  BigCover,
  BigMovie,
  BigOverview,
  BigTitle,
  Box,
  BtnWrapper,
  Filter,
  Loader,
  Overlay,
  Overview,
  Row,
  SlideBtn,
  Slider,
  Title,
  Wrapper,
} from "./Home";

// ================================================
//                Const
// ================================================
const OFFSET = 6;
const enum CATEGORY {
  "AIRING_TODAY" = "AIRING_TODAY",
  "POPULAR" = "POPULAR",
  "TOP_RATED" = "TOP_RATED",
  "ON_THE_AIR" = "ON_THE_AIR",
  "LATEST" = "LATEST",
}
// ================================================
//                Component
// ================================================

// ================================================
//                TV
// ================================================

const Tv = () => {
  const [index, setIndex] = useState([0, 0, 0, 0, 0]);
  const [category, setCategory] = useState<CATEGORY>(CATEGORY.ON_THE_AIR);

  const [leaving, setLeaving] = useState<boolean>(false);
  const [clickedData, setClickedData] = useState<iGetTvResult | iTv>();

  const { data: data_airing_today, isLoading: isLoading_airing_today } =
    useQuery<iGetTvResult>(["tv", "airing_today"], getTv_airing_today);
  const { data: data_popular, isLoading: isLoading_popular } =
    useQuery<iGetTvResult>(["tv", "popular"], getTv_popular);

  const { data: data_top_rated, isLoading: isLoading_top_rated } =
    useQuery<iGetTvResult>(["tv", "top_rate"], getTv_top_rated);

  const { data: data_latest, isLoading: isLoading_latest } = useQuery<iTv>(
    ["tv", "latest"],
    getTv_latest
  );

  const { data: data_on_the_air, isLoading: isLoading_on_the_air } =
    useQuery<iGetTvResult>(["tv", "on_the_air"], getTv_on_the_air);

  const bigTvMatch = useMatch("/tvs/:tvId");

  const IncreaseIndex = (num: number) => {
    let temp = [...index];
    temp[num] === 2 ? (temp[num] = 0) : (temp[num] += 1);
    setIndex(temp);
  };
  const DecreaseIndex = (num: number) => {
    let temp = [...index];
    temp[num] === 0 ? (temp[num] = 2) : (temp[num] -= 1);
    setIndex(temp);
  };

  const navigate = useNavigate();

  const onOverlayClick = () => navigate("/tvs");

  const onBoxClicked = (tvId: number | string, cate: CATEGORY) => {
    setCategory(cate);

    switch (cate) {
      case CATEGORY.AIRING_TODAY:
        setClickedData(data_airing_today);
        break;
      case CATEGORY.POPULAR:
        setClickedData(data_popular);
        break;
      case CATEGORY.TOP_RATED:
        setClickedData(data_top_rated);
        break;
      case CATEGORY.ON_THE_AIR:
        setClickedData(data_on_the_air);
        break;
      case CATEGORY.LATEST:
        setClickedData(data_latest);
        break;
    }
    navigate(`/tvs/${tvId}`);
  };

  const { scrollY } = useViewportScroll();

  const toggleLeaving = () => setLeaving((prev) => !prev);

  const clickedTv =
    bigTvMatch?.params.tvId &&
    (clickedData?.results
      ? clickedData.results.find(
          (tv) => String(tv.id) === bigTvMatch.params.tvId
        )
      : clickedData);

  return (
    <Wrapper>
      {isLoading_on_the_air ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgphoto={makeImagePath(
              data_on_the_air?.results[0].backdrop_path,
              data_on_the_air?.results[0].poster_path
            )}
          >
            <Title>{data_on_the_air?.results[0].name}</Title>
            <Overview>{data_on_the_air?.results[0].overview}</Overview>
          </Banner>

          {/* Airing Today */}
          <Slider>
            <Filter>Airing Today</Filter>
            <BtnWrapper>
              <SlideBtn onClick={() => DecreaseIndex(0)}>{`<`}</SlideBtn>
              <SlideBtn onClick={() => IncreaseIndex(0)}>{`>`}</SlideBtn>
            </BtnWrapper>
            <AnimatePresence>
              <Row key="key_aring_today">
                {data_airing_today?.results
                  .slice(1)
                  .slice(index[0] * OFFSET, index[0] * OFFSET + OFFSET)
                  .map((data) => (
                    <Box
                      layoutId={CATEGORY.AIRING_TODAY + "_" + data.id}
                      key={`airingtoday-${data.id}`}
                      onClick={() =>
                        onBoxClicked(data.id, CATEGORY.AIRING_TODAY)
                      }
                      bg_photo={makeImagePath(
                        data.backdrop_path,
                        data.poster_path,
                        "w500"
                      )}
                    >
                      {data.name}
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>

          {/* Popular */}
          <Slider>
            <Filter>Popular</Filter>
            <BtnWrapper>
              <SlideBtn onClick={() => DecreaseIndex(1)}>{`<`}</SlideBtn>
              <SlideBtn onClick={() => IncreaseIndex(1)}>{`>`}</SlideBtn>
            </BtnWrapper>
            <Row key="key_popular">
              {data_popular?.results
                .slice(1)
                .slice(index[1] * OFFSET, index[1] * OFFSET + OFFSET)
                .map((data) => (
                  <Box
                    layoutId={CATEGORY.POPULAR + "_" + data.id}
                    key={`popular-${data.id}`}
                    onClick={() => onBoxClicked(data.id, CATEGORY.POPULAR)}
                    bg_photo={makeImagePath(
                      data.backdrop_path,
                      data.poster_path,
                      "w500"
                    )}
                  >
                    {data.name}
                  </Box>
                ))}
            </Row>
          </Slider>

          {/* Top Rate */}
          <Slider>
            <Filter>Top Rated</Filter>
            <BtnWrapper>
              <SlideBtn onClick={() => DecreaseIndex(2)}>{`<`}</SlideBtn>
              <SlideBtn onClick={() => IncreaseIndex(2)}>{`>`}</SlideBtn>
            </BtnWrapper>
            <Row key="key_top_rated">
              {data_top_rated?.results
                .slice(1)
                .slice(index[2] * OFFSET, index[2] * OFFSET + OFFSET)
                .map((data) => (
                  <Box
                    layoutId={CATEGORY.TOP_RATED + "_" + data.id}
                    key={`toprated-${data.id}`}
                    onClick={() => onBoxClicked(data.id, CATEGORY.TOP_RATED)}
                    bg_photo={makeImagePath(
                      data.backdrop_path,
                      data.poster_path,
                      "w500"
                    )}
                  >
                    {data.name}
                  </Box>
                ))}
            </Row>
          </Slider>

          {/* On The Air */}
          <Slider>
            <Filter>On The Air</Filter>
            <BtnWrapper>
              <SlideBtn onClick={() => DecreaseIndex(0)}>{`<`}</SlideBtn>
              <SlideBtn onClick={() => IncreaseIndex(0)}>{`>`}</SlideBtn>
            </BtnWrapper>
            <AnimatePresence>
              <Row key="key_on_the_air">
                {data_on_the_air?.results
                  .slice(1)
                  .slice(index[3] * OFFSET, index[3] * OFFSET + OFFSET)
                  .map((data) => (
                    <Box
                      layoutId={CATEGORY.ON_THE_AIR + "_" + data.id}
                      key={`ontheair-${data.id}`}
                      onClick={() => onBoxClicked(data.id, CATEGORY.ON_THE_AIR)}
                      bg_photo={makeImagePath(
                        data.backdrop_path,
                        data.poster_path,
                        "w500"
                      )}
                    >
                      {data.name}
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>

          {/* latest */}
          <Slider>
            <Filter>Latest</Filter>
            <AnimatePresence>
              <Row key="key_latest">
                {data_latest ? (
                  <Box
                    layoutId={CATEGORY.LATEST + "_" + data_latest.id}
                    key={`latest-${data_latest.id}`}
                    onClick={() =>
                      onBoxClicked(data_latest.id, CATEGORY.LATEST)
                    }
                    bg_photo={makeImagePath(
                      data_latest.backdrop_path,
                      data_latest.poster_path,
                      "w500"
                    )}
                  >
                    {data_latest.name}
                  </Box>
                ) : (
                  ""
                )}
              </Row>
            </AnimatePresence>
          </Slider>

          {/* Detail Pop up */}
          <AnimatePresence>
            {bigTvMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <BigMovie
                  layoutId={category + "_" + bigTvMatch.params.tvId}
                  scrolly={scrollY.get()}
                >
                  {clickedTv && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent),url(${makeImagePath(
                            clickedTv.backdrop_path,
                            clickedTv.poster_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigContent>
                        <BigTitle>{clickedTv.name}</BigTitle>
                        <BigOverview>
                          {clickedTv.overview !== ""
                            ? clickedTv.overview
                            : "coming soon..."}
                        </BigOverview>
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

export default Tv;
