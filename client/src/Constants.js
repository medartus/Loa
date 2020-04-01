const BOT = "BOT";
const USER = "USER";
const THINKING = "THINKING";
const BOT_WRITE_TIME = 1800;
const INIT_BUBBLES = [
  {
    type: BOT,
    bubbleType: "text",
    content:
      "Hi, I'm Loa, a new friend of yours that will help you choose among thousands of restaurants in the US! 🤤"
  }
];
const ERROR_BUBBLES = [
  {
    type: BOT,
    bubbleType: "text",
    content:
      "Uuuh, something went wrong behind the scenes... 🙄, try refreshing the page !"
  }
];

const selectStyles = width => ({
  control: styles => ({
    ...styles,
    width,
    fontSize: "12px"
  }),
  input: styles => ({
    ...styles,
    fontFamily: "Open Sans",
    fontSize: "12px"
  }),
  placeholder: styles => ({
    ...styles,
    fontSize: "12px",
    fontFamily: "Open Sans"
  }),
  singleValue: styles => ({
    ...styles,
    fontFamily: "Open Sans",
    fontSize: "12px"
  }),
  option: styles => ({ ...styles, fontFamily: "Open Sans", fontSize: "12px" })
});

const getSameOptions = opts => opts.map(o => ({ label: o, value: o }));

const filterOptions = getSameOptions([
  "Price Ascending",
  "Price Descending",
  "Rating Ascending",
  "Rating Descending",
  "Closest in distance"
]);

const defaultFilters = {
  price: filterOptions[0],
  rating: null,
  distance: null
};

const priceAscSorter = (a, b) =>
  a.price === null
    ? 1
    : b.price === null
    ? -1
    : a.price.length - b.price.length;
const priceDescSorter = (a, b) =>
  a.price === null
    ? 1
    : b.price === null
    ? -1
    : b.price.length - a.price.length;

const deg2rad = deg => deg * (Math.PI / 180);

const coordinatesDistance = (restaurant, userLocation) => {
  const {
    coordinates: { latitude: lat1, longitude: lon1 }
  } = restaurant;
  const { latitude: lat2, longitude: lon2 } = userLocation;
  const R = 6371; // radius of earth
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const getSorted = (filters, restaurants, userLocation) => {
  const { rating, price } = filters;
  if (rating !== null) {
    const { value } = rating;
    if (value === "Rating Ascending")
      return restaurants.sort((a, b) => a.rating - b.rating);
    else return restaurants.sort((a, b) => b.rating - a.rating);
  } else if (price !== null) {
    const { value } = price;
    if (value === "Price Ascending")
      return restaurants.sort((a, b) => priceAscSorter(a, b));
    else return restaurants.sort((a, b) => priceDescSorter(a, b));
  }
  return restaurants.sort(
    (a, b) =>
      coordinatesDistance(a, userLocation) -
      coordinatesDistance(b, userLocation)
  );
};

const getNewFilters = filter => {
  const { value } = filter;
  if (value === filterOptions[0].value)
    return { rating: null, distance: null, price: filterOptions[0] };
  else if (value === filterOptions[1].value)
    return { rating: null, distance: null, price: filterOptions[1] };
  else if (value === filterOptions[2].value)
    return { rating: filterOptions[2], distance: null, price: null };
  else if (value === filterOptions[3].value)
    return { rating: filterOptions[3], distance: null, price: null };
  else if (value === filterOptions[4].value)
    return { rating: null, distance: filterOptions[4], price: null };
};

const priceFeedback = content => {
  switch (content.price) {
    case "€":
    case "$":
      return "Pretty cheap!";
    case "$$":
    case "€€":
      return "Affordable";
    case "$$$":
    case "€€€":
      return "Quite expensive";
    case "$$$$":
    case "€€€€":
      return "Prepare the money!";
    case "$$$$$":
    case "€€€€€":
      return "Very expensive!";
    default:
      return "No price information";
  }
};

export {
  priceFeedback,
  defaultFilters,
  getNewFilters,
  selectStyles,
  filterOptions,
  getSorted,
  BOT,
  USER,
  THINKING,
  BOT_WRITE_TIME,
  ERROR_BUBBLES,
  INIT_BUBBLES
};
