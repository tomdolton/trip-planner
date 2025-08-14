import { useDispatch } from "react-redux";

import { Activity } from "@/types/trip";

import { ActivityIcon } from "@/components/ui/ActivityIcon";
import { Badge } from "@/components/ui/badge";

import { groupActivitiesByDate } from "@/lib/utils/data";
import { formatDateWithDay, formatTimeRange } from "@/lib/utils/dateTime";

import { openDialog } from "@/store/uiDialogSlice";

export function TripActivities({ activities }: { activities: Activity[] }) {
  const dispatch = useDispatch();
  const grouped = groupActivitiesByDate(activities);

  return (
    <div>
      {Object.entries(grouped).map(([date, acts]) => (
        <div key={date} className="mb-4">
          <Badge variant="green" className="mb-2">
            <h3 className="text-xs font-medium">{formatDateWithDay(date)}</h3>
          </Badge>
          <ul className="space-y-2">
            {acts.map((act) => (
              <li
                onClick={() => dispatch(openDialog({ type: "activity", entity: act }))}
                key={act.id}
                className="border p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ActivityIcon activityType={act.activity_type} />
                  <div className="flex-1">
                    <div className="font-medium">{act.name}</div>
                    <p>{formatTimeRange(act.start_time, act.end_time)}</p>
                    {act.notes && <div className="text-sm text-muted-foreground">{act.notes}</div>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
