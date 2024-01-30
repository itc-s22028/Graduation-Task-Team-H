import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";

const ReviewLikeButton = ({ onClick, isLiked }) => {
  return (
    <div className="ReviewLikeButtonContainer">
      <button className="ReviewLikeButton" onClick={onClick}>
        <FontAwesomeIcon
          icon={isLiked ? solidHeart : regularHeart}
          className="heart-icon"
          color={isLiked ? "red" : "black"}
          border={isLiked ? "none" : "1px solid black"}
        />
      </button>
    </div>
  );
};

export default ReviewLikeButton;
