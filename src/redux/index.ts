
import { combineReducers } from "redux";
import authReducer from "./auth/authReducer";
import { NewsReducer } from "./home/HomeReducer";
import SearchReducer from "./search/SearchReducer";
import BooksReducer from "./books/BooksReducer";
import subscriptionReducer from "./subscription/subscriptionReducer";
import moviesReducer from "./movies/MoviesReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  news: NewsReducer,
  search: SearchReducer,
  books: BooksReducer,
  subscription: subscriptionReducer,
  movies: moviesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
