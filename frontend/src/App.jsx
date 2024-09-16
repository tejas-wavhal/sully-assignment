import React, { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";
import Login from "./components/Login";
import Document from "./components/Document";
import axios from "axios";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUser = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/auth/me", {
        withCredentials: true,
      });
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      setError("Unable to fetch user data.");
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;
  // if (error) return <div>{error}</div>;

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login fetchUser={fetchUser} />,
    },
    {
      path: "about",
      element: <div>About</div>,
    },
    {
      path: "document/:id?",
      element: <Document fetchUser={fetchUser} user={user} />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
