import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import Search from "../Pages/Search";
import * as searchActions from "../redux/search/SearchActions";

jest.useFakeTimers();


jest.mock("../redux/search/SearchActions", () => ({
  fetchSearchArticles: jest.fn(() => ({ type: "TEST" })),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));


const createMockStore = (state: any) => ({
  getState: () => state,
  dispatch: jest.fn(),
  subscribe: jest.fn(),
});

const initialState = {
  search: {
    articles: [],
    loading: false,
    noResult: false,
    totalPages: 1,
  },
  auth: {
    user: null,
    token: null,
    isAuthenticated: false,
  },
};

const setup = (state = initialState) => {
  const store = createMockStore(state);

  return render(
    <Provider store={store as any}>
      <BrowserRouter>
        <Search />
      </BrowserRouter>
    </Provider>
  );
};

describe("Search Page", () => {
  test("renders search input", () => {
    setup();
    expect(screen.getByPlaceholderText("Search articles...")).toBeInTheDocument();
  });

  test("typing triggers dispatch", async () => {
    setup();

    fireEvent.change(screen.getByPlaceholderText("Search articles..."), {
      target: { value: "india" },
    });

    await act(async () => {
      jest.runAllTimers();
    });

    expect(searchActions.fetchSearchArticles).toHaveBeenCalled();
  });

  test("opens filter section", () => {
    setup();
    const filterButtons = screen.getAllByRole("button");
    const filterIconBtn = filterButtons[filterButtons.length - 1];

    fireEvent.click(filterIconBtn);

    expect(screen.getByText("Topic")).toBeInTheDocument();
  });

  test("topic chip triggers dispatch", async () => {
    setup();

    const filterButtons = screen.getAllByRole("button");
    const filterBtn = filterButtons[filterButtons.length - 1];
    fireEvent.click(filterBtn);

    fireEvent.click(screen.getByText("Arts"));

    await act(async () => {
      jest.runAllTimers();
    });

    expect(searchActions.fetchSearchArticles).toHaveBeenCalled();
  });

  test("shows no result message", () => {
    setup({
      search: {
        articles: [],
        loading: false,
        noResult: true,
        totalPages: 1,
      },
      auth: { user: null, token: null, isAuthenticated: false },
    });

    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  test("renders article card & navigates", () => {
    setup({
      search: {
        articles: [
          {
            headline: { main: "Test Headline" },
            abstract: "Test abstract",
            multimedia: [],
          },
        ],
        loading: false,
        noResult: false,
        totalPages: 1,
      },
      auth: { user: null, token: null, isAuthenticated: false },
    });

    fireEvent.click(screen.getByText("Test Headline"));
    expect(mockNavigate).toHaveBeenCalled();
  });

  test("pagination triggers search", () => {
    setup({
      search: {
        articles: [
          {
            headline: { main: "AAA" },
            abstract: "BBB",
            multimedia: [],
          },
        ],
        loading: false,
        noResult: false,
        totalPages: 3,
      },
      auth: { user: null, token: null, isAuthenticated: false },
    });

    fireEvent.click(screen.getByRole("button", { name: /page 2/i }));

    expect(searchActions.fetchSearchArticles).toHaveBeenCalled();
  });
});
