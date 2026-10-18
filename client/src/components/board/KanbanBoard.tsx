import { DndContext, DragEndEvent, PointerSensor, closestCorners, useSensor, useSensors } from "@dnd-kit/core";
import { Job, JobStatus, JOB_STATUSES } from "../../types/job";
import { KanbanColumn } from "./KanbanColumn";

export const KanbanBoard = ({
  jobs,
  onStatusChange,
  onEdit,
  onDelete
}: {
  jobs: Job[];
  onStatusChange: (job: Job, status: JobStatus) => void;
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
}) => {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const finishDrag = ({ active, over }: DragEndEvent) => {
    if (!over) return;
    const dragged = jobs.find((job) => job.id === active.id);
    if (!dragged) return;
    const destination = JOB_STATUSES.find((status) => status === over.id)
      ?? jobs.find((job) => job.id === over.id)?.status;
    if (destination && destination !== dragged.status) {
      onStatusChange(dragged, destination);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={finishDrag}>
      <div className="kanban-scroll flex gap-3 overflow-x-auto pb-3">
        {JOB_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            jobs={jobs.filter((job) => job.status === status)}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </DndContext>
  );
};
