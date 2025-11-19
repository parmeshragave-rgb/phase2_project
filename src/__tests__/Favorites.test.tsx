import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import Favorites from "../Pages/Favorites";

jest.mock("../utils/favoriteUtils", () => ({
  getFavorites: jest.fn(),
  removeFavorite: jest.fn(),
}));

import { getFavorites, removeFavorite } from "../utils/favoriteUtils";


const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// --- MOCK STORE FACTORY ---
const createMockStore = (state: any) => ({
  getState: () => state,
  dispatch: jest.fn(),
  subscribe: jest.fn(),
});

const renderFav = (state: any) => {
  const store = createMockStore(state);

  return render(
    <Provider store={store as any}>
      <BrowserRouter>
        <Favorites />
      </BrowserRouter>
    </Provider>
  );
};

describe("Favorites Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("asks user to login when user is null", () => {
    renderFav({ auth: { user: null } });

    expect(
      screen.getByText("Please login to view your favorites.")
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Go to Login"));
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("shows empty favorites message", () => {
    (getFavorites as jest.Mock).mockReturnValue([]);

    renderFav({
      auth: { user: { username: "john" } },
    });

    expect(screen.getByText("No favorites added yet.")).toBeInTheDocument();
  });

  test("renders favorite items", () => {
    (getFavorites as jest.Mock).mockReturnValue([
      {
        url: "u1",
        title: "Fav Article",
        abstract: "Nice article",
        multimedia: [],
      },
    ]);

    renderFav({
      auth: { user: { username: "john" } },
    });

    expect(screen.getByText("Fav Article")).toBeInTheDocument();
  });

  test("navigates to article detail when card clicked", () => {
    (getFavorites as jest.Mock).mockReturnValue([
      {
        url: "u1",
        title: "Article Click",
        abstract: "Nice article",
        multimedia: [],
      },
    ]);

    renderFav({
      auth: { user: { username: "john" } },
    });

    fireEvent.click(screen.getByText("Article Click"));

    expect(mockNavigate).toHaveBeenCalledWith("/article", {
      state: {
        article: {
          url: "u1",
          title: "Article Click",
          abstract: "Nice article",
          multimedia: [],
        },
      },
    });
  });

  test("removes favorite on delete click", () => {
    (getFavorites as jest.Mock).mockReturnValue([
      {
        url: "u1",
        title: "Delete Me",
        abstract: "Test",
        multimedia: [],
      },
    ]);

    renderFav({
      auth: { user: { username: "john" } },
    });

    fireEvent.click(screen.getByRole("button")); 

    expect(removeFavorite).toHaveBeenCalledWith("john", "u1");
    expect(getFavorites).toHaveBeenCalledTimes(2); 
  });
});
