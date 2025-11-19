import React from "react";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Paper,
  InputAdornment,
  IconButton,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Collapse,
  Pagination,
  Snackbar,
} from "@mui/material";

import SkeletonCard from "../Components/SkeletonCard";
import FavoriteHeart from "../Components/FavoriteHeart";

import ClearIcon from "@mui/icons-material/Clear";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import SearchIcon from "@mui/icons-material/Search";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchSearchArticles } from "../redux/search/SearchActions";
import type { RootState } from "../redux/index";

const FALLBACK_IMAGE = "https://placehold.co/900x500?text=No+Image";
const TOPICS = ["Arts", "Business", "Politics", "Science", "Technology", "World"];
const KEYWORDS = ["Opinion", "Health", "Travel", "Sports", "Culture"];

function getImage(article: any) {
  const mm = article.multimedia;
  let raw =
    (Array.isArray(mm) && mm[0]?.url) ||
    mm?.default?.url ||
    mm?.thumbnail?.url ||
    article.media?.[0]?.["media-metadata"]?.slice(-1)?.[0]?.url ||
    null;

  if (!raw) return FALLBACK_IMAGE;
  if (/^https?:\/\//i.test(raw)) return raw;

  return raw.startsWith("/")
    ? `https://www.nytimes.com${raw}`
    : `https://www.nytimes.com/${raw}`;
}

export default function Search() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  
  const [toastOpen, setToastOpen] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  
  const { articles, loading, noResult, totalPages } = useSelector(
    (state: RootState) => state.search
  );

  
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const triggerSearch = useCallback(
    (pageToUse = 1) => {
      if (cooldown) {
        setToastOpen(true);
        return;
      }

      setCooldown(true);
      setTimeout(() => setCooldown(false), 3000);

      dispatch(
        fetchSearchArticles({
          query,
          page: pageToUse,
          topic,
          keywords,
          startDate,
          endDate,
        }) as any
      );
    },
    [dispatch, query, topic, keywords, startDate, endDate, cooldown]
  );

  
  useEffect(() => {
    triggerSearch(page);
  }, [page]);

  
  const debouncedSearch = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      triggerSearch(1);
    }, 700);
  };

  
  useEffect(() => {
    debouncedSearch();
  }, [query]);

  
  useEffect(() => {
    debouncedSearch();
  }, [topic, keywords, startDate, endDate]);


  const handleSearch = () => {
    debouncedSearch();
  };

  const toggleKeyword = (k: string) =>
    setKeywords((prev) =>
      prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]
    );

  const VerticalCard = ({ item }: { item: any }) => (
    <Card
      sx={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "row",
        width: { xs: "380px", md: "800px" },
        height: { xs: "205px", md: "200px" },
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: 3,
      }}
      onClick={() => navigate("/article", { state: { article: item } })}
    >
      <FavoriteHeart article={item} />
      <CardMedia
        component="img"
        image={getImage(item)}
        sx={{
          width: "45%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <CardContent sx={{ flex: 1 }}>
        <Typography fontWeight="bold" sx={{ mb: 1 }}>
          {item.headline?.main}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {item.abstract}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <>
  
      <Snackbar
        open={toastOpen}
        autoHideDuration={2500}
        onClose={() => setToastOpen(false)}
        message="Please wait a few seconds before searching again."
      />

      <Box sx={{ width: "100%", mt: 10 }}>
        
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Box sx={{ width: { xs: "90%", sm: "80%", md: "60%" } }}>
            <Paper
              sx={{
                p: 1.5,
                display: "flex",
                alignItems: "center",
                borderRadius: "50px",
              }}
            >
              <TextField
                fullWidth
                placeholder="Search articles..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment:
                    query && (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => {
                            setQuery("");
                          }}
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "50px",
                    bgcolor: "white",
                    "& fieldset": { border: "none" },
                  },
                }}
              />

              <Button
                variant="contained"
                size="small"
                sx={{
                  ml: 2,
                  bgcolor: "#c00707",
                  "&:hover": { bgcolor: "#a00505" },
                }}
                onClick={handleSearch}
              >
                <SearchIcon />
              </Button>

              <IconButton
                onClick={() => setShowFilters((p) => !p)}
                sx={{ color: "#c00707" }}
              >
                <FilterAltOutlinedIcon />
              </IconButton>
            </Paper>
          </Box>
        </Box>

        
        <Collapse in={showFilters}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Paper sx={{ p: 2, width: { xs: "90%", sm: "80%", md: "60%" } }}>
              <Typography variant="subtitle2">Topic</Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                {TOPICS.map((t) => (
                  <Chip
                    key={t}
                    label={t}
                    color={topic === t ? "error" : "default"}
                    onClick={() => setTopic(topic === t ? "" : t)}
                  />
                ))}
              </Box>

              <Typography variant="subtitle2">Keywords</Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                {KEYWORDS.map((k) => (
                  <Chip
                    key={k}
                    label={k}
                    color={keywords.includes(k) ? "error" : "default"}
                    onClick={() => toggleKeyword(k)}
                  />
                ))}
              </Box>

              <Typography variant="subtitle2">Date Range</Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  type="date"
                  size="small"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="Start"
                />
                <TextField
                  type="date"
                  size="small"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="End"
                />
              </Box>

              <Box sx={{ mt: 2 }}>
                <Button
                  size="small"
                  sx={{
                    border: "1px solid #c00707",
                    color: "#c00707",
                    px: 2,
                    "&:hover": { backgroundColor: "#ffe5e5" },
                  }}
                  onClick={() => {
                    setTopic("");
                    setKeywords([]);
                    setStartDate("");
                    setEndDate("");
                  }}
                >
                  Clear Filters
                </Button>
              </Box>
            </Paper>
          </Box>
        </Collapse>

        
        <Box sx={{ p: 2 }}>
          {loading ? (
            <Grid container spacing={3} justifyContent="center">
              {Array.from({ length: 6 }).map((_, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <SkeletonCard
                    variant="horizontal"
                    height={200}
                    sx={{ width: { xs: "380px", md: "800px" } }}
                  />
                </Grid>
              ))}
            </Grid>
          ) : noResult ? (
            <Typography color="error" textAlign="center">
              No results found
            </Typography>
          ) : (
            <Grid container spacing={3} justifyContent="center">
              {articles.map((a, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <VerticalCard item={a} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        
        {articles.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, v) => setPage(v)}
            />
          </Box>
        )}
      </Box>
    </>
  );
}
