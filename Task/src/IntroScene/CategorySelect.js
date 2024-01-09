import React, { useState, useEffect } from "react";
import axios from "axios";

const CategorySelect = () => {
  const [genreName, setGenreName] = useState("");
  const [artistInfo, setArtistInfo] = useState(null);
  const [bgmUrl, setBgmUrl] = useState(""); // BGMの再生URL

  const handleSongSelection = () => {
    // 曲の選択画面に遷移するためのロジックを実装します
    // 例えば、React Router を使用する場合: history.push("/song-selection");
  };

  useEffect(() => {
    // ジャンルが変更されたら検索を実行
    if (genreName) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genreName]);

  const handleSearch = async () => {
    try {
      const accessToken = await getAccessToken();

      // ジャンルからランダムにアーティストを検索
      const response = await searchByGenre(genreName, accessToken);

      // ランダムにアーティストを選択
      const randomIndex = Math.floor(
        Math.random() * response.data.artists.items.length
      );
      const randomArtist = response.data.artists.items[randomIndex];

      // アーティスト情報をセット
      setArtistInfo(randomArtist);

      // BGMの再生URLを取得
      const bgmResponse = await getArtistTopTrack(randomArtist.id, accessToken);
      const topTrack = bgmResponse.data.tracks[0];
      setBgmUrl(topTrack.preview_url);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const getAccessToken = async () => {
    const clientId = process.env.REACT_APP_CLIENT_ID;
    const clientSecret = process.env.REACT_APP_CLIENT_SECRET;

    try {
      const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        "grant_type=client_credentials",
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
          },
        }
      );

      return response.data.access_token;
    } catch (error) {
      throw new Error("Error fetching access token");
    }
  };

  const searchByGenre = async (genre, token) => {
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/search?q=genre:"${genre}"&type=artist`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response;
    } catch (error) {
      console.error("Error searching by genre:", error.message);
      throw new Error("Error searching by genre");
    }
  };

  const getArtistTopTrack = async (artistId, token) => {
    const response = await axios.get(
      `https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=JP`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  };

  const genres = ["pop", "rock", "hip-hop", "J-pop", "K-pop"];

  return (
    <div>
      <div className="SearchResultCon">
        <div className="GenreButtons">
          {genres.map((genre) => (
            <button
              key={genre}
              className={`GenreButton ${genreName === genre ? "selected" : ""}`}
              onClick={() =>
                setGenreName((prevGenre) => (prevGenre === genre ? "" : genre))
              }
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      <div className="bodyCon">
        <div className="LeftCon">
          {artistInfo && (
            <div>
              <img
                className="artistPic"
                src={artistInfo.images[0].url}
                alt="artistPic"
              />
              <h3>{artistInfo.name}</h3>
              <p className="searchP">
                ジャンル: {artistInfo.genres.join(" | ")}
              </p>
            </div>
          )}

          {/* BGM再生ボタン */}
          {bgmUrl && <audio controls src={bgmUrl} />}

          {/* 曲の選択画面に遷移するボタン */}
          {bgmUrl && (
            <button onClick={() => handleSongSelection()}>曲を選ぶ</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategorySelect;
