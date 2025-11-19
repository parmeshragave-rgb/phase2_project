import React from "react";

import { useLocation, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Button,
    Avatar,
    Chip,
    Divider,
    Stack
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export default function ArticleDetail() {
    window.scrollTo(0, 0);
    const navigate = useNavigate();
    const { state } = useLocation();
    const article = state?.article;

    
    const image =
        article?.multimedia?.[0]?.url
            ? article.multimedia[0].url.startsWith("http")
                ? article.multimedia[0].url
                : `https://www.nytimes.com/${article.multimedia[0].url}`
            : article?.media?.[0]?.["media-metadata"]?.slice(-1)?.[0]?.url || "";

    
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
        <>
            

            <Box sx={{ px: { xs: 2, md: 6 }, py: 4 }}>
                <Box sx={{ maxWidth: 900, mx: "auto" }}>
                  
                    <Stack
                        sx={{
                            width: "100%",
                            maxWidth: 900,
                            mb: 2,
                        }}
                    >
                        <Chip
                            label="NEWS ANALYSIS"
                            sx={{ fontSize: "0.8rem", width: "fit-content" }}
                        />

                        <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            onClick={() => navigate(-1)}
                            sx={{
                                mt: 3,
                                mb: 3,
                                ml: 2,
                                fontWeight: "bold",
                                width: "fit-content",
                                px: { xs: 2, md: 3 },
                                py: { xs: 0.5, md: 0.8 },
                            }}
                        >
                            Back
                        </Button>
                    </Stack>

                    
                    <Typography
                        variant="h3"
                        fontWeight="bold"
                        sx={{ mb: 3, lineHeight: 1.2 }}
                    >
                        {title}
                    </Typography>

                    {abstract && (
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{ mb: 3 }}
                        >
                            {abstract}
                        </Typography>
                    )}

                   
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

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 3 }}>
                        <Avatar>{author[0]}</Avatar>
                        <Box>
                            <Typography variant="subtitle1">{author}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                {published ? new Date(published).toLocaleString() : ""}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    
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

                    <Box sx={{ textAlign: "left", mt: 4 }}>
                        <Button
                            variant="contained"
                            endIcon={<OpenInNewIcon />}
                            onClick={() =>
                                window.open(
                                    article.url || article.link || article.web_url,
                                    "_blank",
                                    "noopener"
                                )
                            }
                            sx={{bgcolor: "#c00707"  }}
                        >
                            Read full article at NYT
                        </Button>
                    </Box>
                </Box>
            </Box>
        </>
    );
}
