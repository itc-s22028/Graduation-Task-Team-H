import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SearchStyle.css';
import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';

const Search = () => {
  const [artistName, setArtistName] = useState('');
  const [artistInfo, setArtistInfo] = useState(null);
  const [bgmPreviewUrl, setBgmPreviewUrl] = useState('');
  const [trackName, setTrackName] = useState('');
  const [audio, setAudio] = useState(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);
  const [albumName, setAlbumName] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [userDisplayName, setUserDisplayName] = useState('Anonymous');

  const handleSearch = async () => {
    try {
      stopBGM();
      const accessToken = await getAccessToken();
      const response = await searchArtist(artistName, accessToken);
      setArtistInfo(response.data.artists.items[0]);
      const topTracksResponse = await getTopTracks(response.data.artists.items[0].id, accessToken);
      if (topTracksResponse) {
        setBgmPreviewUrl(topTracksResponse.tracks[0].preview_url);
        setAlbumName(topTracksResponse.tracks[0].album.name);
        setReleaseDate(topTracksResponse.tracks[0].album.release_date);
        setTrackName(topTracksResponse.tracks[0].name);
      }
      setReviews([]);
    } catch (error) {
      console.error('アーティスト情報の取得エラー:', error.message);
    }
  };

  const getTopTracks = async (artistId, token) => {
    try {
      const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=US`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const topTracks = response.data.tracks;

      if (topTracks.length > 0) {
        const firstTrack = topTracks[0];
        const albumName = firstTrack.album.name;
        const trackName = firstTrack.name;

        return response.data;
      } else {
        throw new Error('No top tracks available for this artist.');
      }
    } catch (error) {
      throw new Error('Error fetching top tracks:', error.message);
    }
  };

  const playBGM = () => {
    if (bgmPreviewUrl && bgmPreviewUrl !== 'null') {
      audio.src = bgmPreviewUrl;
      audio.play()
        .then(() => {
          console.log('BGM is playing:', bgmPreviewUrl);
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error('Error playing BGM:', error);
        });

      audio.addEventListener('ended', handleBGMEnded);
    } else {
      console.warn('No preview available for this track.');
    }
  };

  const handleBGMEnded = () => {
    setIsPlaying(false);
  };

  const stopBGM = () => {
    audio.pause();
    setIsPlaying(false);
    audio.removeEventListener('ended', handleBGMEnded);
  };

  const togglePlayback = () => {
    if (audio.paused) {
      playBGM();
    } else {
      stopBGM();
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
      setReviews([]);
      return;
    }

    const db = getFirestore();
    const reviewsCollection = collection(db, 'reviews');

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
      fetchReviews();
    } catch (error) {
      console.error('レビューの追加エラー:', error.message);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [artistInfo]);

  return (
    <div>
      <div className='SearchResultCon'>
        <div className="leftButtons">
          <input
            className='SearchTx'
            type="text"
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="アーティスト名か曲名で検索"
          />
          <button className='SearchBt' onClick={handleSearch}>Search</button>
        </div>
        <div className='rightButtons'>
          <button className='BackHomeBt' onClick={() => window.location.href = '/Home'}>HOME</button>
        </div>
      </div>

      <div className='bodyCon'>
        <div className='LeftCon'>
          {artistInfo && (
            <div className='bodyCon'>
              <div>
                <img className="artistPic" src={artistInfo.images[0].url} alt="artistPic" />
                <h3>{artistInfo.name}</h3>
                <p className='searchP'>ジャンル: {artistInfo.genres.join(' | ')}</p>
                <p className='searchP'>spotifyでのフォロワー数: {artistInfo.followers.total}</p>
                <p className='searchP'>アーティストの人気度: {artistInfo.popularity} / 100</p>

                {bgmPreviewUrl && (
                  <div>
                    {albumName === trackName ? (
                      <p className='searchP'>曲名 : {trackName}</p>
                    ) : (
                      <>
                        <p className='searchP'>アルバム: {albumName}</p>
                        <p className='searchP'>曲名 : {trackName}</p>
                      </>
                    )}
                    <p className='searchP'>リリース日: {releaseDate}</p>
                    <button className='playBt' onClick={togglePlayback}>
                      {isPlaying ? 'Stop BGM' : 'Play BGM'}
                    </button>
                  </div>
                )}
              </div>
              <div className='RightCon'>
                <div className="kuchikomi">
                  {reviews.map((review) => (
                    <div key={review.id} className='minmiru'>
                      <p className='minmiruP'>{review.content}</p>
                    </div>
                  ))}
                </div>

                <div className='KuchikomiSearch'>
                  <input
                    className='KakikomiTx'
                    type="text" />
                  <button className='KakikomiBt'>書き込む</button>
                </div>
              </div>
            </div>

          )}
        </div>

        
      </div>
    </div>
  );
};

export default Search;
