// src/pages/Search.tsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
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
  CircularProgress,
  Chip,
  Collapse,
  Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useNavigate } from "react-router-dom";

/**
 * Search.tsx
 * - Mixed random default content (different UI from HomePage)
 * - Search results from NYT Article Search
 * - Pagination, images, responsive layout, filters, debounce
 */

// NYT API key (Vite env)
const API_KEY = import.meta.env.VITE_NYT_API_KEY as string;

// Fallback image
const FALLBACK_IMAGE = "https://via.placeholder.com/800x450.png?text=No+Image";

// helpers to safely pick image from various NYT response shapes
function getImageForArticle(article: any): string {
  // TopStories / MostPopular multimedia array: each item has url
  if (Array.isArray(article.multimedia) && article.multimedia.length > 0) {
    // prefer wide images
    const candidate =
      article.multimedia.find((m: any) => m.width && m.width >= 600) || article.multimedia[0];
    const url = candidate?.url;
    if (url) return url.startsWith("http") ? url : `https://www.nytimes.com/${url}`;
  }

  // Article Search multimedia entries sometimes have relative url in .multimedia[0].url
  if (Array.isArray(article.multimedia) && article.multimedia.length > 0) {
    const m = article.multimedia[0];
    if (m?.url) return m.url.startsWith("http") ? m.url : `https://www.nytimes.com/${m.url}`;
  }

  // media -> media-metadata
  if (Array.isArray(article.media) && article.media.length > 0) {
    const meta = article.media[0]["media-metadata"];
    if (Array.isArray(meta) && meta.length > 0) {
      const last = meta[meta.length - 1];
      if (last?.url) return last.url;
    }
  }

  // some Article Search docs include legacy "multimedia" with 'url'
  if (article?.multimedia?.length && article.multimedia[0]?.url) {
    const u = article.multimedia[0].url;
    return u.startsWith("http") ? u : `https://www.nytimes.com/${u}`;
  }

  return FALLBACK_IMAGE;
}

// Utility: pick random N items from an array
function pickRandom<T>(arr: T[], n: number): T[] {
  const copy = arr.slice();
  const out: T[] = [];
  while (out.length < n && copy.length > 0) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

const DEFAULT_SECTIONS = ["world", "technology", "science", "business"];

const topicsSample = ["Arts", "Business", "Politics", "Science", "Technology", "World"];
const keywordsSample = ["Opinion", "Health", "Travel", "Sports", "Culture"];

export default function Search(): JSX.Element {
  const navigate = useNavigate();

  // search UI state
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  // default mixed content (random)
  const [defaultArticles, setDefaultArticles] = useState<any[]>([]);
  const [defaultLoading, setDefaultLoading] = useState(true);

  // search results
  const [results, setResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

  // pagination (UI uses 1-based pages)
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // debounce ref id
  const debounceRef = useRef<number | null>(null);

  // whether user is searching (non-empty query)
  const isSearching = query.trim().length > 0;

  // build fq for Article Search API
  const buildFilterQuery = () => {
    const parts: string[] = [];
    if (selectedTopic) parts.push(`section_name:("${selectedTopic}")`);
    if (selectedKeywords.length > 0) {
      const kw = selectedKeywords.map((k) => `news_desk:("${k}")`).join(" OR ");
      parts.push(`(${kw})`);
    }
    return parts.join(" AND ");
  };

  // Fetch default mixed random content (different from homepage)
  useEffect(() => {
    const fetchMixed = async () => {
      setDefaultLoading(true);
      try {
        // pick 3 or 4 sections randomly from DEFAULT_SECTIONS
        const sectionsPicked = pickRandom(DEFAULT_SECTIONS, 4);
        // fetch each section topstories and pick 2 random each
        const reqs = sectionsPicked.map((s) =>
          axios.get(`https://api.nytimes.com/svc/topstories/v2/${s}.json`, {
            params: { "api-key": API_KEY },
          })
        );

        const responses = await Promise.all(reqs);
        const merged: any[] = [];
        responses.forEach((res, idx) => {
          const list = res.data.results ?? [];
          // pick 2 random items from the list
          const two = pickRandom(list, 2);
          two.forEach((it: any) => {
            // keep section info
            merged.push({ ...it, _defaultSection: sectionsPicked[idx] });
          });
        });

        // shuffle the merged list so it looks mixed
        const shuffled = merged.sort(() => Math.random() - 0.5);
        setDefaultArticles(shuffled);
      } catch (err) {
        console.error("Error fetching mixed default news:", err);
        setDefaultArticles([]);
      } finally {
        setDefaultLoading(false);
      }
    };

    fetchMixed();
    // run on mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // PERFORM search (page is 1-based in UI, mapped to 0-based for API)
  const performSearch = async (uiPage = 1) => {
    const q = query.trim();
    if (!q) return;

    setSearchLoading(true);
    setNoResults(false);

    const params: any = {
      q,
      "api-key": API_KEY,
      page: Math.max(0, uiPage - 1),
    };

    const fq = buildFilterQuery();
    if (fq) params.fq = fq;

    try {
      const res = await axios.get("https://api.nytimes.com/svc/search/v2/articlesearch.json", { params });
      const docs = res.data.response?.docs ?? [];
      const hits = res.data.response?.meta?.hits ?? 0;

      setResults(docs);
      setNoResults(docs.length === 0);
      const pages = Math.min(Math.ceil(hits / 10), 100);
      setTotalPages(pages > 0 ? pages : 1);
      setPage(uiPage);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
      setNoResults(true);
      setTotalPages(1);
      setPage(1);
    } finally {
      setSearchLoading(false);
      // scroll to results
      window.scrollTo({ top: 220, behavior: "smooth" });
    }
  };

  // debounce input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery(v);

    if (!v.trim()) {
      // clear search results and paging
      setResults([]);
      setNoResults(false);
      setTotalPages(1);
      setPage(1);
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      return;
    }

    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    // debounce 700ms
    debounceRef.current = window.setTimeout(() => {
      performSearch(1);
    }, 700);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setNoResults(false);
    setTotalPages(1);
    setPage(1);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
  };

  const toggleKeyword = (kw: string) => {
    setSelectedKeywords((prev) => (prev.includes(kw) ? prev.filter((p) => p !== kw) : [...prev, kw]));
  };

  const handlePageChange = (_: any, value: number) => {
    // if searching -> perform API search page
    if (isSearching) performSearch(value);
    else setPage(value);
  };

  // Card for vertical layout (image on top) - used for default and search results (search docs -> headline.main)
  const VerticalCard: React.FC<{ item: any; isArticleSearch?: boolean }> = ({ item, isArticleSearch = false }) => {
    const image = getImageForArticle(item);
    const title = isArticleSearch ? item.headline?.main ?? item.title : item.title ?? item.headline?.main;
    const snippet = isArticleSearch ? item.abstract ?? item.snippet : item.abstract ?? item.snippet;
    const pubdate = isArticleSearch ? item.pub_date?.slice(0, 10) : item.published_date ?? item.pub_date;

    return (
      <Card
        sx={{
          cursor: "pointer",
          borderRadius: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={() => navigate("/article", { state: { article: item } })}
      >
        <CardMedia
          component="img"
          image={image}
          sx={{ height: { xs: 160, sm: 180, md: 220 }, objectFit: "cover" }}
        />
        <CardContent sx={{ flex: 1 }}>
          <Typography
            fontWeight="bold"
            sx={{
              fontSize: { xs: "15px", md: "16px" },
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 1,
              fontSize: { xs: "12px", md: "14px" },
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {snippet}
          </Typography>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
            {pubdate}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* HERO SEARCH */}
      <Box
        sx={{
          width: "100%",
          background: "linear-gradient(135deg,#f2f6fb 0%, #ffffff 100%)",
          mt: { xs: "64px", md: "72px" },
          mb: 3,
          py: { xs: 6, md: 10 },
          boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box sx={{ width: { xs: "92%", sm: "84%", md: "72%", lg: "60%" } }}>
            <Paper
              elevation={3}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                p: { xs: 1, sm: 1.5 },
                borderRadius: "60px",
                width: "100%",
                bgcolor: "rgba(255,255,255,0.95)",
                boxShadow: 3,
              }}
            >
              <TextField
                placeholder="Search New York Times articles..."
                variant="outlined"
                value={query}
                onChange={handleInputChange}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "text.secondary", ml: 1, mr: 1 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <>
                      {query && (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={handleClear}>
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      )}
                    </>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "60px",
                    backgroundColor: "transparent",
                    "& fieldset": { border: "none" },
                    "&:hover fieldset": { border: "none" },
                    "&.Mui-focused fieldset": { border: "none" },
                    transition: "all 0.2s ease",
                  },
                }}
              />

              <Button
                variant="contained"
                onClick={() => performSearch(1)}
                sx={{
                  borderRadius: "50px",
                  bgcolor: "#c00707ff",
                  color: "white",
                  px: 3,
                  py: 1,
                }}
              >
                Search
              </Button>
            </Paper>
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button variant="text" onClick={() => setShowFilters((s) => !s)}>
            {showFilters ? "Hide filters" : "Show filters"}
          </Button>
        </Box>

        <Collapse in={showFilters}>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Box sx={{ width: { xs: "92%", sm: "84%", md: "72%", lg: "60%" } }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Topic
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
                  {topicsSample.map((t) => (
                    <Chip
                      key={t}
                      label={t}
                      color={t === selectedTopic ? "primary" : "default"}
                      onClick={() => setSelectedTopic((s) => (s === t ? "" : t))}
                      size="small"
                    />
                  ))}
                </Box>

                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Keywords
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {keywordsSample.map((k) => (
                    <Chip
                      key={k}
                      label={k}
                      color={selectedKeywords.includes(k) ? "primary" : "default"}
                      onClick={() => toggleKeyword(k)}
                      size="small"
                    />
                  ))}
                </Box>
              </Paper>
            </Box>
          </Box>
        </Collapse>
      </Box>

      {/* CONTENT AREA */}
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        {/* DEFAULT MIXED RANDOM (only when NOT searching) */}
        {!isSearching && (
          <>
            {defaultLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Explore
                </Typography>

                <Grid container spacing={3}>
                  {defaultArticles.map((it: any, idx: number) => (
                    <Grid item xs={12} sm={6} md={3} key={it.url || `${it.title}-${idx}`}>
                      <VerticalCard item={it} />
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </>
        )}

        {/* SEARCH RESULTS */}
        {isSearching && (
          <>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography variant="h5" sx={{ mr: 2 }}>
                Results for “{query}”
              </Typography>
              {searchLoading && <CircularProgress size={18} />}
            </Box>

            {searchLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                <CircularProgress />
              </Box>
            ) : noResults ? (
              <Typography color="error">No results found</Typography>
            ) : (
              <>
                <Grid container spacing={3}>
                  {results.map((doc: any) => (
                    <Grid item xs={12} sm={6} md={4} key={doc._id || doc.uri}>
                      <VerticalCard item={doc} isArticleSearch />
                    </Grid>
                  ))}
                </Grid>

                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
                </Box>
              </>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
