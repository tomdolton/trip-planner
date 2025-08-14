import { useDispatch } from "react-redux";

import { Activity } from "@/types/trip";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ActivityIcon } from "@/components/ui/ActivityIcon";
import { Badge } from "@/components/ui/badge";

import { groupActivitiesByDate } from "@/lib/utils/data";
import { formatDateWithDay, formatTimeRange } from "@/lib/utils/dateTime";

import { openDialog } from "@/store/uiDialogSlice";

export function TripActivities({ activities }: { activities: Activity[] }) {
  const dispatch = useDispatch();
  const grouped = groupActivitiesByDate(activities);

  return (
    <Accordion type="multiple" defaultValue={Object.keys(grouped)} className="space-y-4">
      {Object.entries(grouped).map(([date, acts]) => (
        <AccordionItem key={date} value={date}>
          <AccordionTrigger className="px-4 py-2 hover:no-underline cursor-pointer items-center gap-8">
            <Badge variant="green">
              <h3 className="text-xs font-medium">{formatDateWithDay(date)}</h3>
            </Badge>

            <span className="text-xs text-muted-foreground font-medium mr-auto">
              {acts.length} activities
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
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
                      {act.notes && (
                        <div className="text-sm text-muted-foreground">{act.notes}</div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
