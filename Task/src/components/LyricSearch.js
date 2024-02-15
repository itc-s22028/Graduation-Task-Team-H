import { useState, useEffect } from "react";

function LyricSearch() {
  const [lyrics, setLyrics] = useState("");
  const [songData, setSongData] = useState(null);

  useEffect(() => {
    if (lyrics) {
      fetchSongData(lyrics).then((data) => {
        setSongData(data);
      });
    }
  }, [lyrics]);

  const fetchSongData = async (lyrics) => {
    const accessToken = process.env.REACT_APP_GENIUS_CLIENT_TOKEN;

    // 曲名を検索
    const searchResponse = await fetch(
      `https://api.genius.com/search?q=${lyrics}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const searchData = await searchResponse.json();

    // 検索結果から曲の詳細を取得
    if (searchData.response.hits.length > 0) {
      const songId = searchData.response.hits[0].result.id;
      const songDetailsResponse = await fetch(
        `https://api.genius.com/songs/${songId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const songDetailsData = await songDetailsResponse.json();

      return songDetailsData.response.song;
    } else {
      throw new Error("曲が見つかりませんでした。");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={lyrics}
        onChange={(e) => setLyrics(e.target.value)}
      />

      {songData && (
        <div>
          <h2>{songData.title}</h2>
          <p>Artist: {songData.primary_artist.name}</p>
          <p>Lyrics:</p>
          <pre>{songData.lyrics}</pre>
        </div>
      )}
    </div>
  );
}

export default LyricSearch;
