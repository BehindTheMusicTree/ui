import { useState } from "react";
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
} from "@behindthemusictree/ui";
import { FaStar } from "react-icons/fa";

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

      <section>
        <Pagination currentPage={page} totalPages={5} onPageChange={setPage} />
      </section>
    </div>
  );
}
