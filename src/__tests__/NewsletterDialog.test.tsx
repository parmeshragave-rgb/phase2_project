import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import NewsletterDialog from "../Components/NewsletterDialog";

jest.useFakeTimers();

describe("NewsletterDialog", () => {
  let onClose: jest.Mock;
  let onSuccess: jest.Mock;

  beforeEach(() => {
    onClose = jest.fn();
    onSuccess = jest.fn();
  });

  function renderDialog(open = true) {
    return render(
      <NewsletterDialog open={open} onClose={onClose} onSuccess={onSuccess} />
    );
  }

  test("renders dialog title and input", () => {
    renderDialog();

    expect(
      screen.getByText("Subscribe to our Newsletter")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
  });

  test("shows error when email is empty", () => {
    renderDialog();

    fireEvent.click(screen.getByText("Subscribe"));

    expect(screen.getByText("Email is required")).toBeInTheDocument();
  });

  test("shows error when email is invalid", () => {
    renderDialog();

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "invalid" },
    });

    fireEvent.click(screen.getByText("Subscribe"));

    expect(
      screen.getByText("Please enter a valid email")
    ).toBeInTheDocument();
  });

  test("shows success message for valid email", () => {
    renderDialog();

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "valid@email.com" },
    });

    fireEvent.click(screen.getByText("Subscribe"));

    expect(
      screen.getByText("You have successfully subscribed!")
    ).toBeInTheDocument();
  });

  test("calls onSuccess after delay when valid", () => {
    renderDialog();

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "valid@email.com" },
    });

    fireEvent.click(screen.getByText("Subscribe"));

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  test("cancel button triggers onClose", () => {
    renderDialog();

    fireEvent.click(screen.getByText("Cancel"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
