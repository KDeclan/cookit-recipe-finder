import React from "react";
import "./FilterSection.css";
import { IoIosArrowForward, IoIosMoon, IoIosSunny } from "react-icons/io";
import { useTheme } from "../../ThemeContext";

const FilterSection = ({ onFilterChange }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`container d-flex flex-column align-items-center justify-content-evenly vh-100 ${theme}`}
      id="top-container"
    >
      <h1 id="sidebar-header">Filters</h1>
      <h3
        className="sidebar-bttns"
        onClick={() => onFilterChange("Search by keyword")}
      >
        Keyword Search
      </h3>
      <h3 className="sidebar-bttns" onClick={() => onFilterChange("Allergies")}>
        Allergies
        <IoIosArrowForward />
      </h3>
      <h3 className="sidebar-bttns" onClick={() => onFilterChange("Diets")}>
        Diets
        <IoIosArrowForward />
      </h3>
      <h3 className="sidebar-bttns" onClick={() => onFilterChange("Calories")}>
        Calories
        <IoIosArrowForward />
      </h3>
      <h3 className="sidebar-bttns" onClick={() => onFilterChange("CookBook")}>
        CookBook
        <IoIosArrowForward />
      </h3>
      <div id="color-button" onClick={toggleTheme}>
        {theme === "light" ? (
          <IoIosMoon size={"3em"} />
        ) : (
          <IoIosSunny size={"3em"} />
        )}
      </div>
    </div>
  );
};

export default FilterSection;
