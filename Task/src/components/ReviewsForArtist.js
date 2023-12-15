import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const ReviewsForArtist = ({ artistId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const db = getFirestore();
      const reviewsCollection = collection(db, 'artists', artistId, 'reviews');

      const q = query(reviewsCollection);
      const querySnapshot = await getDocs(q);

      const fetchedReviews = [];
      querySnapshot.forEach((doc) => {
        fetchedReviews.push({ id: doc.id, ...doc.data() });
      });

      setReviews(fetchedReviews);
    };

    // アーティストが変更されたら、新しいアーティストの口コミを取得
    fetchReviews();
  }, [artistId]);

  return (
    <div>
      <h3>Reviews</h3>
      <ul>
        {reviews.map((review) => (
          <li key={review.id}>
            <p>User: {review.userName}</p>
            <p>Content: {review.content}</p>
            <p>Rating: {review.rating}</p>
            <p>Timestamp: {review.timestamp && review.timestamp.toDate().toString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewsForArtist;
