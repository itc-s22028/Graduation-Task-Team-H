import React, { useState, useEffect } from "react";
import MigiYagi from "../images/MigiYagi.png";
import SearchHome from "../images/HomeLogo.png";
import axios from "axios";
import "./MusicSearch.css";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { formatDistanceToNow, format } from "date-fns";
import { ja } from "date-fns/locale";
import jaLocale from "date-fns/locale/ja";

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
  const [searchResults, setSearchResults] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const calculateElapsedTime = (timestamp) => {
    return formatDistanceToNow(timestamp.toDate(), { locale: jaLocale });
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
      stopBGM();
      const accessToken = await getAccessToken();
      
      // artistNameの値をセット
      setArtistName(trackName);
      
      const response = await searchArtist(artistName, accessToken);
      const topTracksResponse = await getTopTracks(
        response.data.artists.items[0].id,
        accessToken
      );
  
      if (topTracksResponse) {
        // ...
      }
      setReviews([]);
    } catch (error) {
      console.error("アーティスト情報の取得エラー:", error.message);
    }
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
  }, [artistInfo]);

  const handleTrackSelection = (track) => {
    // 選択された曲をstateにセット
    setSelectedTrack(track);

    // 他に何か処理が必要ならここに追加
  };

  const bodyStyle = artistInfo
    ? {
        backgroundImage: `url(${artistInfo.images[0].url})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'repeat',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backgroundBlendMode: 'lighten',
        height: '100vh',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundSize: '100px'
      }
    : {};

  return (
    <div style={bodyStyle}>
      <header className="SearchResultCon">
        <input
          className="SearchTx"
          type="text"
          value={trackName}
          onChange={(e) => setTrackName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="曲名で検索"
        />
        <button className="SearchBt" onClick={handleSearch}>
          Search by Track
        </button>
      </header>

      <div className="TopCon">
        <div className="AllCon">
          {searchResults.length > 0 && (
            <div className="SearchResults">
              <h4 className="SearchResultsH4">曲名の候補：</h4>
              <ul>
                {searchResults.map((result) => (
                  <li key={result.id} onClick={() => handleTrackSelection(result)}>
                    {result.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedTrack && (
            <div className="bodyCon">
              <h2>{selectedTrack.name}</h2>
              <p>アーティスト: {selectedTrack.artists.map(artist => artist.name).join(", ")}</p>
              <p>アルバム: {selectedTrack.album.name}</p>
              <p>リリース日: {selectedTrack.album.release_date}</p>
              {/* 他に表示したい情報があれば追加 */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
