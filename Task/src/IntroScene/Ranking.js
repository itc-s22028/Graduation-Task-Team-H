import React, { useState, useEffect } from "react";
import scrollTop from "../images/scrollTop.png";
import axios from "axios";
import "./Ranking.css";

const Ranking = () => {
  const [topTracks, setTopTracks] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Spotify APIの認証情報（実際のクライアントIDとクライアントシークレットに置き換えてください）
        const clientId = process.env.REACT_APP_CLIENT_ID;
        const clientSecret = process.env.REACT_APP_CLIENT_SERECT;

        // クライアントIDとクライアントシークレットをBase64でエンコード
        const base64EncodedClientIdAndSecret = btoa(
          `${clientId}:${clientSecret}`
        );

        // Spotify APIへのアクセストークン取得
        const responseToken = await axios.post(
          "https://accounts.spotify.com/api/token",
          "grant_type=client_credentials",
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Basic ${base64EncodedClientIdAndSecret}`,
            },
          }
        );

        const accessToken = responseToken.data.access_token;

        // Spotify APIで日本のトップソングのプレイリストを取得
        const responsePlaylists = await axios.get(
          "https://api.spotify.com/v1/browse/categories/toplists/playlists?country=US",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // プレイリストからトップソングの情報を取得
        const playlistId = responsePlaylists.data.playlists.items[0].id;
        const responseTopTracks = await axios.get(
          `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // 人気度の高い順にトラックをソート
        const sortedTopTracks = responseTopTracks.data.items
          .map((item) => item.track)
          .sort((a, b) => b.popularity - a.popularity);

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
        console.error(
          "Spotify API からデータを取得中にエラーが発生しました",
          error
        );
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="OneSet">
        {/*曲名と順位を表示させているところ 始まり*/}
        <h1>Spotify Top Tracks in Japan</h1>
        <button
          className="RanBackHome"
          onClick={() => (window.location.href = "/Home")}
        >
          ◀ Homeへ戻る
        </button>
        <div className="RankingTop">
          <ol>
            {topTracks.map((track, index) => (
              <>
                <li key={track.id}>
                  <span className="NamH2">No. {index + 1}</span>
                  <div className="MusName">
                    {track.name}
                    <br />
                    {track.artists.map((artist) => artist.name).join(", ")}
                  </div>
                </li>

                <img className="AlbumImg" src={track.album.images[0].url} />
                <div>
                  <p>
                    <strong>アルバム:</strong> {track.album.name}
                  </p>
                  <p>
                    <strong>人気度:</strong> {track.popularity}
                  </p>
                </div>
              </>
            ))}
          </ol>
        </div>
        {/*終わり*/}

        {/* 一番上まで戻るボタン */}
        {scrollPosition > 100 && (
          <button className="scrollToTopButton" onClick={scrollToTop}>
            <img src={scrollTop} alt="" className="scrollTopImg" />
          </button>
        )}
      </div>
    </>
  );
};

export default Ranking;
