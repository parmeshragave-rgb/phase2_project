
import axios from "axios";
import type { Dispatch } from "redux";

export const BOOKS_REQUEST = "BOOKS_REQUEST" as const;
export const BOOKS_SUCCESS = "BOOKS_SUCCESS" as const;
export const BOOKS_FAILURE = "BOOKS_FAILURE" as const;

export interface BooksRequestAction {
  type: typeof BOOKS_REQUEST;
}

export interface BooksSuccessAction {
  type: typeof BOOKS_SUCCESS;
  payload: {
    books: any[];
    listName: string;
  };
}

export interface BooksFailureAction {
  type: typeof BOOKS_FAILURE;
  payload: string;
}

export type BooksActions =
  | BooksRequestAction
  | BooksSuccessAction
  | BooksFailureAction;

const API_KEY = import.meta.env.VITE_NYT_API_KEY;

export const fetchBooks = (listName: string) => {
  return async (dispatch: Dispatch<BooksActions>) => {
    dispatch({ type: BOOKS_REQUEST });

    try {
      const url = `https://api.nytimes.com/svc/books/v3/lists/current/${listName}.json?api-key=${API_KEY}`;

      const res = await axios.get(url);
      const books = res.data.results?.books || [];

      dispatch({
        type: BOOKS_SUCCESS,
        payload: { books, listName },
      });
    } catch (error: any) {
      dispatch({
        type: BOOKS_FAILURE,
        payload: error.message || "Failed to fetch book list",
      });
    }
  };
};
