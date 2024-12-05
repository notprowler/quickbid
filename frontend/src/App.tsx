import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute.tsx";
import SigninPage from "./pages/SigninPage.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import CartPage from "./pages/CartPage.tsx";
import MainLayout from "./layouts/MainLayout.tsx";
import NoNavbarLayout from "./layouts/NoNavbarLayout.tsx";
import ProductPage from "./pages/ProductPage.tsx";
import LandingPage from "./pages/LandingPage.tsx"; // Import the LandingPage component
import Listings from "./pages/Listings.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import Rating from "./components/Rate.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/item/:itemID" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />

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
          <Route path="/login" element={<SigninPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
