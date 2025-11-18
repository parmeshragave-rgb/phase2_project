import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Toolbar,
  Button
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getFavorites, removeFavorite } from "../utils/favoriteUtils";
import type { RootState } from "../redux/reducers";

const FALLBACK_IMAGE = "https://via.placeholder.com/600x400.png?text=No+Image";

export default function Favorites() {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    if (user?.username) {
      const favs = getFavorites(user.username);
      setFavorites(favs);
    }
  }, [user]);

  const handleRemove = (url: string) => {
    if (!user) return;
    removeFavorite(user.username, url);
    setFavorites(getFavorites(user.username));
  };

  if (!user)
    return (
      <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              textAlign: 'center',
              mt:"200px"
            }}
          >
            <Toolbar/>
            <Typography
              variant="h4"
              sx={{
                fontFamily: 'sans-serif',
                fontWeight: 'bold',
                color: '#b31b1b93',
              }}
            >
        Please login to view your favorites.
              
            </Typography>
            
            <Button variant="contained" sx={{bgcolor: "#c00707ff",
                  color: "whitesmoke",
                  fontWeight: "bold",
                  mt:"10px"}}
                  onClick={() => navigate("/login")}
                  >Go to Login</Button>
            
          </Box>
    );

  return (
    <Box sx={{ p: 3, mt: 8 }}>
      <Typography variant="h4" mb={2}>
        Your Favorites
      </Typography>

      {favorites.length === 0 ? (
        <Typography>No favorites added yet.</Typography>
      ) : (
        <Grid container spacing={3}>
          {favorites.map((article) => {
            const image =
              article.multimedia?.[0]?.url ||
              article.media?.[0]?.["media-metadata"]?.[2]?.url ||
              article.image ||
              FALLBACK_IMAGE;

            return (
              <Grid item xs={12} sm={6} md={4} key={article.url}>
                <Card
                  sx={{
                    cursor: "pointer",
                    position: "relative",
                    borderRadius: 2,
                    overflow: "hidden",
                    width:"600px"
                  }}
                  onClick={() => navigate("/article", { state: { article } })}
                >
                  <CardMedia
                    component="img"
                    image={image}
                    height="180"
                    sx={{ objectFit: "cover" }}
                  />

                  <CardContent>
                    <Typography fontWeight="bold">
                      {article.title || article.headline?.main}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        mt: 1
                      }}
                    >
                      {article.abstract || article.snippet}
                    </Typography>
                  </CardContent>

                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      bgcolor: "white"
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(article.url);
                    }}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}
