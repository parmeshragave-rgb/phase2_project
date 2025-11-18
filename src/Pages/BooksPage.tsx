import { useEffect, useState } from "react";
import axios from "axios";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Toolbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import BooksCategoryDropdown from "../Components/BooksCategoryDropdown";


const API_KEY = import.meta.env.VITE_NYT_API_KEY;

interface Book {
  rank: number;
  title: string;
  author: string;
  description: string;
  book_image: string;
  primary_isbn13: string;
}

const BOOK_LISTS = [
  { label: "Hardcover Fiction", value: "hardcover-fiction" },
  { label: "Hardcover Nonfiction", value: "hardcover-nonfiction" },
  { label: "Paperback Trade Fiction", value: "trade-fiction-paperback" },
  { label: "Combined Print & E-Book Fiction", value: "combined-print-and-e-book-fiction" },
  { label: "Combined Print & E-Book Nonfiction", value: "combined-print-and-e-book-nonfiction" },
  { label: "Young Adult Hardcover", value: "young-adult-hardcover" },
  { label: "Children's Middle Grade Hardcover", value: "childrens-middle-grade-hardcover" },
];

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [listName, setListName] = useState("hardcover-fiction"); // DEFAULT LIST
  const navigate = useNavigate();

  const fetchBooks = async () => {
    setLoading(true);

    try {
      const url = `https://api.nytimes.com/svc/books/v3/lists/current/${listName}.json?api-key=${API_KEY}`;

      const res = await axios.get(url);
      setBooks(res.data.results.books);
    } catch (err) {
      console.error("Error fetching books:", err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [listName]); 

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <>
      <Toolbar />

      <Box sx={{ p: 2 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          NYT Best Sellers – {BOOK_LISTS.find((x) => x.value === listName)?.label}
        </Typography>

        <BooksCategoryDropdown
  listName={listName}
  onChange={(val) => setListName(val)}
/>


        <Grid container spacing={2}>
          {books.map((book) => (
            <Grid item xs={12} sm={6} md={3} key={book.primary_isbn13}>
              <Card
                sx={{
                  cursor: "pointer",
                  borderRadius: 2,
                  height: 300,
                  width: 280,
                }}
                onClick={() =>
                  navigate(`/book/${book.primary_isbn13}`, { state: { book } })
                }
              >
                <CardMedia
                  component="img"
                  image={book.book_image}
                  sx={{
                    height: 200,
                    objectFit: "cover",
                  }}
                />

                <CardContent>
                  <Typography
                    fontWeight="bold"
                    sx={{
                      fontSize: { xs: "14px", md: "16px" },
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {book.title}
                  </Typography>

                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    {book.author}
                  </Typography>

                  <Typography variant="caption" color="textSecondary">
                    Rank: #{book.rank}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}
