import React, { useState, useEffect } from "react";
import MigiYagi from "../images/MigiYagi.png";
import SearchHome from "../images/HomeLogo.png";
import axios from "axios";
import "./SearchStyle.css";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  setDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { formatDistanceToNow, format } from "date-fns";
import { ja } from "date-fns/locale";
import jaLocale from "date-fns/locale/ja";
import LikeButton from "../components/LikeButton"; // ファイルパスは実際のファイルの場所に合わせて修正してください
import { deleteDoc } from "firebase/firestore";
import { useLikeContext } from "../components/LikeContext";

const Search = () => {
  const [artistName, setArtistName] = useState("");
  const [artistInfo, setArtistInfo] = useState(null);
  const [bgmPreviewUrl, setBgmPreviewUrl] = useState("");
  const [trackName, setTrackName] = useState("");
  const [audio, setAudio] = useState(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);
  const [albumName, setAlbumName] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [reviews, setReviews] = useState([]);
  const [newReviewInput, setNewReviewInput] = useState("");
  const [userDisplayName, setUserDisplayName] = useState("Anonymous");
  const [userProfileImage, setUserProfileImage] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [popularTracks, setPopularTracks] = useState([]);
  const { isArtistLiked, addLikedArtist, removeLikedArtist } = useLikeContext();
  const [totalLikes, setTotalLikes] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [artistDetail, setArtistDetail] = useState(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [artistInfos, setArtistInfos] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });
  }, []);

  // artistIndex ステートを追加
  const [artistIndex, setArtistIndex] = useState(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const calculateElapsedTime = (timestamp) => {
    return formatDistanceToNow(timestamp.toDate(), { locale: jaLocale });
  };

  const getLikesCount = async () => {
    const db = getFirestore();
    const likesCollection = collection(db, "likes");

    const likesQuery = query(
      likesCollection,
      where("artistName", "==", artistInfo ? artistInfo.name : "")
    );

    try {
      const querySnapshot = await getDocs(likesQuery);
      return querySnapshot.size; // いいねの数を返す
    } catch (error) {
      console.error("Error in getLikesCount:", error.message);
      return 0;
    }
  };

  const fetchLikes = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const db = getFirestore();
      const likesCollection = collection(db, "likes");

      const likesQuery = query(
        likesCollection,
        where("artistName", "==", artistInfo ? artistInfo.name : "")
      );

      try {
        const querySnapshot = await getDocs(likesQuery);
        setTotalLikes(querySnapshot.size); // 総いいねの数を更新
        console.log("After fetchLikes");
      } catch (error) {
        console.error("Error in fetchLikes:", error.message);
      }
    }
  };

  const handleLike = async () => {
    try {
      console.log("Handle Like is called");
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const db = getFirestore();
        const likesCollection = collection(db, "likes");

        // 既存のいいねを取得
        const existingLikeQuery = query(
          likesCollection,
          where("userId", "==", user.uid),
          where("artistName", "==", artistInfo ? artistInfo.name : "")
        );

        const existingLikeSnapshot = await getDocs(existingLikeQuery);

        if (!existingLikeSnapshot.empty) {
          // 既存のいいねが存在する場合、そのドキュメントを削除
          const existingLikeDoc = existingLikeSnapshot.docs[0];
          await deleteDoc(existingLikeDoc.ref);
        } else {
          // 既存のいいねが存在しない場合、新しいドキュメントを追加
          await addDoc(likesCollection, {
            userId: user.uid,
            artistName: artistInfo ? artistInfo.name : "",
            liked: true,
          });
        }

        // デバッグログを追加
        console.log("Before fetchLikes");

        // Fetch直後にデータの再読み込み
        await fetchLikes();

        // デバッグログを追加
        console.log("After fetchLikes");
      }
    } catch (error) {
      console.error("いいねの処理エラー:", error.message);
    }
  };

  const handleLikeClick = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const db = getFirestore();
        const likesCollection = collection(db, "likes");

        // deleteDocのインポートを削除

        // いいねの状態を反転させる
        const artistName = artistInfo ? artistInfo.name : "";
        const artistIsLiked = isArtistLiked(artistName);
        if (!artistIsLiked) {
          // いいねを追加する場合
          await addDoc(likesCollection, {
            userId: user.uid,
            artistName: artistName,
            liked: true,
          });
          addLikedArtist(artistName);
          setTotalLikes((prevLikes) => prevLikes + 1); // 総いいねの数を更新
        } else {
          // いいねを解除する場合
          const existingLikeQuery = query(
            likesCollection,
            where("userId", "==", user.uid),
            where("artistName", "==", artistName)
          );

          const existingLikeSnapshot = await getDocs(existingLikeQuery);

          if (!existingLikeSnapshot.empty) {
            const existingLikeDoc = existingLikeSnapshot.docs[0];
            await deleteDoc(existingLikeDoc.ref);
            removeLikedArtist(artistName);
            setTotalLikes((prevLikes) => prevLikes - 1); // 総いいねの数を更新
          }
        }
      }
    } catch (error) {
      console.error("いいねの処理エラー:", error.message);
    }
  };

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserDisplayName(user.displayName || "Anonymous");
        if (
          user.providerData &&
          user.providerData[0]?.providerId === "google.com"
        ) {
          setUserProfileImage(user.photoURL);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSearch = async () => {
    try {
      // BGMを停止
      stopBGM();

      // Spotifyアクセストークンを取得
      const accessToken = await getAccessToken();

      // アーティスト検索APIを呼び出し
      const response = await searchArtist(artistName, accessToken);

      // 検索結果のアーティスト一覧を取得
      const artists = response.data.artists.items;

      // 検索結果をsearchResultsステートにセット
      setSearchResults(artists);

      // オプションで、最初のアーティストを主な artistInfo として設定する
      if (artists.length > 0) {
        // 最初のアーティストの情報をセット
        setArtistInfo(artists[0]);

        // 最初のアーティストのトップトラックを取得
        const topTracksResponse = await getTopTracks(
          artists[0].id,
          accessToken
        );

        // トップトラックが存在する場合、その情報をセット
        if (topTracksResponse) {
          setBgmPreviewUrl(topTracksResponse.tracks[0].preview_url);
          setAlbumName(topTracksResponse.tracks[0].album.name);
          setReleaseDate(topTracksResponse.tracks[0].album.release_date);
          setTrackName(topTracksResponse.tracks[0].name);
          setPopularTracks(topTracksResponse.tracks);
        }
      }

      // レビュー一覧をリセット
      setReviews([]);
      setArtistDetail(null);
    } catch (error) {
      console.error("アーティスト情報の取得エラー:", error.message);
    }
  };

  const handleArtistDetail = async (artist) => {
    try {
      // アーティストの詳細情報をセット
      setArtistDetail(artist);

      // アーティストのトップトラックを取得
      const accessToken = await getAccessToken();
      const topTracksResponse = await getTopTracks(artist.id, accessToken);

      // トップトラックが存在する場合、その情報をセット
      if (topTracksResponse) {
        setBgmPreviewUrl(topTracksResponse.tracks[0].preview_url);
        setAlbumName(topTracksResponse.tracks[0].album.name);
        setReleaseDate(topTracksResponse.tracks[0].album.release_date);
        setTrackName(topTracksResponse.tracks[0].name);
        setPopularTracks(topTracksResponse.tracks);
      }

      // コメントを即座に読み込む
      await fetchReviews();
    } catch (error) {
      console.error("アーティスト詳細情報の取得エラー:", error.message);
    }

    setIsDetailVisible(true); // 詳細情報を表示
  };

  const handleBack = () => {
    setArtistDetail(null);
    setIsDetailVisible(false); // 一覧を表示
  };

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
        const firstTrack = topTracks[0];
        const albumName = firstTrack.album.name;
        const trackName = firstTrack.name;
        return response.data;
      } else {
        throw new Error("No top tracks available for this artist.");
      }
    } catch (error) {
      throw new Error("Error fetching top tracks:", error.message);
    }
  };

  const playBGM = () => {
    if (bgmPreviewUrl && bgmPreviewUrl !== "null") {
      audio.src = bgmPreviewUrl;
      audio
        .play()
        .then(() => {
          console.log("BGM is playing:", bgmPreviewUrl);
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Error playing BGM:", error);
        });
      audio.addEventListener("ended", handleBGMEnded);
    } else {
      console.warn("No preview available for this track.");
    }
  };

  const handleBGMEnded = () => {
    setIsPlaying(false);
  };

  const stopBGM = () => {
    audio.pause();
    setIsPlaying(false);
    audio.removeEventListener("ended", handleBGMEnded);
  };

  const togglePlayback = () => {
    if (audio.paused) {
      playBGM();
    } else {
      stopBGM();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (event.shiftKey) {
        // Shift + Enterの場合は改行
      } else {
        handleSearch();
        postReview();
      }
    }
  };

  const handleReviewKeyDown = (event) => {
    if (event.key === "Enter" && event.shiftKey) {
      const textarea = event.target;
      const value = textarea.value;
      const selectionStart = textarea.selectionStart;
      const selectionEnd = textarea.selectionEnd;

      const newValue =
        value.substring(0, selectionStart) +
        "\n" +
        value.substring(selectionEnd);

      setNewReviewInput(newValue);

      event.preventDefault();
    } else if (event.key === "Enter") {
      postReview();
    }
  };

  function DisplayReview({ content, timestamp }) {
    const elapsed = formatDistanceToNow(new Date(timestamp.toDate()), {
      locale: ja,
    });

    const formattedContent = content.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index !== content.length - 1 && <br />}
      </React.Fragment>
    ));

    return (
      <div>
        <div dangerouslySetInnerHTML={{ __html: formattedContent.join("") }} />
        <p>{elapsed}</p>
      </div>
    );
  }

  const getAccessToken = async () => {
    const clientId = process.env.REACT_APP_CLIENT_ID;
    const clientSecret = process.env.REACT_APP_CLIENT_SERECT;

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
      throw new Error("アクセストークンの取得エラー");
    }
  };

  const searchArtist = async (name, token) => {
    return axios.get(
      `https://api.spotify.com/v1/search?q=${name}&type=artist`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const fetchReviews = async () => {
    if (!artistInfo) {
      setReviews([]);
      return;
    }

    const db = getFirestore();
    const reviewsCollection = collection(db, "reviews");

    const artistQuery = query(
      reviewsCollection,
      where("artistName", "==", artistInfo.name)
    );

    try {
      const querySnapshot = await getDocs(artistQuery);
      const reviewsData = [];
      querySnapshot.forEach((doc) => {
        reviewsData.push({ id: doc.id, ...doc.data() });
      });
      setReviews(reviewsData);
    } catch (error) {
      console.error("口コミの取得エラー:", error.message);
    }
  };

  const postReview = async () => {
    if (newReviewInput.trim() === "") {
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      await signInAnonymously(auth);
    }

    const db = getFirestore();
    const reviewsCollection = collection(db, "reviews");
    const timestamp = new Date();

    try {
      await addDoc(reviewsCollection, {
        userID: user ? user.uid : "anonymous",
        userName: user ? user.displayName || "Anonymous" : "Anonymous",
        userIcon: userProfileImage || "",
        content: newReviewInput.replace(/\n/g, "<br>"),
        timestamp: timestamp,
        rating: 5,
        artistName: artistInfo ? artistInfo.name : "",
      });

      setNewReviewInput("");
      fetchReviews();
    } catch (error) {
      console.error("レビューの追加エラー:", error.message);
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchLikes(); // ここで fetchLikes を呼び出す
  }, [artistInfo]);

  const bodyStyle = artistInfo;

  // 口コミ削除関数
  const deleteReview = async (reviewId) => {
    const confirmation = window.confirm("コメントを削除しますか？");

    if (confirmation) {
      try {
        const db = getFirestore();
        const reviewDocRef = doc(db, "reviews", reviewId);
        await deleteDoc(reviewDocRef);
        fetchReviews(); // コメントが削除された後に再読み込み
      } catch (error) {
        console.error("コメントの削除エラー:", error.message);
      }
    }
  };

  const handleDelete = async (reviewId) => {
    const confirmed = window.confirm("削除しますか？");

    if (confirmed) {
      // OKがクリックされた場合の削除処理
      try {
        const db = getFirestore();
        const reviewsCollection = collection(db, "reviews");
        await deleteDoc(doc(reviewsCollection, reviewId));

        // 削除後に口コミを再取得するなどの処理を追加
        fetchReviews();
      } catch (error) {
        console.error("削除エラー:", error.message);
      }
    } else {
      // キャンセルがクリックされた場合の処理（オプション）
      // 何も行わないか、必要に応じてメッセージを表示するなど
    }
  };

  return (
    <div style={bodyStyle}>
      {isDetailVisible ? (
        // 詳細情報を表示
        <div className="ArtistDetail">
          <div className="bodyCon">
            <div className="smartphone">
              <div className="TopTracksContainer">
                <div className="left-align">
                  <h4 className="ninnki">{artistDetail.name}の人気曲</h4>
                  <ol>
                    {popularTracks.slice(0, 10).map((track, index) => (
                      <li key={track.id}>
                        <span className="SearchSpan">{index + 1}</span>
                        {track.name}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="LeftCon">
                <img
                  className="artistPic"
                  src={artistDetail.images[0].url}
                  alt="artistPic"
                />
                <h3>{artistDetail.name}</h3>
                <div className="artistCon">
                  <p className="searchP">
                    ジャンル: {artistDetail.genres.join("♢")}
                  </p>
                  <p className="searchP">
                    spotifyでのフォロワー数: {artistDetail.followers.total}
                  </p>
                  <p className="searchP">
                    アーティストの人気度: {artistDetail.popularity} / 100
                  </p>
                </div>

                {bgmPreviewUrl ? (
                  <div className="artistCon">
                    {albumName === trackName ? (
                      <p className="searchP">曲名 : {trackName}</p>
                    ) : (
                      <>
                        <p className="searchP">アルバム: {albumName}</p>
                        <p className="searchP">曲名 : {trackName}</p>
                      </>
                    )}
                    <p className="searchP">リリース日: {releaseDate}</p>
                    <div className="BgmLike">
                      <div className="PlayBtTop">
                        <button className="playBt" onClick={togglePlayback}>
                          {isPlaying ? "Stop BGM" : "Play BGM"}
                        </button>
                      </div>

                      <div className="LikeButtonContainer">
                        <LikeButton
                          isLiked={isArtistLiked(
                            artistInfo ? artistInfo.name : ""
                          )}
                          onClick={handleLikeClick}
                        />
                        <p className="TotalLikes">: {`${totalLikes}`} Like</p>
                      </div>
                    </div>
                    <button className="SearchBack" onClick={handleBack}>
                      ◀ 戻る
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="LikeButtonContainer">
                      <LikeButton
                        isLiked={isArtistLiked(
                          artistInfo ? artistInfo.name : ""
                        )}
                        onClick={handleLikeClick}
                      />
                      <p className="TotalLikes">: {`${totalLikes}`} Like</p>
                    </div>
                    <button className="SearchBack" onClick={handleBack}>
                      ◀ 戻る
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="RightCon">
              {reviews.length > 0 ? (
                <div className="kuchikomi">
                  {reviews
                    .sort((a, b) => a.timestamp - b.timestamp) // timestampが古い順にソート
                    .map((review) => (
                      <div key={review.id} className="minmiru">
                        <div className="userContainer">
                          <img
                            className="userIcon"
                            src={review.userIcon}
                            alt="userIcon"
                          />
                          <p className="userName">{review.userName}</p>
                          <p className="postTime">
                            {calculateElapsedTime(review.timestamp) ===
                            "1分未満" ? (
                              <span>
                                {calculateElapsedTime(review.timestamp)}
                              </span>
                            ) : (
                              <span>
                                {calculateElapsedTime(review.timestamp)}前
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="PDel">
                          <p className="minmiruP">{review.content}</p>
                          {user && review.userID === user.uid && (
                            <button onClick={() => deleteReview(review.id)}>
                              ︙
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="kuchikomi">
                  <p className="kuchikomiZero">口コミがありません</p>
                </div>
              )}

              <div className="KuchikomiSearch">
                <input
                  className="KakikomiTx"
                  value={newReviewInput}
                  onChange={(e) => setNewReviewInput(e.target.value)}
                  placeholder="すてきな口コミを書く"
                  onKeyDown={handleReviewKeyDown}
                />
                <button className="KakikomiBt" onClick={postReview}>
                  書き込む
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // アーティスト一覧を表示
        <div>
          <header className="SearchResultCon">
            <div className="leftButtons">
              <input
                className="SearchTx"
                type="text"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="アーティスト名か曲名で検索"
              />
              <button className="SearchBt" onClick={handleSearch}>
                Search
              </button>
            </div>
            <div className="rightButtons">
              <img
                className="BackHomeBt"
                onClick={() => (window.location.href = "/Home")}
                src={isHovered ? SearchHome : MigiYagi}
                alt=""
                style={{
                  cursor: "pointer",
                  transform: isHovered ? "scale(1.2)" : "scale(1.2)",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
            </div>
          </header>

          <div className="TopCon">
            <div className="AllCon">
              {searchResults.map((result) => (
                <div key={result.id} className="bodyCon">
                  <div className="LeftCon">
                    {result.images && result.images.length > 0 && (
                      <img
                        className="artistPic"
                        src={result.images[0].url}
                        alt="artistPic"
                      />
                    )}
                    <h3>{result.name}</h3>
                    <button
                      className="GoSearch"
                      onClick={() => handleArtistDetail(result)}
                    >
                      詳細へ ▶
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
