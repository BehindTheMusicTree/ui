import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Alert } from "./Alert";
import { Card } from "./Card";
import { EmptyState } from "./EmptyState";
import { TextLink, textLinkClassName } from "./TextLink";

describe("Card", () => {
  it("renders a titled section with description and actions", () => {
    render(
      <Card title="Edges" description="All links" actions={<button>Add</button>}>
        body
      </Card>,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Edges" })).toBeInTheDocument();
    expect(screen.getByText("All links")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
    expect(screen.getByText("body")).toBeInTheDocument();
  });

  it("omits the header without title, description or actions", () => {
    render(<Card>only body</Card>);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });
});

describe("Alert", () => {
  it("announces errors with role alert", () => {
    render(<Alert variant="error">Failed</Alert>);
    expect(screen.getByRole("alert")).toHaveTextContent("Failed");
  });

  it("uses role status for info and success", () => {
    render(
      <>
        <Alert>Info</Alert>
        <Alert variant="success">Done</Alert>
      </>,
    );
    expect(screen.getAllByRole("status")).toHaveLength(2);
  });
});

describe("EmptyState", () => {
  it("shows title, description and action", () => {
    render(<EmptyState title="Nothing yet" description="Add one" action={<button>Create</button>} />);
    expect(screen.getByText("Nothing yet")).toBeInTheDocument();
    expect(screen.getByText("Add one")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
  });
});

describe("TextLink", () => {
  it("renders an anchor with the shared class", () => {
    render(<TextLink href="/x">Go</TextLink>);
    const link = screen.getByRole("link", { name: "Go" });
    expect(link).toHaveAttribute("href", "/x");
    expect(link.className).toContain(textLinkClassName.split(" ")[0]);
  });
});
