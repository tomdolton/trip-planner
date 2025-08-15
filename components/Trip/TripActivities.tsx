import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";

import { Activity } from "@/types/trip";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ActionMenu, ActionMenuItem, ActionMenuSeparator } from "@/components/ui/ActionMenu";
import { ActivityIcon } from "@/components/ui/ActivityIcon";
import { Badge } from "@/components/ui/badge";
import { ConfirmDeleteDialog } from "@/components/ui/ConfirmDeleteDialog";
import { TripItemCard } from "@/components/ui/TripItemCard";

import { useDeleteActivity } from "@/lib/mutations/useDeleteActivity";
import { groupActivitiesByDate } from "@/lib/utils/data";
import { formatDateWithDay, formatTimeRange } from "@/lib/utils/dateTime";

import { openDialog } from "@/store/uiDialogSlice";

export function TripActivities({ activities, tripId }: { activities: Activity[]; tripId: string }) {
  const dispatch = useDispatch();
  const deleteActivity = useDeleteActivity(tripId);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(null);
  const grouped = groupActivitiesByDate(activities);

  function handleEdit(activity: Activity) {
    dispatch(openDialog({ type: "activity", entity: activity }));
  }

  function handleDelete(activity: Activity) {
    setActivityToDelete(activity);
    setShowDeleteDialog(true);
  }

  function confirmDelete() {
    if (activityToDelete) {
      deleteActivity.mutate({ id: activityToDelete.id });
    }
    setShowDeleteDialog(false);
    setActivityToDelete(null);
  }

  return (
    <>
      <Accordion type="multiple" defaultValue={Object.keys(grouped)} className="space-y-4">
        {Object.entries(grouped).map(([date, acts]) => (
          <AccordionItem key={date} value={date}>
            <AccordionTrigger className="px-4 py-2 hover:bg-muted gap-8">
              <Badge variant="green">
                <h3 className="text-xs font-medium">{formatDateWithDay(date)}</h3>
              </Badge>

              <span className="text-xs text-muted-foreground font-medium mr-auto">
                <span className="me-1">{acts.length}</span>
                {acts.length > 0 && acts.length < 2 && `Activity`}
                {acts.length > 1 && `Activities`}
              </span>
            </AccordionTrigger>

            <AccordionContent className="px-4 pb-4">
              <div className="space-y-2">
                {acts.map((act) => (
                  <TripItemCard key={act.id} className="p-4 cursor-pointer" hoverEffect>
                    <div
                      onClick={() => dispatch(openDialog({ type: "activity", entity: act }))}
                      className="flex items-center gap-3"
                    >
                      <ActivityIcon activityType={act.activity_type} />
                      <div className="flex-1">
                        <div className="font-medium">{act.name}</div>

                        {act.notes && (
                          <div className="text-sm text-muted-foreground">{act.notes}</div>
                        )}
                      </div>
                      {act.start_time && <p>{formatTimeRange(act.start_time, act.end_time)}</p>}

                      {/* Action Menu */}
                      <ActionMenu>
                        <ActionMenuItem onSelect={() => handleEdit(act)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </ActionMenuItem>
                        <ActionMenuSeparator />
                        <ActionMenuItem
                          onSelect={() => handleDelete(act)}
                          disabled={deleteActivity.isPending}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </ActionMenuItem>
                      </ActionMenu>
                    </div>
                  </TripItemCard>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <ConfirmDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title={`Delete "${activityToDelete?.name || "this activity"}"?`}
        description="This action cannot be undone. All data associated with this activity will be permanently deleted."
        onConfirm={confirmDelete}
        loading={deleteActivity.isPending}
      />
    </>
  );
}
