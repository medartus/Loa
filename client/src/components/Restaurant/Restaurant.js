import React, { memo } from "react";
import "./Restaurant.css";

import Tilt from "react-tilt";

import Skeleton from "react-loading-skeleton";
import { IoIosStarHalf, IoIosStarOutline, IoIosStar } from "react-icons/io";
import maps_icon from "../../assets/maps_icon.png";
import { MdLocationOn } from "react-icons/md";
import { priceFeedback } from "../../Constants";

const PHOTO_DEFAULT =
  "https://cdn.dribbble.com/users/1042202/screenshots/5836341/icon-rest_2x.jpg";
const ICON_SIZE = 15;
const ICON_COLOR = "#4949e7";
const SKELETON_WIDTH = 50;
const TILT_STYLES = { width: "45%", height: "33vh" };
const TILT_OPTIONS = { scale: 1.04, max: 10 };

const Restaurant = memo(({ content, index }) => {
  const {
    categories,
    photos,
    rating,
    url,
    location: { city, postal_code },
    price,
    review_count,
    name,
    coordinates: { latitude, longitude }
  } = content;

  const getCategories = () => {
    let rep = "";
    for (let i in categories) {
      rep += categories[i].title + " ";
    }
    return rep;
  };

  const getImgUrl = () => {
    return !photos[0].includes("None") ? photos[0] : PHOTO_DEFAULT;
  };

  const handleMaps = e => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
      "_blank"
    );
    e.stopPropagation();
  };

  const renderStars = () => {
    let stars = [];
    for (let i = 0.5; i < 5.5; i += 1.0) {
      if (rating > i) stars.push(IoIosStar);
      else if (rating === i) stars.push(IoIosStarHalf);
      else stars.push(IoIosStarOutline);
    }
    return (
      <div className="stars">
        {stars.map((Star, i) => (
          <Star
            key={i}
            className="star-logo"
            color={ICON_COLOR}
            size={ICON_SIZE}
          />
        ))}
      </div>
    );
  };

  const renderTop = () => (
    <div className="element-top">
      <img className="element-image" alt="restaurant" src={getImgUrl()} />
      <div className="element-infos">
        <div className="info-container">
          <MdLocationOn color={ICON_COLOR} size={ICON_SIZE} />
          <p className="city">
            {postal_code} {city}
          </p>
        </div>
        <div className="info-container">
          <p className="price">{price}</p>
          <p className="price-feedback">{priceFeedback(content)}</p>
        </div>
        <div className="info-container">
          {renderStars()}
          <p className="votes">({review_count} votes)</p>
        </div>
      </div>
    </div>
  );

  const renderBottom = () => (
    <div className="element-bottom">
      <div className="element-main-info">
        <p className="name">{name}</p>
        <p className="categories">{getCategories()}</p>
      </div>
      <div className="element-more">
        <div onClick={handleMaps} className="more-button ">
          <img src={maps_icon} alt="maps" className="maps-icon" />
        </div>
      </div>
    </div>
  );

  return (
    <Tilt options={TILT_OPTIONS} style={TILT_STYLES}>
      <div
        className="restaurant-element"
        style={{ animation: `slipIn 0.5s ease-in-out ${index * 100}ms` }}
        onClick={() => window.open(url, "_blank")}
      >
        {renderTop()}
        {renderBottom()}
      </div>
    </Tilt>
  );
});

const SkeletonRestaurant = () => (
  <div className="restaurant-element" style={{ width: "45%", height: "33vh" }}>
    <div className="element-top">
      <Skeleton width="14vw" height="20vh" />
      <div className="element-infos" style={{ backgroundColor: "white" }}>
        <div className="info-container">
          <Skeleton width="10vw" height="2vh" />
        </div>
        <div className="info-container">
          <Skeleton width="7vw" height="2vh" />
        </div>
        <div className="info-container">
          <Skeleton width="9vw" height="2vh" />
        </div>
      </div>
    </div>
    <div className="element-bottom">
      <div
        className="element-main-info"
        style={{ justifyContent: "space-around", paddingLeft: "20px" }}
      >
        <Skeleton width="18vw" height="4vh" />
        <Skeleton width="12vw" height="3vh" style={{ marginTop: "10px" }} />
      </div>
      <div className="element-more">
        <Skeleton
          circle={true}
          width={SKELETON_WIDTH}
          height={SKELETON_WIDTH}
        />
      </div>
    </div>
  </div>
);

export { Restaurant, SkeletonRestaurant };
