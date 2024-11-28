import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import MainLayout from "./layouts/MainLayout.tsx";
import NoNavbarLayout from "./layouts/NoNavbarLayout.tsx";
import LandingPage from "./pages/LandingPage/LandingPage.tsx"; // Import the LandingPage component

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>

        <Route element={<NoNavbarLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route path="/landing" element={<LandingPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;
