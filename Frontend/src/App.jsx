import React from "react";
import Home from "./pages/Home";
import Loading from "./components/Loading";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "./redux/slices/authSlice";
import { getToken } from "./utils/localStorage";
import "./index.css";

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization or data fetching
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust the timeout duration as needed

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const { exp } = jwtDecode(token);
      const timeUntilExpiry = exp * 1000 - Date.now();

      const timeout = setTimeout(() => {
        dispatch(logout()); // Log out user when token expires
      }, timeUntilExpiry);

      return () => clearTimeout(timeout); // Clear timer on unmount
    }
  }, [dispatch]);

  return <>{loading ? <Loading /> : <Home />}</>;
}

export default App;
