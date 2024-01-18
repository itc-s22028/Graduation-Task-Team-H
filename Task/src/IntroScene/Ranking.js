import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Ranking = () => {
  const [topTracks, setTopTracks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Spotify APIの認証情報（実際のクライアントIDとクライアントシークレットに置き換えてください）
        const clientId = process.env.REACT_APP_CLIENT_ID;
        const clientSecret = process.env.REACT_APP_CLIENT_SERECT;

        // クライアントIDとクライアントシークレットをBase64でエンコード
        const base64EncodedClientIdAndSecret = btoa(`${clientId}:${clientSecret}`);

        // Spotify APIへのアクセストークン取得
        const responseToken = await axios.post(
          'https://accounts.spotify.com/api/token',
          'grant_type=client_credentials',
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: `Basic ${base64EncodedClientIdAndSecret}`,
            },
          }
        );

        const accessToken = responseToken.data.access_token;

        // Spotify APIで日本のトップソングのプレイリストを取得
        const responsePlaylists = await axios.get('https://api.spotify.com/v1/browse/categories/toplists/playlists?country=JP', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // プレイリストからトップソングの情報を取得
        const playlistId = responsePlaylists.data.playlists.items[0].id;
        const responseTopTracks = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // 人気度の高い順にトラックをソート
        const sortedTopTracks = responseTopTracks.data.items.map(item => item.track).sort((a, b) => b.popularity - a.popularity);

        // 同率の場合に同じ順位を表示するための処理
        let rank = 1;
        let prevPopularity = sortedTopTracks[0].popularity;

        const tracksWithRank = sortedTopTracks.map((track, index) => {
          if (track.popularity !== prevPopularity) {
            rank = index + 1;
            prevPopularity = track.popularity;
          }
          return { ...track, rank };
        });

        setTopTracks(tracksWithRank);
      } catch (error) {
        console.error('Spotify API からデータを取得中にエラーが発生しました', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Spotify Top Tracks in Japan</h1>
      <ul>
        {topTracks.map((track) => (
          <div key={track.id} style={{ marginBottom: '20px' }}>
            <p><strong>順位:</strong> {track.rank}</p>
            <img src={track.album.images[0].url} alt={`${track.name} cover`} style={{ width: '100px', height: '100px' }} />
            <div>
              <p><strong>曲名:</strong> {track.name}</p>
              <p><strong>アーティスト:</strong> {track.artists.map(artist => artist.name).join(', ')}</p>
              <p><strong>アルバム:</strong> {track.album.name}</p>
              <p><strong>人気度:</strong> {track.popularity}</p>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Ranking;
