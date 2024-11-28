import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import MainLayout from "./layouts/MainLayout.tsx";
import NoNavbarLayout from "./layouts/NoNavbarLayout.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      <Routes>
        <Route 
          path="/list" 
          element={
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: 2 }}>
              <Listings />
            </Box>
          } 
        />
      </Routes>
        <Route element={<NoNavbarLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
