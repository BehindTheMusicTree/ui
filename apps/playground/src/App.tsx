import { useRef, useState } from "react";
import {
  Button,
  IconTextButton,
  Input,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Skeleton,
  RingLoader,
  Pagination,
  DetailPanel,
  Breadcrumb,
  PanelSection,
  PanelBleed,
  useObscuredInset,
} from "@behindthemusictree/ui";
import { FaStar } from "react-icons/fa";

function DetailPanelDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [side, setSide] = useState<"left" | "right">("left");
  const inset = useObscuredInset(ref);

  return (
    <div className="space-y-2">
      <div className="space-x-2">
        <Button onClick={() => setOpen(true)}>Open</Button>
        <Button variant="outline" onClick={() => setSide(side === "left" ? "right" : "left")}>
          Side: {side}
        </Button>
        <Button variant="outline" onClick={() => setExpanded(!expanded)}>
          Expanded: {String(expanded)}
        </Button>
        <span className="text-sm">inset {JSON.stringify(inset)}</span>
      </div>
      <div className="relative h-[28rem] overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface-muted)]">
        {open && (
          <DetailPanel
            ref={ref}
            title="Rock"
            side={side}
            collapsed={collapsed}
            expanded={expanded}
            onExpandedChange={setExpanded}
            onClose={() => setOpen(false)}
            aside={<PanelSection title="Aside">Artists</PanelSection>}
            edgeTab={{
              edge: { label: collapsed ? "Show panel" : "Hide panel", onClick: () => setCollapsed(!collapsed) },
              center: { label: "Expand panel", onClick: () => setExpanded(!expanded), expanded },
            }}
          >
            <PanelSection title="About">Detail panel body.</PanelSection>
            <PanelBleed padded className="border-y border-[var(--color-border)] py-2">
              Bleed band
            </PanelBleed>
            <PanelSection title="History">Second section.</PanelSection>
          </DetailPanel>
        )}
      </div>
    </div>
  );
}

function BreadcrumbDemo() {
  const path = ["Rock", "Punk", "Hardcore", "Crust", "D-beat"];
  const [depth, setDepth] = useState(path.length);
  const items = path.slice(0, depth).map((name) => ({ id: name, label: name }));
  return (
    <section className="relative h-24 rounded-lg bg-gray-100">
      {depth > 0 && (
        <Breadcrumb
          className="absolute left-1/2 top-3 max-w-[calc(100%-24px)] -translate-x-1/2"
          home={{ label: "All genres", onSelect: () => setDepth(0) }}
          items={items}
          onSelect={(id) => setDepth(path.indexOf(id) + 1)}
          onSelectCurrent={() => setDepth(path.length)}
        />
      )}
    </section>
  );
}

export function App() {
  const [page, setPage] = useState(1);

  return (
    <div className="p-8 space-y-8 max-w-2xl mx-auto">
      <section className="space-x-2">
        <Button>Default</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="secondary">Secondary</Button>
        <Button disabled>Disabled</Button>
        <IconTextButton icon={FaStar} text="Favorite" />
      </section>

      <section>
        <Input placeholder="Type something..." />
      </section>

      <section>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Foo</TableCell>
              <TableCell>Bar</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      <section className="flex items-center gap-4">
        <Skeleton className="h-8 w-32" />
        <RingLoader />
      </section>

      <BreadcrumbDemo />

      <DetailPanelDemo />

      <section>
        <Pagination currentPage={page} totalPages={5} onPageChange={setPage} />
      </section>
    </div>
  );
}
