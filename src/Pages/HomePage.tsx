
import React,{ useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Divider,
  Toolbar,
  Button,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "../redux/index";
import {
  fetchTopStories,
  fetchSectionStories,
  fetchPopularStories,
} from "../redux/home/HomeActions";

import FavoriteHeart from "../Components/FavoriteHeart";
import SkeletonCard from "../Components/SkeletonCard";

const FALLBACK_IMAGE =
  "https://via.placeholder.com/300x200.png?text=No+Image";

const SECTIONS = ["world", "technology"];

function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { topStories, sectionStories, popularStories } = useSelector(
    (state: RootState) => state.news
  );

  const loading =
    topStories.length === 0 ||
    popularStories.length === 0 ||
    Object.keys(sectionStories).length === 0;

  useEffect(() => {
    dispatch(fetchTopStories() as any);
    dispatch(fetchSectionStories(SECTIONS) as any);
    dispatch(fetchPopularStories() as any);
  }, []);

  // ---------------- MAIN CARD ----------------
  const MainCard = ({ article }: any) => {
    const img =
      article?.multimedia?.[0]?.url ||
      article?.media?.[0]?.["media-metadata"]?.[2]?.url ||
      FALLBACK_IMAGE;

    return (
      <Card
        sx={{
          display: "flex",
          width: { xs: "330px", md: "800px" },
          height: { xs: "140px", md: "160px" },
          mb: 2,
          borderRadius: 2,
          position: "relative",
        }}
      >
        <Box
          sx={{ display: "flex", cursor: "pointer", width: "100%" }}
          onClick={() => navigate("/article", { state: { article } })}
        >
          <FavoriteHeart article={article} />
          <CardMedia
            component="img"
            image={img}
            sx={{
              width: { xs: "110px", sm: "140px", md: "170px" },
              minWidth: { xs: "110px", sm: "140px", md: "170px" },
              height: "100%",
              objectFit: "cover",
              borderRadius: "8px 0 0 8px",
            }}
          />

          <CardContent sx={{ overflow: "hidden", p: { xs: 1, md: 2 } }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                fontSize: { xs: "13px", sm: "15px", md: "17px" },
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {article?.title || article?.headline?.main}
            </Typography>

            <Typography
              variant="body2"
              mt={1}
              sx={{
                fontSize: { xs: "11px", sm: "13px", md: "14px" },
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {article?.abstract}
            </Typography>
          </CardContent>
        </Box>
      </Card>
    );
  };

  // ---------------- POPULAR CARD ----------------
  const PopularCard = ({ article }: any) => {
    const img =
      article.media?.[0]?.["media-metadata"]?.[2]?.url ||
      article.multimedia?.[0]?.url ||
      FALLBACK_IMAGE;

    return (
      <Card
        sx={{
          width: { xs: "330px", sm: "300px", md: "350px" },
          mb: 3,
          borderRadius: 2,
          position: "relative",
          display: "flex",
          flexDirection: { xs: "row", sm: "column", md: "column" },
          overflow: "hidden",
        }}
        onClick={() => navigate("/article", { state: { article } })}
      >
        <FavoriteHeart article={article} />

        <CardMedia
          component="img"
          image={img}
          sx={{
            width: { xs: "45%", sm: "100%", md: "100%" },
            height: { xs: "100%", sm: 120, md: 180 },
            objectFit: "cover",
          }}
        />

        <CardContent sx={{ p: { xs: 1, sm: 1.5, md: 2 } }}>
          <Typography fontWeight="bold">{article.title}</Typography>
        </CardContent>
      </Card>
    );
  };

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Toolbar />
            <Typography variant="h4" mb={2}>
              Top Stories
            </Typography>

            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard
                key={i}
                variant="vertical"
                sx={{
                  width: { xs: "330px", md: "800px" },
                  height: { xs: "140px", md: "160px" },
                  mb: 2,
                }}
              />
            ))}
          </Grid>

          <Grid item xs={12} md={4}>
            <Toolbar />
            <Typography variant="h5" mb={2}>
              Most Popular
            </Typography>

            {[1, 2, 3, 4, 5].map((i) => (
              <SkeletonCard
                key={i}
                variant="vertical"
                sx={{
                  width: { xs: "330px", sm: "300px", md: "350px" },
                  mb: 3,
                }}
              />
            ))}
          </Grid>
        </Grid>
      </Box>
    );
  }

  // ---------------- UI ----------------
  return (
    <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
      <Grid container spacing={4}>
        {/* LEFT COLUMN */}
        <Grid item xs={12} md={8}>
          <Toolbar />

          {/* TOP STORIES */}
          <Typography variant="h4" mb={2}>
            Top Stories
          </Typography>

          {topStories.map((a) => (
            <MainCard key={a.url} article={a} />
          ))}

          <Divider sx={{ my: 4 }} />

          {/* --- SECTION STORIES (WORLD, TECHNOLOGY) --- */}
          {SECTIONS.map(
            (sec) =>
              sectionStories[sec] && (
                <Box key={sec} sx={{ mb: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{ textTransform: "capitalize" }}
                    >
                      {sec}
                    </Typography>

                    {/* SEE MORE BUTTON */}
                    <Button
                      onClick={() => navigate(`/category/${sec}`)}
                      sx={{
                        textTransform: "none",
                        color: "#c00707",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      See more →
                    </Button>
                  </Box>

                  {/* Show first 5 only */}
                  {sectionStories[sec].slice(0, 5).map((a: any) => (
                    <MainCard key={a.url} article={a} />
                  ))}
                </Box>
              )
          )}
        </Grid>

        {/* RIGHT COLUMN */}
        <Grid item xs={12} md={4} sx={{ position: "sticky", top: 80 }}>
          <Toolbar />
          <Typography variant="h5" mb={2}>
            Most Popular
          </Typography>

          {popularStories.map((p) => (
            <PopularCard key={p.url} article={p} />
          ))}
        </Grid>
      </Grid>
    </Box>
  );
}

export default HomePage;
