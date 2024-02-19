import React, { createContext, useContext, useEffect, useState } from "react";

const ReviewLikeContext = createContext();

export const ReviewLikeProvider = ({ children }) => {
  const [totalReviewLikes, setTotalReviewLikes] = useState(0);

  const incrementReviewLikes = () => {
    setTotalReviewLikes((prevLikes) => prevLikes + 1);
  };

  const decrementReviewLikes = () => {
    setTotalReviewLikes((prevLikes) => Math.max(prevLikes - 1, 0));
  };

  return (
    <ReviewLikeContext.Provider
      value={{ totalReviewLikes, incrementReviewLikes, decrementReviewLikes }}
    >
      {children}
    </ReviewLikeContext.Provider>
  );
};

export const useReviewLikeContext = () => {
  return useContext(ReviewLikeContext);
};
