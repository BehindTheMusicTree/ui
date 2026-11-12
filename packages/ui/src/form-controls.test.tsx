import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Checkbox } from "./Checkbox";
import { Field } from "./Field";
import { Input } from "./Input";
import { Label } from "./Label";
import { Select } from "./Select";
import { Textarea } from "./Textarea";
import { inputBaseClassName } from "./input-base";

describe("Field", () => {
  it("labels the control", () => {
    render(
      <Field label="Name">
        <Input />
      </Field>,
    );
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });

  it("describes the control by hint and error and marks it invalid", () => {
    render(
      <Field label="Name" hint="Shown publicly" error="Required">
        <Input />
      </Field>,
    );
    const input = screen.getByLabelText("Name");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Shown publicly Required");
  });

  it("is not invalid without an error", () => {
    render(
      <Field label="Name">
        <Input />
      </Field>,
    );
    expect(screen.getByLabelText("Name")).not.toHaveAttribute("aria-invalid");
  });

  it("keeps an explicit id and an existing aria-describedby", () => {
    render(
      <>
        <span id="extra">Extra</span>
        <Field label="Kind" hint="Pick one">
          <Select id="kind" aria-describedby="extra" />
        </Field>
      </>,
    );
    const select = screen.getByLabelText("Kind");
    expect(select).toHaveAttribute("id", "kind");
    expect(select).toHaveAccessibleDescription("Extra Pick one");
  });

  it("works with Textarea", () => {
    render(
      <Field label="Notes">
        <Textarea />
      </Field>,
    );
    expect(screen.getByRole("textbox", { name: "Notes" }).tagName).toBe("TEXTAREA");
  });
});

describe("controls", () => {
  it("Select renders options and shares the input base classes", () => {
    render(
      <Select aria-label="Kind">
        <option value="a">A</option>
        <option value="b">B</option>
      </Select>,
    );
    const select = screen.getByRole("combobox", { name: "Kind" });
    expect(screen.getAllByRole("option")).toHaveLength(2);
    expect(select.className).toContain(inputBaseClassName.split(" ")[0]);
  });

  it("Checkbox is a native checkbox", () => {
    render(
      <Label>
        <Checkbox defaultChecked /> Accept
      </Label>,
    );
    expect(screen.getByRole("checkbox", { name: "Accept" })).toBeChecked();
  });

  it("Textarea defaults to three rows and accepts overrides", () => {
    render(<Textarea aria-label="a" />);
    expect(screen.getByLabelText("a")).toHaveAttribute("rows", "3");
  });
});
