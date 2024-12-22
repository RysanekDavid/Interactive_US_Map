import { BrowserRouter, Routes, Route } from "react-router-dom";
import MapView from "./pages/MapView";
import CountryDetail from "./pages/CountryDetail";
import Login from "./pages/Login";
import { AuthGuard } from "./components/login/AuthGuard";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <AuthGuard>
              <MapView />
            </AuthGuard>
          }
        />
        <Route
          path="/state/:name"
          element={
            <AuthGuard>
              <CountryDetail />
            </AuthGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
