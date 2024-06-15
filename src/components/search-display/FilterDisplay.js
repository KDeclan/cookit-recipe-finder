import React, { useState } from "react";
import "./FilterDisplay.css";
import { IoIosAdd, IoIosCheckmark, IoIosSearch } from "react-icons/io";
import { fetchRecipes } from "../../services/api"; // Corrected import path

const FilterDisplay = ({ currentFilter }) => {
  const [filters, setFilters] = useState({
    keyword: [],
    allergies: [],
    diets: [],
    calories: [],
    nutrients: [],
  });

  const [recipes, setRecipes] = useState([]); // State to store fetched recipes

  const addSearch = () => {
    const keywordInput = document.getElementById("keyword-search");
    const calorieInput = document.getElementById("calorie-input");

    if (keywordInput && keywordInput.value) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        keyword: [...prevFilters.keyword, keywordInput.value],
      }));
      keywordInput.value = "";
      alert("Input has been added!");
    }

    if (calorieInput && calorieInput.value) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        calories: [...prevFilters.calories, calorieInput.value],
      }));
      calorieInput.value = "";
      alert("Input has been added!");
    }
  };

  const handleSelection = (filter, category) => {
    setFilters((prevFilters) => {
      const categoryFilters = prevFilters[category] || [];
      return {
        ...prevFilters,
        [category]: categoryFilters.includes(filter)
          ? categoryFilters.filter((item) => item !== filter)
          : [...categoryFilters, filter],
      };
    });
  };

  const renderFilters = (filterList, category) => (
    <div className="filters">
      {filterList.map((filter, index) => (
        <div
          className="filter"
          key={index}
          onClick={() => handleSelection(filter, category)}
        >
          {filters[category]?.includes(filter) ? (
            <IoIosCheckmark className="icon" color="green" />
          ) : (
            <IoIosAdd className="icon" color="white" />
          )}
          <span className="filter-text">{filter}</span>
        </div>
      ))}
    </div>
  );

  const filterInput = () => {
    switch (currentFilter) {
      case "Search by keyword":
        return (
          <div className="input-row">
            <input
              id="keyword-search"
              type="text"
              placeholder="halloumi and coffee"
            />
            <p className="add-bttn" onClick={addSearch}>
              <IoIosAdd color="white" />
            </p>
          </div>
        );
      case "Allergies":
        return renderFilters(
          [
            "Celery-free",
            "Fish-free",
            "Peanut-free",
            "Soy-free",
            "Crustacean-free",
            "Gluten-free",
            "Sesame-free",
            "Tree-nut-free",
            "Dairy-free",
            "Lupine-free",
            "Shellfish-free",
            "Wheat-free",
            "Egg-free",
            "Mustard-free",
          ],
          "allergies"
        );
      case "Diets":
        return renderFilters(
          ["Balanced", "High-protein", "Low-fat", "Low-carb"],
          "diets"
        );
      case "Calories":
        return (
          <div className="calorie-filter">
            <input
              id="calorie-input"
              name="calorie-input"
              type="number"
              placeholder="Calories"
            />
            <label htmlFor="calorie-input">kcal</label>
            <p className="add-bttn" id="calorie-add-bttn" onClick={addSearch}>
              <IoIosAdd color="white" />
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  const handleSearch = async () => {
    try {
      const data = await fetchRecipes(filters);
      setRecipes(data.hits);
      console.log(data);
      // Display recipes on your website
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  return (
    <div className="d-flex flex-column w-100" id="main-top-container">
      <div className="filter-display-container d-flex flex-column align-items-center w-100">
        <h2>{currentFilter}</h2>
        {filterInput()}
      </div>
      <div className="search-display-container d-flex flex-column justify-content-between w-100">
        <div id="selected-filters">
          {Object.keys(filters).map((category) =>
            filters[category].map((filter, index) => (
              <span key={index}>{filter}, </span>
            ))
          )}
        </div>
        <div className="search-bttn" onClick={handleSearch}>
          <IoIosSearch color="white" />
        </div>
      </div>
      <div className="recipes-display">
        {recipes && recipes.length > 0 ? (
          recipes.map((hit, index) => (
            <div key={index} className="recipe">
              <p id="recipe-label">{hit.recipe.label}</p>
              <img
                src={hit.recipe.image}
                alt={hit.recipe.label}
                height={150}
                width={125}
              />
              <div id="recipe-stats">
                <p>
                  <strong>Cal</strong> {hit.recipe.calories.toFixed(2)}
                </p>
                <p>
                  <strong>Fat</strong>{" "}
                  {hit.recipe.totalNutrients.FAT.quantity.toFixed(2)}
                </p>
                <p>
                  <strong>Pro</strong>{" "}
                  {hit.recipe.totalNutrients.PROCNT.quantity.toFixed(2)}
                </p>
                <p>
                  <strong>Carb</strong>{" "}
                  {hit.recipe.totalNutrients.CHOCDF.quantity.toFixed(2)}
                </p>
              </div>
              <a
                href={hit.recipe.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Recipe
              </a>
            </div>
          ))
        ) : (
          <p>No recipes found</p>
        )}
      </div>
    </div>
  );
};

export default FilterDisplay;
