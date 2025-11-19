import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import BookDetailPage from "../Pages/BooksDetailPage";

// Mock navigate()
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock window.open
const mockOpen = jest.fn();
window.open = mockOpen as any;

const renderPage = (bookState?: any) => {
  return render(
    <BrowserRouter>
      <BookDetailPage />
    </BrowserRouter>
  );
};

describe("BookDetailPage Tests", () => {
  test("shows fallback when no book provided", () => {
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useLocation: () => ({ state: null }),
    }));

    renderPage();

    expect(screen.getByText("No book data found")).toBeInTheDocument();
  });

  test("renders book details", () => {
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useLocation: () => ({
        state: {
          book: {
            title: "Sample Book",
            author: "John Doe",
            book_image: "img.jpg",
            description: "Test description",
            rank: 2,
            buy_links: [],
          },
        },
      }),
      useNavigate: () => mockNavigate,
    }));

    renderPage();

    expect(screen.getByText("Sample Book")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
    expect(screen.getByText("Rank: #2")).toBeInTheDocument();
  });

  test("back button works", () => {
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useLocation: () => ({
        state: {
          book: {
            title: "Book",
            author: "A",
            book_image: "",
            description: "",
            rank: 1,
            buy_links: [],
          },
        },
      }),
      useNavigate: () => mockNavigate,
    }));

    renderPage();

    fireEvent.click(screen.getByText("Back"));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  test("buy link opens new window", () => {
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useLocation: () => ({
        state: {
          book: {
            title: "Book",
            author: "A",
            book_image: "",
            description: "",
            rank: 1,
            buy_links: [{ name: "Amazon", url: "http://amazon.com" }],
          },
        },
      }),
      useNavigate: () => mockNavigate,
    }));

    renderPage();

    fireEvent.click(screen.getByText("Amazon"));
    expect(mockOpen).toHaveBeenCalledWith("http://amazon.com", "_blank");
  });
});
