import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EditableSlider } from "./editableSlider";

describe("EditableSlider", () => {
  it("renders the label and formatted value", () => {
    render(<EditableSlider label="Intensity" value={21} min={0} max={100} step={1} unit="%" onChange={vi.fn()} />);
    expect(screen.getByText("Intensity")).toBeInTheDocument();
    expect(screen.getByText("21%")).toBeInTheDocument();
  });

  it("opens numeric editor on double click", () => {
    render(<EditableSlider label="Dot Size" value={12} min={2} max={32} step={1} onChange={vi.fn()} />);
    const valueButton = screen.getByLabelText("Edit dot size value");
    fireEvent.doubleClick(valueButton);
    const input = screen.getByLabelText("Edit dot size value");
    expect(input.tagName).toBe("INPUT");
  });

  it("commits a valid typed value on Enter", () => {
    const onChange = vi.fn();
    render(<EditableSlider label="Intensity" value={21} min={0} max={100} step={1} unit="%" onChange={onChange} />);
    fireEvent.doubleClick(screen.getByLabelText("Edit intensity value"));
    const input = screen.getByLabelText("Edit intensity value") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "45" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith(45);
  });

  it("accepts percentage input with % symbol", () => {
    const onChange = vi.fn();
    render(<EditableSlider label="Intensity" value={21} min={0} max={100} step={1} unit="%" onChange={onChange} />);
    fireEvent.doubleClick(screen.getByLabelText("Edit intensity value"));
    const input = screen.getByLabelText("Edit intensity value") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "67%" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith(67);
  });

  it("clamps values to min/max", () => {
    const onChange = vi.fn();
    render(<EditableSlider label="Intensity" value={21} min={0} max={100} step={1} unit="%" onChange={onChange} />);
    fireEvent.doubleClick(screen.getByLabelText("Edit intensity value"));
    const input = screen.getByLabelText("Edit intensity value") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "150" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith(100);
  });

  it("snaps values to step", () => {
    const onChange = vi.fn();
    render(<EditableSlider label="Zoom" value={1} min={1} max={3} step={0.05} onChange={onChange} />);
    fireEvent.doubleClick(screen.getByLabelText("Edit zoom value"));
    const input = screen.getByLabelText("Edit zoom value") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "1.23" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith(1.25);
  });

  it("cancels edit on Escape", () => {
    const onChange = vi.fn();
    render(<EditableSlider label="Intensity" value={21} min={0} max={100} step={1} unit="%" onChange={onChange} />);
    fireEvent.doubleClick(screen.getByLabelText("Edit intensity value"));
    const input = screen.getByLabelText("Edit intensity value") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "99" } });
    fireEvent.keyDown(input, { key: "Escape" });
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByText("21%")).toBeInTheDocument();
  });

  it("restores previous value on invalid input", () => {
    const onChange = vi.fn();
    render(<EditableSlider label="Intensity" value={21} min={0} max={100} step={1} unit="%" onChange={onChange} />);
    fireEvent.doubleClick(screen.getByLabelText("Edit intensity value"));
    const input = screen.getByLabelText("Edit intensity value") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "abc" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByText("21%")).toBeInTheDocument();
  });

  it("calls onCommit when a value is committed", () => {
    const onCommit = vi.fn();
    render(
      <EditableSlider
        label="Intensity"
        value={21}
        min={0}
        max={100}
        step={1}
        unit="%"
        onChange={vi.fn()}
        onCommit={onCommit}
      />
    );
    fireEvent.doubleClick(screen.getByLabelText("Edit intensity value"));
    const input = screen.getByLabelText("Edit intensity value") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "50" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onCommit).toHaveBeenCalled();
  });
});
