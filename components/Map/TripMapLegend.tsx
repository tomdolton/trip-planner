export function TripMapLegend() {
  return (
    <>
      <h4 className="mb-6 text-center text-lg font-semibold md:text-start md:text-xl">
        Map Legend
      </h4>
      <div className="grid grid-cols-2 gap-4 text-xs font-medium md:text-base">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="bg-chart-1 size-3 rounded-full md:size-4"></div>
            <span>Accommodation</span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="bg-chart-2 size-3 rounded-full md:size-4"></div>
            <span>Activity</span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="bg-chart-3 size-3 rounded-full md:size-4"></div>
            <span>Location</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="bg-chart-4 size-3 rounded-full md:size-4"></div>
            <span>Journey Departure</span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="bg-chart-5 size-3 rounded-full md:size-4"></div>
            <span>Journey Arrival</span>
          </div>
        </div>
      </div>
    </>
  );
}
