import React, { useState } from 'react';
import axios from 'axios';

// import { calculatePopularityIndex } from './src/utils';

const Search = () => {
  
  const [artistName, setArtistName] = useState('');
  const [artistInfo, setArtistInfo] = useState(null);

  const handleSearch = async () => {
    try {
      // Spotify APIへのリクエスト用にアクセストークンを取得
      const accessToken = await getAccessToken();

      // アーティスト情報を検索
      const response = await searchArtist(artistName, accessToken);

      // アーティスト情報をセット
      setArtistInfo(response.data.artists.items[0]);
    } catch (error) {
      console.error('Error fetching artist info:', error.message);
    }
  };

  // Spotify APIにアクセストークンを取得する関数Client_ID
  const getAccessToken = async () => {
    // ここにSpotify Developer Dashboardで作成したアプリのクライアントIDとクライアントシークレットをセット
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
      throw new Error('Error fetching access token');
    }
  };

  // Spotify APIでアーティストを検索する関数
  const searchArtist = async (name, token) => {
    return axios.get(`https://api.spotify.com/v1/search?q=${name}&type=artist`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  return (
    <div>
      <h2>Search for Artist</h2>
      <input
        type="text"
        value={artistName}
        onChange={(e) => setArtistName(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {artistInfo && (
        <div>
          <h3>{artistInfo.name}</h3>
          <p>Genres: {artistInfo.genres.join(', ')}</p>
          <p>Followers: {artistInfo.followers.total}</p>
        
          <p>人気指数: {artistInfo.popularity} / 100</p>
          <img src={artistInfo.images[0].url} alt="Artist" />
        </div>
      )}
    </div>
  );
};

export default Search;