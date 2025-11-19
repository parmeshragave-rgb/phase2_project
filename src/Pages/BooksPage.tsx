import React from "react";

import { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Toolbar,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import  type{ RootState } from "../redux/index";
import { fetchBooks } from "../redux/books/BooksActions";

import { useNavigate } from "react-router-dom";

import BooksCategoryDropdown from "../Components/BooksCategoryDropdown";
import SkeletonCard from "../Components/SkeletonCard";

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
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { books, loading, listName } = useSelector(
    (state: RootState) => state.books
  );

  const [selectedList, setSelectedList] = useState(listName);

  useEffect(() => {
    dispatch(fetchBooks(selectedList) as any);
  }, [selectedList, dispatch]);

  if (loading)
    return (
      <>
        <Toolbar />
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <SkeletonCard variant="vertical" height={330} width="280px" />
              </Grid>
            ))}
          </Grid>
        </Box>
      </>
    );

  return (
    <>
      

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h4"
            sx={{ mb: 2, fontFamily: "sans-serif", fontWeight: "bold" }}
          >
            NYT Best Sellers –{" "}
            {BOOK_LISTS.find((x) => x.value === selectedList)?.label}
          </Typography>

          <BooksCategoryDropdown
            listName={selectedList}
            onChange={(val) => setSelectedList(val)}
          />

          <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
            {books.map((book: any) => (
              <Grid item xs={12} sm={6} md={3} key={book.primary_isbn13}>
                <Card
                  sx={{ cursor: "pointer", borderRadius: 2, height: 330, width: 280 }}
                  onClick={() =>
                    navigate(`/book/${book.primary_isbn13}`, {
                      state: { book },
                    })
                  }
                >
                  <CardMedia
                    component="img"
                    image={book.book_image}
                    sx={{ height: 200, objectFit: "cover" }}
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

                    <Typography variant="body2" sx={{ mt: 1 }}>
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
      </Box>
    </>
  );
}
