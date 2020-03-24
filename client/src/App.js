import React, { useState, useEffect } from "react";
import "./App.css";
import { RestaurantContainer, Chat } from "./components";

const App = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localizeUser();
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [restaurants]);

  const localizeUser = () => {
    // only works on HTTPS
    // navigator.geolocation.getCurrentPosition(position => {
    //   const userLocation = {
    //     latitude: position.coords.latitude,
    //     longitude: position.coords.longitude
    //   };
    //   setUserLocation(userLocation);
    // });
    const userLocation = {
      latitude: 48.90655,
      longitude: 2.26636
    };
    setUserLocation(userLocation);
  };

  return (
    <div className="app">
      <Chat
        userLocation={userLocation}
        setRestaurants={setRestaurants}
        setLoading={setLoading}
        loading={loading}
      />
      <RestaurantContainer loading={loading} restaurants={restaurants} />
    </div>
  );
};

export default App;
