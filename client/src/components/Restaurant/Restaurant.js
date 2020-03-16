import React from "react";
import "./Restaurant.css";
import { IoMdPricetag, IoIosStar, IoMdPhonePortrait } from "react-icons/io";
import { GiCookingPot, GiChefToque } from "react-icons/gi";
import Skeleton from "react-loading-skeleton";

const Restaurant = ({ content }) => {
  const getLocation = () =>
    `${content.address.street}, ${content.address.town}, ${content.address.zipCode}`;
  const getPrice = () => `${content.price.bottom} - ${content.price.top} EUR`;
  const getRating = () =>
    `${content.rating} / 5 (${content.numberVotes} votes)`;

  return <div className="restaurant-container"></div>;
};

const SkeletonRestaurant = () => {
  const renderPicture = () => (
    <div className="picture-container">
      <Skeleton width="30vh" height="25vh" />
    </div>
  );

  const renderContent = () => (
    <div className="content-container">
      <div className="main-infos">
        <div className="row-infos">
          <Skeleton width="10vw" height="3vh" />
        </div>
        <div className="row-infos">
          <Skeleton width="20vw" height="3vh" />
        </div>
      </div>
      <div className="icons-infos">
        <div className="row-infos">
          <Skeleton width="4vw" height="2vh" />
        </div>
        <div className="row-infos">
          <Skeleton width="16vw" height="2vh" />
        </div>
        <div className="row-infos">
          <Skeleton width="12vw" height="2vh" />
        </div>
        <div className="row-infos">
          <Skeleton width="10vw" height="2vh" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="restaurant-container">
      {renderPicture()}
      {renderContent()}
    </div>
  );
};

export { Restaurant, SkeletonRestaurant };
