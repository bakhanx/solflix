import { createBrowserRouter } from "react-router-dom";
import Root from "./Root";
import NotFound from "./NotFound";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";
import ErrorComponents from "./Components/ErrorComponents";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Home />,
        errorElement: <ErrorComponents/>,
        children :[
            {
                path: "/movies/:movieId",
                errorElement: <ErrorComponents/>,
            }
        ]
      },
      {
        path: "search",
        element: <Search />,
        errorElement: <ErrorComponents/>
      },
      {
        path: "/tvs",
        element: <Tv />,
        children :[
            {
                path: "/tvs/:tvId",
                errorElement: <ErrorComponents/>,
            }
        ],
        errorElement: <ErrorComponents/>
      },
    ],
    errorElement: <NotFound />,
  },
]);

export default router;
