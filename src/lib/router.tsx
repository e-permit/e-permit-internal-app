import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import Home from "../pages/Home";
import Login from "../pages/Login";
import AuthorityDetails from "../pages/AuthorityDetails";
import PermitDetails from "../pages/PermitDetails";

const router = createBrowserRouter([
  {
    element: <Dashboard />,
    children: [{
      path: "/",
      element: <Home />
    },
    {
      path: "authorities/:code",
      element: <AuthorityDetails />
    },
    {
      path: "permits/:id",
      element: <PermitDetails />
    }]
  },
  {
    path: "/login",
    element: <Login />
  },
]);

export default router;