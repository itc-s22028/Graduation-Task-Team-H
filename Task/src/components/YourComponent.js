import React, { useState, useEffect } from 'react';
import { getFirestore, doc, setDoc, collection, addDoc, getDocs } from 'firebase/firestore';

const YourComponent = () => {
  const [artistName, setArtistName] = useState('');
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const artistDocRef = doc(db, 'artists', 'your_artist_id');
      const reviewsCollectionRef = collection(artistDocRef, 'reviews');

      // Firestoreからデータを読み込む
      const querySnapshot = await getDocs(reviewsCollectionRef);
      const reviewsData = querySnapshot.docs.map((doc) => doc.data());
      setReviews(reviewsData);
    };

    fetchData();
  }, []); // 空の依存配列を渡すことで、初回のみ実行

  const addReview = async () => {
    const artistDocRef = doc(db, 'artists', 'your_artist_id');
    const reviewsCollectionRef = collection(artistDocRef, 'reviews');

    // 新しいレビューを追加
    await addDoc(reviewsCollectionRef, {
      content: 'Great artist!',
      rating: 5,
      timestamp: new Date(),
      userID: 'your_user_id',
      userName: 'Your User Name',
    });

    // データを再読み込み
    fetchData();
  };

  return (
    <div>
      <h2>{artistName}</h2>
      <button onClick={addReview}>Add Review</button>
      <ul>
        {reviews.map((review, index) => (
          <li key={index}>
            <p>User: {review.userName}</p>
            <p>Content: {review.content}</p>
            <p>Rating: {review.rating}</p>
            <p>Timestamp: {review.timestamp.toString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default YourComponent;
