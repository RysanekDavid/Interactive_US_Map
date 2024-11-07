// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MapView from "./pages/MapView";
import CountryDetail from "./pages/CountryDetail";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MapView />} />
        <Route path="/state/:name" element={<CountryDetail />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
