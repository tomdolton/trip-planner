import { useDispatch } from "react-redux";

import { Activity } from "@/types/trip";

import { formatTimeRange } from "@/lib/utils/formatTimeRange";
import { groupActivitiesByDate } from "@/lib/utils/groupActivitiesByDate";

import { openDialog } from "@/store/uiDialogSlice";

export function TripActivities({ activities }: { activities: Activity[] }) {
  const dispatch = useDispatch();
  const grouped = groupActivitiesByDate(activities);

  return (
    <div>
      {Object.entries(grouped).map(([date, acts]) => (
        <div key={date} className="mb-4">
          <h3 className="text-lg font-semibold mb-2">📅 {date}</h3>
          <ul className="space-y-2">
            {acts.map((act) => (
              <li
                onClick={() => dispatch(openDialog({ type: "activity", entity: act }))}
                key={act.id}
                className="border p-2 rounded"
              >
                <div className="font-medium">{act.name}</div>
                <p>{formatTimeRange(act.start_time, act.end_time)}</p>
                {act.notes && <div className="text-sm text-muted-foreground">{act.notes}</div>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
