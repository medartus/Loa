import React from "react";
import "./Restaurant.css";
import Tilt from "react-tilt";

import Skeleton from "react-loading-skeleton";
import { IoIosStarHalf, IoIosStarOutline, IoIosStar } from "react-icons/io";
import { MdLocationOn } from "react-icons/md";

const PHOTO_DEFAULT =
  "https://cdn.dribbble.com/users/1042202/screenshots/5836341/icon-rest_2x.jpg";

const Restaurant = ({ content }) => {
  const getCategories = () => {
    let rep = "";
    for (let i in content.categories) {
      rep += content.categories[i].title + " ";
    }
    return rep;
  };

  const priceFeeback = () => {
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

  const getImgUrl = () => {
    return !content.photos[0].includes("None")
      ? content.photos[0]
      : PHOTO_DEFAULT;
  };

  const renderStars = () => {
    const rating = content.rating;
    let stars = [];
    for (let i = 0.5; i < 5.5; i += 1.0) {
      if (rating > i) stars.push(IoIosStar);
      else if (rating === i) stars.push(IoIosStarHalf);
      else stars.push(IoIosStarOutline);
    }
    return (
      <div className="stars">
        {stars.map((Star, i) => (
          <Star key={i} className="star-logo" color="#4949e7" size={15} />
        ))}
      </div>
    );
  };

  return (
    <Tilt
      options={{ max: 10, scale: 1.04 }}
      style={{ width: "45%", height: "33vh" }}
    >
      <div className="restaurant-element">
        <div className="element-top">
          <img className="element-image" src={getImgUrl()} />
          <div className="element-infos">
            <div className="info-container">
              <MdLocationOn color="#4949e7" size={15} />
              <p className="city">
                {content.location.postal_code} {content.location.city}
              </p>
            </div>
            <div className="info-container">
              <p className="price">{content.price}</p>
              <p className="price-feedback">{priceFeeback()}</p>
            </div>
            <div className="info-container">
              {renderStars()}
              <p className="votes">({content.review_count} votes)</p>
            </div>
          </div>
        </div>
        <div className="element-bottom">
          <div className="element-main-info">
            <p className="name">{content.name}</p>
            <p className="categories">{getCategories()}</p>
          </div>
          <div className="element-more">
            <a className="more-button" href={content.url} target="_blank">
              <p className="more-text">View more</p>
            </a>
          </div>
        </div>
      </div>
    </Tilt>
  );
};

const SkeletonRestaurant = () => (
  <div className="restaurant-element" style={{ width: "45%", height: "33vh" }}>
    <div className="element-top">
      <Skeleton width="14vw" height="20vh" />
      <div className="element-infos">
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
        <Skeleton circle={true} width={50} height={50} />
      </div>
    </div>
  </div>
);

export { Restaurant, SkeletonRestaurant };
