import { Routes, Route, BrowserRouter } from "react-router-dom";

import Home from "./Routes/Home";
import Tv from "./Routes/Tv";
import Search from "./Routes/Search";
import Header from "./Components/Header";

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="/movies/:movieId" element={<Home />} />
        </Route>
        <Route path="/tvs" element={<Tv />}>
          <Route path="/tvs/:tvId" element={<Tv />} />
        </Route>
        <Route path="/movie/search" element={<Search />}>
          <Route path="/movie/search/:keyword" element={<Search />} />
        </Route>
        <Route path="/tv/search" element={<Search />}>
          <Route path="/tv/search/:keyword" element={<Search />} />
        </Route>
        {/* <Route path="/search:searchId" element={<Search />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
