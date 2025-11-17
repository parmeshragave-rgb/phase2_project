import { useLocation } from "react-router-dom";
import { Box, Typography, Card, CardContent, CardMedia, Button, Link } from "@mui/material";

const FALLBACK_IMAGE = "https://via.placeholder.com/600x400.png?text=No+Image";

function ArticleDetail() {
  const location = useLocation();
  const article = location.state?.article;

  if (!article) return <Typography>No article selected.</Typography>;

  const imageUrl =
    article.multimedia?.[0]?.url ||
    article.media?.[0]?.["media-metadata"]?.[0]?.url ||
    FALLBACK_IMAGE;

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardMedia
          component="img"
          image={imageUrl}
          alt={article.title || article.headline?.main}
          sx={{ maxHeight: 400 }}
        />
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {article.title || article.headline?.main}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {article.abstract || article.snippet}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 2 }}>
            {article.byline?.original || "Unknown Author"} |{" "}
            {new Date(article.published_date || article.pub_date).toLocaleDateString()}
          </Typography>
          <Button
            variant="contained"
            component={Link}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Read More on NYT
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ArticleDetail;
