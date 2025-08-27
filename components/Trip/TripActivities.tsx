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
      <Accordion type="multiple" defaultValue={Object.keys(grouped)} className="-mt-2 space-y-4">
        {Object.entries(grouped).map(([date, acts]) => (
          <AccordionItem key={date} value={date} className="space-y-3">
            <AccordionTrigger
              chevronAlign="right"
              className="hover:bg-muted w-full gap-6 px-0 py-2"
            >
              <Badge variant="green">
                <h3 className="text-xs font-medium">{formatDateWithDay(date)}</h3>
              </Badge>

              <span className="text-muted-foreground mr-auto text-xs font-medium">
                <span className="me-1">{acts.length}</span>
                {acts.length > 0 && acts.length < 2 && `Activity`}
                {acts.length > 1 && `Activities`}
              </span>
            </AccordionTrigger>

            <AccordionContent>
              <div className="space-y-5">
                {acts.map((act) => (
                  <TripItemCard
                    key={act.id}
                    className="cursor-pointer p-4"
                    hoverEffect
                    id={`activity-${act.id}`}
                  >
                    <div
                      onClick={() => dispatch(openDialog({ type: "activity", entity: act }))}
                      className="flex items-center gap-4"
                    >
                      <ActivityIcon activityType={act.activity_type} />

                      <div className="flex-1 space-y-3">
                        <h4 className="font-sans font-medium">{act.name}</h4>

                        {act.notes && (
                          <div className="text-muted-foreground text-xs font-medium">
                            {act.notes}
                          </div>
                        )}
                      </div>
                      {act.start_time && (
                        <p className="text-muted-foreground text-xs font-medium">
                          {formatTimeRange(act.start_time, act.end_time)}
                        </p>
                      )}

                      {/* Action Menu */}
                      <ActionMenu>
                        <ActionMenuItem onSelect={() => handleEdit(act)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </ActionMenuItem>
                        <ActionMenuSeparator />
                        <ActionMenuItem
                          onSelect={() => handleDelete(act)}
                          disabled={deleteActivity.isPending}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
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
