import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ArticleDetail from "../Pages/ArticleDetail";

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
      <ArticleDetail />
    </BrowserRouter>
  );
}

describe("ArticleDetail Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders article title, abstract and author", () => {
    renderWithState({
      article: {
        title: "Breaking News",
        abstract: "Something happened",
        byline: { original: "By John Doe" },
        multimedia: [{ url: "https://img.com/pic.jpg" }],
        published_date: "2024-01-05T12:00:00Z",
      },
    });

    expect(screen.getByText("Breaking News")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Something happened" })
    ).toBeInTheDocument();
    expect(screen.getByText("By John Doe")).toBeInTheDocument();
  });

  test("back button navigates correctly", () => {
    renderWithState({
      article: { title: "X", multimedia: [] },
    });

    fireEvent.click(screen.getByText("Back"));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  test("renders image when available", () => {
    renderWithState({
      article: {
        title: "Pic Test",
        multimedia: [{ url: "/images/photo.jpg" }],
      },
    });

    const img = screen.getByAltText("article");
    expect(img).toBeInTheDocument();
  });

  test("renders paragraphs when available", () => {
    renderWithState({
      article: {
        title: "Paragraph Test",
        lead_paragraph: "First paragraph",
        abstract: "Second",
        snippet: "Third",
        multimedia: [],
      },
    });

    expect(screen.getByText("First paragraph")).toBeInTheDocument();
    expect(screen.getAllByText("Second").length).toBeGreaterThan(0);
    expect(screen.getByText("Third")).toBeInTheDocument();
  });

  test("shows fallback text when no paragraphs exist", () => {
    renderWithState({
      article: {
        title: "No Text",
        multimedia: [],
        lead_paragraph: null,
        abstract: null,
        snippet: null,
      },
    });

    expect(
      screen.getByText("No detailed text available.")
    ).toBeInTheDocument();
  });

  test("opens full article link in new tab", () => {
    renderWithState({
      article: {
        title: "Full Article",
        url: "https://nytimes.com/story",
        multimedia: [],
      },
    });

    fireEvent.click(screen.getByText("Read full article at NYT"));
    expect(mockOpen).toHaveBeenCalledWith(
      "https://nytimes.com/story",
      "_blank",
      "noopener"
    );
  });
});
