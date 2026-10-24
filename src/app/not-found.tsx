import Link from "next/link";
import { PageHeader } from "@/components/blocks";

export default function NotFound() {
  return (
    <PageHeader label="404" title="Off the map." lede="That page doesn’t exist. It may have moved when the site was rebuilt.">
      <div className="ctas">
        <Link href="/" className="btn btn-solid">
          Home
        </Link>
        <Link href="/#machines" className="btn">
          Machines
        </Link>
      </div>
    </PageHeader>
  );
}
