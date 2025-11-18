import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Navbar from './Components/Navbar';
import Search from './Pages/Search';
import HomePage from './Pages/HomePage';
import ArticleDetail from './Pages/ArticleDetail';
import Login from "./Pages/Login";
import BookDetailPage from "./Pages/BooksDetailPage";
import BooksPage from "./Pages/BooksPage";
import Favorites from "./Pages/Favorites";
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="search" element={<Search />} />
        <Route path="/article" element={<ArticleDetail />} />
        <Route path="login" element={<Login />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/book/:id" element={<BookDetailPage />} />
        <Route path="/favorites" element={<Favorites />} />

        <Route path="*" element={<div>Page not found</div>} />

      </Routes>
    </Router>
  );
}

export default App;
