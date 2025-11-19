import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import BookDetailPage from "../Pages/BooksDetailPage";

const mockNavigate = jest.fn();
const mockOpen = jest.fn();
window.open = mockOpen;

let mockState: any = null;

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: mockState }),
}));

function renderWithState(state: any) {
  mockState = state;
  return render(
    <BrowserRouter>
      <BookDetailPage />
    </BrowserRouter>
  );
}

describe("BookDetailPage", () => {
  test("shows fallback when no book provided", () => {
    renderWithState(null);

    expect(screen.getByText("No book data found")).toBeInTheDocument();
  });

  test("renders book details", () => {
    renderWithState({
      book: {
        title: "Sample Book",
        author: "John Doe",
        book_image: "img.jpg",
        description: "Test description",
        rank: 2,
        buy_links: [],
      },
    });

    expect(screen.getByText("Sample Book")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
    expect(screen.getByText("Rank: #2")).toBeInTheDocument();
  });

  test("back button works", () => {
    renderWithState({
      book: {
        title: "AAA",
        author: "BBB",
        book_image: "",
        description: "",
        rank: 1,
        buy_links: [],
      },
    });

    fireEvent.click(screen.getByText("Back"));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  test("buy link opens new window", () => {
    renderWithState({
      book: {
        title: "AAA",
        author: "BBB",
        book_image: "",
        description: "",
        rank: 1,
        buy_links: [{ name: "Amazon", url: "http://amazon.com" }],
      },
    });

    fireEvent.click(screen.getByText("Amazon"));

    expect(mockOpen).toHaveBeenCalledWith("http://amazon.com", "_blank");
  });
});
