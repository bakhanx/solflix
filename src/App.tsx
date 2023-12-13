import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";

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
          <Route path=":tvId" element={<Tv />} />
        </Route>
        <Route path="/search" element={<Search />} />
         
        <Route path="*" element={<Navigate to="/"></Navigate>} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
