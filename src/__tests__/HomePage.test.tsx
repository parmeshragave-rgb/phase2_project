import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import HomePage from "../Pages/HomePage";

import * as homeActions from "../redux/home/HomeActions";

// ---------- MOCK DISPATCH ACTIONS ----------
jest.mock("../redux/home/HomeActions", () => ({
  fetchTopStories: jest.fn(() => ({ type: "FETCH_TOP" })),
  fetchSectionStories: jest.fn(() => ({ type: "FETCH_SEC" })),
  fetchPopularStories: jest.fn(() => ({ type: "FETCH_POP" })),
}));

// ---------- MOCK navigate ----------
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// ---------- MOCK FavoriteHeart (to prevent auth crashes) ----------
jest.mock("../Components/FavoriteHeart", () => () => <div />);

// ---------- MOCK STORE ----------
const createMockStore = (state: any) => ({
  getState: () => state,
  dispatch: jest.fn(),
  subscribe: jest.fn(),
});

const renderHome = (state: any) => {
  const store = createMockStore(state);

  return render(
    <Provider store={store as any}>
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    </Provider>
  );
};

// ---------- DEFAULT EMPTY STATE (Loading Mode) ----------
const loadingState = {
  news: {
    topStories: [],
    sectionStories: {},
    popularStories: [],
  },
};

// ---------- FILLED STATE TO AVOID LOADING BUG ----------
const filledState = {
  news: {
    topStories: [
      {
        url: "1",
        title: "Top Story A",
        abstract: "A abstract",
        multimedia: [{ url: "" }],
      },
    ],
    sectionStories: {
      world: [
        {
          url: "w1",
          title: "World News",
          abstract: "",
          multimedia: [{ url: "" }],
        },
      ],
      technology: [
        {
          url: "t1",
          title: "Tech News",
          abstract: "",
          multimedia: [{ url: "" }],
        },
      ],
    },
    popularStories: [
      {
        url: "p1",
        title: "Popular Story",
        media: [{ "media-metadata": [{}, {}, { url: "" }] }],
      },
    ],
  },
};

describe("HomePage", () => {
  test("dispatches all 3 actions on mount", () => {
    renderHome(loadingState);

    expect(homeActions.fetchTopStories).toHaveBeenCalled();
    expect(homeActions.fetchSectionStories).toHaveBeenCalled();
    expect(homeActions.fetchPopularStories).toHaveBeenCalled();
  });

  test("shows loading skeleton when data is empty", () => {
    renderHome(loadingState);

    expect(screen.getByText("Top Stories")).toBeInTheDocument();
    expect(screen.getByText("Most Popular")).toBeInTheDocument();
  });

  test("renders Top Stories", () => {
    renderHome(filledState);
    expect(screen.getByText("Top Story A")).toBeInTheDocument();
  });

 test("renders Section Stories and See more works", () => {
  renderHome(filledState);

  expect(screen.getByText("world")).toBeInTheDocument();
  expect(screen.getByText("World News")).toBeInTheDocument();

  const seeMoreButtons = screen.getAllByText("See more →");

  
  fireEvent.click(seeMoreButtons[0]);

  expect(mockNavigate).toHaveBeenCalledWith("/category/world");
});


  test("renders Popular Stories", () => {
    renderHome(filledState);
    expect(screen.getByText("Popular Story")).toBeInTheDocument();
  });

  test("clicking a top story navigates to detail page", () => {
    renderHome(filledState);

    fireEvent.click(screen.getByText("Top Story A"));
    expect(mockNavigate).toHaveBeenCalled();
  });
});
