import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Link,
} from "@mui/material";

const API_KEY = import.meta.env.VITE_NYT_API_KEY;
const sections = ["home", "world", "technology", "sports"];
const FALLBACK_IMAGE =
  "https://via.placeholder.com/180x120.png?text=No+Image";

function HomePage() {
  const [topStories, setTopStories] = useState<any>({});
  const [trendingStories, setTrendingStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  

  const fetchTopStories = () => {
    const topData: any = {};
    let completed = 0;

    sections.forEach((section) => {
      axios
        .get(`https://api.nytimes.com/svc/topstories/v2/${section}.json`, {
          params: { "api-key": API_KEY },
        })
        .then((res) => {
          topData[section] = res.data.results.slice(0, 5);
        })
        .catch((err) => {
          console.error(err);
          topData[section] = [];
        })
        .finally(() => {
          completed += 1;
          if (completed === sections.length) {
            setTopStories(topData);
            setLoading(false);
          }
        });
    });
  };

  const fetchTrendingStories = () => {
    axios
      .get(`https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json`, {
        params: { "api-key": API_KEY },
      })
      .then((res) => setTrendingStories(res.data.results.slice(0, 10)))
      .catch((err) => {
        console.error(err);
        setTrendingStories([]);
      });
  };
  useEffect(() => {
    fetchTopStories();
    fetchTrendingStories();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;

  const renderArticleCard = (article: any) => {
    const imageUrl =
      article.multimedia?.[0]?.url ||
      article.media?.[0]?.["media-metadata"]?.[0]?.url ||
      FALLBACK_IMAGE;

    return (
      <Card sx={{ display: "flex", mb: 2 }} key={article.url}>
        <CardMedia
          component="img"
          sx={{ width: 180 }}
          image={imageUrl}
          alt={article.title || article.headline?.main}
        />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent>
            <Link
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {article.title || article.headline?.main}
              </Typography>
            </Link>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {article.abstract || article.snippet}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {article.byline?.original || "Unknown Author"} |{" "}
              {new Date(article.published_date || article.pub_date).toLocaleDateString()}
            </Typography>
          </CardContent>
        </Box>
      </Card>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={2}>
        Top Stories
      </Typography>
      {sections.map((section) => (
        <Box key={section} sx={{ mb: 4 }}>
          <Typography variant="h5" mb={1}>
            {section.toUpperCase()}
          </Typography>
          <Grid container spacing={2}>
            {topStories[section]?.map((article: any) => (
              <Grid item xs={12} md={6} key={article.url}>
                {renderArticleCard(article)}
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      <Typography variant="h4" mb={2}>
        Trending Stories
      </Typography>
      <Grid container spacing={2}>
        {trendingStories.map((article) => (
          <Grid item xs={12} md={6} key={article.url}>
            {renderArticleCard(article)}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default HomePage;
