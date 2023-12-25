import { createBrowserRouter } from "react-router-dom";
import Root from "./Root";
import NotFound from "./NotFound";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";
import ErrorComponents from "./Components/ErrorComponents";
import Detail from "./Components/Detail";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Root />,
      children: [
        {
          path: "/",
          element: <Home />,
          errorElement: <ErrorComponents />,
          children: [
            {
              path: "/movies/:movieId",
              element: <></>,
              errorElement: <ErrorComponents />,
            },
          ],
        },
        {
          path: "search",
          element: <Search />,
          errorElement: <ErrorComponents />,
        },
        {
          path: "/tvs",
          element: <Tv />,
          children: [
            {
              path: "/tvs/:tvId",
              element: <></>,
              errorElement: <ErrorComponents />,
            },
          ],
          errorElement: <ErrorComponents />,
        },
      ],
      errorElement: <NotFound />,
    },
  ],
  { basename: `${process.env.PUBLIC_URL}` }
);

export default router;
