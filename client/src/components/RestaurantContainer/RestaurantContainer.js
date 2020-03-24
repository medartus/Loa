import React from "react";
import "./RestaurantContainer.css";

import { Restaurant } from "../Restaurant";

const RestaurantContainer = ({ restaurants }) => {
  const renderRestaurants = () => {
    
    const nb = restaurants.length
    let pairs = []
    for(let i =0;i<nb-1;i+=2){
      pairs.push([restaurants[i],restaurants[i+1]])
    }

    return (
    <>
      {pairs.map((pair, i) => (
        <div className = "restaurant-line" key = {i}>
          <Restaurant content={pair[0]} />
          <Restaurant content={pair[1]} />
        </div>
      ))}
    </>
  )};
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
