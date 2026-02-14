import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

describe("demo app", () => {
  it("renders navigation heading", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText("react-datalist-input demos")).toBeInTheDocument();
  });
});
