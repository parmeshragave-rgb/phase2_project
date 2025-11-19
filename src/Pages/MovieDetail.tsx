// src/pages/MovieDetails.tsx
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Chip,
  Toolbar,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export default function MovieDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const movie = state?.movie;

  if (!movie)
    return <Typography>No movie data found.</Typography>;

  return (
    <>
      <Toolbar />

      <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
        <Button
          variant="outlined"
          color="error"
          sx={{ mb: 3 }}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>

        <Typography variant="h4" fontWeight="bold">
          {movie.display_title}
        </Typography>

        <Typography variant="h6" sx={{ mt: 1 }}>
          {movie.headline}
        </Typography>

        <img
          src={movie.multimedia?.src}
          style={{ width: "100%", borderRadius: 10, marginTop: 20 }}
        />

        <Chip label={`Rating: ${movie.mpaa_rating || "NR"}`} sx={{ mt: 2 }} />

        <Typography sx={{ mt: 3, lineHeight: 1.8 }}>
          {movie.summary_short}
        </Typography>

        <Button
          variant="contained"
          sx={{ mt: 4, bgcolor: "#c00707" }}
          endIcon={<OpenInNewIcon />}
          onClick={() => window.open(movie.link.url, "_blank")}
        >
          Read Full Review at NYT
        </Button>
      </Box>
    </>
  );
}
