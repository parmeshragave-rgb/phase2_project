import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Chip,
  Divider
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export default function ArticleDetail() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const article = state?.article;

  // If user tries to directly type /article in browser
  if (!article) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight="bold">
          No article selected.
        </Typography>
        <Typography sx={{ mt: 1 }}>
          Please go back and select an article.
        </Typography>

        <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate("/")}>
          Go Home
        </Button>
      </Box>
    );
  }

  // Determine best possible image
  const image =
    article.multimedia?.[0]?.url ||
    article.media?.[0]?.["media-metadata"]?.[2]?.url ||
    article.media?.[0]?.["media-metadata"]?.[1]?.url ||
    article.media?.[0]?.["media-metadata"]?.[0]?.url ||
    "";

  const title = article.title || article.headline?.main;
  const abstract = article.abstract || article.snippet;
  const author =
    article.byline?.original ||
    article.byline ||
    "Unknown Author";

  const published =
    article.published_date || article.pub_date || "";

  const paragraphs = [
    article.lead_paragraph,
    article.abstract,
    article.snippet,
  ].filter(Boolean);

  return (
    <Box sx={{ px: { xs: 2, md: 6 }, py: 4 }}>
      <Box sx={{ maxWidth: 900, mx: "auto" }}>

        {/* SECTION TAG */}
        <Chip
          label="NEWS ANALYSIS"
          sx={{ mb: 2, fontSize: "0.8rem" }}
        />

        {/* TITLE */}
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{ mb: 3, lineHeight: 1.2 }}
        >
          {title}
        </Typography>

        {/* ABSTRACT */}
        {abstract && (
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            {abstract}
          </Typography>
        )}

        {/* IMAGE */}
        {image && (
          <Box sx={{ textAlign: "center", my: 3 }}>
            <img
              src={image}
              alt="article"
              style={{
                width: "100%",
                maxWidth: 900,
                borderRadius: 10,
              }}
            />

            {/* caption if exists */}
            {article.caption && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 1 }}
              >
                {article.caption}
              </Typography>
            )}
          </Box>
        )}

        {/* AUTHOR + DATE */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 3 }}>
          <Avatar>{author[0]}</Avatar>
          <Box>
            <Typography variant="subtitle1">
              {author}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {published ? new Date(published).toLocaleString() : ""}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* FULL PARAGRAPHS */}
        {paragraphs.length > 0 ? (
          paragraphs.map((p, i) => (
            <Typography
              key={i}
              variant="body1"
              sx={{ mb: 3, lineHeight: 1.7 }}
            >
              {p}
            </Typography>
          ))
        ) : (
          <Typography>No detailed text available.</Typography>
        )}

        {/* READ FULL ARTICLE BUTTON */}
        <Box sx={{ textAlign: "left", mt: 4 }}>
          <Button
            variant="contained"
            endIcon={<OpenInNewIcon />}
            onClick={() =>
              window.open(article.url, "_blank", "noopener")
            }
          >
            Read full article at NYT
          </Button>
        </Box>

      </Box>
    </Box>
  );
}
