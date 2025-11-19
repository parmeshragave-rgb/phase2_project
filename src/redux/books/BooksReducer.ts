// src/redux/books/BooksReducer.ts
import {
  BOOKS_REQUEST,
  BOOKS_SUCCESS,
  BOOKS_FAILURE,
  
} from "./BooksActions";
import type {BooksActions} from "./BooksActions";
export interface BooksState {
  books: any[];
  listName: string;
  loading: boolean;
  error: string | null;
}

const initialState: BooksState = {
  books: [],
  listName: "hardcover-fiction",
  loading: false,
  error: null,
};

export default function BooksReducer(
  state: BooksState = initialState,
  action: BooksActions
): BooksState {
  switch (action.type) {
    case BOOKS_REQUEST:
      return { ...state, loading: true, error: null };

    case BOOKS_SUCCESS:
      return {
        ...state,
        loading: false,
        books: action.payload.books,
        listName: action.payload.listName,
      };

    case BOOKS_FAILURE:
      return { ...state, loading: false, error: action.payload, books: [] };

    default:
      return state;
  }
}
