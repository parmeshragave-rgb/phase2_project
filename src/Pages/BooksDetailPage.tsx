
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CardMedia,
  Button,
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
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Button onClick={() => navigate(-1)}>⬅ Back</Button>

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

      <Typography variant="h6" sx={{ mb: 2 }}>
        Rank: #{book.rank}
      </Typography>

      
      <Typography variant="h5" sx={{ mb: 1 }}>
        Buy This Book:
      </Typography>

      {book.buy_links?.map((link: any) => (
        <Button
          key={link.name}
          variant="contained"
          sx={{ mr: 2, mb: 2 }}
          onClick={() => window.open(link.url, "_blank")}
        >
          {link.name}
        </Button>
      ))}
    </Box>
  );
}
