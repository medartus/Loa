import React from "react";
import "./RestaurantContainer.css";

import { Restaurant, SkeletonRestaurant } from "../Restaurant";

import empty from "../../assets/empty.svg";

const RestaurantContainer = ({ restaurants, loading }) => {
  const renderRestaurants = () => {
    if (restaurants) {
      const nb = restaurants.length;
      if (loading) {
        return (
          <>
            {[null, null, null, null, null, null].map((_, i) => (
              <div className="restaurant-line" key={i}>
                <SkeletonRestaurant />
                <SkeletonRestaurant />
              </div>
            ))}
          </>
        );
      }
      if (nb === 0) {
        return (
          <div className="empty-container">
            <img src={empty} alt="no data" className="empty-img" />
            <p className="empty-text">
              Looks like we can't feed you for now...
            </p>
          </div>
        );
      }
      let pairs = [];
      for (let i = 0; i < nb - 1; i += 2) {
        pairs.push([restaurants[i], restaurants[i + 1]]);
      }
      return (
        <>
          {pairs.map((pair, i) => (
            <div className="restaurant-line" key={i}>
              <Restaurant content={pair[0]} />
              <Restaurant content={pair[1]} />
            </div>
          ))}
        </>
      );
    }
    return null;
  };
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
