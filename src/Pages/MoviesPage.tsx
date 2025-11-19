// src/pages/MoviesPage.tsx
import { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Toolbar,
  Pagination,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux";
import { fetchAllMovies } from "../redux/movies/MoviesActions";

import { useNavigate } from "react-router-dom";
import SkeletonCard from "../Components/SkeletonCard";

const FALLBACK_IMAGE = "https://placehold.co/600x400?text=No+Image";

function getImage(movie: any) {
  return movie?.multimedia?.src || movie?.multimedia?.url || FALLBACK_IMAGE;
}

export default function MoviesPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { movies, loading } = useSelector((state: RootState) => state.movies);

  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  useEffect(() => {
    dispatch(fetchAllMovies() as any);
  }, [dispatch]);

  const totalPages = Math.ceil(movies.length / PER_PAGE);
  const pageItems = movies.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  if (loading)
    return (
      <>
        <Toolbar />
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <SkeletonCard variant="vertical" height={330} width="280px" />
              </Grid>
            ))}
          </Grid>
        </Box>
      </>
    );

  return (
    <>
      <Toolbar />

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h4"
            sx={{ mb: 2, fontFamily: "sans-serif", fontWeight: "bold", textAlign: "center" }}
          >
            NYT Movie Reviews
          </Typography>

          <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
            {pageItems.map((movie: any) => (
              <Grid item xs={12} sm={6} md={3} key={movie.display_title}>
                <Card
                  sx={{ cursor: "pointer", borderRadius: 2, height: 330, width: 280 }}
                  onClick={() =>
                    navigate(`/movie/${encodeURIComponent(movie.display_title)}`, {
                      state: { movie },
                    })
                  }
                >
                  <CardMedia
                    component="img"
                    image={getImage(movie)}
                    sx={{ height: 200, objectFit: "cover" }}
                  />

                  <CardContent>
                    <Typography
                      fontWeight="bold"
                      sx={{
                        fontSize: { xs: "14px", md: "16px" },
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {movie.display_title}
                    </Typography>

                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {movie.byline}
                    </Typography>

                    <Typography variant="caption" color="textSecondary">
                      Rated: {movie.mpaa_rating || "NR"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* PAGINATION */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, v) => setPage(v)}
              color="error"
            />
          </Box>
        </Box>
      </Box>
    </>
  );
}
