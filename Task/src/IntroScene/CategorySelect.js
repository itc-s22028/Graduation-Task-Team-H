import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // uuid パッケージを使用

const CategorySelect = () => {
  const [genreName, setGenreName] = useState('');
  const [artistInfo, setArtistInfo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());
  const [bgmPreviewUrl, setBgmPreviewUrl] = useState('');
  const [topTracks, setTopTracks] = useState(null);

  const getTopTracks = async (artistId, token) => {
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=US`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const topTracks = response.data.tracks;

      if (topTracks.length > 0) {
        // const firstTrack = topTracks[0]; // これは使用されていないようです
        return response.data;
      } else {
        throw new Error("No top tracks available for this artist.");
      }
    } catch (error) {
      throw new Error("Error fetching top tracks:" + error.message);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup
      audioRef.current.pause();
      audioRef.current.removeEventListener('ended', handleBGMEnded);
    };
  }, []); 

  const searchByGenre = async (genre, token) => {
    try {
      const randomString = uuidv4(); // uuid を使用してランダムな文字列を生成
      const response = await axios.get(
        `https://api.spotify.com/v1/search?q=genre:"${encodeURIComponent(genre)}"&type=artist&random=${randomString}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('searchByGenre response:', response.data);
      return response;
    } catch (error) {
      console.error('Error fetching artist info:', error.message);
      throw new Error('Error fetching artist info');
    }
  };
  
  useEffect(() => {
    if (genreName) {
      handleSearch();
    }
  }, [genreName]);

  useEffect(() => {
    if (artistInfo) {
      playBGM(artistInfo.tracks);
    }
  }, [artistInfo]);

  const handleSearch = async () => {
    try {
      const accessToken = await getAccessToken();
      const response = await searchByGenre(genreName, accessToken);
      const randomIndex = Math.floor(
        Math.random() * response.data.artists.items.length
      );
      const randomArtist = response.data.artists.items[randomIndex];
      setArtistInfo(randomArtist);
      const topTracksResponse = await getTopTracks(randomArtist.id, accessToken);
      
      if (topTracksResponse) {
        setBgmPreviewUrl(topTracksResponse.tracks[0].preview_url);
        playBGM();  // 非同期処理が完了したら再生する
      }
      
      setTopTracks(topTracksResponse);
    } catch (error) {
      console.error('Error fetching artist info:', error.message);
      // ユーザーフィードバックを追加することも検討してください
    }
  };

  const playBGM = async () => {
    console.log('bgmPreviewUrl:', bgmPreviewUrl);
  
    if (bgmPreviewUrl && bgmPreviewUrl !== 'null') {
      try {
        // Update the src property of the audio element
        audioRef.current.src = bgmPreviewUrl;
  
        // Wait for the audio to be loaded
        await audioRef.current.load(); // 'canplaythrough' イベントを待たなくてもよい
        // Start playing
        await audioRef.current.play();
  
        console.log('BGM is playing:', bgmPreviewUrl);
        setIsPlaying(true);
      } catch (error) {
        console.error('Error playing BGM:', error);
      }
    } else {
      console.warn('No preview available for this track.');
    }
  };

  const stopBGM = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    console.log('Toggling playback');
    if (isPlaying) {
      stopBGM();
    } else {
      playBGM();
    }
  };

  const handleBGMEnded = () => {
    setIsPlaying(false);
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

  const genres = ['pop', 'rock', 'hip-hop', 'J-pop', 'K-pop'];

  return (
    <div>
      <div className="SearchResultCon">
        <div className="GenreButtons">
          <>
            {genres.map((genre) => (
              <button
                key={genre}
                className={`GenreButton ${
                  genreName === genre ? 'selected' : ''
                }`}
                onClick={() =>
                  setGenreName((prevGenre) => (prevGenre === genre ? '' : genre))
                }
              >
                {genre}
              </button>
            ))}
          </>
        </div>
      </div>
      {artistInfo && (
        <div>
          <img
            className="artistPic"
            src={artistInfo.images[0].url}
            alt="artistPic"
          />
          <h3>{artistInfo.name}</h3>
          <p className="searchP">ジャンル: {artistInfo.genres.join(' | ')}</p>
          {bgmPreviewUrl && (
            <div>
              <button className="playBt" onClick={togglePlayback}>
                {isPlaying ? 'Stop BGM' : 'Play BGM'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategorySelect;
