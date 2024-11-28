import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import MainLayout from "./layouts/MainLayout.tsx";
import NoNavbarLayout from "./layouts/NoNavbarLayout.tsx";
import ProductPage from "./pages/ProductPage.tsx";
import LandingPage from "./pages/LandingPage.tsx"; // Import the LandingPage component

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<ErrorPage />} />
          {/*temporary values for individually selected items*/}
          <Route path="/item/:itemID" element={<ProductPage transactionType="bid" productDetails={{id: 1, name: "Dog", price: 200, description: "Dog for sale", image: "https://cdn.discordapp.com/attachments/757667613097721876/1307887179359588352/cutedog.jpg?ex=673d41da&is=673bf05a&hm=f8c18bf18be3d1f2fe9885c65ba1174b01cb80349dfe19d57fe66270ae929bbb&"}} bidValue={50} />} />
        </Route>

        <Route element={<NoNavbarLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
