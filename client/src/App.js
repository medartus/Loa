import React, { useState, useEffect } from "react";
import "./App.css";
import { RestaurantContainer, Chat } from "./components";
import { defaultFilters, getSorted } from "./Constants";

const App = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    localizeUser();
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [restaurants]);

  useEffect(() => {
    const sortedRestaurants = getSorted(filters, restaurants, userLocation);
    setRestaurants(sortedRestaurants);
  }, [filters, userLocation]);

  const localizeUser = () => {
    navigator.geolocation.getCurrentPosition(position => {
      const userLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      setUserLocation(userLocation);
    });
  };

  return (
    <div className="app">
      <Chat
        userLocation={userLocation}
        setRestaurants={setRestaurants}
        setLoading={setLoading}
        loading={loading}
        filters={filters}
      />
      <RestaurantContainer
        loading={loading}
        restaurants={restaurants}
        filters={filters}
        setFilters={setFilters}
        userLocation={userLocation}
      />
    </div>
  );
};

export default App;
