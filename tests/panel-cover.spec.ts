import { expect, test } from "@playwright/test";

for (const expanded of [false, true]) {
  test(`cover and content scroll together, expanded=${expanded}`, async ({ page }) => {
    await page.goto(`/?panelCover&tall${expanded ? "&expanded" : ""}`);
    const cover = page.getByRole("img", { name: "Demo cover" });
    const scroller = page.locator("[data-panel-cover-scroll]");
    const before = await cover.boundingBox();
    expect(before).not.toBeNull();
    await scroller.evaluate(el => { el.scrollTop = 200; });
    await expect.poll(async () => (await cover.boundingBox())!.y).toBe(before!.y - 200);
    await page.getByRole("button", { name: "Last action" }).click();
    await expect(page.getByRole("button", { name: "Last action" })).toBeInViewport();
    if (expanded) await expect(page.getByText("Family column")).toBeAttached();
  });
}

test("cover starts behind floating search and credits stay in the body", async ({ page }) => {
  await page.goto("/?panelCover");
  const cover = (await page.getByRole("img").boundingBox())!;
  const search = (await page.getByRole("textbox", { name: "Search" }).boundingBox())!;
  expect(cover.y).toBeLessThan(search.y);
  expect(cover.y + cover.height).toBeGreaterThan(search.y + search.height);
  await expect(page.getByText("Photo credit")).toBeVisible();
});

test("mobile grabber and overlaid header controls remain clickable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?panelCover");
  await page.getByRole("button", { name: "Toggle width" }).click();
  await expect(page.getByText("Family column")).toBeVisible();
  await page.getByRole("button", { name: "Toggle width" }).click();
  await page.getByRole("button", { name: "Resize panel" }).click();
  await expect(page.getByRole("button", { name: "Resize panel" })).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(page.getByText("Panel closed")).toBeVisible();
});

test("panels without a cover keep their content reachable", async ({ page }) => {
  await page.goto("/?panelCover&noCover");
  await expect(page.locator("[data-panel-cover-scroll]")).toHaveCount(0);
  await page.getByRole("button", { name: "Last action" }).click();
  await expect(page.getByRole("button", { name: "Last action" })).toBeInViewport();
});
