import React, { useState } from 'react';

const ReviewForm = ({ onAddReview }) => {
  const [userName, setUserName] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);

  const handleAddReview = () => {
    // フォームの入力が有効なら口コミを追加
    if (userName && content) {
      const newReview = {
        userName,
        content,
        rating,
        timestamp: new Date(),
      };

      // 親コンポーネントに口コミを追加する関数を呼ぶ
      onAddReview(newReview);

      // フォームをリセット
      setUserName('');
      setContent('');
      setRating(5);
    }
  };

  return (
    <div>
      <h3>Add a Review</h3>
      <div>
        <label>User Name:</label>
        <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
      </div>
      <div>
        <label>Content:</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      </div>
      <div>
        <label>Rating:</label>
        <input type="number" value={rating} onChange={(e) => setRating(e.target.value)} />
      </div>
      <button onClick={handleAddReview}>Submit Review</button>
    </div>
  );
};

export default ReviewForm;
