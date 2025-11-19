import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./Components/Navbar";
import Search from "./Pages/Search";
import HomePage from "./Pages/HomePage";
import ArticleDetail from "./Pages/ArticleDetail";
import Login from "./Pages/Login";
import BookDetailPage from "./Pages/BooksDetailPage";
import BooksPage from "./Pages/BooksPage";
import Favorites from "./Pages/Favorites";
import Footer from "./Components/Footer";
import CategoryPage from "./Pages/CategoryPage";


import { Box, Typography } from "@mui/material";

function App() {
  return (
    <Router>
      <Navbar />
      <Box
        sx={{
          minHeight: "calc(100vh - 110px)",
          display: "flex",
          flexDirection: "column",
          pb: 4,
        }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:name" element={<CategoryPage />} />
          <Route path="/search" element={<Search />} />
          <Route path="/article" element={<ArticleDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/book/:id" element={<BookDetailPage />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="*" element={<Box sx={{display:"flex",justifyContent:"center",alignItems:"center"}}><Typography variant="h3" color="error">Page not found</Typography></Box>} />
        </Routes>
      </Box>


      <Footer />
    </Router>
  );
}

export default App;
