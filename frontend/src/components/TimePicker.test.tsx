import { fireEvent, render, screen } from "@testing-library/react";
import TimePicker from "./TimePicker";

function setup(props: Partial<React.ComponentProps<typeof TimePicker>> = {}) {
  const onChange = jest.fn();
  render(
    <>
      <span id="l">Start time</span>
      <TimePicker name="startTime" labelledBy="l" value="" isDisabled={() => false} onChange={onChange} {...props} />
    </>,
  );
  fireEvent.click(screen.getByRole("button", { name: /^Start time/ }));
  return onChange;
}

describe("TimePicker (24 hour)", () => {
  it("picks the hour, then the minutes, and returns HH:mm", () => {
    const onChange = setup();
    fireEvent.click(screen.getByRole("button", { name: "18 o'clock" }));
    fireEvent.click(screen.getByRole("button", { name: "18:30" }));
    expect(onChange).toHaveBeenCalledWith("18:30");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("covers the whole day: 00 is midnight, 12 is noon", () => {
    const onChange = setup();
    fireEvent.click(screen.getByRole("button", { name: "00 o'clock" }));
    fireEvent.click(screen.getByRole("button", { name: "00:00" }));
    expect(onChange).toHaveBeenLastCalledWith("00:00");
    fireEvent.click(screen.getByRole("button", { name: /^Start time/ }));
    fireEvent.click(screen.getByRole("button", { name: "12 o'clock" }));
    fireEvent.click(screen.getByRole("button", { name: "12:30" }));
    expect(onChange).toHaveBeenLastCalledWith("12:30");
  });

  it("disables hours that have passed", () => {
    setup({ isDisabled: (s) => s < "09:00" });
    expect(screen.getByRole("button", { name: "08 o'clock" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "09 o'clock" })).toBeEnabled();
  });

  it("shows the current value as HH:mm", () => {
    render(<TimePicker name="t" labelledBy="x" value="18:30" isDisabled={() => false} onChange={() => {}} />);
    expect(screen.getByRole("button")).toHaveTextContent("18:30");
  });
});
