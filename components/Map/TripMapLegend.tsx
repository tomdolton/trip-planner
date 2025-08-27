export function TripMapLegend() {
  return (
    <>
      <h4 className="mb-6 text-xl font-semibold">Map Legend</h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-chart-1 size-4 rounded-full"></div>
            <span className="font-medium">Accommodation</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-chart-2 size-4 rounded-full"></div>
            <span className="font-medium">Activity</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-chart-3 size-4 rounded-full"></div>
            <span className="font-medium">Location</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-chart-4 size-4 rounded-full"></div>
            <span className="font-medium">Journey Departure</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-chart-5 size-4 rounded-full"></div>
            <span className="font-medium">Journey Arrival</span>
          </div>
        </div>
      </div>
    </>
  );
}
