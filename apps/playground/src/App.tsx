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
  PanelSection,
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
          </DetailPanel>
        )}
      </div>
    </div>
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

      <DetailPanelDemo />

      <section>
        <Pagination currentPage={page} totalPages={5} onPageChange={setPage} />
      </section>
    </div>
  );
}
