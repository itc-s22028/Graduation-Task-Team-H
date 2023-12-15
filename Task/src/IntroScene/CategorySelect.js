import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategorySelect = () => {
  const [genreName, setGenreName] = useState('');
  const [artistInfo, setArtistInfo] = useState(null);

  useEffect(() => {
    // ジャンルが変更されたら検索を実行
    if (genreName) {
      handleSearch();
    }
  }, [genreName]);

  const handleSearch = async () => {
    try {
      const accessToken = await getAccessToken();

      // ジャンルからランダムにアーティストを検索
      const response = await searchByGenre(genreName, accessToken);

      // ランダムにアーティストを選択
      const randomIndex = Math.floor(Math.random() * response.data.artists.items.length);
      const randomArtist = response.data.artists.items[randomIndex];
      setArtistInfo(randomArtist);
      

      // アーティスト情報をセット
      setArtistInfo(randomArtist);
    } catch (error) {
      console.error('Error fetching artist info:', error.message);
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
      throw new Error('Error fetching access token');
    }
  };

  const searchByGenre = async (genre, token) => {
    const response = await axios.get(`https://api.spotify.com/v1/search?q=genre:"${genre}"&type=artist`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  };

  const genres = ["pop", "rock", "hip-hop", "J-pop", "K-pop"];

  return (
    <div>
      <div className='SearchResultCon'>
        <div className="GenreButtons">
          {genres.map((genre) => (
           <button
           key={genre}
           className={`GenreButton ${genreName === genre ? 'selected' : ''}`}
           onClick={() => setGenreName(prevGenre => (prevGenre === genre ? '' : genre))}
         >
           {genre}
         </button>
         
          ))}
        </div>
      </div>

      <div className='bodyCon'>
        <div className='LeftCon'>
          {artistInfo && (
            <div>
              <img className="artistPic" src={artistInfo.images[0].url} alt="artistPic" />
              <h3>{artistInfo.name}</h3>
              <p className='searchP'>ジャンル: {artistInfo.genres.join(' | ')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategorySelect;
