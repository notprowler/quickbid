import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import PrivateRoute from "./components/PrivateRoute.tsx";

import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";

import MainLayout from "./layouts/MainLayout.tsx";
import NoNavbarLayout from "./layouts/NoNavbarLayout.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />

          {/* for page not found */}
          <Route path="*" element={<ErrorPage />} />
        </Route>

        <Route element={<NoNavbarLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
