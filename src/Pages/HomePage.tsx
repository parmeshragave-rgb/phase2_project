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
    Divider,
    Toolbar,
    CardActions,
    IconButton
} from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from "react-router-dom";

const API_KEY = import.meta.env.VITE_NYT_API_KEY;

const SECTIONS = ["world", "technology"];
const FALLBACK_IMAGE =
    "https://via.placeholder.com/300x200.png?text=No+Image";

function HomePage() {
    const navigate = useNavigate();



    const [topStories, setTopStories] = useState<any[]>([]);
    const [sectionStories, setSectionStories] = useState<any>({});
    const [popularStories, setPopularStories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTopStories = async () => {
        const res = await axios.get(
            `https://api.nytimes.com/svc/topstories/v2/home.json`,
            { params: { "api-key": API_KEY } }
        );
        setTopStories(res.data.results.slice(0, 6));
    };

    const fetchSectionStories = async () => {
        const data: any = {};

        await Promise.all(
            SECTIONS.map((section) =>
                axios
                    .get(
                        `https://api.nytimes.com/svc/topstories/v2/${section}.json`,
                        { params: { "api-key": API_KEY } }
                    )
                    .then((res) => {
                        data[section] = res.data.results.slice(0, 6);
                    })
                    .catch(() => {
                        data[section] = [];
                    })
            )
        );

        setSectionStories(data);
    };

    const fetchPopularStories = async () => {
        const res = await axios.get(
            `https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json`,
            { params: { "api-key": API_KEY } }
        );
        setPopularStories(res.data.results.slice(0, 8));
    };

    useEffect(() => {
        Promise.all([
            fetchTopStories(),
            fetchSectionStories(),
            fetchPopularStories(),
        ]).finally(() => setLoading(false));
    }, []);

    if (loading) return <Typography>Loading...</Typography>;

    // ------------------------- MAIN LEFT CARD -------------------------
    const MainCard = ({ article }: any) => {
        const img =
            article.multimedia?.[0]?.url ||
            article.media?.[0]?.["media-metadata"]?.[2]?.url ||
            FALLBACK_IMAGE;

        return (

            <Card sx={{ display: "flex", width: "800px", height: 160, mb: 2 }}>
                <Box
                    sx={{ display: "flex", cursor: "pointer", width: "100%" }}
                    onClick={() => navigate("/article", { state: { article } })}
                >
                    <CardMedia
                        component="img"
                        image={img}
                        sx={{ width: 170, height: "100%", objectFit: "cover" }}
                    />

                    <CardContent sx={{ overflow: "hidden" }}>
                        <Typography variant="h6" fontWeight="bold" noWrap>
                            {article.title || article.headline?.main}
                        </Typography>

                        <Typography variant="body2" mt={1} sx={{ maxHeight: 60, overflow: "hidden" }}>
                            {article.abstract}
                        </Typography>
                    </CardContent>
                </Box>

                {/* <CardActions>
        <IconButton onClick={(e) => { e.stopPropagation(); }}>
            <FavoriteBorderIcon />
        </IconButton>

        <IconButton
            onClick={(e) => {
                e.stopPropagation();
                window.open(article.url, "_blank");
            }}
        >
            <OpenInNewIcon />
        </IconButton>
    </CardActions> */}
            </Card>

        );
    };


    const PopularCard = ({ article }: any) => {
        const img =
            article.media?.[0]?.["media-metadata"]?.[2]?.url ||
            article.multimedia?.[0]?.url ||
            FALLBACK_IMAGE;

        return (
            <Card
                sx={{
                    width: "350px",
                    height: 280,
                    mb: 3,
                    borderRadius: 2,
                }}
            >
                <Box onClick={() => navigate("/article", { state: { article } })}>
                    <CardMedia
                        component="img"
                        image={img}
                        sx={{
                            width: "100%",
                            height: 180,
                            objectFit: "cover",
                        }}
                    />

                    <CardContent>

                        <Typography variant="subtitle1" fontWeight="bold">
                            {article.title}
                        </Typography>

                    </CardContent>
                </Box>
            </Card>
        );
    };

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={4}>
                {/* ---------------- LEFT COLUMN ---------------- */}
                <Grid item xs={12} md={8}>
                    <Toolbar />
                    <Typography variant="h4" mb={2}>
                        Top Stories
                    </Typography>

                    {topStories.map((a) => (
                        <MainCard key={a.url} article={a} />
                    ))}

                    <Divider sx={{ my: 4 }} />

                    {SECTIONS.map((sec) =>
                        sectionStories[sec]?.length > 0 ? (
                            <Box key={sec} sx={{ mb: 4 }}>
                                <Typography variant="h5" mb={2} textTransform="capitalize">
                                    {sec}
                                </Typography>

                                {sectionStories[sec].map((a: any) => (
                                    <MainCard key={a.url} article={a} />
                                ))}
                            </Box>
                        ) : null
                    )}
                </Grid>

                {/* ---------------- RIGHT SIDEBAR (ALWAYS FIXED) ---------------- */}

                <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{
                        position: "sticky",
                        top: 80,
                        alignSelf: "flex-start",
                    }}
                >
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
