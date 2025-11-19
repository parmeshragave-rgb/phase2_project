import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import BooksPage from "../Pages/BooksPage";
import * as booksActions from "../redux/books/BooksActions";


jest.mock("../redux/books/BooksActions", () => ({
  fetchBooks: jest.fn((list) => ({ type: "FETCH_BOOKS", payload: list })),
}));


const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));


jest.mock("../Components/BooksCategoryDropdown", () => ({
  __esModule: true,
  default: ({ onChange }: any) => (
    <button onClick={() => onChange("hardcover-fiction")}>Change List</button>
  ),
}));


jest.mock("../Components/SkeletonCard", () => ({
  __esModule: true,
  default: () => <div role="progressbar" />,
}));

const createMockStore = (state: any) => ({
  getState: () => state,
  dispatch: jest.fn(),
  subscribe: jest.fn(),
});

const renderBooks = (state: any) => {
  const store = createMockStore(state);

  return render(
    <Provider store={store as any}>
      <BrowserRouter>
        <BooksPage />
      </BrowserRouter>
    </Provider>
  );
};

const loadingState = {
  books: {
    books: [],
    loading: true,
    listName: "hardcover-fiction",
  },
};

const filledState = {
  books: {
    books: [
      {
        primary_isbn13: "123",
        title: "Sample Book",
        author: "John Doe",
        rank: 1,
        book_image: "image.jpg",
      },
    ],
    loading: false,
    listName: "hardcover-fiction",
  },
};

describe("BooksPage Tests", () => {
  test("dispatches fetchBooks on mount", () => {
    renderBooks(loadingState);

    expect(booksActions.fetchBooks).toHaveBeenCalledWith("hardcover-fiction");
  });

  test("shows skeleton loader when loading", () => {
    renderBooks(loadingState);

    expect(screen.getAllByRole("progressbar").length).toBeGreaterThan(0);
  });

  test("renders book list when loaded", () => {
    renderBooks(filledState);

    expect(screen.getByText("Sample Book")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText(/Rank/)).toBeInTheDocument();
  });

  test("changes list triggers dispatch", () => {
    renderBooks(filledState);

    fireEvent.click(screen.getByText("Change List"));

    expect(booksActions.fetchBooks).toHaveBeenCalledWith("hardcover-fiction");
  });

  test("clicking a book navigates to detail page", () => {
    renderBooks(filledState);

    fireEvent.click(screen.getByText("Sample Book"));

    expect(mockNavigate).toHaveBeenCalledWith("/book/123", {
      state: { book: filledState.books.books[0] },
    });
  });
});
