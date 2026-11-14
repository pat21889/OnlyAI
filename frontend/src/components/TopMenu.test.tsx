import { render, screen } from "@testing-library/react";
import { getServerSession } from "next-auth";
import TopMenu from "./TopMenu";

jest.mock("next/server", () => ({ connection: jest.fn() }));
jest.mock("next-auth", () => ({ getServerSession: jest.fn() }));
jest.mock("@/app/api/auth/[...nextauth]/authOptions", () => ({ authOptions: {} }));
jest.mock("next-auth/react", () => ({ signOut: jest.fn() }));

const mockSession = getServerSession as jest.Mock;
const user = (role: "admin" | "member") => ({
  user: { id: "1", name: "Alice", email: "a@b.co", role, token: "t" },
});

// TopMenu is an async server component: await it, then render the JSX it returns.
const renderMenu = async () => render(await TopMenu());

describe("TopMenu", () => {
  it("shows Login/Register for guests", async () => {
    mockSession.mockResolvedValue(null);
    await renderMenu();
    expect(screen.getByRole("link", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Register" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Logout" })).not.toBeInTheDocument();
    expect(screen.queryByText("My Bookings")).not.toBeInTheDocument();
  });

  it("shows name and Logout for a member, without admin links", async () => {
    mockSession.mockResolvedValue(user("member"));
    await renderMenu();
    expect(screen.getByTestId("user-name")).toHaveTextContent("Alice (member)");
    expect(screen.getByRole("button", { name: "Logout" })).toBeInTheDocument();
    expect(screen.getByText("My Bookings")).toBeInTheDocument();
    expect(screen.queryByText("Manage Facilities")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Login" })).not.toBeInTheDocument();
  });

  it("shows admin links for admin", async () => {
    mockSession.mockResolvedValue(user("admin"));
    await renderMenu();
    expect(screen.getByText("Manage Facilities")).toBeInTheDocument();
  });
});
