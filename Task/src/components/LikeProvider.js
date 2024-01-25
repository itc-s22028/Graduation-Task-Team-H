// // LikeProvider.js
// import React, { createContext, useContext, useEffect, useState } from "react";

// const LikeContext = createContext();

// export const LikeProvider = ({ children, userId }) => {
//   // ユーザーごとに一意なキーを生成
//   const storageKey = `likedArtists_${userId}`;

//   const [likedArtists, setLikedArtists] = useState(
//     JSON.parse(localStorage.getItem(storageKey)) || []
//   );

//   useEffect(() => {
//     localStorage.setItem(storageKey, JSON.stringify(likedArtists));
//   }, [likedArtists, storageKey]);

//   const addLikedArtist = (artistName) => {
//     setLikedArtists((prevLikedArtists) => [...prevLikedArtists, artistName]);
//   };

//   const removeLikedArtist = (artistName) => {
//     setLikedArtists((prevLikedArtists) =>
//       prevLikedArtists.filter((name) => name !== artistName)
//     );
//   };

//   const isArtistLiked = (artistName) => {
//     return likedArtists.includes(artistName);
//   };

//   return (
//     <LikeContext.Provider
//       value={{
//         likedArtists,
//         addLikedArtist,
//         removeLikedArtist,
//         isArtistLiked: (artistName) => likedArtists.includes(artistName),
//       }}
//     >
//       {children}
//     </LikeContext.Provider>
//   );
// };

// export const useLikeContext = () => {
//   return useContext(LikeContext);
// };
