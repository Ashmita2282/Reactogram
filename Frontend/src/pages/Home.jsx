import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux"; // Assuming you're using Redux for user state management
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import FilterButtons from "../components/FilterButtons"; // Assuming this handles category filtering

// Home Component
const Home = () => {
  const { user } = useSelector((state) => state.auth); // Pull user state from Redux
  "hoem", user?.data;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const location = useLocation();
  const hideComponentsRoutes = ["/signin", "/register"]; // Routes where certain components are hidden
  // Determine if the current route is for login/register
  const isAuthPage = hideComponentsRoutes.includes(location.pathname);
  const isHomePage = location.pathname === "/";

  return (
    <div className={`${isAuthPage ? "" : "flex bg-gray-100"}`}>
      {/* Sidebar */}

      {/* Conditionally Render FilterButtons */}
      {!isAuthPage && (
        <>
          <Sidebar isOpen={isSidebarOpen} />
          <Header onSearch={handleSearch} toggleSidebar={toggleSidebar} />
        </>
      )}

      {/* Conditionally Render FilterButtons for Home Page Only */}
      {isHomePage && !isAuthPage && (
        <div className={`${isSidebarOpen ? "lg:ml-40" : "lg:ml-14"}`}>
          {" "}
          <FilterButtons onCategorySelect={handleCategorySelect} />{" "}
        </div>
      )}

      {/* Render Child Routes */}
      <main
        className={`${
          isAuthPage
            ? "" // Special class for login/register pages
            : `main-content  ${
                isSidebarOpen ? "lg:ml-32 lg:w-[90%]" : "lg:ml-12 lg:w-[100%]"
              }`
        }`}
      >
        <Outlet context={{ user: user?.data, searchTerm, selectedCategory }} />{" "}
        {/* Passing userId (user?.data?.id) to child routes */}
      </main>
    </div>
  );
};

export default Home;
