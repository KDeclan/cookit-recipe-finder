import React, { useState } from "react";
import FilterSection from "./components/sidebar/FilterSection";
import FilterDisplay from "./components/search-display/FilterDisplay";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [currentFilter, setCurrentFilter] = useState("Search by keyword");

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
  };

  return (
    <div className="app-container container-fluid p-0">
      <div className="row no-gutters vh-100">
        <div className="col-xs-12 col-sm-4 col-md-3 col-lg-2 p-0">
          <FilterSection onFilterChange={handleFilterChange} />
        </div>
        <div className="col-xs-12 col-sm-8 col-md-9 col-lg-10 d-flex justify-content-center p-0">
          <FilterDisplay currentFilter={currentFilter} />
        </div>
      </div>
    </div>
  );
};

export default App;
