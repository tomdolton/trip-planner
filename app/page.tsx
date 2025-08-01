import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 ">
      <div className="flex flex-col gap-8 row-start-2 items-center ">
        <h1 className="text-4xl font-bold">Trip Planner</h1>

        <Button asChild variant="outline" className="text-white">
          <Link href="/trips" className="text-white">
            View Trips
          </Link>
        </Button>
      </div>
    </div>
  );
}
