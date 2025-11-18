import React, { useEffect, useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { IconButton, Box } from "@mui/material";
import { useSelector } from "react-redux";
import { addFavorite, removeFavorite, getFavorites } from "../utils/favoriteUtils";
import type { RootState } from "../redux/reducers";

interface Props {
  article: any;
}

export default function FavoriteHeart({ article }: Props) {
  const { user } = useSelector((state: RootState) => state.auth);

  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    if (user?.username) {
      const favs = getFavorites(user.username);
      const exists = favs.some((a: any) => a.url === article.url);
      setIsFav(exists);
    }
  }, [user, article.url]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      alert("Please login to add favorites.");
      return;
    }

    if (isFav) {
      removeFavorite(user.username, article.url);
      setIsFav(false);
    } else {
      addFavorite(user.username, article);
      setIsFav(true);
    }
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: 8,
        right: 8,
        zIndex: 10,
        backgroundColor: "rgba(255,255,255,0.85)",
        borderRadius: "50%",
      }}
    >
      <IconButton onClick={toggleFavorite} size="small">
        {isFav ? (
          <FavoriteIcon sx={{ color: "red" }} />
        ) : (
          <FavoriteBorderIcon sx={{ color: "#444" }} />
        )}
      </IconButton>
    </Box>
  );
}
