import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.tsx";
import NoNavbarLayout from "./layouts/NoNavbarLayout.tsx";

import LandingPage from "./pages/LandingPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import SigninPage from "./pages/SigninPage.tsx";
import Listings from "./pages/Listings.tsx";
import ProductPage from "./pages/ProductPage.tsx";
import CartPage from "./pages/CartPage.tsx";
import CreateListing from "./pages/createListing.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import AdminPanel from "./pages/AdminPanel.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";

import PrivateRoute from "./components/PrivateRoute.tsx";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function App() {
  return (
    <Elements stripe={stripePromise}>
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/item/:id" element={<ProductPage />} />

            {/* cart page */}
            <Route
              path="/cart"
              element={
                <PrivateRoute>
                  <CartPage />
                </PrivateRoute>
              }
            />

            {/* create page */}
            <Route
              path="/create"
              element={
                <PrivateRoute>
                  <CreateListing />
                </PrivateRoute>
              }
            />

            {/* profile page */}
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />

            {/* admin panel */}
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminPanel />
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
    </Elements>
  );
}

export default App;
