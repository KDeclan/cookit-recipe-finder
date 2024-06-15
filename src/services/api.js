import axios from "axios";
import axiosRetry from "axios-retry";
import pLimit from "p-limit";

const API_BASE_URL = "https://api.edamam.com/api/recipes/v2";
const APP_ID = "793bad84";
const APP_KEY = "9304b7d6461919559a354b2172f34c09";

// Function to build the query string
const buildQueryString = (filters) => {
  let queryString = `${API_BASE_URL}?type=public&app_id=${APP_ID}&app_key=${APP_KEY}`;

  if (filters.keyword.length) {
    queryString += `&q=${filters.keyword.join(",")}`;
  } else {
    queryString += `&q=recipe`; // Provide a default keyword if none is specified
  }

  if (filters.allergies.length) {
    queryString += filters.allergies
      .map((allergy) => `&health=${allergy.toLowerCase().replace(/ /g, "-")}`)
      .join("");
  }

  if (filters.diets.length) {
    queryString += filters.diets
      .map((diet) => `&diet=${diet.toLowerCase().replace(/ /g, "-")}`)
      .join("");
  }

  if (filters.calories.length) {
    queryString += `&calories=${filters.calories.join(",")}`;
  }

  if (filters.nutrients.length) {
    filters.nutrients.forEach((nutrient) => {
      const nutrientKey = `nutrients[${nutrient
        .toLowerCase()
        .replace(/ /g, "")}]`;
      queryString += `&${nutrientKey}=0-100`; // Adjust the range as needed
    });
  }

  console.log("Query String:", queryString); // Debugging

  return queryString;
};

// Initialize axios with retry functionality
const axiosInstance = axios.create();
axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
});

// Function to fetch recipes
const limit = pLimit(5); // Limit to 5 concurrent requests

export const fetchRecipes = async (filters) => {
  const queryString = buildQueryString(filters);
  try {
    const response = await limit(() => axiosInstance.get(queryString));
    return response.data;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
};
