import React, { createContext, useContext, useEffect, useState } from "react";

const LikeContext = createContext();

export const LikeProvider = ({ children }) => {
  const [likedArtists, setLikedArtists] = useState(
    JSON.parse(localStorage.getItem("likedArtists")) || []
  );

  useEffect(() => {
    localStorage.setItem("likedArtists", JSON.stringify(likedArtists));
  }, [likedArtists]);

  const addLikedArtist = (artistName) => {
    setLikedArtists((prevLikedArtists) => [...prevLikedArtists, artistName]);
  };

  const removeLikedArtist = (artistName) => {
    setLikedArtists((prevLikedArtists) =>
      prevLikedArtists.filter((name) => name !== artistName)
    );
  };

  const isArtistLiked = (artistName) => {
    return likedArtists.includes(artistName);
  };

  return (
    <LikeContext.Provider
      value={{ likedArtists, addLikedArtist, removeLikedArtist, isArtistLiked }}
    >
      {children}
    </LikeContext.Provider>
  );
};

export const useLikeContext = () => {
  return useContext(LikeContext);
};
