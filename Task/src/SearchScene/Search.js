import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';

const Search = () => {
  const [artistName, setArtistName] = useState('');
  const [artistInfo, setArtistInfo] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [userDisplayName, setUserDisplayName] = useState('Anonymous');

  const handleSearch = async () => {
    try {
      const accessToken = await getAccessToken();
      const response = await searchArtist(artistName, accessToken);
      setArtistInfo(response.data.artists.items[0]);
      // 新しいアーティストを検索するときにレビューをリセット
      setReviews([]);
    } catch (error) {
      console.error('アーティスト情報の取得エラー:', error.message);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const getAccessToken = async () => {
    const clientId = process.env.REACT_APP_CLIENT_ID;
    const clientSecret = process.env.REACT_APP_CLIENT_SERECT;

    try {
      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        'grant_type=client_credentials',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
          },
        }
      );

      return response.data.access_token;
    } catch (error) {
      throw new Error('アクセストークンの取得エラー');
    }
  };

  const searchArtist = async (name, token) => {
    return axios.get(`https://api.spotify.com/v1/search?q=${name}&type=artist`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const fetchReviews = async () => {
    if (!artistInfo) {
      setReviews([]); // アーティスト情報がない場合は口コミをリセット
      return;
    }

    const db = getFirestore();
    const reviewsCollection = collection(db, 'reviews');

    // アーティスト名を使ってクエリを組み立てる
    const artistQuery = query(reviewsCollection, where('artistName', '==', artistInfo.name));

    try {
      const querySnapshot = await getDocs(artistQuery);
      const reviewsData = [];
      querySnapshot.forEach((doc) => {
        reviewsData.push({ id: doc.id, ...doc.data() });
      });
      setReviews(reviewsData);
    } catch (error) {
      console.error('口コミの取得エラー:', error.message);
    }
  };

  const postReview = async () => {
    if (newReview.trim() === '') {
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      // ユーザーがいない場合は匿名ログイン
      await signInAnonymously(auth);
    }

    const db = getFirestore();
    const reviewsCollection = collection(db, 'reviews');
    const timestamp = new Date();

    try {
      await addDoc(reviewsCollection, {
        userID: user ? user.uid : 'anonymous',
        userName: user ? user.displayName : 'Anonymous',
        content: newReview,
        timestamp: timestamp,
        rating: 5,
        artistName: artistInfo ? artistInfo.name : '',
      });
      setNewReview('');
      // 口コミが追加されたら口コミ一覧を再取得
      fetchReviews();
    } catch (error) {
      console.error('レビューの追加エラー:', error.message);
    }
  };

  useEffect(() => {
    // アーティストが変わったら口コミ一覧を取得
    fetchReviews();
  }, [artistInfo]);

  return (
    <div>
      <h2>アーティスト検索</h2>
      <input
        type="text"
        value={artistName}
        onChange={(e) => setArtistName(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleSearch}>検索</button>

      {artistInfo && (
        <div>
          <h3>{artistInfo.name}</h3>
          <p>ジャンル: {artistInfo.genres.join(', ')}</p>
          <p>フォロワー数: {artistInfo.followers.total}</p>
          <p>人気指数: {artistInfo.popularity} / 100</p>
          <img src={artistInfo.images[0].url} alt="アーティスト" />
        </div>
      )}

      <div>
        <h3>口コミ</h3>
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>
              <strong>{review.userName}:</strong> {review.content}
            </li>
          ))}
        </ul>
        <textarea
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="レビューを書く..."
        ></textarea>
        <button onClick={postReview}>レビュー投稿</button>
      </div>
    </div>
  );
};

export default Search;