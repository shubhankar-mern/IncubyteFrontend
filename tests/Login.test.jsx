
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import Login from "../src/pages/Login";

const mockNavigate = vi.fn();
const mockCheckAuth = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../src/context/AuthContext", () => ({
  useAuth: () => ({
    checkAuth: mockCheckAuth,
  }),
}));

vi.mock("../src/services/api", () => ({
  default: {
    defaults: { baseURL: "http://localhost:3000/api" },
    post: vi.fn(),
  },
}));

afterEach(() => {
  cleanup();
});

describe("Login", () => {
  it("renders email and password fields", () => {
    render(<Login />);

    expect(screen.getByLabelText("Work email")).toBeTruthy();
    expect(screen.getByLabelText("Password")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Sign in" })
    ).toBeTruthy();
  });

  it("shows validation when credentials are empty", () => {
    render(<Login />);

    const form = document.querySelector("form");
    fireEvent.submit(form);

    expect(
      screen.getByText("Please enter your email and password.")
    ).toBeTruthy();
  });
});
