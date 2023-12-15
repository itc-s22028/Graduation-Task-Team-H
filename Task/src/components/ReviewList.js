import React from 'react';
import ReviewItem from './ReviewItem';

const ReviewList = ({ reviews, onDeleteReview }) => {
  if (reviews.length === 0) {
    return (
      <div>
        <h3>Reviews</h3>
        <p>No reviews available.</p>
      </div>
    );
  }

  return (
    <div>
      <h3>Reviews</h3>
      <ul>
        {reviews.map((review, index) => (
          <li key={index}>
            <ReviewItem review={review} onDeleteReview={onDeleteReview} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewList;
