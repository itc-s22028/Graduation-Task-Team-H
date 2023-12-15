import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const Comment = () => {
    const [reviews, setReviews] = useState([]);
    const [user, setUser] = useState(null);
  
    useEffect(() => {
      // 2. ログイン状態の確認
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
      });
  
      return () => {
        // コンポーネントがアンマウントされるときにunsubscribe
        unsubscribe();
      };
    }, []);
  
    const handleAddReview = async (newReview) => {
      // 3. 口コミデータの作成時にユーザー情報を保存
      const db = getFirestore();
      const reviewsCollection = collection(db, 'reviews');
  
      await addDoc(reviewsCollection, {
        ...newReview,
        userName: user ? user.displayName : 'Anonymous',
      });
  
      // レビューを再取得して更新
      fetchData();
    };
  
    const fetchData = async () => {
      // 口コミデータの取得
      const db = getFirestore();
      const reviewsCollection = collection(db, 'reviews');
      const q = query(reviewsCollection, where('content', '!=', null));
      const querySnapshot = await getDocs(q);
  
      const reviewsData = [];
      querySnapshot.forEach((doc) => {
        reviewsData.push({ id: doc.id, ...doc.data() });
      });
  
      setReviews(reviewsData);
    };
  
    return (
      <div>
        <h2>Reviews</h2>
        {/* コメントフォーム */}
        <ReviewForm onAddReview={handleAddReview} />
        {/* レビューリスト */}
        <ReviewList reviews={reviews} />
      </div>
    );
  };
  
  export default Comment;