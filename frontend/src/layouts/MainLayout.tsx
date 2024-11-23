import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.tsx";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <div>
        <Outlet />
      </div>
    </>
  );
}
