import React from "react";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Toolbar,
  Skeleton,
  Button,
  Pagination,
} from "@mui/material";

import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "../redux";
import { fetchSingleSection } from "../redux/home/HomeActions";
import FavoriteHeart from "../Components/FavoriteHeart";

const FALLBACK_IMAGE =
  "https://via.placeholder.com/900x600.png?text=No+Image+Available";

function getImage(article: any): string {
  const mm = article?.multimedia;
  if (Array.isArray(mm) && mm.length > 0) {
    const best = mm.reduce((best, cur) =>
      (cur.width || 0) > (best?.width || 0) ? cur : best
    );
    if (best?.url)
      return /^https?:\/\//i.test(best.url)
        ? best.url
        : `https://www.nytimes.com${best.url}`;
  }

  const media = article?.media?.[0];
  const meta = media?.["media-metadata"];
  if (Array.isArray(meta) && meta.length > 0) {
    const last = meta[meta.length - 1];
    if (last?.url) return last.url;
  }

  return FALLBACK_IMAGE;
}

export default function CategoryPage() {
   
    window.scrollTo(0, 0);

  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { sectionStories } = useSelector(
    (state: RootState) => state.news || { sectionStories: {} }
  );

  useEffect(() => {
    if (name) dispatch(fetchSingleSection(name) as any);
  }, [name, dispatch]);

  const items = sectionStories[name || ""] || [];

  
  const ITEMS_PER_PAGE = 8;
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const paginatedItems = items.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handlePageChange = (_: any, v: number) => {
    setPage(v);
    window.scrollTo(0, 0);
  };

  const CardItem = ({ article }: { article: any }) => {
    const img = getImage(article);

    return (
      <Card
        onClick={() => navigate("/article", { state: { article } })}
        sx={{
          cursor: "pointer",
          mb: 3,
          width: { xs: "100%", md: "800px" },
          borderRadius: 2,
          display: "flex",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <FavoriteHeart article={article} />

        <Box
          sx={{
            width: { xs: "38%", md: "35%" },
            minWidth: { xs: "140px", md: "220px" },
            height: { xs: 120, md: 150 },
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          <CardMedia
            component="img"
            image={img}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>

        <CardContent sx={{ flex: 1 }}>
          <Typography
            fontWeight="bold"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              fontSize: { xs: "14px", md: "16px" },
            }}
          >
            {article.title || article.headline?.main}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mt: 1,
              color: "text.secondary",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {article.abstract || article.snippet}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
      <Grid container justifyContent="center">
        <Grid item size={{ xs: 12}}>
          <Toolbar />

          
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={() => navigate(-1)}
            sx={{
              mb: 3,
              fontWeight: "bold",
              width: "fit-content",
              px: { xs: 2, md: 3 },
              py: { xs: 0.5, md: 0.8 },
              ml: 1,
            }}
          >
            Back
          </Button>

          <Typography
            variant="h4"
            align="center"
            sx={{ textTransform: "capitalize", mb: 3 }}
          >
            {name}
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {items.length === 0 ? (
              <>
                <Skeleton data-testid="category-skeleton" variant="rectangular" width={800} height={150} sx={{ mb: 2 }} />
<Skeleton data-testid="category-skeleton" variant="rectangular" width={800} height={150} sx={{ mb: 2 }} />

              </>
            ) : (
              paginatedItems.map((a: any) => (
                <CardItem key={a.url || a.uri} article={a} />
              ))
            )}
          </Box>

    
          {items.length > ITEMS_PER_PAGE && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="error"
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
