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
        <Route path="/search" element={<Search />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
