import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./NakasoneStyle.css";
import MigiYagi from "../images/MigiYagi.png";
import SearchHome from "../images/HomeLogo.png";

const NakasoneRoom = () => {
  const [likedArtists, setLikedArtists] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    const fetchLikedArtists = async () => {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const db = getFirestore();
          const likesCollection = collection(db, "likes");

          const likedArtistsQuery = query(
            likesCollection,
            where("userId", "==", user.uid),
            where("liked", "==", true)
          );

          try {
            const querySnapshot = await getDocs(likedArtistsQuery);
            const likedArtistsData = [];
            querySnapshot.forEach((doc) => {
              likedArtistsData.push(doc.data().artistName);
            });

            console.log("Liked Artists Data:", likedArtistsData);

            // ここでLiked Artists Dataからアーティスト画像を取得する処理を呼び出す
            fetchArtistImages(likedArtistsData);
          } catch (error) {
            console.error("Error fetching liked artists:", error.message);
          }
        }
      });
    };

    fetchLikedArtists();
  }, []);

  const fetchArtistImages = async (likedArtistsData) => {
    const clientId = process.env.REACT_APP_CLIENT_ID;
    const clientSecret = process.env.REACT_APP_CLIENT_SERECT;

    const tokenEndpoint = "https://accounts.spotify.com/api/token";
    const artistEndpoint = "https://api.spotify.com/v1/artists";

    const tokenResponse = await axios.post(
      tokenEndpoint,
      new URLSearchParams({
        grant_type: "client_credentials",
      }),
      {
        headers: {
          Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    const promises = likedArtistsData.map(async (artistName) => {
      const artistSearchResponse = await axios.get(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          artistName
        )}&type=artist&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const artists = artistSearchResponse.data.artists.items;

      if (artists.length > 0) {
        const artistId = artists[0].id;

        const artistDetailResponse = await axios.get(
          `${artistEndpoint}/${artistId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        console.log("Artist Detail Response:", artistDetailResponse.data);

        if (artistDetailResponse.data.images.length > 0) {
          return {
            artistName,
            artistImageURL: artistDetailResponse.data.images[0].url,
          };
        } else {
          return null;
        }
      } else {
        return null;
      }
    });

    const artistDetails = await Promise.all(promises);
    setLikedArtists(artistDetails.filter((artist) => artist !== null));
  };

  return (
    <div className="container">
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
      <h2>いいねしたアーティスト一覧</h2>
      <div>
        {likedArtists.map((artist) => (
          <div key={artist.artistName} className="artist-container">
            <img
              src={artist.artistImageURL}
              alt={artist.artistName}
              className="artist-image"
            />
            <span className="artist-name1">{artist.artistName}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NakasoneRoom;
