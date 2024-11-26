import React, { useState } from "react";

// FilterButtons component
const FilterButtons = ({ onCategorySelect }) => {
  const categories = [
    "All",
    "Music",
    "Gaming",
    "Education",
    "Technology",
    "Food",
    "Drama",
  ];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    onCategorySelect(category); // Pass the selected category to Home
  };

  return (
    <div className="flex pb-3 pt-7 p-5 justify-between z-0 bg-gray-50 fixed mt-16  lg:mt-16 w-full lg:w-[96%]">
      {categories.map((category) => (
        <button
          key={category}
          className={`px-4 py-1 rounded-full ${
            selectedCategory === category
              ? "bg-black text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => handleCategoryClick(category)}
        >
          {category}
        </button>
      ))}
      <i className="fa-solid fa-angle-right fa-xl pl-0 ml-0 pt-4"></i>
    </div>
  );
};

export default FilterButtons;
