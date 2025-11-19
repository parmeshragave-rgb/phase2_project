import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "../Components/Footer";

describe("Footer Component", () => {
  test("renders brand name", () => {
    render(<Footer />);
    expect(screen.getByText("Newsly.")).toBeInTheDocument();
  });

  test("renders description text", () => {
    render(<Footer />);

    expect(
      screen.getByText(/Your personalized gateway to global news/i)
    ).toBeInTheDocument();
  });

  test("renders copyright year", () => {
    render(<Footer />);

    const year = new Date().getFullYear();
    expect(
      screen.getByText(`© ${year} Newsly. All rights reserved.`)
    ).toBeInTheDocument();
  });
});
