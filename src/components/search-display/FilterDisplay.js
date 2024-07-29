import React, { useState, useEffect } from "react";
import "./FilterDisplay.css";
import {
  IoIosAdd,
  IoIosCheckmark,
  IoIosSearch,
  IoIosCloseCircle,
} from "react-icons/io";
import { fetchRecipes } from "../../services/api";

const FilterDisplay = ({ currentFilter }) => {
  const [filters, setFilters] = useState({
    keyword: [],
    allergies: [],
    diets: [],
    calories: [],
    nutrients: [],
  });

  const [recipes, setRecipes] = useState([]);
  const [cookbook, setCookbook] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [calorieInput, setCalorieInput] = useState("");

  useEffect(() => {
    const savedCookbook = localStorage.getItem("cookbook");
    if (savedCookbook) {
      setCookbook(JSON.parse(savedCookbook));
    }
  }, []);

  const addSearch = () => {
    if (keywordInput) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        keyword: [...prevFilters.keyword, keywordInput],
      }));
      setKeywordInput("");
      alert("Keyword has been added!");
    }

    if (calorieInput) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        calories: [...prevFilters.calories, calorieInput],
      }));
      setCalorieInput("");
      alert("Calories filter has been added!");
    }
  };

  const addCookBook = (recipe) => {
    if (cookbook.some((savedRecipe) => savedRecipe.label === recipe.label)) {
      alert("Recipe is already saved!");
    } else {
      setCookbook((prevCookbook) => {
        const updatedCookbook = [...prevCookbook, recipe];
        localStorage.setItem("cookbook", JSON.stringify(updatedCookbook));
        return updatedCookbook;
      });
      alert("Recipe has been added to your cookbook!");
    }
  };

  const removeCookBook = (recipe) => {
    const index = cookbook.findIndex((item) => item.label === recipe.label);

    if (index !== -1) {
      const updatedCookbook = [...cookbook];
      updatedCookbook.splice(index, 1);
      setCookbook(updatedCookbook);
      localStorage.setItem("cookbook", JSON.stringify(updatedCookbook));
      alert("Recipe has been removed from cookbook!");
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
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              type="text"
              placeholder="Coffee and Halloumi"
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
              value={calorieInput}
              onChange={(e) => setCalorieInput(e.target.value)}
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
      case "CookBook":
        //when a recipe is added to the cookbook it will appear here
        //todo: save to localStorage so saved recipes persist
        return (
          <div className="cookbook-display">
            {cookbook.map((recipe, index) => (
              <div key={index} className="recipe">
                <p id="recipe-label">{recipe.label}</p>
                <img
                  src={recipe.image}
                  alt={recipe.label}
                  height={150}
                  width={125}
                />
                <div className="recipe-stats">
                  <p>
                    <strong>Cal</strong> {recipe.calories.toFixed(2)}
                  </p>
                  <p>
                    <strong>Fat</strong>{" "}
                    {recipe.totalNutrients.FAT.quantity.toFixed(2)}
                  </p>
                  <p>
                    <strong>Pro</strong>{" "}
                    {recipe.totalNutrients.PROCNT.quantity.toFixed(2)}
                  </p>
                  <p>
                    <strong>Carb</strong>{" "}
                    {recipe.totalNutrients.CHOCDF.quantity.toFixed(2)}
                  </p>
                </div>
                <a href={recipe.url} target="_blank" rel="noopener noreferrer">
                  View Recipe
                </a>
                <div
                  id="remove-cookbook"
                  onClick={() => removeCookBook(recipe)}
                >
                  <IoIosCloseCircle />
                </div>
              </div>
            ))}
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
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const removeSearch = (filter, category) => {
    setFilters((prevFilters) => {
      const categoryFilters = prevFilters[category] || [];
      return {
        ...prevFilters,
        [category]: categoryFilters.filter((item) => item !== filter),
      };
    });
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
              <span
                id="user-word"
                key={index}
                onClick={() => removeSearch(filter, category)}
              >
                {filter}{" "}
              </span>
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
              <div className="recipe-stats">
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
              <p id="cookbook-add-bttn" onClick={() => addCookBook(hit.recipe)}>
                <IoIosAdd color="white" />
                Add to cookbook
              </p>
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
