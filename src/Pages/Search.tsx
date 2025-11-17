import { useState, useRef } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Typography,
  Collapse,
  Chip,
  Pagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";


function Search() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [noResults, setNoResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const API_KEY = import.meta.env.VITE_NYT_API_KEY;
  const debounceTimer = useRef<any>(null);

  const topics = [
    "Arts&Leisure", "BookReview", "Business", "Climate", "Corrections", "Culture",
    "Dining", "Foreign", "Games", "Graphics", "Learning", "Letters", "Magazine",
    "Metro", "NYTNow", "National", "Obits", "OpEd", "Podcasts", "Politics",
    "RealEstate", "Science", "Styles", "Summary", "SundayBusiness", "TStyle",
    "Travel", "Washington", "Weather", "Weekend", "Well"
  ];

  const keywords = [
    "Arts", "Books", "Briefing", "Climate", "Corrections", "En español", "Fashion",
    "Food", "Gameplay", "Guide", "Health", "Home Page", "Job Market", "Lens",
    "Magazine", "Movies", "Multimedia/Photos", "New York", "Obituaries", "Opinion",
    "Parenting", "Podcasts", "Reader Center", "Real Estate", "Science", "Smarter Living",
    "Sports", "Style", "Sunday Review", "T Brand", "T Magazine", "The Learning Network",
    "The New York Times Presents", "The Upshot", "The Weekly", "Theater", "Times Insider",
    "Today's Paper", "Travel", "U.S.", "Universal", "Well", "World", "Your Money"
  ];

  const buildFilterQuery = () => {
    const filters: string[] = [];
    if (selectedTopic) filters.push(`section.name:("${selectedTopic}")`);
    if (selectedKeywords.length > 0) {
      const keywordFilter = selectedKeywords.map(k => `desk:("${k}")`).join(" OR ");
      filters.push(keywordFilter);
    }
    return filters.join(" AND ");
  };

  const handleSearch = (newPage = 1) => {
    if (!query.trim()) return;
    setLoading(true);

    const fq = buildFilterQuery();
    const params: any = { q: query, "api-key": API_KEY, page: newPage - 1 };
    if (fq) params.fq = fq;

    axios
      .get("https://api.nytimes.com/svc/search/v2/articlesearch.json", { params })
      .then((res) => {
        const docs = res.data.response?.docs || [];
        const hits = res.data.response?.meta?.hits || 0;

        setResults(docs);
        setNoResults(docs.length === 0);
        setTotalPages(Math.min(Math.ceil(hits / 10), 100));
        setLoading(false);
        setPage(newPage);
      })
      .catch(() => {
        setResults([]);
        setNoResults(true);
        setLoading(false);
      });
  };

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
      clearTimeout(debounceTimer.current);
      setLoading(false);
      return;
    }

    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      handleSearch(1);
    }, 2000);
  };

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords(prev =>
      prev.includes(keyword) ? prev.filter(k => k !== keyword) : [...prev, keyword]
    );
  };

  const handlePageChange = (_: any, value: number) => {
    handleSearch(value);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" mb={2}>
        Search Articles
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 2, width: "400px" }}>
        <TextField
          label="Search something..."
          variant="outlined"
          fullWidth
          value={query}
          onChange={handleInputChange}
        />
        <Button variant="contained" onClick={() => handleSearch(1)}>
          Search
        </Button>
      </Box>

      <Button
        variant="outlined"
        onClick={() => setShowFilters(prev => !prev)}
        sx={{ mb: 2 }}
      >
        {showFilters ? "Hide Filters" : "Show Filters"}
      </Button>

      <Collapse in={showFilters}>
        <Box sx={{ border: "1px solid #ccc", p: 2, mb: 2, width: "400px" }}>
          <Typography variant="subtitle1">Filter by Topic:</Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
            {topics.map(t => (
              <Chip
                key={t}
                label={t}
                color={t === selectedTopic ? "primary" : "default"}
                onClick={() => setSelectedTopic(prev => prev === t ? "" : t)}
              />
            ))}
          </Box>

          <Typography variant="subtitle1">Filter by Keywords:</Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
            {keywords.map(k => (
              <Chip
                key={k}
                label={k}
                color={selectedKeywords.includes(k) ? "primary" : "default"}
                onClick={() => toggleKeyword(k)}
              />
            ))}
          </Box>
        </Box>
      </Collapse>

      {loading && <Typography>Loading...</Typography>}
      {noResults && !loading && <Typography color="error">No results found</Typography>}

      <Box>
        {results.map(item => (
          <Card key={item._id || item.uri} sx={{ mb: 2 }} onClick={() => navigate("/article", { state: { article: item } })}>
            <CardContent>
              <Typography variant="h6">{item.headline?.main}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {item.snippet}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {item.pub_date?.slice(0, 10)}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {results.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />

        </Box>
      )}
    </Box>
  );
}

export default Search;
