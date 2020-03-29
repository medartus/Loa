import React from "react";
import "./RestaurantContainer.css";

import { Restaurant, SkeletonRestaurant } from "../Restaurant";
import Select from "react-select";

import {
  filterOptions,
  selectStyles,
  getNewFilters,
  getSorted
} from "../../Constants";

import empty from "../../assets/empty.svg";

const PLACEHOLDERS = [null, null, null, null, null, null];

const RestaurantContainer = ({
  restaurants,
  loading,
  filters,
  setFilters,
  userLocation
}) => {
  const getFilterLabel = () => {
    const { price, rating, distance } = filters;
    if (price !== null) return { label: price.label };
    else if (rating !== null) return { label: rating.label };
    else return { label: distance.label };
  };

  const renderRestaurants = () => {
    if (restaurants) {
      const nb = restaurants.length;
      if (loading) {
        return (
          <>
            {PLACEHOLDERS.map((_, i) => (
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
      const sortedRestaurants = getSorted(filters, restaurants, userLocation);
      let pairs = [];
      for (let i = 0; i < nb - 1; i += 2) {
        pairs.push([sortedRestaurants[i], sortedRestaurants[i + 1]]);
      }
      return (
        <>
          {pairs.map((pair, i) => (
            <div className="restaurant-line" key={i}>
              <Restaurant content={pair[0]} index={i} />
              <Restaurant content={pair[1]} index={i} />
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
  const renderFilters = () => (
    <div className="header-results" style={{ backgroundColor: "#fff7f3" }}>
      <p className="header-results-text" style={{ color: "#4949e7" }}>
        FILTER BY
      </p>
      <div className="select-container">
        <Select
          options={filterOptions}
          value={getFilterLabel()}
          placeholder="Filter..."
          isSearchable={false}
          styles={selectStyles("15vw")}
          onChange={filter => setFilters(getNewFilters(filter))}
        />
      </div>
    </div>
  );

  return (
    <div className="restaurant-container">
      {renderHeader()}
      {renderFilters()}
      {renderRestaurants()}
    </div>
  );
};

export default RestaurantContainer;
