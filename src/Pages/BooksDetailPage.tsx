
import { useLocation, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    CardMedia,
    Button,
    Toolbar,
} from "@mui/material";

export default function BookDetailPage() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const book = state?.book;

    if (!book)
        return (
            <Typography sx={{ mt: 10, textAlign: "center" }}>
                No book data found
            </Typography>
        );

    return (
        <>
            <Toolbar />
            

            <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
                 <Box sx={{ px: { xs: 2, md: 0 }, mb: 2 }}>
                <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => navigate(-1)}
                    sx={{
                        fontWeight: "bold",
                        borderRadius: "20px",
                        px: { xs: 2, md: 3 },
                        py: { xs: 0.3, md: 0.7 },
                        
                    }}
                >
                    Back
                </Button>
            </Box>
                <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
                    {book.title}
                </Typography>

                <Typography variant="h6" color="textSecondary" sx={{ mb: 2 }}>
                    {book.author}
                </Typography>

                <CardMedia
                    component="img"
                    image={book.book_image}
                    sx={{
                        width: "100%",
                        maxHeight: 450,
                        objectFit: "cover",
                        borderRadius: 3,
                        mb: 3,
                    }}
                />

                <Typography variant="body1" sx={{ mb: 3 }}>
                    {book.description || "No description available"}
                </Typography>

                <Typography variant="h6" sx={{ mb: 2, fontFamily: "sans-serif", fontWeight: "bold" }}>
                    Rank: #{book.rank}
                </Typography>


                <Typography variant="h5" sx={{ mb: 1, fontFamily: "sans-serif", fontWeight: "bold" }}>
                    Buy This Book:
                </Typography>

                {book.buy_links?.map((link: any) => (
                    <Button
                        key={link.name}
                        variant="contained"
                        sx={{
                            mr: 2, mb: 2, bgcolor: "#c00707ff",
                            color: "whitesmoke",
                            fontWeight: "bold",
                        }}
                        onClick={() => window.open(link.url, "_blank")}
                    >
                        {link.name}
                    </Button>
                ))}
            </Box>
        </>
    );
}
