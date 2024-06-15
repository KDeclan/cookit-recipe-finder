import React from "react";
import "./FilterSection.css";
import { IoIosArrowForward } from "react-icons/io";

const FilterSection = ({ onFilterChange }) => {
  return (
    <div
      className="container d-flex flex-column align-items-center justify-content-evenly vh-100"
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
    </div>
  );
};

export default FilterSection;
