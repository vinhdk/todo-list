import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Textarea,
} from '@todo/design-system';
import { PropsWithChildren, useState } from 'react';
import { Statuses } from '../enums';
import { TaskItem } from '../types';

export type EditTaskProps = {
  data?: TaskItem;
  onSave: (data: TaskItem) => void;
};

export function EditTask({
  children,
  data,
  onSave,
}: PropsWithChildren<EditTaskProps>) {
  const [task, setTask] = useState<TaskItem>({
    name: 'Task name',
    description: 'Task Description',
    status: Statuses.Incomplete,
    ...(data ?? {}),
  } as TaskItem);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<boolean>(false);

  const onSubmit = () => {
    if (!task.name) {
      setError(true);
      return;
    }

    onSave(task);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{data ? 'Edit Task' : 'Create Task'}</DialogTitle>
          <DialogDescription>
            {data
              ? 'Edit the task below to update the information'
              : 'Create a new task to add to your todo-list'}
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className={'text-b1 font-semibold'}>
              Name
            </Label>
            <Input
              id="name"
              className="col-span-3"
              type={'text'}
              value={task.name ?? ''}
              onInput={e => {
                setTask({ ...task, name: e.currentTarget.value });
                setError(false);
              }}
            />
            {error && (
              <span className="font-bold text-primary-er-500">
                Please enter a name
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description" className={'text-b1 font-semibold'}>
              Description
            </Label>
            <Textarea
              id="description"
              className="col-span-3"
              value={task.description ?? ''}
              onInput={e =>
                setTask({ ...task, description: e.currentTarget.value })
              }
            />
          </div>
        </form>
        <DialogFooter>
          <Button onClick={onSubmit}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
