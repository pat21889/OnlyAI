import { render, screen } from "@testing-library/react";
import FacilityCard from "./FacilityCard";
import type { Facility } from "@/types/facility";

// Delete button imports a server action; not needed for rendering checks.
jest.mock("./DeleteFacilityButton", () => function DeleteStub() { return <button>Delete</button>; });

const facility: Facility = {
  _id: "507f1f77bcf86cd799439011",
  name: "Court A",
  sportType: "Badminton",
  location: "Building 1",
  capacity: 4,
  hourlyRate: 150,
  createdAt: "",
  updatedAt: "",
};

describe("FacilityCard", () => {
  it("shows name, sport type, location, capacity and rate", () => {
    render(<FacilityCard facility={facility} isAdmin={false} />);
    expect(screen.getByRole("link", { name: "Court A" })).toHaveAttribute("href", `/facility/${facility._id}`);
    expect(screen.getByText("Badminton")).toBeInTheDocument();
    expect(screen.getByText("Building 1")).toBeInTheDocument();
    expect(screen.getByText(/Up to 4 people/)).toHaveTextContent("150 THB/hour");
  });

  it("hides Edit/Delete for non-admins", () => {
    render(<FacilityCard facility={facility} isAdmin={false} />);
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  it("shows Edit/Delete for admins", () => {
    render(<FacilityCard facility={facility} isAdmin />);
    expect(screen.getByRole("link", { name: "Edit" })).toHaveAttribute("href", `/admin/facility/${facility._id}/edit`);
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });
});
