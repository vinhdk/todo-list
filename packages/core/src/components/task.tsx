import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@todo/design-system';
import { Statuses } from '../enums';
import { TaskItem } from '../types';
import { EditTask } from './edit-task';

export type TaskProps = {
  data: TaskItem;
  onSave?: (data: TaskItem) => void;
  onDelete?: (data: TaskItem) => void;
};

export function Task({ data, onSave, onDelete }: TaskProps) {
  const {
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
    isDragging,
  } = useSortable({
    id: data.id,
    data: {
      type: 'task',
      status: data.status,
    },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <Card
      className={'relative w-full'}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}>
      <CardHeader>
        <CardTitle>
          <label className={'flex items-center justify-between gap-2'}>
            <span className={'text-b1 font-semibold'}>{data.name}</span>
            <EditTask data={data} onSave={event => onSave?.(event)}>
              <Button variant={'default'} size={'sm'} className={'!px-4'}>
                Edit
              </Button>
            </EditTask>
          </label>
        </CardTitle>
        <CardDescription>{data.description}</CardDescription>
      </CardHeader>
      <CardContent className={'flex items-center justify-between gap-2'}>
        <Badge
          variant={
            data.status === Statuses.Completed ? 'success' : 'in-progress'
          }>
          {data.status}
        </Badge>
        <Button
          variant={'link'}
          size={'sm'}
          className={'!px-4'}
          onClick={() => onDelete?.(data)}>
          Delete
        </Button>
      </CardContent>
    </Card>
  );
}
