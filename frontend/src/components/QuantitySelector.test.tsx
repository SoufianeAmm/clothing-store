import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuantitySelector from "./QuantitySelector";

describe("QuantitySelector", () => {
  it("calls onChange with quantity + 1 when increment is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<QuantitySelector quantity={2} onChange={onChange} />);

    await user.click(screen.getByLabelText("Increase quantity"));

    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("calls onChange with quantity - 1 when decrement is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<QuantitySelector quantity={2} onChange={onChange} />);

    await user.click(screen.getByLabelText("Decrease quantity"));

    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("disables decrement at quantity 1", () => {
    render(<QuantitySelector quantity={1} onChange={vi.fn()} />);
    expect(screen.getByLabelText("Decrease quantity")).toBeDisabled();
  });

  it("disables increment once max is reached", () => {
    render(<QuantitySelector quantity={5} onChange={vi.fn()} max={5} />);
    expect(screen.getByLabelText("Increase quantity")).toBeDisabled();
  });

  it("does not disable increment when under max", () => {
    render(<QuantitySelector quantity={3} onChange={vi.fn()} max={5} />);
    expect(screen.getByLabelText("Increase quantity")).not.toBeDisabled();
  });
});
