// import React, { useState, useEffect } from "react";
// import MigiYagi from "../images/MigiYagi.png";
// import SearchHome from "../images/HomeLogo.png";
// import axios from "axios";
// import "./SearchStyle.css";
// import {
//   getFirestore,
//   collection,
//   addDoc,
//   getDocs,
//   query,
//   where,
// } from "firebase/firestore";
// import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
// import { formatDistanceToNow, format } from "date-fns";
// import { ja } from "date-fns/locale";
// import jaLocale from "date-fns/locale/ja";

// const Search = () => {
//   const [artistName, setArtistName] = useState("");
//   const [artistInfo, setArtistInfo] = useState(null);
//   const [bgmPreviewUrl, setBgmPreviewUrl] = useState("");
//   const [trackName, setTrackName] = useState("");
//   const [audio, setAudio] = useState(new Audio());
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [albumName, setAlbumName] = useState("");
//   const [releaseDate, setReleaseDate] = useState("");
//   const [reviews, setReviews] = useState([]);
//   const [newReviewInput, setNewReviewInput] = useState("");
//   const [userDisplayName, setUserDisplayName] = useState("Anonymous");
//   const [userProfileImage, setUserProfileImage] = useState("");

//   const [isHovered, setIsHovered] = useState(false);

//   const handleMouseEnter = () => {
//     setIsHovered(true);
//   };

//   const handleMouseLeave = () => {
//     setIsHovered(false);
//   };

//   const calculateElapsedTime = (timestamp) => {
//     return formatDistanceToNow(timestamp.toDate(), { locale: jaLocale });
//   };

//   useEffect(() => {
//     const auth = getAuth();
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setUserDisplayName(user.displayName || "Anonymous");

//         if (
//           user.providerData &&
//           user.providerData[0]?.providerId === "google.com"
//         ) {
//           setUserProfileImage(user.photoURL);
//         }
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const handleSearch = async () => {
//     try {
//       stopBGM();
//       const accessToken = await getAccessToken();
//       const response = await searchArtist(artistName, accessToken);
//       setArtistInfo(response.data.artists.items[0]);
//       const topTracksResponse = await getTopTracks(
//         response.data.artists.items[0].id,
//         accessToken
//       );
//       if (topTracksResponse) {
//         setBgmPreviewUrl(topTracksResponse.tracks[0].preview_url);
//         setAlbumName(topTracksResponse.tracks[0].album.name);
//         setReleaseDate(topTracksResponse.tracks[0].album.release_date);
//         setTrackName(topTracksResponse.tracks[0].name);
//       }
//       setReviews([]);
//     } catch (error) {
//       console.error("アーティスト情報の取得エラー:", error.message);
//     }
//   };

//   const getTopTracks = async (artistId, token) => {
//     try {
//       const response = await axios.get(
//         `https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=US`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const topTracks = response.data.tracks;

//       if (topTracks.length > 0) {
//         const firstTrack = topTracks[0];
//         const albumName = firstTrack.album.name;
//         const trackName = firstTrack.name;

//         return response.data;
//       } else {
//         throw new Error("No top tracks available for this artist.");
//       }
//     } catch (error) {
//       throw new Error("Error fetching top tracks:", error.message);
//     }
//   };

//   const playBGM = () => {
//     if (bgmPreviewUrl && bgmPreviewUrl !== "null") {
//       audio.src = bgmPreviewUrl;
//       audio
//         .play()
//         .then(() => {
//           console.log("BGM is playing:", bgmPreviewUrl);
//           setIsPlaying(true);
//         })
//         .catch((error) => {
//           console.error("Error playing BGM:", error);
//         });

//       audio.addEventListener("ended", handleBGMEnded);
//     } else {
//       console.warn("No preview available for this track.");
//     }
//   };

//   const handleBGMEnded = () => {
//     setIsPlaying(false);
//   };

//   const stopBGM = () => {
//     audio.pause();
//     setIsPlaying(false);
//     audio.removeEventListener("ended", handleBGMEnded);
//   };

//   const togglePlayback = () => {
//     if (audio.paused) {
//       playBGM();
//     } else {
//       stopBGM();
//     }
//   };

//   const handleKeyDown = (event) => {
//     if (event.key === "Enter") {
//       if (event.shiftKey) {
//         // Shift + Enterの場合は改行
//       } else {
//         handleSearch();
//         postReview();
//       }
//     }
//   };

//   const handleReviewKeyDown = (event) => {
//     if (event.key === "Enter" && event.shiftKey) {
//       const textarea = event.target;
//       const value = textarea.value;
//       const selectionStart = textarea.selectionStart;
//       const selectionEnd = textarea.selectionEnd;

//       const newValue =
//         value.substring(0, selectionStart) +
//         "\n" +
//         value.substring(selectionEnd);

//       setNewReviewInput(newValue);

//       event.preventDefault();
//     } else if (event.key === "Enter") {
//       postReview();
//     }
//   };

//   function DisplayReview({ content, timestamp }) {
//     const elapsed = formatDistanceToNow(new Date(timestamp.toDate()), {
//       locale: ja,
//     });

//     const formattedContent = content.split("\n").map((line, index) => (
//       <React.Fragment key={index}>
//         {line}
//         {index !== content.length - 1 && <br />}
//       </React.Fragment>
//     ));

//     return (
//       <div>
//         <div dangerouslySetInnerHTML={{ __html: formattedContent.join("") }} />
//         <p>{elapsed}</p>
//       </div>
//     );
//   }

//   const getAccessToken = async () => {
//     const clientId = process.env.REACT_APP_CLIENT_ID;
//     const clientSecret = process.env.REACT_APP_CLIENT_SERECT;

//     try {
//       const response = await axios.post(
//         "https://accounts.spotify.com/api/token",
//         "grant_type=client_credentials",
//         {
//           headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//             Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
//           },
//         }
//       );

//       return response.data.access_token;
//     } catch (error) {
//       throw new Error("アクセストークンの取得エラー");
//     }
//   };

//   const searchArtist = async (name, token) => {
//     return axios.get(
//       `https://api.spotify.com/v1/search?q=${name}&type=artist`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//   };

//   const fetchReviews = async () => {
//     if (!artistInfo) {
//       setReviews([]);
//       return;
//     }

//     const db = getFirestore();
//     const reviewsCollection = collection(db, "reviews");

//     const artistQuery = query(
//       reviewsCollection,
//       where("artistName", "==", artistInfo.name)
//     );

//     try {
//       const querySnapshot = await getDocs(artistQuery);
//       const reviewsData = [];
//       querySnapshot.forEach((doc) => {
//         reviewsData.push({ id: doc.id, ...doc.data() });
//       });
//       setReviews(reviewsData);
//     } catch (error) {
//       console.error("口コミの取得エラー:", error.message);
//     }
//   };

//   const postReview = async () => {
//     if (newReviewInput.trim() === "") {
//       return;
//     }

//     const auth = getAuth();
//     const user = auth.currentUser;

//     if (!user) {
//       await signInAnonymously(auth);
//     }

//     const db = getFirestore();
//     const reviewsCollection = collection(db, "reviews");
//     const timestamp = new Date();

//     try {
//       await addDoc(reviewsCollection, {
//         userID: user ? user.uid : "anonymous",
//         userName: user ? user.displayName || "Anonymous" : "Anonymous",
//         userIcon: userProfileImage || "",
//         content: newReviewInput.replace(/\n/g, "<br>"),
//         timestamp: timestamp,
//         rating: 5,
//         artistName: artistInfo ? artistInfo.name : "",
//       });

//       setNewReviewInput("");
//       fetchReviews();
//     } catch (error) {
//       console.error("レビューの追加エラー:", error.message);
//     }
//   };

//   useEffect(() => {
//     fetchReviews();
//   }, [artistInfo]);

//   return (
//     <div>
//       <div className="SearchResultCon">
//         <div className="leftButtons">
//           <input
//             className="SearchTx"
//             type="text"
//             value={artistName}
//             onChange={(e) => setArtistName(e.target.value)}
//             onKeyDown={handleKeyDown}
//             placeholder="アーティスト名か曲名で検索"
//           />
//           <button className="SearchBt" onClick={handleSearch}>
//             Search
//           </button>
//         </div>
//         <div className="rightButtons">
//           <img
//             className="BackHomeBt"
//             onClick={() => (window.location.href = "/Home")}
//             src={isHovered ? SearchHome : MigiYagi}
//             alt=""
//             style={{
//               cursor: "pointer",
//               transform: isHovered ? "scale(1.2)" : "scale(1)",
//               transition: "transform 0.3s ease",
//             }}
//             onMouseEnter={handleMouseEnter}
//             onMouseLeave={handleMouseLeave}
//           />
//         </div>
//       </div>

//       <div className="bodyCon">
//         <div className="LeftCon">
//           {artistInfo && (
//             <div className="bodyCon">
//               <div>
//                 <img
//                   className="artistPic"
//                   src={artistInfo.images[0].url}
//                   alt="artistPic"
//                 />
//                 <h3>{artistInfo.name}</h3>
//                 <p className="searchP">
//                   ジャンル: {artistInfo.genres.join(" | ")}
//                 </p>
//                 <p className="searchP">
//                   spotifyでのフォロワー数: {artistInfo.followers.total}
//                 </p>
//                 <p className="searchP">
//                   アーティストの人気度: {artistInfo.popularity} / 100
//                 </p>

//                 {bgmPreviewUrl && (
//                   <div>
//                     {albumName === trackName ? (
//                       <p className="searchP">曲名 : {trackName}</p>
//                     ) : (
//                       <>
//                         <p className="searchP">アルバム: {albumName}</p>
//                         <p className="searchP">曲名 : {trackName}</p>
//                       </>
//                     )}
//                     <p className="searchP">リリース日: {releaseDate}</p>
//                     <button className="playBt" onClick={togglePlayback}>
//                       {isPlaying ? "Stop BGM" : "Play BGM"}
//                     </button>
//                   </div>
//                 )}
//               </div>
//               <div className="RightCon">
//                 <div className="kuchikomi">
//                   {reviews.map((review) => (
//                     <div key={review.id} className="minmiru">
//                       <div className="userContainer">
//                         <img
//                           className="userIcon"
//                           src={review.userIcon}
//                           alt="userIcon"
//                         />
//                         <p className="userName">{review.userName}</p>
//                         <p className="postTime">
//                         {calculateElapsedTime(review.timestamp) === '1分未満' ? (
//                             <span>{calculateElapsedTime(review.timestamp)}</span>
//                           ) : (
//                             <span>{calculateElapsedTime(review.timestamp)}前</span>
//                           )}
//                         </p>
//                       </div>
//                       <p className="minmiruP">{review.content}</p>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="KuchikomiSearch">
//                   <input
//                     className="KakikomiTx"
//                     value={newReviewInput}
//                     onChange={(e) => setNewReviewInput(e.target.value)}
//                     placeholder="すてきなコメントを書く"
//                     onKeyDown={handleReviewKeyDown}
//                   />
//                   <button className="KakikomiBt" onClick={postReview}>
//                     書き込む
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Search;

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
      const response = await searchArtist(artistName, accessToken);
      setArtistInfo(response.data.artists.items[0]);
      const topTracksResponse = await getTopTracks(
        response.data.artists.items[0].id,
        accessToken
      );
      if (topTracksResponse) {
        setBgmPreviewUrl(topTracksResponse.tracks[0].preview_url);
        setAlbumName(topTracksResponse.tracks[0].album.name);
        setReleaseDate(topTracksResponse.tracks[0].album.release_date);
        setTrackName(topTracksResponse.tracks[0].name);
        setPopularTracks(topTracksResponse.tracks);
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

  return (
    <div>
      <div className="SearchResultCon">
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
              transform: isHovered ? "scale(1.2)" : "scale(1)",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        </div>
      </div>

      <div className="bodyCon">
        <div className="LeftCon">
          {artistInfo && (
            <div className="bodyCon">
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
                <p className="searchP">
                  spotifyでのフォロワー数: {artistInfo.followers.total}
                </p>
                <p className="searchP">
                  アーティストの人気度: {artistInfo.popularity} / 100
                </p>

                {bgmPreviewUrl && (
                  <div>
                    {albumName === trackName ? (
                      <p className="searchP">曲名 : {trackName}</p>
                    ) : (
                      <>
                        <p className="searchP">アルバム: {albumName}</p>
                        <p className="searchP">曲名 : {trackName}</p>
                      </>
                    )}
                    <p className="searchP">リリース日: {releaseDate}</p>
                    <button className="playBt" onClick={togglePlayback}>
                      {isPlaying ? "Stop BGM" : "Play BGM"}
                    </button>

                    <div className="TopTracksContainer">
                      <div className="left-align">
                        <h4>人気曲</h4>
                        <ul>
                          {popularTracks.map((track) => (
                            <li key={track.id}>{track.name}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="RightCon">
                <div className="kuchikomi">
                  {reviews.map((review) => (
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
                      <p className="minmiruP">{review.content}</p>
                    </div>
                  ))}
                </div>

                <div className="KuchikomiSearch">
                  <input
                    className="KakikomiTx"
                    value={newReviewInput}
                    onChange={(e) => setNewReviewInput(e.target.value)}
                    placeholder="すてきなコメントを書く"
                    onKeyDown={handleReviewKeyDown}
                  />
                  <button className="KakikomiBt" onClick={postReview}>
                    書き込む
                  </button>
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
