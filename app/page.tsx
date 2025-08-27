import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 sm:p-20">
      <div className="row-start-2 flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold">Trip Planner</h1>

        <Button asChild variant="outline">
          <Link href="/trips">View Trips</Link>
        </Button>
      </div>
    </div>
  );
}
