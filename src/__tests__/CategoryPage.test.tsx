import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import CategoryPage from "../Pages/CategoryPage";
import * as homeActions from "../redux/home/HomeActions";
import * as favoriteUtils from "../utils/favoriteUtils";


jest.mock("../redux/home/HomeActions", () => ({
  fetchSingleSection: jest.fn(() => ({ type: "FETCH_SINGLE" })),
}));

jest.mock("../Components/FavoriteHeart", () => () => <div />);


const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ name: "technology" }),
  useNavigate: () => mockNavigate,
}));


const createMockStore = (state: any) => ({
  getState: () => state,
  dispatch: jest.fn(),
  subscribe: jest.fn(),
});


const renderCategory = (state: any) => {
  const store = createMockStore(state);

  return render(
    <Provider store={store as any}>
      <BrowserRouter>
        <CategoryPage />
      </BrowserRouter>
    </Provider>
  );
};


const emptyState = {
  news: {
    sectionStories: {
      technology: [],
    },
  },
};

describe("CategoryPage Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("dispatches fetchSingleSection on mount", () => {
    renderCategory(emptyState);

    expect(homeActions.fetchSingleSection).toHaveBeenCalledWith("technology");
  });

 test("shows skeleton loader when empty", () => {
  renderCategory(emptyState);

  expect(screen.getAllByTestId("category-skeleton").length).toBe(2);
});

  test("displays category title", () => {
    renderCategory(emptyState);

    expect(screen.getByText("technology")).toBeInTheDocument();
  });

  test("renders article cards when data exists", () => {
    renderCategory({
      news: {
        sectionStories: {
          technology: [
            {
              url: "1",
              title: "Tech Story",
              abstract: "Abstract",
              multimedia: [],
            },
          ],
        },
      },
    });

    expect(screen.getByText("Tech Story")).toBeInTheDocument();
  });

  test("navigates to article page when card clicked", () => {
    renderCategory({
      news: {
        sectionStories: {
          technology: [
            {
              url: "1",
              title: "Clickable Story",
              abstract: "A",
              multimedia: [],
            },
          ],
        },
      },
    });

    fireEvent.click(screen.getByText("Clickable Story"));

    expect(mockNavigate).toHaveBeenCalledWith("/article", {
      state: {
        article: {
          url: "1",
          title: "Clickable Story",
          abstract: "A",
          multimedia: [],
        },
      },
    });
  });

test("pagination appears when items exceed 8", () => {
  const manyArticles = Array.from({ length: 12 }).map((_, i) => ({
    url: `a${i}`,
    title: `Article ${i}`,
    multimedia: []
  }));

  renderCategory({
    news: {
      sectionStories: { technology: manyArticles }
    }
  });

  const page2 = screen.getByRole("button", { name: /2|go to page 2/i });
  expect(page2).toBeInTheDocument();
});



  test("back button works", () => {
    renderCategory(emptyState);

    fireEvent.click(screen.getByText("Back"));

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
