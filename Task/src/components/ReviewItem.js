import React from 'react';

const ReviewItem = ({ review, onDeleteReview }) => {
  const handleDeleteClick = () => {
    onDeleteReview(review.id); // 口コミのドキュメント ID を渡して削除関数を呼び出す
  };

  return (
    <div>
      <p>User: {review.userName}</p>
      <p>Content: {review.content}</p>
      <p>Rating: {review.rating}</p>
      <p>Timestamp: {review.timestamp.toString()}</p>
      <button onClick={handleDeleteClick}>Delete Review</button>
    </div>
  );
};

export default ReviewItem;
