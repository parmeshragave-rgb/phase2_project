import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../Pages/Login";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import configureStore from "redux-mock-store";


const mockStore = configureStore([]);


const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));


const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
}));

// Mock Google Login button
jest.mock("@react-oauth/google", () => ({
  GoogleLogin: ({ onSuccess }: any) => (
    <button onClick={() => onSuccess({ credential: "google-token" })}>
      Google Login Mock
    </button>
  ),
}));

// Mock jwtDecode
jest.mock("jwt-decode", () => ({
  jwtDecode: () => ({
    name: "Google User",
    email: "google@test.com",
    picture: "pic.png",
    sub: "123",
  }),
}));

const setup = () => {
  const store = mockStore({});
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </Provider>
  );
};

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

test("renders login heading", () => {
  setup();
  expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();

});

test("toggles to signup mode", () => {
  setup();
  fireEvent.click(screen.getByText(/new user\? sign up/i)); 

  
  expect(
    screen.getByRole("heading", { name: /sign up/i })
  ).toBeInTheDocument();
});

test("shows validation errors on empty submit", () => {
  setup();
  fireEvent.click(screen.getByRole("button", { name: "Login" }));
  expect(screen.getByText("Username required")).toBeInTheDocument();
  expect(screen.getByText("Password required")).toBeInTheDocument();
});

test("invalid login shows message", () => {
  localStorage.setItem("users", JSON.stringify([{ username: "x", password: "y" }]));

  setup();

  fireEvent.change(screen.getByLabelText("Username"), {
    target: { value: "john" },
  });
  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "wrongpass" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Login" }));

  expect(screen.getByText("Invalid username or password!")).toBeInTheDocument();
});

test("successful local login works", () => {
  localStorage.setItem(
    "users",
    JSON.stringify([
      { id: 1, username: "john", password: "123456", email: "john@test.com" },
    ])
  );

  setup();

  fireEvent.change(screen.getByLabelText("Username"), {
    target: { value: "john" },
  });
  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "123456" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Login" }));

  expect(mockDispatch).toHaveBeenCalledTimes(1);
  expect(mockNavigate).toHaveBeenCalledWith("/");
});

test("signup works correctly", () => {
  setup();

  fireEvent.click(screen.getByText("New user? Sign up"));

  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "test@test.com" },
  });
  fireEvent.change(screen.getByLabelText("Username"), {
    target: { value: "newuser" },
  });
  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "123456" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

  expect(mockDispatch).toHaveBeenCalledTimes(1);
  expect(mockNavigate).toHaveBeenCalledWith("/");
});

test("Google login works", () => {
  setup();

  fireEvent.click(screen.getByText("Google Login Mock"));

  expect(mockDispatch).toHaveBeenCalledTimes(1);
  expect(mockNavigate).toHaveBeenCalledWith("/");
});
