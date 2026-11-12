import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Page } from "./Page";

describe("Page", () => {
  it("renders the title as the h1 with description and actions", () => {
    render(
      <Page title="Curation" description="Manage edges" actions={<button>New</button>}>
        content
      </Page>,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Curation" })).toBeInTheDocument();
    expect(screen.getByText("Manage edges")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "New" })).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveTextContent("content");
  });

  it("limits the document column by width", () => {
    const { rerender } = render(<Page title="T">x</Page>);
    expect(screen.getByText("x").className).toContain("--layout-page-max-w)");
    rerender(<Page title="T" width="narrow">x</Page>);
    expect(screen.getByText("x").className).toContain("--layout-page-max-w-narrow");
    rerender(<Page title="T" width="full">x</Page>);
    expect(screen.getByText("x").className).toContain("max-w-none");
  });

  it("keeps a visually hidden title in the accessibility tree", () => {
    render(<Page title="Map" visuallyHiddenTitle>x</Page>);
    const h1 = screen.getByRole("heading", { level: 1, name: "Map" });
    expect(h1.className).toContain("sr-only");
  });

  it("canvas layout renders the title and children without the document column", () => {
    render(
      <Page title="Map" layout="canvas" visuallyHiddenTitle data-testid="page">
        <div>canvas</div>
      </Page>,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Map" })).toBeInTheDocument();
    expect(screen.getByTestId("page")).toHaveClass("flex-col");
    expect(screen.getByText("canvas").parentElement).toBe(screen.getByTestId("page"));
  });

  it("passes data attributes through", () => {
    render(<Page title="T" data-testid="p">x</Page>);
    expect(screen.getByTestId("p")).toBeInTheDocument();
  });

  it("keeps an sr-only h1 inside the header when a hidden title has actions", () => {
    render(
      <Page title="Map" visuallyHiddenTitle actions={<button>Go</button>}>
        x
      </Page>,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Map" }).className).toContain("sr-only");
    expect(screen.getByRole("button", { name: "Go" })).toBeInTheDocument();
  });
});
