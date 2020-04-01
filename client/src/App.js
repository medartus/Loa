import React, { useState } from "react";
import "./App.css";
import { RestaurantContainer, Chat } from "./components";
import { useLocation } from "./Hooks/useLocation";
import Context from "./Context";

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "SET_RESTAURANTS":
//       return { ...state, restaurants: action.payload };
//     case "SET_LOADING":
//       return { ...state, loading: action.payload };
//     case "SET_FILTERS":
//       return { ...state, filters: action.payload };
//     default:
//       return state;
//   }
// };

// const initialState = {
//   restaurants: [],
//   loading: false,
//   filters: defaultFilters
// };

const App = () => {
  const [restaurants, setRestaurants] = useState([]);
  const userLocation = useLocation();

  // useEffect(() => {
  //   dispatch({ type: "SET_LOADING", payload: false });
  // }, [restaurants]);

  // useEffect(() => {
  //   const sortedRestaurants = getSorted(filters, restaurants, userLocation);
  //   dispatch({ type: "SET_RESTAURANTS", payload: sortedRestaurants });
  // }, [filters, userLocation]);

  return (
    <Context.Provider value={{ userLocation, restaurants, setRestaurants }}>
      <div className="app">
        <Chat />
        <RestaurantContainer />
      </div>
    </Context.Provider>
  );
};

export default App;
