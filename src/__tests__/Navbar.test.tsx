import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import Navbar from "../Components/Navbar";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

jest.mock("../Components/NewsletterDialog", () => {
  return ({ open }: any) => (open ? <div>Newsletter Dialog</div> : null);
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../redux/auth/authActions", () => ({
  logout: () => ({ type: "LOGOUT" }),
}));

jest.mock("../redux/subscription/subscriptionActions", () => ({
  setSubscribed: (v: boolean) => ({ type: "SET_SUB", payload: v }),
}));

const mockDispatch = jest.fn();

function renderNavbar(state: any) {
  const store = {
    getState: () => state,
    dispatch: mockDispatch,
    subscribe: jest.fn(),
  };

  return render(
    <Provider store={store}>
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    </Provider>
  );
}

describe("Navbar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("shows Login button when user not authenticated", () => {
    renderNavbar({
      auth: { isAuthenticated: false, user: null },
      subscription: { subscribed: false },
    });

    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("shows Subscribe button when not subscribed", () => {
    renderNavbar({
      auth: { isAuthenticated: false, user: null },
      subscription: { subscribed: false },
    });

    expect(screen.getByText("Subscribe")).toBeInTheDocument();
  });

  test("opens newsletter dialog when clicking Subscribe", () => {
    renderNavbar({
      auth: { isAuthenticated: false, user: null },
      subscription: { subscribed: false },
    });

    fireEvent.click(screen.getByText("Subscribe"));
    expect(screen.getByText("Newsletter Dialog")).toBeInTheDocument();
  });

  test("dispatches unsubscribe action when already subscribed", () => {
    renderNavbar({
      auth: { isAuthenticated: false, user: null },
      subscription: { subscribed: true },
    });

    fireEvent.click(screen.getByText("Unsubscribe"));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "SET_SUB",
      payload: false,
    });
  });

  test("shows user avatar when authenticated", () => {
    renderNavbar({
      auth: {
        isAuthenticated: true,
        user: { username: "Ragav", picture: "" },
      },
      subscription: { subscribed: false },
    });

    expect(screen.getByText("R")).toBeInTheDocument();
  });

  test("opens avatar menu and triggers logout", () => {
    renderNavbar({
      auth: {
        isAuthenticated: true,
        user: { username: "Ragav", picture: "" },
      },
      subscription: { subscribed: false },
    });

    fireEvent.click(screen.getByText("R"));
    fireEvent.click(screen.getByText("Logout"));

    expect(mockDispatch).toHaveBeenCalledWith({ type: "LOGOUT" });
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("opens drawer on mobile menu click", () => {
    renderNavbar({
      auth: { isAuthenticated: false, user: null },
      subscription: { subscribed: false },
    });

    fireEvent.click(screen.getByTestId("MenuIcon"));

    const drawer = screen.getByRole("presentation");

    expect(within(drawer).getByText("Home")).toBeInTheDocument();
  });

  test("clicking a menu item navigates", () => {
    renderNavbar({
      auth: { isAuthenticated: false, user: null },
      subscription: { subscribed: false },
    });

    fireEvent.click(screen.getByTestId("MenuIcon"));

    const drawer = screen.getByRole("presentation");

    fireEvent.click(within(drawer).getByText("Books"));

    expect(mockNavigate).toHaveBeenCalledWith("/books");
  });

  test("clicks the center brand logo and navigates home", () => {
    renderNavbar({
      auth: { isAuthenticated: false, user: null },
      subscription: { subscribed: false },
    });

    fireEvent.click(screen.getByText("News"));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
