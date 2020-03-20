import React, { useState, useEffect } from "react";
import "./App.css";
import { RestaurantContainer, Chat } from "./components";

const App = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [restaurants]);

  useEffect(() => {
    localizeUser();
  }, []);

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
      <Chat userLocation={userLocation} setRestaurants={setRestaurants}/>
      <RestaurantContainer restaurants={restaurants} />
    </div>
  );
};

export default App;
