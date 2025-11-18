import React, { useEffect, useState } from "react";
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
  Toolbar,
} from "@mui/material";
import SkeletonCard from "../Components/SkeletonCard";
import FavoriteHeart from "../Components/FavoriteHeart";

import ClearIcon from "@mui/icons-material/Clear";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SearchIcon from '@mui/icons-material/Search';

const API_KEY = import.meta.env?.VITE_NYT_API_KEY || "";
const FALLBACK_IMAGE = "https://placehold.co/900x500?text=No+Image";
const TOPICS = ["Arts", "Business", "Politics", "Science", "Technology", "World"];
const KEYWORDS = ["Opinion", "Health", "Travel", "Sports", "Culture"];

function getImage(article) {
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

  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noResult, setNoResult] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showFilters, setShowFilters] = useState(false);

  const buildFilter = () => {
    const parts = [];
    if (topic) parts.push(`section.name:("${topic}")`);
    if (keywords.length > 0) {
      const f = keywords.map(k => `desk:("${k}")`).join(" OR ");
      parts.push(`(${f})`);
    }
    return parts.join(" AND ") || undefined;
  };

  const fetchArticles = async (pageNum = 1) => {
    setLoading(true);

    const params = {
      "api-key": API_KEY,
      page: pageNum - 1,
      q: query.trim() || " ",
    };

    const fq = buildFilter();
    if (fq) params.fq = fq;

    if (startDate) params.begin_date = startDate.replace(/-/g, "");
    if (endDate) params.end_date = endDate.replace(/-/g, "");
    console.log(startDate)
    try {
      const res = await axios.get(
        "https://api.nytimes.com/svc/search/v2/articlesearch.json",
        { params }
      );

      const docs = res.data.response?.docs || [];
      const hits = res.data.response?.metadata?.hits || 0;

      setArticles(docs);
      setNoResult(docs.length === 0);

      setTotalPages(Math.min(Math.ceil(hits / 10), 100));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(page);
  }, [page]);

  const handleSearch = () => {
    fetchArticles(page);
  };

  const toggleKeyword = (k) => {
    setKeywords(prev =>
      prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]
    );
  };

  const VerticalCard = ({ item }) => {
    return (
      <Card
        sx={{
          cursor: "pointer",
          display: "flex",
          flexDirection: { xs: "row", sm: "row", md: "row" },
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
            width: { xs: "45%", sm: "45%", md: "45%" },
            height: { xs: "100%", sm: "100%", md: "100%" },
            objectFit: "cover",
          }}
        />

        <CardContent sx={{ flex: 1 }}>
          <Typography
            fontWeight="bold"
            sx={{ mb: 1, fontSize: { xs: "0.8rem", md: "1.1rem" } }}
          >
            {item.headline?.main}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: { xs: "0.65rem", md: "0.9rem" },
            }}
          >
            {item.abstract}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <Toolbar />
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
                variant="outlined"
                placeholder="Search articles..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    query && (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => {
                            setQuery("");
                            fetchArticles();
                          }}
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    )
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
                  bgcolor: "#c00707ff",
                  color: "whitesmoke",
                  width: "5px",
                  fontWeight: "bold",
                  "&:hover": { bgcolor: "#a00505" },
                }}
                onClick={handleSearch}
              >
                <SearchIcon />
              </Button>

              <Button
                variant="text"
                sx={{
                  ml: 1,
                  borderColor: "#c00707ff",
                  color: "#c00707ff",
                  fontWeight: "bold",
                  "&:hover": { borderColor: "#a00505", color: "#a00505" },
                }}
                onClick={() => setShowFilters((s) => !s)}
              >
                <FilterAltOutlinedIcon />
              </Button>
            </Paper>
          </Box>
        </Box>

        <Collapse in={showFilters}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Paper sx={{ p: 2, width: { xs: "90%", sm: "80%", md: "60%" } }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Topic
              </Typography>

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

              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Keywords
              </Typography>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {KEYWORDS.map((k) => (
                  <Chip
                    key={k}
                    label={k}
                    color={keywords.includes(k) ? "error" : "default"}
                    onClick={() => toggleKeyword(k)}
                  />
                ))}
              </Box>

              <Typography variant="subtitle2" sx={{ mb: 1, mt: 2 }}>
                Date Range
              </Typography>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <TextField
                  label="Start Date"
                  type="date"
                  size="small"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  color="error"
                />

                <TextField
                  label="End Date"
                  type="date"
                  size="small"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  color="error"

                />
              </Box>

              <Button
                size="small"
                color="error"
                sx={{ mt: 2 }}
                onClick={() => {
                  setTopic("");
                  setKeywords([]);
                  setStartDate("");
                  setEndDate("");
                }}
              >
                Clear Filters
              </Button>
               <Button
                size="small"
                color="error"
                sx={{ mt: 2 ,ml:2}}
                onClick={handleSearch}
              >
                Apply Filters
              </Button>
            </Paper>
          </Box>
        </Collapse>

        <Box sx={{ p: 2 }}>
          {loading ? (
            <Grid container spacing={3} sx={{ display: "flex", justifyContent: "center" }}>
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
            <Grid container spacing={3} sx={{ display: "flex", justifyContent: "center" }}>
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
              onChange={(e, v) => setPage(v)}
            />
          </Box>
        )}
      </Box>
    </>
  );
}
