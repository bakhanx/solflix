import styled from "styled-components";
import { motion, useAnimation, useViewportScroll } from "framer-motion";
import { Link, PathMatch, useMatch, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import LogoImg from "../Image/solflix.png";

// ================================================
//              Components
// ================================================
const Nav = styled(motion.nav)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  z-index: 9999;
  width: 100vw;
  top: 0;
  background-color: black; // ✔ change it as red !
  font-size: 16px;
  padding: 20px 60px;
  color: white;
  box-sizing: border-box; // 🎈 Catch overflow by width:100% & padding
`;
const Col = styled.div`
  display: flex;
  align-items: center;
`;
const LogoWrapper = styled.div`
  margin-right: 50px;
`;
const Logo = styled.div`
  width: 130px;
  height: 40px;
  background: url(${LogoImg});
  background-size: 130px 40px;
`;
const Items = styled.ul`
  display: flex;
  align-items: center;
  font-weight: 500;
`;
const Item = styled.li`
  margin-right: 20px;
  color: ${(props) => props.theme.white.darker};
  transition: color 0.3s ease-in-out;
  &:hover {
    color: ${(props) => props.theme.white.lighter};
    transform: scale(1.2);
    transition: 0.2s ease;
  }
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  Link {
  }
`;
const Circle = styled(motion.span)`
  width: 5px;
  height: 5px;
  border-radius: 5px;
  position: absolute;
  background-color: ${(props) => props.theme.red};
  bottom: -10px;
  left: 0;
  right: 0;
  margin: 0 auto;
`;
const Search = styled.form`
  color: white;
  display: flex;
  align-items: center;
  position: relative;
  svg {
    height: 25px;
  }
  &:hover {
    cursor: pointer;
    transform: scale(1.2);
    transition: 0.1s ease;
  }
`;
const Input = styled(motion.input)`
  transform-origin: right center;
  position: absolute;
  left: -220px;
  right: 0;
  padding: 5px 10px;
  padding-left: 40px;
  z-index: -1;
  color: white;
  font-size: 16px;
  background-color: transparent;
  border: 1px solid ${(props) => props.theme.white.lighter};
`;

// ================================================
//              Variants
// ================================================
const logoVariants = {
  normal: {
    fillOpacity: 1,
  },
  active: {
    fillOpacity: [0, 1, 0],
    transition: {
      repeat: Infinity,
    },
  },
};
const navVariants = {
  top: { backgroundColor: "rgba(0,0,0,0)" },
  scroll: { backgroundColor: "rgba(0,0,0,1)" },
};

// ================================================
//              Interface
// ================================================
interface IForm {
  keyword: string;
}

// ================================================
//              Header
// ================================================
const Header = () => {
  // ============= Hook =============================
  const [searchOpen, setSearchOpen] = useState(false);
  const homeMatch: PathMatch<string> | null = useMatch("/");
  const tvMatch: PathMatch<string> | null = useMatch("/tvs");
  const inputAnimation = useAnimation();
  const navAnimation = useAnimation();
  const { scrollY } = useViewportScroll();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm<IForm>();

  const onValid = (data: IForm) => {
    console.log(data);
    setValue("keyword", "");
    navigate(`/search?keyword=${data.keyword}`);
  };
  useEffect(() => {
    scrollY.onChange(() => {
      if (scrollY.get() > 80) {
        navAnimation.start("scroll");
      } else {
        navAnimation.start("top");
      }
    });
  }, [scrollY, navAnimation]);

  // ================= Handle ==========================
  const toggleSearch = () => {
    if (searchOpen) {
      inputAnimation.start({
        scaleX: 0,
      });
    } else {
      inputAnimation.start({
        scaleX: 1,
      });
    }
    setSearchOpen((prev) => !prev);
  };

  // ================= return ==========================
  return (
    <Nav variants={navVariants} initial="top" animate={navAnimation}>
      <Col>
        <LogoWrapper>
          <Link to="/">
            <Logo>
              {/* <img src={LogoImg} width={130} height={40} alt="" /> */}
            </Logo>
          </Link>
        </LogoWrapper>

        <Items>
          <Item>
            <Link to="/">
              Home
              {homeMatch ? <Circle /> : null}
            </Link>
          </Item>
          <Item>
            <Link to="/tvs">
              Tv Shows
              {tvMatch ? <Circle /> : null}
            </Link>
          </Item>
        </Items>
      </Col>
      <Col>
        <Search onSubmit={handleSubmit(onValid)}>
          <motion.svg
            onClick={toggleSearch}
            transition={{ type: "linear" }}
            animate={{ x: searchOpen ? -215 : -10 }}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </motion.svg>
          <Input
            {...register("keyword", { required: true, minLength: 2 })}
            animate={inputAnimation}
            initial={{ scaleX: 0 }}
            transition={{ type: "linear" }}
            placeholder="Saerch for movie and show"
          ></Input>
        </Search>
      </Col>
    </Nav>
  );
};

export default Header;
