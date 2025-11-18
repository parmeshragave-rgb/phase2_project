import { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Grid,
    Divider,
    Toolbar,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import FavoriteHeart from "../Components/FavoriteHeart";
import SkeletonCard from "../Components/SkeletonCard";


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
        setPopularStories(res.data.results.slice(0, 10));
    };

    useEffect(() => {
        Promise.all([
            fetchTopStories(),
            fetchSectionStories(),
            fetchPopularStories(),
        ]).finally(() => setLoading(false));
    }, []);

  if (loading)
  return (
    <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
      <Grid container spacing={4}>
        
        <Grid item xs={12} md={8}>
          <Toolbar />
          <Typography
            variant="h4"
            mb={2}
            sx={{ fontFamily: "sans-serif", fontWeight: "bold" }}
          >
            Top Stories
          </Typography>

          <Grid container spacing={2}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Grid item xs={12} key={i}>
                <SkeletonCard
                variant="vertical"
                  sx={{
                display: "flex",
                width: { xs: "330px", md: "800px" },
                height: { xs: "140px", md: "160px" },
                mb: 2,
                borderRadius: 2,
 position: "relative",
            }}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} md={4}>
          <Toolbar />
          <Typography
            variant="h5"
            mb={2}
            sx={{ fontFamily: "sans-serif", fontWeight: "bold" }}
          >
            Most Popular
          </Typography>

          <Grid container spacing={2}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Grid item xs={12} key={i}>
                <SkeletonCard
                  variant="vertical"
                  sx={{
         width: { xs: "330px", sm: "300px", md: "350px" },
        height: "auto",
        mb: 3,
        borderRadius: 2,
        position: "relative",
        display: "flex",
        flexDirection: { xs: "row", sm: "column", md: "column" },
        overflow: "hidden",
      }}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>

      </Grid>
    </Box>
  );



   const MainCard = ({ article }: any) => {
    const img =
        article.multimedia?.[0]?.url ||
        article.media?.[0]?.["media-metadata"]?.[2]?.url ||
        FALLBACK_IMAGE;

    return (
        <Card
            sx={{
                display: "flex",
                width: { xs: "330px", md: "800px" },
                height: { xs: "140px", md: "160px" },
                mb: 2,
                borderRadius: 2,
 position: "relative",
            }}
        >
            <Box
                sx={{ display: "flex", cursor: "pointer", width: "100%" }}
                onClick={() => navigate("/article", { state: { article } })}
            >
                  <FavoriteHeart article={article} />

                <CardMedia
                    component="img"
                    image={img}
                    sx={{
                        width: { xs: "110px", sm: "140px", md: "170px" },
                         minWidth: { xs: "110px", sm: "140px", md: "170px" }, 
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "8px 0 0 8px",
                    }}
                />

                <CardContent
                    sx={{
                        overflow: "hidden",
                        p: { xs: 1, md: 2 },
                    }}
                >
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                            fontSize: { xs: "13px", sm: "15px", md: "17px" },
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {article.title || article.headline?.main}
                    </Typography>

                    <Typography
                        variant="body2"
                        mt={1}
                        sx={{
                            fontSize: { xs: "11px", sm: "13px", md: "14px" },
                            maxHeight: { xs: "35px", md: "60px" },
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {article.abstract}
                    </Typography>
                </CardContent>
            </Box>
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
         width: { xs: "330px", sm: "300px", md: "350px" },
        height: "auto",
        mb: 3,
        borderRadius: 2,
        position: "relative",
        display: "flex",
        flexDirection: { xs: "row", sm: "column", md: "column" },
        overflow: "hidden",
      }}
      onClick={() => navigate("/article", { state: { article } })}
    >
      <FavoriteHeart article={article} />

      <CardMedia
        component="img"
        image={img}
        sx={{
          width: { xs: "45%", sm: "100%", md: "100%" },
          height: { xs: "100%", sm: 120, md: 180 },
          objectFit: "cover",
        }}
      />

      <CardContent sx={{ p: { xs: 1, sm: 1.5, md: 2 } }}>
        <Typography
          fontWeight="bold"
          sx={{
            fontSize: { xs: "13px", sm: "14px", md: "16px" },
          }}
        >
          {article.title}
        </Typography>
      </CardContent>
    </Card>
  );
};



    return (
        <Box sx={{ p: 3 ,display:"flex",justifyContent:"center"}}>
            <Grid container spacing={4} >
                <Grid item xs={12} md={8}>
                    <Toolbar />
                    <Typography variant="h4" mb={2} sx={{fontFamily:"sans-serif",fontWeight:"bold"}}>
                        Top Stories

                    </Typography>

                    {topStories.map((a) => (
                        <MainCard key={a.url} article={a} />
                    ))}

                    <Divider sx={{ my: 4 }} />

                    {SECTIONS.map((sec) =>
                        sectionStories[sec]?.length > 0 ? (
                            <Box key={sec} sx={{ mb: 4 }}>
                                <Typography variant="h5" mb={2} textTransform="capitalize" sx={{fontFamily:"sans-serif",fontWeight:"bold"}}>
                                    {sec}
                                </Typography>

                                {sectionStories[sec].map((a: any) => (
                                    <MainCard key={a.url} article={a} />
                                ))}
                            </Box>
                        ) : null
                    )}
                </Grid>


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

                    <Typography variant="h5" mb={2} sx={{fontFamily:"sans-serif",fontWeight:"bold"}}>
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
