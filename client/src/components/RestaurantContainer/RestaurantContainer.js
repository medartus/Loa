import React from "react";
import "./RestaurantContainer.css";

import { Restaurant } from "../Restaurant";

const RestaurantContainer = ({ restaurants }) => {
  const renderRestaurants = () => (
    <>
      {restaurants.map((r, i) => (
        <Restaurant key={i} content={r} />
      ))}
    </>
  );
  const renderHeader = () => (
    <div className="header-results">
      <p className="header-results-text">RESULTS</p>
    </div>
  );
  return (
    <div className="restaurant-container">
      {renderHeader()}
      {renderRestaurants()}
    </div>
  );
};

export default RestaurantContainer;
