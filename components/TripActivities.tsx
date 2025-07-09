import { groupActivitiesByDate } from "@/lib/groupActivitiesByDate";
import { Activity } from "@/types/trip";

export function TripActivities({ activities }: { activities: Activity[] }) {
  const grouped = groupActivitiesByDate(activities);

  return (
    <div>
      {Object.entries(grouped).map(([date, acts]) => (
        <div key={date} className="mb-4">
          <h3 className="text-lg font-semibold mb-2">📅 {date}</h3>
          <ul className="space-y-2">
            {acts.map((act) => (
              <li key={act.id} className="border p-2 rounded">
                <div className="font-medium">{act.name}</div>
                {act.start_time && <div className="text-sm">🕒 {act.start_time}</div>}
                {act.notes && <div className="text-sm text-muted-foreground">{act.notes}</div>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
