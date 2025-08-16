export function TripMapLegend() {
  return (
    <>
      <h4 className="font-semibold text-xl mb-6">Map Legend</h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="size-4 rounded-full bg-blue-500"></div>
            <span className="font-medium">Accommodation</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="size-4 rounded-full bg-red-500"></div>
            <span className="font-medium">Activity</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="size-4 rounded-full bg-green-500"></div>
            <span className="font-medium">Location</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="size-4 rounded-full bg-amber-500"></div>
            <span className="font-medium">Journey Departure</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="size-4 rounded-full bg-purple-500"></div>
            <span className="font-medium">Journey Arrival</span>
          </div>
        </div>
      </div>
    </>
  );
}
